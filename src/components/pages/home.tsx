import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Investment Portfolio Optimizer
        </h1>
        <p className="text-xl text-slate-600">
          Visualize and optimize your investment portfolio with our
          comprehensive dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="text-lg px-8 py-6"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
