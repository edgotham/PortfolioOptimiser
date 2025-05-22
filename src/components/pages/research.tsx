import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const Research = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token!;

      // Call the analyze function through Supabase Edge Function
      const response = await supabase.functions.invoke(
        "supabase-functions-analyze",
        {
          body: { prompt },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.error) throw new Error(response.error.message);
      setResult(response.data.response || "No response received");
    } catch (error: any) {
      console.error("Analysis error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: <span>📊</span>, label: "Dashboard" },
    { icon: <span>💼</span>, label: "Portfolio" },
    { icon: <span>📈</span>, label: "Markets" },
    { icon: <span>🔍</span>, label: "Research", isActive: true },
    { icon: <span>⚙️</span>, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Research" />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="container mx-auto px-6 pt-4 pb-2">
            <h1 className="text-2xl font-semibold text-gray-900">Research</h1>
          </div>

          {/* Content */}
          <div className="container mx-auto p-6 space-y-8">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-medium mb-4">Investment Analysis</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter your analysis prompt:
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Analyze the current market trends for tech stocks"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading || !prompt.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {loading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
            </Card>

            {(result || loading) && (
              <Card className="p-6 bg-white shadow-sm">
                <h2 className="text-xl font-medium mb-4">Analysis Result</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{result}</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Research;
