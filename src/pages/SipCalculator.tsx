import { useState } from "react";
import { IndianRupee, TrendingUp, PiggyBank, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<{
    invested: number;
    returns: number;
    total: number;
    yearlyBreakdown: { year: number; invested: number; value: number }[];
  } | null>(null);

  const handleCalculate = () => {
    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    const invested = monthlyInvestment * totalMonths;

    // SIP Future Value: P × [(1+r)^n - 1] / r × (1+r)
    const futureValue =
      monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

    const yearlyBreakdown: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const inv = monthlyInvestment * m;
      const val = monthlyInvestment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyBreakdown.push({ year: y, invested: inv, value: Math.round(val) });
    }

    setResult({
      invested,
      returns: Math.round(futureValue - invested),
      total: Math.round(futureValue),
      yearlyBreakdown,
    });
  };

  const investedPercent = result ? (result.invested / result.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">SIP Calculator</h1>
          <p className="text-muted-foreground">
            अपनी SIP निवेश की भविष्य की वैल्यू जानें
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6 border-border">
          <CardContent className="p-6 space-y-6">
            {/* Monthly Investment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">मासिक निवेश (Monthly Investment)</Label>
                <span className="text-sm font-bold text-primary">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <Slider
                value={[monthlyInvestment]}
                onValueChange={(v) => setMonthlyInvestment(v[0])}
                min={500}
                max={100000}
                step={500}
                className="mb-2"
              />
              <Input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 500)}
                min={500}
                max={100000}
                className="mt-2"
              />
            </div>

            {/* Expected Return */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">अपेक्षित वार्षिक रिटर्न (Expected Return %)</Label>
                <span className="text-sm font-bold text-primary">{annualReturn}%</span>
              </div>
              <Slider
                value={[annualReturn]}
                onValueChange={(v) => setAnnualReturn(v[0])}
                min={1}
                max={30}
                step={0.5}
              />
              <Input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value) || 1)}
                min={1}
                max={30}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Time Period */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">निवेश अवधि (Time Period in Years)</Label>
                <span className="text-sm font-bold text-primary">{years} साल</span>
              </div>
              <Slider
                value={[years]}
                onValueChange={(v) => setYears(v[0])}
                min={1}
                max={40}
                step={1}
              />
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value) || 1)}
                min={1}
                max={40}
                className="mt-2"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full sm:w-auto">
              <TrendingUp className="h-4 w-4 mr-2" />
              Calculate SIP
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <PiggyBank className="h-5 w-5" />
                  <span className="text-xs font-medium">कुल निवेश</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(result.invested)}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-4 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs font-medium">अनुमानित रिटर्न</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(result.returns)}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 p-4 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <IndianRupee className="h-5 w-5" />
                  <span className="text-xs font-medium">कुल वैल्यू</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(result.total)}</p>
              </div>
            </div>

            {/* Visual Bar */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">निवेश vs रिटर्न</h2>
                <div className="w-full h-8 rounded-full overflow-hidden bg-secondary flex">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
                    style={{ width: `${investedPercent}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-700"
                    style={{ width: `${100 - investedPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>🔵 निवेश: {investedPercent.toFixed(1)}%</span>
                  <span>🟢 रिटर्न: {(100 - investedPercent).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Year-wise Breakdown */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  साल-वार ब्रेकडाउन
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">साल</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">निवेश</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">वैल्यू</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">रिटर्न</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-2 px-2">{row.year}</td>
                          <td className="text-right py-2 px-2">{formatCurrency(row.invested)}</td>
                          <td className="text-right py-2 px-2 font-medium text-primary">{formatCurrency(row.value)}</td>
                          <td className="text-right py-2 px-2 text-emerald-600">{formatCurrency(row.value - row.invested)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <AdBanner />
          </div>
        )}
      </div>
    </div>
  );
};

export default SipCalculator;
