
export interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  pledgeHaircut: number; // Percentage haircut when pledging balance
  extraProfitRate: number; // Additional annual profit percentage from pledging
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
  pledgeAmount: number; // Amount pledged after haircut
  extraProfit: number; // Extra profit from pledging
  endBalance: number;
}

export const calculateCompoundInterest = (data: InvestmentData): YearlyBreakdown[] => {
  const { 
    initialInvestment, 
    monthlyContribution, 
    annualInterestRate, 
    years,
    pledgeHaircut,
    extraProfitRate 
  } = data;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyExtraProfitRate = extraProfitRate / 100 / 12;
  let currentBalance = initialInvestment;
  const breakdown: YearlyBreakdown[] = [];
  
  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    const yearlyContribution = monthlyContribution * 12;
    let yearlyInterest = 0;
    let yearlyExtraProfit = 0;
    const monthlyData: MonthlyBreakdown[] = [];
    
    // Calculate month by month for more accurate compounding
    for (let month = 1; month <= 12; month++) {
      const monthStartBalance = currentBalance;
      
      // Add this month's contribution
      currentBalance += monthlyContribution;
      
      // Calculate pledging amount (after haircut)
      const pledgeableBalance = currentBalance;
      const pledgeAmount = pledgeableBalance * (1 - pledgeHaircut/100);
      
      // Calculate regular interest for this month
      const monthlyInterest = currentBalance * monthlyRate;
      
      // Calculate extra profit from pledging
      const extraProfit = pledgeAmount * monthlyExtraProfitRate;
      
      yearlyInterest += monthlyInterest;
      yearlyExtraProfit += extraProfit;
      
      // Add the interest and extra profit to the balance
      currentBalance += monthlyInterest + extraProfit;
      
      // Record monthly breakdown
      monthlyData.push({
        month,
        startBalance: monthStartBalance,
        contribution: monthlyContribution,
        interest: monthlyInterest,
        pledgeAmount: pledgeAmount,
        extraProfit: extraProfit,
        endBalance: currentBalance,
      });
    }
    
    breakdown.push({
      year,
      startBalance,
      contributions: yearlyContribution,
      interest: yearlyInterest + yearlyExtraProfit,
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
