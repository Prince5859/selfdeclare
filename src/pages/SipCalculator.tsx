import { useState, useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";

const formatCurrency = (amount: number) =>
  "₹" + amount.toLocaleString("en-IN");

const DonutChart = ({ invested, returns }: { invested: number; returns: number }) => {
  const total = invested + returns;
  const investedPct = total > 0 ? (invested / total) * 100 : 50;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const investedArc = (investedPct / 100) * circumference;
  const returnsArc = circumference - investedArc;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="24"
          strokeDasharray={`${investedArc} ${returnsArc}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--green-india))" strokeWidth="24"
          strokeDasharray={`${returnsArc} ${investedArc}`}
          strokeDashoffset={circumference / 4 - investedArc}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xs text-muted-foreground">कुल वैल्यू</p>
        <p className="text-base font-bold text-foreground">{formatCurrency(total)}</p>
      </div>
    </div>
  );
};

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  // String states for free typing
  const [monthlyStr, setMonthlyStr] = useState("25000");
  const [returnStr, setReturnStr] = useState("12");
  const [yearsStr, setYearsStr] = useState("10");

  const result = useMemo(() => {
    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    const invested = monthlyInvestment * totalMonths;
    const futureValue =
      monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    return {
      invested,
      returns: Math.round(futureValue - invested),
      total: Math.round(futureValue),
    };
  }, [monthlyInvestment, annualReturn, years]);

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">SIP Calculator</h1>
          <p className="text-muted-foreground text-sm">
            अपनी SIP निवेश की भविष्य की वैल्यू जानें
          </p>
        </div>

        {/* Main Card - Groww Style */}
        <Card className="border-border mb-6">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left - Sliders */}
              <div className="flex-1 space-y-8">
                {/* Monthly Investment */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Monthly investment</span>
                    <div className="flex items-center gap-1 bg-secondary/60 rounded-md px-3 py-1.5">
                      <span className="text-sm text-primary font-medium">₹</span>
                       <input
                        type="text"
                        inputMode="numeric"
                        value={monthlyStr}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setMonthlyStr(raw);
                          const v = Number(raw);
                          if (v > 0) setMonthlyInvestment(Math.min(1000000, v));
                        }}
                        onBlur={() => {
                          const v = Math.min(1000000, Math.max(100, Number(monthlyStr) || 100));
                          setMonthlyInvestment(v);
                          setMonthlyStr(String(v));
                        }}
                        className="w-24 text-right text-sm font-semibold text-primary bg-transparent border-none outline-none cursor-text"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[monthlyInvestment]}
                    onValueChange={(v) => setMonthlyInvestment(v[0])}
                    min={100}
                    max={1000000}
                    step={100}
                  />
                </div>

                {/* Expected Return */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Expected return rate (p.a)</span>
                    <div className="flex items-center gap-1 bg-secondary/60 rounded-md px-3 py-1.5">
                       <input
                        type="number"
                        value={annualReturn}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (!isNaN(v)) setAnnualReturn(Math.min(30, Math.max(1, v)));
                        }}
                        className="w-14 text-right text-sm font-semibold text-primary bg-transparent border-none outline-none cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm text-primary font-medium">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[annualReturn]}
                    onValueChange={(v) => setAnnualReturn(v[0])}
                    min={1}
                    max={30}
                    step={0.5}
                  />
                </div>

                {/* Time Period */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Time period</span>
                    <div className="flex items-center gap-1 bg-secondary/60 rounded-md px-3 py-1.5">
                       <input
                        type="number"
                        value={years}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (!isNaN(v)) setYears(Math.min(40, Math.max(1, v)));
                        }}
                        className="w-12 text-right text-sm font-semibold text-primary bg-transparent border-none outline-none cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm text-primary font-medium">Yr</span>
                    </div>
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={(v) => setYears(v[0])}
                    min={1}
                    max={40}
                    step={1}
                  />
                </div>
              </div>

              {/* Right - Donut Chart */}
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Legend */}
                <div className="flex items-center gap-6 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                    Invested amount
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block bg-[hsl(var(--green-india))]" />
                    Est. returns
                  </span>
                </div>
                <DonutChart invested={result.invested} returns={result.returns} />
              </div>
            </div>

            {/* Bottom Summary */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Invested amount</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(result.invested)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Est. returns</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(result.returns)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total value</span>
                <span className="text-base font-bold text-foreground">{formatCurrency(result.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdBanner />
      </div>
    </div>
  );
};

export default SipCalculator;
