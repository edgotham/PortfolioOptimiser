import React, { useState, useEffect, useCallback, useMemo } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import PortfolioSummary from "../dashboard/PortfolioSummary";
import PortfolioChart from "../dashboard/PortfolioChart";
import HoldingsTable from "../dashboard/HoldingsTable";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  interface Window {
    Plaid?: any;
  }
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [plaidReady, setPlaidReady] = useState(false);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (msg: string) => setDebugLog((prev) => [...prev, msg]);

  // Load Plaid Link script
  useEffect(() => {
    if (window.Plaid) {
      setPlaidReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = () => setPlaidReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch and refresh holdings
  const fetchHoldings = async (user_id: string) => {
    try {
      addDebugLog("Refreshing holdings from Plaid...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      // 1. Trigger Plaid sync
      const refreshRes = await fetch(
        "https://znzmpdgrtbtpljtvjorq.supabase.co/functions/v1/fetch-investments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: user_id }),
        },
      );
      if (!refreshRes.ok) {
        const err = await refreshRes.text();
        throw new Error(`Plaid sync failed: ${err}`);
      }
      addDebugLog("Plaid sync successful. Fetching from Supabase...");

      // 2. Read from Supabase
      const { data, error } = await supabase
        .from("investment_holdings")
        .select("*")
        .eq("user_id", user_id);
      if (error) throw error;

      setHoldings(data || []);
      addDebugLog(`Fetched ${data?.length || 0} holdings.`);
    } catch (err: any) {
      console.error("Error fetching holdings:", err);
      addDebugLog(`Error: ${err.message}`);
    }
  };

  // Handle Plaid Link
  const handleConnectAccounts = useCallback(async () => {
    if (!window.Plaid) return;
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user?.id;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!user_id) {
        alert("Please log in first.");
        addDebugLog("User not logged in.");
        setLoading(false);
        return;
      }

      addDebugLog(`User ID: ${user_id}`);

      // Create link token
      const res = await fetch(
        "https://znzmpdgrtbtpljtvjorq.supabase.co/functions/v1/create-link-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user_id }),
        },
      );
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Create link token failed: ${err}`);
      }
      const { link_token } = await res.json();
      if (!link_token) throw new Error("Link token missing");

      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: async (public_token: string, metadata: any) => {
          addDebugLog("Plaid success: exchanging token...");
          const inst = metadata.institution || {};
          // Exchange token
          const exchangeRes = await fetch(
            "https://znzmpdgrtbtpljtvjorq.supabase.co/functions/v1/exchange-public-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                public_token,
                user_id,
                institution: {
                  id: inst.institution_id,
                  name: inst.name,
                },
              }),
            },
          );
          if (!exchangeRes.ok) {
            const err = await exchangeRes.text();
            throw new Error(`Token exchange failed: ${err}`);
          }
          addDebugLog("Token exchange success. Refreshing holdings...");
          await fetchHoldings(user_id);
          alert("Bank account connected!");
          setLoading(false);
        },
        onExit: () => {
          addDebugLog("Plaid Link exited by user.");
          setLoading(false);
        },
      });
      handler.open();
    } catch (err: any) {
      console.error("Connect error:", err);
      addDebugLog(`Error: ${err.message}`);
      alert("Something went wrong.");
      setLoading(false);
    }
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user?.id;
      if (user_id) await fetchHoldings(user_id);
    } finally {
      setLoading(false);
    }
  };

  // Summary metrics
  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + (h.institution_value || 0), 0),
    [holdings],
  );
  const totalCost = useMemo(
    () =>
      holdings.reduce((sum, h) => sum + h.quantity * (h.cost_basis ?? 0), 0),
    [holdings],
  );
  const totalGain = totalValue - totalCost;
  const totalReturn = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const dailyChange = 0; // implement if you have historical data

  const navItems = [
    { icon: <span>📊</span>, label: "Dashboard", isActive: true },
    { icon: <span>💼</span>, label: "Portfolio" },
    { icon: <span>📈</span>, label: "Markets" },
    { icon: <span>🔍</span>, label: "Research" },
    { icon: <span>⚙️</span>, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Dashboard" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Investment Dashboard
              </h1>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 h-9 shadow-sm"
                onClick={handleConnectAccounts}
                disabled={!plaidReady || loading}
              >
                {loading ? "Connecting..." : "Connect Accounts"}
              </Button>
            </div>
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>

          <div className="container mx-auto p-6 space-y-8">
            <PortfolioSummary
              totalValue={totalValue}
              dailyChange={dailyChange}
              totalGain={totalGain}
              totalReturn={totalReturn}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PortfolioChart holdings={holdings} />
              </div>
              <div className="lg:col-span-2">
                <HoldingsTable holdings={holdings} />
              </div>
            </div>

            <div className="bg-gray-800 text-white p-4 rounded shadow mt-8">
              <h2 className="text-lg font-bold mb-2">Debug Panel</h2>
              <div className="space-y-1 text-sm max-h-48 overflow-auto">
                {debugLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
