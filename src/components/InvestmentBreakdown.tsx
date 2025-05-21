
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { YearlyBreakdown, formatCurrency, formatMonth } from "@/utils/compoundInterest";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface InvestmentBreakdownProps {
  breakdown: YearlyBreakdown[];
  initialInvestment: number;
  totalContributions: number;
}

const InvestmentBreakdown = ({
  breakdown,
  initialInvestment,
  totalContributions,
}: InvestmentBreakdownProps) => {
  const finalAmount = breakdown.length > 0 ? breakdown[breakdown.length - 1].endBalance : 0;
  const totalInterest = finalAmount - initialInvestment - totalContributions;
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  // Prepare data for chart
  const chartData = breakdown.map((item) => ({
    year: item.year,
    balance: item.endBalance,
    contributions: initialInvestment + item.year * 12 * (totalContributions / (breakdown.length * 12)),
    interest: item.endBalance - initialInvestment - item.year * 12 * (totalContributions / (breakdown.length * 12)),
  }));

  const toggleYearExpansion = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Growth</CardTitle>
        <CardDescription>
          Detailed breakdown of your investment over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-finance-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Final Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(finalAmount)}</p>
            </CardContent>
          </Card>
          <Card className="bg-finance-secondary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(initialInvestment + totalContributions)}</p>
            </CardContent>
          </Card>
          <Card className="bg-finance-growth text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-0">
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
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    label={{ 
                      value: 'Balance ($)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
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
          </TabsContent>
          <TabsContent value="table" className="mt-0">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Starting Balance</TableHead>
                    <TableHead>Annual Contribution</TableHead>
                    <TableHead>Interest Earned</TableHead>
                    <TableHead>End Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakdown.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell>{row.year}</TableCell>
                      <TableCell>{formatCurrency(row.startBalance)}</TableCell>
                      <TableCell>{formatCurrency(row.contributions)}</TableCell>
                      <TableCell>{formatCurrency(row.interest)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(row.endBalance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="mt-0">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]"></TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Starting Balance</TableHead>
                    <TableHead>Contribution</TableHead>
                    <TableHead>Interest Earned</TableHead>
                    <TableHead>End Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakdown.map((yearData) => (
                    <>
                      <TableRow 
                        key={`year-${yearData.year}`} 
                        className="bg-muted/30 cursor-pointer hover:bg-muted"
                        onClick={() => toggleYearExpansion(yearData.year)}
                      >
                        <TableCell>
                          {expandedYears.includes(yearData.year) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </TableCell>
                        <TableCell className="font-medium">Year {yearData.year}</TableCell>
                        <TableCell>{formatCurrency(yearData.startBalance)}</TableCell>
                        <TableCell>{formatCurrency(yearData.contributions)}</TableCell>
                        <TableCell>{formatCurrency(yearData.interest)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(yearData.endBalance)}</TableCell>
                      </TableRow>
                      {expandedYears.includes(yearData.year) && yearData.months?.map((monthData) => (
                        <TableRow key={`year-${yearData.year}-month-${monthData.month}`} className="bg-muted/10">
                          <TableCell></TableCell>
                          <TableCell className="pl-8">{formatMonth(monthData.month)}</TableCell>
                          <TableCell>{formatCurrency(monthData.startBalance)}</TableCell>
                          <TableCell>{formatCurrency(monthData.contribution)}</TableCell>
                          <TableCell>{formatCurrency(monthData.interest)}</TableCell>
                          <TableCell>{formatCurrency(monthData.endBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvestmentBreakdown;
