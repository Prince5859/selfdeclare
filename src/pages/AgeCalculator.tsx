import { useState } from "react";
import { Calendar, Clock, Gift, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: number;
  nextBirthdayDate: string;
  dayOfBirth: string;
}


const calculateAge = (birthDate: Date): AgeResult => {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let d = today.getDate() - birthDate.getDate();

  if (d < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    d += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = today.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // Next birthday
  let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday <= today) {
    nextBday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const nextBirthday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days: d,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    nextBirthday,
    nextBirthdayDate: nextBday.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }),
    dayOfBirth: days[birthDate.getDay()],
  };
};

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);
    
    let dob: Date;
    if (birthDate) {
      dob = new Date(birthDate);
    } else if (day && month && year) {
      dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      setError("कृपया जन्म तिथि दर्ज करें");
      return;
    }
    
    if (isNaN(dob.getTime()) || dob > new Date()) {
      setError("कृपया सही जन्म तिथि दर्ज करें");
      return;
    }
    setResult(calculateAge(dob));
  };

  const statCards = result
    ? [
        { icon: <Calendar className="h-5 w-5" />, label: "उम्र", value: `${result.years} साल, ${result.months} महीने, ${result.days} दिन`, color: "from-orange-500 to-amber-500" },
        { icon: <Gift className="h-5 w-5" />, label: "अगला जन्मदिन", value: `${result.nextBirthdayDate} (${result.nextBirthday} दिन बाकी)`, color: "from-pink-500 to-rose-500" },
        { icon: <Clock className="h-5 w-5" />, label: "कुल दिन जिए", value: result.totalDays.toLocaleString(), color: "from-blue-500 to-cyan-500" },
        { icon: <Calculator className="h-5 w-5" />, label: "कुल हफ्ते", value: result.totalWeeks.toLocaleString(), color: "from-purple-500 to-violet-500" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Calculator className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Age Calculator
          </h1>
          <p className="text-muted-foreground">
            अपनी जन्म तिथि डालें और अपनी सही उम्र जानें
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6 border-border">
          <CardContent className="p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              जन्म तिथि (Date of Birth) — Date Picker
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setDay(""); setMonth(""); setYear(""); }}
                max={new Date().toISOString().split("T")[0]}
                className="flex-1"
              />
            </div>

            <label className="block text-sm font-medium text-foreground mb-2">
              या मैन्युअल दर्ज करें (DD / MM / YYYY)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                type="number"
                placeholder="दिन (DD)"
                value={day}
                onChange={(e) => { setDay(e.target.value); setBirthDate(""); }}
                min="1" max="31"
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="महीना (MM)"
                value={month}
                onChange={(e) => { setMonth(e.target.value); setBirthDate(""); }}
                min="1" max="12"
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="साल (YYYY)"
                value={year}
                onChange={(e) => { setYear(e.target.value); setBirthDate(""); }}
                min="1900" max={new Date().getFullYear()}
                className="flex-1"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Age
            </Button>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Result Cards */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stat Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-gradient-to-br ${card.color} p-4 text-white`}
                >
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    {card.icon}
                    <span className="text-xs font-medium">{card.label}</span>
                  </div>
                  <p className="text-sm md:text-base font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Detailed Info */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">विस्तृत जानकारी</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground">कुल घंटे</span>
                    <span className="font-semibold text-foreground">{result.totalHours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground">कुल मिनट</span>
                    <span className="font-semibold text-foreground">{result.totalMinutes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground">जन्म का दिन</span>
                    <span className="font-semibold text-foreground">{result.dayOfBirth}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground">राशि (Zodiac)</span>
                    <span className="font-semibold text-foreground">{result.zodiacSign}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Banner */}
            <AdBanner />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
