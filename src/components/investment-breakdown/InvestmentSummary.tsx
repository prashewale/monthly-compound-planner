
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

  // Calculate total taxes paid
  const totalTaxOnInterest = breakdown.reduce((total, yearData) => {
    return total + (yearData.taxOnInterest || 0);
  }, 0);

  const totalTaxOnWithdrawals = breakdown.reduce((total, yearData) => {
    return total + (yearData.taxOnWithdrawals || 0);
  }, 0);

  const totalSTT = breakdown.reduce((total, yearData) => {
    return total + (yearData.sttPaid || 0);
  }, 0);

  const totalTaxesPaid = totalTaxOnInterest + totalTaxOnWithdrawals + totalSTT;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      <InvestmentSummaryCard
        title="Total Taxes Paid"
        amount={totalTaxesPaid}
        bgColor="bg-red-600"
      />
      <InvestmentSummaryCard
        title="Tax on Interest"
        amount={totalTaxOnInterest}
        bgColor="bg-red-500"
      />
      <InvestmentSummaryCard
        title="STT Paid"
        amount={totalSTT}
        bgColor="bg-red-400"
      />
    </div>
  );
};

export default InvestmentSummary;
