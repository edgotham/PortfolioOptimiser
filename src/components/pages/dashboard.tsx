import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import PortfolioSummary from "../dashboard/PortfolioSummary";
import PortfolioChart from "../dashboard/PortfolioChart";
import HoldingsTable from "../dashboard/HoldingsTable";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    // Reset loading after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Custom navigation items for investment dashboard
  const navItems = [
    {
      icon: <span className="text-gray-500">📊</span>,
      label: "Dashboard",
      isActive: true,
    },
    { icon: <span className="text-gray-500">💼</span>, label: "Portfolio" },
    { icon: <span className="text-gray-500">📈</span>, label: "Markets" },
    { icon: <span className="text-gray-500">🔍</span>, label: "Research" },
    { icon: <span className="text-gray-500">⚙️</span>, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Dashboard" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Investment Dashboard
            </h1>
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Data"}
            </Button>
          </div>
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            {/* Portfolio Summary Cards */}
            <PortfolioSummary />

            {/* Portfolio Chart and Holdings Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PortfolioChart />
              </div>
              <div className="lg:col-span-2">
                <HoldingsTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
