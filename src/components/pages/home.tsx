import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  ChevronRight,
  LineChart,
  PieChart,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl">
              Portfolio Optimiser
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            Portfolio Optimiser Dashboard
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-4">
            Visualize and optimize your investment portfolio with powerful
            analytics
          </h3>
          <div className="flex justify-center space-x-6 text-xl text-blue-600">
            <Link to="/signup" className="flex items-center hover:underline">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="flex items-center hover:underline">
              Sign in <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-[#f5f5f7] text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            Powerful Analytics
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-4">
            Make informed investment decisions with comprehensive data
            visualization
          </h3>
          <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Asset Allocation</h4>
              <p className="text-gray-500">
                Interactive pie charts showing your portfolio distribution
                across different asset classes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Performance Tracking</h4>
              <p className="text-gray-500">
                Track the performance of your investments with detailed metrics
                and historical data.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Portfolio Analysis</h4>
              <p className="text-gray-500">
                Advanced analytics to help you optimize your portfolio for
                better returns.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Preview section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              Interactive Charts
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Visualize your portfolio with interactive pie charts
            </h3>
            <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-white shadow-inner mx-auto max-w-[250px]">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "conic-gradient(#4f46e5 0% 25%, #10b981 25% 55%, #f59e0b 55% 70%, #ef4444 70% 85%, #8b5cf6 85% 100%)",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white w-[60%] h-[60%] rounded-full flex items-center justify-center">
                    <div className="text-lg font-semibold">Portfolio</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                  <span>Stocks (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Bonds (30%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span>Real Estate (15%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Crypto (15%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Cash (15%)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              Holdings Table
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Sortable and searchable investment data
            </h3>
            <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto overflow-hidden">
              <div className="text-xs">
                <div className="grid grid-cols-4 gap-2 font-semibold bg-gray-100 p-2 rounded-t-lg">
                  <div>Asset</div>
                  <div>Price</div>
                  <div>Value</div>
                  <div>%</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2 border-b">
                  <div className="font-medium">AAPL</div>
                  <div>$175.04</div>
                  <div>$17,504</div>
                  <div className="text-green-600">+12.3%</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2 border-b">
                  <div className="font-medium">MSFT</div>
                  <div>$410.34</div>
                  <div>$20,517</div>
                  <div className="text-green-600">+8.7%</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2 border-b">
                  <div className="font-medium">GOOGL</div>
                  <div>$152.19</div>
                  <div>$15,219</div>
                  <div className="text-red-600">-2.1%</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2 border-b">
                  <div className="font-medium">AMZN</div>
                  <div>$178.75</div>
                  <div>$17,875</div>
                  <div className="text-green-600">+5.4%</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2">
                  <div className="font-medium">TSLA</div>
                  <div>$175.34</div>
                  <div>$8,767</div>
                  <div className="text-red-600">-3.8%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Ready to optimize your investments?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who use our platform to track, analyze,
            and optimize their portfolios.
          </p>
          <Link to="/signup">
            <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 h-auto">
              Get Started Now
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 text-xs text-gray-500">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-300 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Portfolio Optimiser
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Investment Guide
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Market Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Portfolio Strategy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>© 2025 Portfolio Optimiser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
