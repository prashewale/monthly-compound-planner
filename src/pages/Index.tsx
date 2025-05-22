
import { useState } from "react";
import InvestmentForm from "@/components/InvestmentForm";
import InvestmentBreakdown from "@/components/investment-breakdown";
import { InvestmentData, YearlyBreakdown, calculateCompoundInterest } from "@/utils/compoundInterest";
import { IndianRupee } from "lucide-react";

const Index = () => {
  const [breakdown, setBreakdown] = useState<YearlyBreakdown[]>([]);
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null);

  const handleCalculate = (data: InvestmentData) => {
    const results = calculateCompoundInterest(data);
    setBreakdown(results);
    setInvestmentData(data);
  };

  // Calculate total contributions from the breakdown data for accuracy
  const totalContributions = breakdown.reduce((total, year) => total + year.contributions, 0);
  const initialInvestment = investmentData ? investmentData.initialInvestment : 0;

  return (
    <div className="min-h-screen bg-finance-background">
      <header className="bg-finance-primary text-white py-6">
        <div className="container">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <IndianRupee className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Investment Planner</h1>
          </div>
          <p className="text-center md:text-left mt-2 text-finance-accent">
            Calculate the growth of your investments over time with compound interest
          </p>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InvestmentForm onCalculate={handleCalculate} />
          </div>
          <div className="lg:col-span-8">
            {breakdown.length > 0 ? (
              <InvestmentBreakdown 
                breakdown={breakdown} 
                initialInvestment={initialInvestment}
                totalContributions={totalContributions}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
                <div className="text-center">
                  <IndianRupee className="h-16 w-16 text-finance-primary mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Welcome to Your Investment Planner</h2>
                  <p className="text-gray-500 max-w-md">
                    Fill out the form with your investment details and see how your money can grow over time with the power of compound interest.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-finance-primary text-white py-4 mt-12">
        <div className="container text-center text-sm">
          <p>Investment Planner © {new Date().getFullYear()} | This calculator is for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
