import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioChartProps {
  assets?: AssetAllocation[];
}

const defaultAssets: AssetAllocation[] = [
  { name: "Stocks", value: 45000, percentage: 45, color: "#4f46e5" },
  { name: "Bonds", value: 30000, percentage: 30, color: "#10b981" },
  { name: "Real Estate", value: 15000, percentage: 15, color: "#f59e0b" },
  { name: "Crypto", value: 5000, percentage: 5, color: "#ef4444" },
  { name: "Cash", value: 5000, percentage: 5, color: "#8b5cf6" },
];

const PortfolioChart = ({ assets = defaultAssets }: PortfolioChartProps) => {
  const [hoveredAsset, setHoveredAsset] = useState<AssetAllocation | null>(
    null,
  );
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // Generate conic gradient for pie chart
  const generateConicGradient = () => {
    let gradient = "";
    let currentPercentage = 0;

    assets.forEach((asset) => {
      const startPercentage = currentPercentage;
      currentPercentage += asset.percentage;
      gradient += `${asset.color} ${startPercentage}% ${currentPercentage}%, `;
    });

    return `conic-gradient(${gradient.slice(0, -2)})`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-full">
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
            {/* Pie Chart */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-inner"
              style={{ background: generateConicGradient() }}
            ></div>

            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white w-[60%] h-[60%] rounded-full flex flex-col items-center justify-center shadow-sm">
                {hoveredAsset ? (
                  <>
                    <div className="text-sm font-medium text-gray-500">
                      {hoveredAsset.name}
                    </div>
                    <div className="text-xl font-bold">
                      ${hoveredAsset.value.toLocaleString()}
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {hoveredAsset.percentage}%
                    </div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-gray-900">
                    Portfolio
                  </div>
                )}
              </div>
            </div>

            {/* Interactive segments */}
            {assets.map((asset, index) => {
              // Calculate position for hover areas around the chart
              const angle = (asset.percentage / 100) * 360;
              const previousAngles = assets
                .slice(0, index)
                .reduce((sum, a) => sum + (a.percentage / 100) * 360, 0);
              const midAngle = previousAngles + angle / 2;
              const radians = (midAngle - 90) * (Math.PI / 180);
              const x = Math.cos(radians) * 100 + 50;
              const y = Math.sin(radians) * 100 + 50;

              return (
                <TooltipProvider key={asset.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute w-8 h-8 rounded-full cursor-pointer bg-transparent"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseEnter={() => setHoveredAsset(asset)}
                        onMouseLeave={() => setHoveredAsset(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-lg border border-gray-100 p-2 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium">{asset.name}</div>
                        <div>
                          ${asset.value.toLocaleString()} ({asset.percentage}%)
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
            {assets.map((asset) => (
              <div
                key={asset.name}
                className="flex items-center gap-2 text-sm"
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-medium">{asset.name}</span>
                <span className="text-gray-500">{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
