
export interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
}

export interface YearlyBreakdown {
  year: number;
  startBalance: number;
  contributions: number;
  interest: number;
  endBalance: number;
  months?: MonthlyBreakdown[];
}

export interface MonthlyBreakdown {
  month: number;
  startBalance: number;
  contribution: number;
  interest: number;
  endBalance: number;
}

export const calculateCompoundInterest = (data: InvestmentData): YearlyBreakdown[] => {
  const { initialInvestment, monthlyContribution, annualInterestRate, years } = data;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  let currentBalance = initialInvestment;
  const breakdown: YearlyBreakdown[] = [];
  
  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    const yearlyContribution = monthlyContribution * 12;
    let yearlyInterest = 0;
    const monthlyData: MonthlyBreakdown[] = [];
    
    // Calculate month by month for more accurate compounding
    for (let month = 1; month <= 12; month++) {
      const monthStartBalance = currentBalance;
      
      // Add this month's contribution
      currentBalance += monthlyContribution;
      
      // Calculate interest for this month
      const monthlyInterest = currentBalance * monthlyRate;
      yearlyInterest += monthlyInterest;
      
      // Add the interest to the balance
      currentBalance += monthlyInterest;
      
      // Record monthly breakdown
      monthlyData.push({
        month,
        startBalance: monthStartBalance,
        contribution: monthlyContribution,
        interest: monthlyInterest,
        endBalance: currentBalance,
      });
    }
    
    breakdown.push({
      year,
      startBalance,
      contributions: yearlyContribution,
      interest: yearlyInterest,
      endBalance: currentBalance,
      months: monthlyData,
    });
  }
  
  return breakdown;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatMonth = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};
