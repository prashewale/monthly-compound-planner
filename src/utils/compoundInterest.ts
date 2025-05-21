
export interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  pledgeHaircut: number; // Percentage haircut when pledging balance
  extraProfitRate: number; // Additional annual profit percentage from pledging
  yearlyBonusRate: number; // Yearly bonus rate for monthly contributions
}

export interface YearlyBreakdown {
  year: number;
  startBalance: number;
  contributions: number;
  interest: number;
  yearlyBonus: number; // Yearly bonus on monthly contributions
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
    extraProfitRate,
    yearlyBonusRate
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
    
    // Calculate yearly bonus on monthly contributions
    const yearlyBonus = yearlyContribution * (yearlyBonusRate / 100);
    currentBalance += yearlyBonus;
    
    breakdown.push({
      year,
      startBalance,
      contributions: yearlyContribution,
      interest: yearlyInterest + yearlyExtraProfit,
      yearlyBonus: yearlyBonus,
      endBalance: currentBalance,
      months: monthlyData,
    });
  }
  
  return breakdown;
};

export const formatCurrency = (value: number): string => {
  // Format according to Indian numeration system (with rupee symbol)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const formatMonth = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};
