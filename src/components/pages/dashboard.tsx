// src/components/pages/Dashboard.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PortfolioSummary from "../dashboard/PortfolioSummary";
import PortfolioChart from "../dashboard/PortfolioChart";
import HoldingsTable from "../dashboard/HoldingsTable";
import PortfolioAnalysis from "../dashboard/PortfolioAnalysis";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Derive your Functions root URL
const fnUrl = `${supabaseUrl}/functions/v1`;

declare global {
  interface Window {
    Plaid?: any;
  }
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [plaidReady, setPlaidReady] = useState(false);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (msg: string) => setDebugLog((prev) => [...prev, msg]);

  // 1) Load Plaid Link script
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
    return () => document.body.removeChild(script);
  }, []);

  // 2) On mount, fetch holdings & load last analysis
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      await fetchHoldings(user.id);

      // load cached analysis if any
      const cached = localStorage.getItem(`analysis_${user.id}`);
      if (cached) setAnalysisText(cached);
    })();
  }, []);

  // Fetch holdings once
  const fetchHoldings = async (userId: string) => {
    try {
      addDebugLog("Triggering Plaid sync…");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token!;
      const resp = await fetch(`${fnUrl}/fetch-investments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      addDebugLog("Plaid sync OK; loading from Supabase…");

      const { data, error } = await supabase
        .from("investment_holdings")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;

      setHoldings(data ?? []);
      addDebugLog(`Loaded ${data?.length ?? 0} holdings.`);
    } catch (err: any) {
      console.error("fetchHoldings error:", err);
      addDebugLog(`Error fetching holdings: ${err.message}`);
    }
  };

  // Manual “Regenerate Analysis” trigger
  const handleAnalyze = useCallback(async () => {
    setAnalysisLoading(true);
    try {
      addDebugLog("Requesting portfolio analysis…");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token!;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Not logged in");

      const res = await fetch(`${fnUrl}/portfolio-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const { summary } = await res.json();
      setAnalysisText(summary);
      localStorage.setItem(`analysis_${user.id}`, summary);
      addDebugLog("Analysis updated and cached.");
    } catch (err: any) {
      console.error("handleAnalyze error:", err);
      addDebugLog(`Error in analysis: ${err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  // Manual refresh holdings
  const handleRefresh = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id) await fetchHoldings(user.id);
    setLoading(false);
  };

  // Connect Plaid
  const handleConnectAccounts = useCallback(async () => {
    if (!window.Plaid) return;
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token!;
      if (!userId) throw new Error("Login required");

      // create link token
      const ltRes = await fetch(`${fnUrl}/create-link-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const { link_token } = await ltRes.json();

      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: async (public_token: string, metadata: any) => {
          addDebugLog("Plaid success: exchanging token…");
          await fetch(`${fnUrl}/exchange-public-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              public_token,
              user_id: userId,
              institution: {
                id: metadata.institution?.institution_id,
                name: metadata.institution?.name,
              },
            }),
          });
          await fetchHoldings(userId);
          setLoading(false);
        },
        onExit: () => setLoading(false),
      });
      handler.open();
    } catch (err: any) {
      console.error("handleConnectAccounts error:", err);
      addDebugLog(`Error: ${err.message}`);
      setLoading(false);
    }
  }, []);

  // Metrics
  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + (h.institution_value || 0), 0),
    [holdings],
  );
  const totalCost = useMemo(
    () =>
      holdings.reduce((sum, h) => sum + h.quantity * (h.cost_basis || 0), 0),
    [holdings],
  );
  const totalGain = totalValue - totalCost;
  const totalReturn = totalCost ? (totalGain / totalCost) * 100 : 0;
  const dailyChange = 0;

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
          {/* Header */}
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Investment Dashboard
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={handleConnectAccounts}
                disabled={!plaidReady || loading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? "Connecting…" : "Connect Accounts"}
              </Button>
              <Button
                onClick={handleRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing…" : "Refresh Data"}
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={analysisLoading || holdings.length === 0}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {analysisLoading ? "Analyzing…" : "Regenerate Analysis"}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto p-6 space-y-8">
            <PortfolioSummary
              totalValue={totalValue}
              dailyChange={dailyChange}
              totalGain={totalGain}
              totalReturn={totalReturn}
            />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <PortfolioChart holdings={holdings} />
                </div>
                <div className="lg:w-1/2">
                  <PortfolioAnalysis
                    analysisText={analysisText}
                    isLoading={analysisLoading}
                  />
                </div>
              </div>
              <HoldingsTable holdings={holdings} />
            </div>

            {/* Debug Panel */}
            <div className="bg-gray-800 text-white p-4 rounded shadow mt-8">
              <h2 className="text-lg font-bold mb-2">Debug Panel</h2>
              <div className="space-y-1 text-sm max-h-48 overflow-auto">
                {debugLog.map((msg, i) => (
                  <div key={i}>{msg}</div>
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
