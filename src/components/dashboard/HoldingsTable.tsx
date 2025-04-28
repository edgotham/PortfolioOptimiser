import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";

interface Holding {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  price: number;
  value: number;
  change: number;
}

interface HoldingsTableProps {
  holdings?: Holding[];
}

const defaultHoldings: Holding[] = [
  {
    id: "1",
    name: "Apple Inc.",
    ticker: "AAPL",
    quantity: 100,
    price: 175.04,
    value: 17504,
    change: 12.3,
  },
  {
    id: "2",
    name: "Microsoft Corporation",
    ticker: "MSFT",
    quantity: 50,
    price: 410.34,
    value: 20517,
    change: 8.7,
  },
  {
    id: "3",
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    quantity: 100,
    price: 152.19,
    value: 15219,
    change: -2.1,
  },
  {
    id: "4",
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    quantity: 100,
    price: 178.75,
    value: 17875,
    change: 5.4,
  },
  {
    id: "5",
    name: "Tesla Inc.",
    ticker: "TSLA",
    quantity: 50,
    price: 175.34,
    value: 8767,
    change: -3.8,
  },
  {
    id: "6",
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    quantity: 30,
    price: 950.02,
    value: 28500.6,
    change: 15.2,
  },
  {
    id: "7",
    name: "Meta Platforms Inc.",
    ticker: "META",
    quantity: 40,
    price: 485.39,
    value: 19415.6,
    change: 7.8,
  },
];

const HoldingsTable = ({ holdings = defaultHoldings }: HoldingsTableProps) => {
  const [sortField, setSortField] = useState<keyof Holding>("value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (field: keyof Holding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredHoldings = holdings.filter(
    (holding) =>
      holding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holding.ticker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (sortField === "name" || sortField === "ticker") {
      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else {
      return sortDirection === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const totalValue = sortedHoldings.reduce(
    (sum, holding) => sum + holding.value,
    0,
  );

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-full">
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("name")}
                  >
                    Asset
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("ticker")}
                  >
                    Ticker
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("price")}
                  >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("value")}
                  >
                    Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => handleSort("change")}
                  >
                    Change
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding) => (
                <tr
                  key={holding.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {holding.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-blue-600">
                      {holding.ticker}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {holding.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    ${holding.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={
                        holding.change >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {holding.change >= 0 ? "+" : ""}
                      {holding.change}%
                    </span>
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
