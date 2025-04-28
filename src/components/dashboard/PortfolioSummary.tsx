import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  TrendingUp,
} from "lucide-react";

interface PortfolioSummaryProps {
  totalValue?: number;
  dailyChange?: number;
  totalGain?: number;
  totalReturn?: number;
}

const PortfolioSummary = ({
  totalValue = 127798.8,
  dailyChange = 1.2,
  totalGain = 27798.8,
  totalReturn = 21.8,
}: PortfolioSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-700">
            Total Value
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-gray-900">
            ${totalValue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">Current portfolio value</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-700">
            Daily Change
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
            {dailyChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-semibold ${dailyChange >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {dailyChange >= 0 ? "+" : ""}
            {dailyChange}%
          </div>
          <p className="text-sm text-gray-500 mt-1">From previous day</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-700">
            Total Gain
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-semibold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-700">
            Total Return
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
            <Percent className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-semibold ${totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn}%
          </div>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
