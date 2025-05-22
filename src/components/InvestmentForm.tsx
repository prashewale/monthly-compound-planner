
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { InvestmentData } from "@/utils/compoundInterest";
import { IndianRupee } from "lucide-react";

interface InvestmentFormProps {
  onCalculate: (data: InvestmentData) => void;
}

const InvestmentForm = ({ onCalculate }: InvestmentFormProps) => {
  const [formData, setFormData] = useState<InvestmentData>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualInterestRate: 7,
    years: 20,
    pledgeHaircut: 10, // Default 10% haircut
    extraProfitRate: 3, // Default 3% extra profit
    yearlyBonusRate: 2, // Default 2% yearly bonus on contributions
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
              <span className="text-sm text-muted-foreground">
                <IndianRupee className="h-4 w-4" />
              </span>
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
              max={500000}
              step={1000}
              value={[formData.initialInvestment]}
              onValueChange={(value) => handleSliderChange("initialInvestment", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span><IndianRupee className="inline h-3 w-3" /> 0</span>
              <span><IndianRupee className="inline h-3 w-3" /> 5,00,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <IndianRupee className="h-4 w-4" />
              </span>
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
              max={50000}
              step={100}
              value={[formData.monthlyContribution]}
              onValueChange={(value) => handleSliderChange("monthlyContribution", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span><IndianRupee className="inline h-3 w-3" /> 0</span>
              <span><IndianRupee className="inline h-3 w-3" /> 50,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Annual Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              name="annualInterestRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={formData.annualInterestRate}
              onChange={handleInputChange}
            />
            <Slider
              id="annualInterestRate-slider"
              min={0}
              max={30}
              step={0.1}
              value={[formData.annualInterestRate]}
              onValueChange={(value) => handleSliderChange("annualInterestRate", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pledgeHaircut">Pledge Haircut (%)</Label>
            <Input
              id="pledgeHaircut"
              name="pledgeHaircut"
              type="number"
              min="0"
              max="75"
              step="1"
              value={formData.pledgeHaircut}
              onChange={handleInputChange}
            />
            <Slider
              id="pledgeHaircut-slider"
              min={0}
              max={50}
              step={1}
              value={[formData.pledgeHaircut]}
              onValueChange={(value) => handleSliderChange("pledgeHaircut", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraProfitRate">Extra Annual Profit Rate (%)</Label>
            <Input
              id="extraProfitRate"
              name="extraProfitRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={formData.extraProfitRate}
              onChange={handleInputChange}
            />
            <Slider
              id="extraProfitRate-slider"
              min={0}
              max={20}
              step={0.1}
              value={[formData.extraProfitRate]}
              onValueChange={(value) => handleSliderChange("extraProfitRate", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearlyBonusRate">Yearly Bonus on Contributions (%)</Label>
            <Input
              id="yearlyBonusRate"
              name="yearlyBonusRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={formData.yearlyBonusRate}
              onChange={handleInputChange}
            />
            <Slider
              id="yearlyBonusRate-slider"
              min={0}
              max={20}
              step={0.1}
              value={[formData.yearlyBonusRate]}
              onValueChange={(value) => handleSliderChange("yearlyBonusRate", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Investment Period (Years)</Label>
            <Input
              id="years"
              name="years"
              type="number"
              min="1"
              max="100"
              step="1"
              value={formData.years}
              onChange={handleInputChange}
            />
            <Slider
              id="years-slider"
              min={1}
              max={60}
              step={1}
              value={[formData.years]}
              onValueChange={(value) => handleSliderChange("years", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>60 years</span>
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
