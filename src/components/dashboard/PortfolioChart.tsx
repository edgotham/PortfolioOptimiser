import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Holding {
  security_type: string;
  institution_value: number;
}

interface AssetAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioChartProps {
  holdings: Holding[];
}

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#db2777",
  "#047857",
];

export default function PortfolioChart({ holdings }: PortfolioChartProps) {
  // 1️⃣ Aggregate by security_type
  const assets = useMemo<AssetAllocation[]>(() => {
    const agg: Record<string, number> = {};
    let total = 0;

    holdings.forEach((h) => {
      agg[h.security_type] = (agg[h.security_type] || 0) + h.institution_value;
      total += h.institution_value;
    });

    return Object.entries(agg).map(([name, value], i) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      color: COLORS[i % COLORS.length],
    }));
  }, [holdings]);

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  const [hovered, setHovered] = useState<AssetAllocation | null>(null);

  // 2️⃣ Build conic gradient string
  const gradient = useMemo(() => {
    let start = 0;
    return (
      "conic-gradient(" +
      assets
        .map((a) => {
          const end = start + a.percentage;
          const seg = `${a.color} ${start}% ${end}%`;
          start = end;
          return seg;
        })
        .join(", ") +
      ")"
    );
  }, [assets]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Portfolio Allocation
        </CardTitle>
        <p className="text-sm text-gray-500">
          Total Value: ${totalValue.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            {/* Pie */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-inner"
              style={{ background: gradient }}
            />

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white w-[60%] h-[60%] rounded-full flex flex-col items-center justify-center shadow-sm">
                {hovered ? (
                  <>
                    <div className="text-sm font-medium text-gray-500">
                      {hovered.name}
                    </div>
                    <div className="text-xl font-bold">
                      ${hovered.value.toLocaleString()}
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {hovered.percentage}%
                    </div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-gray-900">
                    Portfolio
                  </div>
                )}
              </div>
            </div>

            {/* Hit areas */}
            {assets.map((a, i) => {
              const mid =
                assets.slice(0, i).reduce((sum, x) => sum + x.percentage, 0) +
                a.percentage / 2;
              const rad = ((mid - 90) * Math.PI) / 180;
              const x = Math.cos(rad) * 100 + 50;
              const y = Math.sin(rad) * 100 + 50;
              return (
                <TooltipProvider key={a.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute w-8 h-8 rounded-full cursor-pointer"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseEnter={() => setHovered(a)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-lg border border-gray-100 p-2 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium">{a.name}</div>
                        <div>
                          ${a.value.toLocaleString()} ({a.percentage}%)
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {assets.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-2 text-sm cursor-pointer"
                onMouseEnter={() => setHovered(a)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
                <span className="font-medium">{a.name}</span>
                <span className="text-gray-500">{a.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
