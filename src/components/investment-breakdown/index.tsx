
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YearlyBreakdown } from "@/utils/compoundInterest";
import InvestmentSummary from "./InvestmentSummary";
import InvestmentChart from "./InvestmentChart";
import YearlyBreakdownTable from "./YearlyBreakdownTable";
import MonthlyBreakdownTable from "./MonthlyBreakdownTable";

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
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Growth</CardTitle>
        <CardDescription>
          Detailed breakdown of your investment over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InvestmentSummary 
          breakdown={breakdown}
          initialInvestment={initialInvestment}
          totalContributions={totalContributions}
        />

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-0">
            <InvestmentChart 
              breakdown={breakdown}
              initialInvestment={initialInvestment}
              totalContributions={totalContributions}
            />
          </TabsContent>
          <TabsContent value="table" className="mt-0">
            <YearlyBreakdownTable breakdown={breakdown} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-0">
            <MonthlyBreakdownTable breakdown={breakdown} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvestmentBreakdown;
