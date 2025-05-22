
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { YearlyBreakdown, formatCurrency } from "@/utils/compoundInterest";

interface YearlyBreakdownTableProps {
  breakdown: YearlyBreakdown[];
}

const YearlyBreakdownTable = ({ breakdown }: YearlyBreakdownTableProps) => {
  return (
    <div className="max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Starting Balance</TableHead>
            <TableHead>Monthly Contribution</TableHead>
            <TableHead>Annual Contribution</TableHead>
            <TableHead>Interest Earned</TableHead>
            <TableHead>Yearly Bonus</TableHead>
            <TableHead>End Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.map((row) => (
            <TableRow key={row.year}>
              <TableCell>{row.year}</TableCell>
              <TableCell>{formatCurrency(row.startBalance)}</TableCell>
              <TableCell>{formatCurrency(row.monthlyContribution || 0)}</TableCell>
              <TableCell>{formatCurrency(row.contributions)}</TableCell>
              <TableCell>{formatCurrency(row.interest)}</TableCell>
              <TableCell>{formatCurrency(row.yearlyBonus || 0)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(row.endBalance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default YearlyBreakdownTable;
