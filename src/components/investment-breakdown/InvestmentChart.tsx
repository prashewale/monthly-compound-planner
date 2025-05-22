
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { YearlyBreakdown } from "@/utils/compoundInterest";

interface InvestmentChartProps {
  breakdown: YearlyBreakdown[];
  initialInvestment: number;
  totalContributions: number;
}

const InvestmentChart = ({
  breakdown,
  initialInvestment,
  totalContributions,
}: InvestmentChartProps) => {
  // Prepare data for chart
  const chartData = breakdown.map((item) => {
    // Calculate cumulative contributions up to this year
    const cumulativeContributions = initialInvestment + 
      breakdown
        .filter(y => y.year <= item.year)
        .reduce((total, y) => total + y.contributions, 0);
    
    return {
      year: item.year,
      balance: item.endBalance,
      contributions: cumulativeContributions,
      interest: item.endBalance - cumulativeContributions,
    };
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: 'Years', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
          />
          <YAxis 
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            label={{ 
              value: 'Balance (₹)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip 
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, undefined]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="balance" 
            name="Total Balance"
            stroke="#2b6cb0" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="contributions" 
            name="Contributions" 
            stroke="#9f7aea" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="interest" 
            name="Interest" 
            stroke="#38a169" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
