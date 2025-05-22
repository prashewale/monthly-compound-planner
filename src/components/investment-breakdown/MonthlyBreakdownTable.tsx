
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { YearlyBreakdown, formatCurrency, formatMonth } from "@/utils/compoundInterest";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MonthlyBreakdownTableProps {
  breakdown: YearlyBreakdown[];
}

const MonthlyBreakdownTable = ({ breakdown }: MonthlyBreakdownTableProps) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  const toggleYearExpansion = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  return (
    <div className="max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]"></TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Starting Balance</TableHead>
            <TableHead>Contribution</TableHead>
            <TableHead>Regular Interest</TableHead>
            <TableHead>Pledged Amount</TableHead>
            <TableHead>Extra Profit</TableHead>
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
                <TableCell colSpan={3}>
                  {formatCurrency(yearData.interest)}
                  {yearData.yearlyBonus > 0 && (
                    <div className="text-xs text-yellow-600 font-medium mt-1">
                      +{formatCurrency(yearData.yearlyBonus)} bonus
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(yearData.endBalance)}</TableCell>
              </TableRow>
              {expandedYears.includes(yearData.year) && yearData.months?.map((monthData) => (
                <TableRow key={`year-${yearData.year}-month-${monthData.month}`} className="bg-muted/10">
                  <TableCell></TableCell>
                  <TableCell className="pl-8">{formatMonth(monthData.month)}</TableCell>
                  <TableCell>{formatCurrency(monthData.startBalance)}</TableCell>
                  <TableCell>{formatCurrency(monthData.contribution)}</TableCell>
                  <TableCell>{formatCurrency(monthData.interest)}</TableCell>
                  <TableCell>{formatCurrency(monthData.pledgeAmount || 0)}</TableCell>
                  <TableCell>{formatCurrency(monthData.extraProfit || 0)}</TableCell>
                  <TableCell>{formatCurrency(monthData.endBalance)}</TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MonthlyBreakdownTable;
