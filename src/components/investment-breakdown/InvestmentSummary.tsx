
import { YearlyBreakdown } from "@/utils/compoundInterest";
import InvestmentSummaryCard from "./InvestmentSummaryCard";

interface InvestmentSummaryProps {
  breakdown: YearlyBreakdown[];
  initialInvestment: number;
  totalContributions: number;
}

const InvestmentSummary = ({
  breakdown,
  initialInvestment,
  totalContributions,
}: InvestmentSummaryProps) => {
  const finalAmount = breakdown.length > 0 ? breakdown[breakdown.length - 1].endBalance : 0;

  // Calculate total extra profit from pledging
  const totalExtraProfit = breakdown.reduce((total, yearData) => {
    if (yearData.months) {
      return total + yearData.months.reduce((yearTotal, monthData) => {
        return yearTotal + (monthData.extraProfit || 0);
      }, 0);
    }
    return total;
  }, 0);

  // Calculate total regular interest (excluding extra profit)
  const totalRegularInterest = breakdown.reduce((total, yearData) => {
    if (yearData.months) {
      return total + yearData.months.reduce((yearTotal, monthData) => {
        return yearTotal + (monthData.interest || 0);
      }, 0);
    }
    return total;
  }, 0);

  // Calculate total yearly bonus
  const totalYearlyBonus = breakdown.reduce((total, yearData) => {
    return total + (yearData.yearlyBonus || 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <InvestmentSummaryCard
        title="Final Amount"
        amount={finalAmount}
        bgColor="bg-finance-primary"
      />
      <InvestmentSummaryCard
        title="Total Contributions"
        amount={initialInvestment + totalContributions}
        bgColor="bg-finance-secondary"
      />
      <InvestmentSummaryCard
        title="Regular Interest"
        amount={totalRegularInterest}
        bgColor="bg-finance-growth"
      />
      <InvestmentSummaryCard
        title="Extra Profit"
        amount={totalExtraProfit}
        bgColor="bg-finance-accent"
      />
      <InvestmentSummaryCard
        title="Yearly Bonus"
        amount={totalYearlyBonus}
        bgColor="bg-yellow-600"
      />
    </div>
  );
};

export default InvestmentSummary;
