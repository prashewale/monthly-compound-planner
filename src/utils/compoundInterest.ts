
export interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  pledgeHaircut: number; // Percentage haircut when pledging balance
  extraProfitRate: number; // Additional annual profit percentage from pledging
  yearlyBonusRate: number; // Yearly bonus rate for monthly contributions
  yearlyContributionIncreaseRate: number; // Yearly percentage increase in contributions
  contributionStopYears: number; // Year when contributions stop
  contributionStopMonths: number; // Additional months when contributions stop
  monthlyWithdrawalAmount: number; // Monthly withdrawal amount
  withdrawalStartYears: number; // Year when withdrawals start
  withdrawalStartMonths: number; // Additional months when withdrawals start
}

export interface YearlyBreakdown {
  year: number;
  startBalance: number;
  contributions: number;
  interest: number;
  yearlyBonus: number; // Yearly bonus on monthly contributions
  withdrawals: number; // Total withdrawals for the year
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
  withdrawal: number; // Monthly withdrawal amount
  endBalance: number;
  contributionWithBonus?: number; // Track the contribution amount that will receive bonus
  monthlyBonus?: number; // Monthly bonus amount for this specific month's contribution
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
    yearlyContributionIncreaseRate,
    contributionStopYears,
    contributionStopMonths,
    monthlyWithdrawalAmount,
    withdrawalStartYears,
    withdrawalStartMonths
  } = data;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyExtraProfitRate = extraProfitRate / 100 / 12;
  let currentBalance = initialInvestment;
  const breakdown: YearlyBreakdown[] = [];
  
  // Track all monthly contributions across all years for cumulative bonus calculation
  const allContributions: {[key: string]: number} = {};
  
  // Track current monthly contribution amount
  let currentMonthlyContribution = monthlyContribution;
  
  // Calculate total stop period in months
  const totalStopMonths = (contributionStopYears * 12) + contributionStopMonths;
  
  // Calculate total withdrawal start period in months
  const totalWithdrawalStartMonths = (withdrawalStartYears * 12) + withdrawalStartMonths;
  
  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    let yearlyContribution = 0;
    let yearlyInterest = 0;
    let yearlyExtraProfit = 0;
    let totalYearlyBonus = 0;
    let yearlyWithdrawals = 0;
    const monthlyData: MonthlyBreakdown[] = [];
    
    // Calculate total bonus from previous years to distribute monthly
    // Only start applying bonus from year 2 onwards
    let totalBonusFromPreviousYears = 0;
    if (year > 2) {
      for (let bonusYear = 1; bonusYear < year; bonusYear++) {
        for (let month = 1; month <= 12; month++) {
          const contributionKey = `${bonusYear}-${month}`;
          const contributionAmount = allContributions[contributionKey] || 0;
          const bonusAmount = contributionAmount * (yearlyBonusRate / 100);
          totalBonusFromPreviousYears += bonusAmount;
        }
      }
    }
    
    // Distribute previous years bonus across 12 months
    const monthlyBonusFromPreviousYears = totalBonusFromPreviousYears / 12;
    
    // Calculate month by month for more accurate compounding
    for (let month = 1; month <= 12; month++) {
      const monthStartBalance = currentBalance;
      
      // Calculate current month number from start of investment
      const currentMonthFromStart = ((year - 1) * 12) + month;
      
      // Check if we should still make contributions
      const shouldMakeContribution = currentMonthFromStart <= totalStopMonths;
      const monthlyContributionAmount = shouldMakeContribution ? currentMonthlyContribution : 0;
      
      // Check if we should start withdrawals
      const shouldMakeWithdrawal = currentMonthFromStart > totalWithdrawalStartMonths;
      const monthlyWithdrawal = shouldMakeWithdrawal ? monthlyWithdrawalAmount : 0;
      
      // Add this month's contribution
      currentBalance += monthlyContributionAmount;
      yearlyContribution += monthlyContributionAmount;
      
      // Track this contribution for yearly bonus (store with year-month key)
      const contributionKey = `${year}-${month}`;
      allContributions[contributionKey] = monthlyContributionAmount;
      
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
      
      // Calculate bonus for this specific month's contribution
      // Only apply bonus starting from year 2
      const monthlyBonusForThisContribution = year >= 2 ? monthlyContributionAmount * (yearlyBonusRate / 100) : 0;
      
      // Total monthly bonus = current month's contribution bonus + portion of previous years' bonus
      const totalMonthlyBonus = monthlyBonusForThisContribution + monthlyBonusFromPreviousYears;
      
      currentBalance += totalMonthlyBonus;
      totalYearlyBonus += totalMonthlyBonus;
      
      // Subtract withdrawal amount
      currentBalance -= monthlyWithdrawal;
      yearlyWithdrawals += monthlyWithdrawal;
      
      // Record monthly breakdown
      monthlyData.push({
        month,
        startBalance: monthStartBalance,
        contribution: monthlyContributionAmount,
        interest: monthlyInterest,
        pledgeAmount: pledgeAmount,
        extraProfit: extraProfit,
        withdrawal: monthlyWithdrawal,
        endBalance: currentBalance,
        contributionWithBonus: monthlyContributionAmount,
        monthlyBonus: totalMonthlyBonus
      });
    }
    
    breakdown.push({
      year,
      startBalance,
      contributions: yearlyContribution,
      interest: yearlyInterest + yearlyExtraProfit,
      yearlyBonus: totalYearlyBonus,
      withdrawals: yearlyWithdrawals,
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
