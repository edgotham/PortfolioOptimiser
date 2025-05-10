// src/components/dashboard/PortfolioAnalysis.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marked } from "marked";

interface PortfolioAnalysisProps {
  analysisText: string;
  isLoading: boolean;
}

const PortfolioAnalysis = ({
  analysisText,
  isLoading,
}: PortfolioAnalysisProps) => {
  const [safeMarkdown, setSafeMarkdown] = useState<string>("");
  const [renderError, setRenderError] = useState<boolean>(false);

  useEffect(() => {
    if (!analysisText) return;
    try {
      const sanitized = analysisText
        .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
        .trim();
      setSafeMarkdown(sanitized);
      setRenderError(false);
    } catch {
      setRenderError(true);
    }
  }, [analysisText]);

  console.log("Rendering markdown:", safeMarkdown);

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
        <CardTitle className="text-white text-lg font-medium">
          Portfolio Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ) : renderError ? (
          <div className="text-red-500 text-sm">
            There was an error rendering the analysis. Please try again.
          </div>
        ) : safeMarkdown ? (
          // WARNING: This uses dangerouslySetInnerHTML. Only use with trusted markdown!
          <div
            className="prose prose-sm lg:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: marked.parse(safeMarkdown) }}
          />
        ) : (
          <div className="text-gray-700 text-sm">
            No analysis available. Please connect your accounts to generate
            insights.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalysis;
