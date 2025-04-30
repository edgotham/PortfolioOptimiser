import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";

interface Holding {
  security_name: string;
  ticker_symbol: string;
  security_type: string;
  quantity: number;
  institution_price: number;
  institution_value: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

const HoldingsTable = ({ holdings = [] }: HoldingsTableProps) => {
  // Default sort by value descending
  const [sortField, setSortField] =
    useState<keyof Holding>("institution_value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (field: keyof Holding) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filtered = holdings.filter(
    (h) =>
      h.security_name.toLowerCase().includes(searchQuery) ||
      h.ticker_symbol.toLowerCase().includes(searchQuery),
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField] as number;
    const bVal = b[sortField] as number;
    if (typeof aVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalValue = sorted.reduce((sum, h) => sum + h.institution_value, 0);

  return (
    <Card className="bg-white border rounded-2xl shadow-sm overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Holdings
            </CardTitle>
            <p className="text-sm text-gray-500">
              Total Value: ${totalValue.toLocaleString()}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assets..."
              className="pl-9 h-10 rounded-full bg-gray-100 border-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* Wider first column */}
                <th className="text-left py-3 px-4 min-w-1/3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("security_name")}
                  >
                    Asset
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("ticker_symbol")}
                  >
                    Ticker
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("security_type")}
                  >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("institution_price")}
                  >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("institution_value")}
                  >
                    Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* Prevent wrapping and enforce width */}
                  <td className="py-3 px-4 whitespace-nowrap text-gray-900">
                    {h.security_name}
                  </td>
                  <td className="py-3 px-4 text-blue-600 whitespace-nowrap">
                    {h.ticker_symbol}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {h.security_type}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {h.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    ${h.institution_price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                    ${h.institution_value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
