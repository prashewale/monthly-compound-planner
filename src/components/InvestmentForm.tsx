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
    yearlyContributionIncreaseRate: 0, // Default 0% yearly increase in contributions
    contributionStopYears: 20, // Default stop at end of investment period
    contributionStopMonths: 0, // Default 0 additional months
    monthlyWithdrawalAmount: 0, // Default 0 withdrawal
    withdrawalStartYears: 20, // Default start withdrawals at end of investment period
    withdrawalStartMonths: 0, // Default 0 additional months
    // Tax defaults (Indian tax rates)
    capitalGainsTaxRate: 10, // LTCG tax rate for equity (10%)
    interestTaxRate: 30, // Tax rate on interest income (30% for highest slab)
    sttRate: 0.1, // STT rate (0.1%)
    exemptionLimit: 100000, // Annual LTCG exemption limit (₹1 lakh)
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
          Adjust the values to calculate your investment growth with Indian tax considerations
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
            <Label htmlFor="contributionStopYears">Stop Contributions After (Years)</Label>
            <Input
              id="contributionStopYears"
              name="contributionStopYears"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.contributionStopYears}
              onChange={handleInputChange}
            />
            <Slider
              id="contributionStopYears-slider"
              min={0}
              max={60}
              step={1}
              value={[formData.contributionStopYears]}
              onValueChange={(value) => handleSliderChange("contributionStopYears", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 years</span>
              <span>60 years</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contributionStopMonths">Additional Months</Label>
            <Input
              id="contributionStopMonths"
              name="contributionStopMonths"
              type="number"
              min="0"
              max="11"
              step="1"
              value={formData.contributionStopMonths}
              onChange={handleInputChange}
            />
            <Slider
              id="contributionStopMonths-slider"
              min={0}
              max={11}
              step={1}
              value={[formData.contributionStopMonths]}
              onValueChange={(value) => handleSliderChange("contributionStopMonths", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 months</span>
              <span>11 months</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyWithdrawalAmount">Monthly Withdrawal Amount</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <IndianRupee className="h-4 w-4" />
              </span>
              <Input
                id="monthlyWithdrawalAmount"
                name="monthlyWithdrawalAmount"
                type="number"
                min="0"
                step="50"
                value={formData.monthlyWithdrawalAmount}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <Slider
              id="monthlyWithdrawalAmount-slider"
              min={0}
              max={50000}
              step={100}
              value={[formData.monthlyWithdrawalAmount]}
              onValueChange={(value) => handleSliderChange("monthlyWithdrawalAmount", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span><IndianRupee className="inline h-3 w-3" /> 0</span>
              <span><IndianRupee className="inline h-3 w-3" /> 50,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawalStartYears">Start Withdrawals After (Years)</Label>
            <Input
              id="withdrawalStartYears"
              name="withdrawalStartYears"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.withdrawalStartYears}
              onChange={handleInputChange}
            />
            <Slider
              id="withdrawalStartYears-slider"
              min={0}
              max={60}
              step={1}
              value={[formData.withdrawalStartYears]}
              onValueChange={(value) => handleSliderChange("withdrawalStartYears", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 years</span>
              <span>60 years</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawalStartMonths">Additional Months</Label>
            <Input
              id="withdrawalStartMonths"
              name="withdrawalStartMonths"
              type="number"
              min="0"
              max="11"
              step="1"
              value={formData.withdrawalStartMonths}
              onChange={handleInputChange}
            />
            <Slider
              id="withdrawalStartMonths-slider"
              min={0}
              max={11}
              step={1}
              value={[formData.withdrawalStartMonths]}
              onValueChange={(value) => handleSliderChange("withdrawalStartMonths", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 months</span>
              <span>11 months</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearlyContributionIncreaseRate">Yearly Contribution Increase (%)</Label>
            <Input
              id="yearlyContributionIncreaseRate"
              name="yearlyContributionIncreaseRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={formData.yearlyContributionIncreaseRate}
              onChange={handleInputChange}
            />
            <Slider
              id="yearlyContributionIncreaseRate-slider"
              min={0}
              max={25}
              step={0.1}
              value={[formData.yearlyContributionIncreaseRate]}
              onValueChange={(value) => handleSliderChange("yearlyContributionIncreaseRate", value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
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

          {/* Tax Parameters Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Tax Parameters (Indian Tax Rules)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="capitalGainsTaxRate">Long-Term Capital Gains Tax Rate (%)</Label>
              <Input
                id="capitalGainsTaxRate"
                name="capitalGainsTaxRate"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.capitalGainsTaxRate}
                onChange={handleInputChange}
              />
              <Slider
                id="capitalGainsTaxRate-slider"
                min={0}
                max={30}
                step={0.1}
                value={[formData.capitalGainsTaxRate]}
                onValueChange={(value) => handleSliderChange("capitalGainsTaxRate", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestTaxRate">Interest Income Tax Rate (%)</Label>
              <Input
                id="interestTaxRate"
                name="interestTaxRate"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.interestTaxRate}
                onChange={handleInputChange}
              />
              <Slider
                id="interestTaxRate-slider"
                min={0}
                max={40}
                step={0.1}
                value={[formData.interestTaxRate]}
                onValueChange={(value) => handleSliderChange("interestTaxRate", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>40%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sttRate">Securities Transaction Tax Rate (%)</Label>
              <Input
                id="sttRate"
                name="sttRate"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.sttRate}
                onChange={handleInputChange}
              />
              <Slider
                id="sttRate-slider"
                min={0}
                max={0.5}
                step={0.01}
                value={[formData.sttRate]}
                onValueChange={(value) => handleSliderChange("sttRate", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>0.5%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exemptionLimit">Annual LTCG Exemption Limit</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  <IndianRupee className="h-4 w-4" />
                </span>
                <Input
                  id="exemptionLimit"
                  name="exemptionLimit"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.exemptionLimit}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
              <Slider
                id="exemptionLimit-slider"
                min={0}
                max={200000}
                step={1000}
                value={[formData.exemptionLimit]}
                onValueChange={(value) => handleSliderChange("exemptionLimit", value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span><IndianRupee className="inline h-3 w-3" /> 0</span>
                <span><IndianRupee className="inline h-3 w-3" /> 2,00,000</span>
              </div>
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
