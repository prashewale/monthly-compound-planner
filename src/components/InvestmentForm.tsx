
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { InvestmentData } from "@/utils/compoundInterest";

interface InvestmentFormProps {
  onCalculate: (data: InvestmentData) => void;
}

const InvestmentForm = ({ onCalculate }: InvestmentFormProps) => {
  const [formData, setFormData] = useState<InvestmentData>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualInterestRate: 7,
    years: 20,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSliderChange = (name: keyof InvestmentData, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Parameters</CardTitle>
        <CardDescription>
          Adjust the values to calculate your investment growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">Initial Investment</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id="initialInvestment"
                name="initialInvestment"
                type="number"
                min="0"
                step="100"
                value={formData.initialInvestment}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <Slider
              id="initialInvestment-slider"
              min={0}
              max={100000}
              step={1000}
              value={[formData.initialInvestment]}
              onValueChange={(value) => handleSliderChange("initialInvestment", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id="monthlyContribution"
                name="monthlyContribution"
                type="number"
                min="0"
                step="50"
                value={formData.monthlyContribution}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <Slider
              id="monthlyContribution-slider"
              min={0}
              max={5000}
              step={50}
              value={[formData.monthlyContribution]}
              onValueChange={(value) => handleSliderChange("monthlyContribution", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Annual Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              name="annualInterestRate"
              type="number"
              min="0"
              max="30"
              step="0.1"
              value={formData.annualInterestRate}
              onChange={handleInputChange}
            />
            <Slider
              id="annualInterestRate-slider"
              min={0}
              max={15}
              step={0.1}
              value={[formData.annualInterestRate]}
              onValueChange={(value) => handleSliderChange("annualInterestRate", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Investment Period (Years)</Label>
            <Input
              id="years"
              name="years"
              type="number"
              min="1"
              max="50"
              step="1"
              value={formData.years}
              onChange={handleInputChange}
            />
            <Slider
              id="years-slider"
              min={1}
              max={40}
              step={1}
              value={[formData.years]}
              onValueChange={(value) => handleSliderChange("years", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>40 years</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-finance-primary hover:bg-finance-secondary">
            Calculate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
