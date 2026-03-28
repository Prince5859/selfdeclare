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
  dayOfBirth: string;
  zodiacSign: string;
}

const getZodiacSign = (month: number, day: number): string => {
  const signs = [
    { sign: "♑ Capricorn", start: [1, 1], end: [1, 19] },
    { sign: "♒ Aquarius", start: [1, 20], end: [2, 18] },
    { sign: "♓ Pisces", start: [2, 19], end: [3, 20] },
    { sign: "♈ Aries", start: [3, 21], end: [4, 19] },
    { sign: "♉ Taurus", start: [4, 20], end: [5, 20] },
    { sign: "♊ Gemini", start: [5, 21], end: [6, 20] },
    { sign: "♋ Cancer", start: [6, 21], end: [7, 22] },
    { sign: "♌ Leo", start: [7, 23], end: [8, 22] },
    { sign: "♍ Virgo", start: [8, 23], end: [9, 22] },
    { sign: "♎ Libra", start: [9, 23], end: [10, 22] },
    { sign: "♏ Scorpio", start: [10, 23], end: [11, 21] },
    { sign: "♐ Sagittarius", start: [11, 22], end: [12, 21] },
    { sign: "♑ Capricorn", start: [12, 22], end: [12, 31] },
  ];
  for (const z of signs) {
    if (
      (month === z.start[0] && day >= z.start[1]) ||
      (month === z.end[0] && day <= z.end[1])
    ) {
      return z.sign;
    }
  }
  return "♑ Capricorn";
};

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
    dayOfBirth: days[birthDate.getDay()],
    zodiacSign: getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate()),
  };
};

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);
    if (!birthDate) {
      setError("कृपया जन्म तिथि दर्ज करें");
      return;
    }
    const dob = new Date(birthDate);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      setError("कृपया सही जन्म तिथि दर्ज करें");
      return;
    }
    setResult(calculateAge(dob));
  };

  const statCards = result
    ? [
        { icon: <Calendar className="h-5 w-5" />, label: "उम्र", value: `${result.years} साल, ${result.months} महीने, ${result.days} दिन`, color: "from-orange-500 to-amber-500" },
        { icon: <Gift className="h-5 w-5" />, label: "अगला जन्मदिन", value: `${result.nextBirthday} दिन बाकी`, color: "from-pink-500 to-rose-500" },
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
              जन्म तिथि (Date of Birth)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="flex-1"
              />
              <Button onClick={handleCalculate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Age
              </Button>
            </div>
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
