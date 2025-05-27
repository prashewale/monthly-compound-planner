export interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  pledgeHaircut: number; // Percentage haircut when pledging balance
  extraProfitRate: number; // Additional annual profit percentage from pledging
  yearlyBonusRate: number; // Yearly bonus rate for monthly contributions
  yearlyContributionIncreaseRate: number; // Yearly percentage increase in contributions
}

export interface YearlyBreakdown {
  year: number;
  startBalance: number;
  contributions: number;
  interest: number;
  yearlyBonus: number; // Yearly bonus on monthly contributions
  endBalance: number;
  months?: MonthlyBreakdown[];
  monthlyContribution: number; // Keep track of the monthly contribution for this year
}

export interface MonthlyBreakdown {
  month: number;
  startBalance: number;
  contribution: number;
  interest: number;
  pledgeAmount: number; // Amount pledged after haircut
  extraProfit: number; // Extra profit from pledging
  endBalance: number;
  contributionWithBonus?: number; // Track the contribution amount that will receive bonus
  monthlyBonus?: number; // Monthly bonus amount
}

export const calculateCompoundInterest = (data: InvestmentData): YearlyBreakdown[] => {
  const { 
    initialInvestment, 
    monthlyContribution, 
    annualInterestRate, 
    years,
    pledgeHaircut,
    extraProfitRate,
    yearlyBonusRate,
    yearlyContributionIncreaseRate
  } = data;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyExtraProfitRate = extraProfitRate / 100 / 12;
  let currentBalance = initialInvestment;
  const breakdown: YearlyBreakdown[] = [];
  
  // Track all monthly contributions across all years for cumulative bonus calculation
  const allContributions: {[key: string]: number} = {};
  
  // Track current monthly contribution amount
  let currentMonthlyContribution = monthlyContribution;
  
  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    const yearlyContribution = currentMonthlyContribution * 12;
    let yearlyInterest = 0;
    let yearlyExtraProfit = 0;
    const monthlyData: MonthlyBreakdown[] = [];
    
    // Calculate month by month for more accurate compounding
    for (let month = 1; month <= 12; month++) {
      const monthStartBalance = currentBalance;
      
      // Add this month's contribution
      currentBalance += currentMonthlyContribution;
      
      // Track this contribution for yearly bonus (store with year-month key)
      const contributionKey = `${year}-${month}`;
      allContributions[contributionKey] = currentMonthlyContribution;
      
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
        contribution: currentMonthlyContribution,
        interest: monthlyInterest,
        pledgeAmount: pledgeAmount,
        extraProfit: extraProfit,
        endBalance: currentBalance,
        contributionWithBonus: currentMonthlyContribution
      });
    }
    
    // Apply yearly bonus to ALL previous contributions (including current year)
    let totalYearlyBonus = 0;
    
    // Loop through all years up to and including current year
    for (let bonusYear = 1; bonusYear <= year; bonusYear++) {
      for (let month = 1; month <= 12; month++) {
        const contributionKey = `${bonusYear}-${month}`;
        const contributionAmount = allContributions[contributionKey] || 0;
        const bonusAmount = contributionAmount * (yearlyBonusRate / 100);
        totalYearlyBonus += bonusAmount;
        
        // Add bonus to current balance
        currentBalance += bonusAmount;
      }
    }
    
    // Update the end balance in monthly data for the last month to reflect the total bonus
    if (monthlyData.length > 0) {
      monthlyData[monthlyData.length - 1].endBalance = currentBalance;
    }
    
    breakdown.push({
      year,
      startBalance,
      contributions: yearlyContribution,
      interest: yearlyInterest + yearlyExtraProfit,
      yearlyBonus: totalYearlyBonus,
      endBalance: currentBalance,
      months: monthlyData,
      monthlyContribution: currentMonthlyContribution
    });
    
    // Increase monthly contribution for next year based on yearly increase rate
    if (yearlyContributionIncreaseRate > 0) {
      currentMonthlyContribution += currentMonthlyContribution * (yearlyContributionIncreaseRate / 100);
    }
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
