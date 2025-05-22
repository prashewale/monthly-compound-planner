
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/compoundInterest";

interface InvestmentSummaryCardProps {
  title: string;
  amount: number;
  bgColor: string;
  textColor?: string;
}

const InvestmentSummaryCard = ({
  title,
  amount,
  bgColor,
  textColor = "text-white",
}: InvestmentSummaryCardProps) => {
  return (
    <Card className={`${bgColor} ${textColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
      </CardContent>
    </Card>
  );
};

export default InvestmentSummaryCard;
