import { useState, useRef, useCallback, useEffect } from "react";
import {
  Globe, FileText, Wifi, Mail, Phone, MessageSquare,
  Download, Copy, Share2, Shield, Lock, CheckCircle,
  Palette, QrCode, ChevronDown, Upload, X, Square, Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import qrcode from "qrcode-generator";

type QrType = "website" | "text" | "wifi" | "email" | "phone" | "sms";
type DotStyle = "square" | "rounded" | "dots";
type ErrorLevel = "L" | "M" | "Q" | "H";

const QR_TYPES = [
  { id: "website" as QrType, label: "Website", icon: Globe },
  { id: "text" as QrType, label: "Text", icon: FileText },
  { id: "wifi" as QrType, label: "WiFi", icon: Wifi },
  { id: "email" as QrType, label: "Email", icon: Mail },
  { id: "phone" as QrType, label: "Phone", icon: Phone },
  { id: "sms" as QrType, label: "SMS", icon: MessageSquare },
];

const PRESET_COLORS = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#533483", "#2b9348", "#ff6b35",
  "#1d3557", "#457b9d", "#e63946", "#6a4c93",
];

const QrCodeGenerator = () => {
  const [qrType, setQrType] = useState<QrType>("website");
  
  // Input fields
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [plainText, setPlainText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  // Design
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [qrSize, setQrSize] = useState(280);
  const [margin, setMargin] = useState(4);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [designTab, setDesignTab] = useState("colors");

  // Output
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const getQrData = useCallback((): string => {
    switch (qrType) {
      case "website": {
        let url = websiteUrl.trim();
        if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
        return url;
      }
      case "text":
        return plainText.trim();
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNumber}`;
      case "sms":
        return `smsto:${smsNumber}:${smsMessage}`;
      default:
        return "";
    }
  }, [qrType, websiteUrl, plainText, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, emailBody, phoneNumber, smsNumber, smsMessage]);

  const hasInput = useCallback((): boolean => {
    switch (qrType) {
      case "website": return !!websiteUrl.trim();
      case "text": return !!plainText.trim();
      case "wifi": return !!wifiSsid.trim();
      case "email": return !!emailTo.trim();
      case "phone": return !!phoneNumber.trim();
      case "sms": return !!smsNumber.trim();
      default: return false;
    }
  }, [qrType, websiteUrl, plainText, wifiSsid, emailTo, phoneNumber, smsNumber]);

  const generateQR = useCallback(() => {
    const data = getQrData();
    if (!data) return;

    try {
      const qr = qrcode(0, errorLevel);
      qr.addData(data);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor((qrSize - margin * 2) / moduleCount);
      const actualSize = cellSize * moduleCount + margin * 2;

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = actualSize;
      canvas.height = actualSize;
      const ctx = canvas.getContext("2d")!;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, actualSize, actualSize);

      // Draw QR modules
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = margin + col * cellSize;
            const y = margin + row * cellSize;
            ctx.fillStyle = fgColor;

            if (dotStyle === "rounded") {
              const r = cellSize * 0.4;
              ctx.beginPath();
              ctx.moveTo(x + r, y);
              ctx.lineTo(x + cellSize - r, y);
              ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + r);
              ctx.lineTo(x + cellSize, y + cellSize - r);
              ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - r, y + cellSize);
              ctx.lineTo(x + r, y + cellSize);
              ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - r);
              ctx.lineTo(x, y + r);
              ctx.quadraticCurveTo(x, y, x + r, y);
              ctx.fill();
            } else if (dotStyle === "dots") {
              const cx = x + cellSize / 2;
              const cy = y + cellSize / 2;
              ctx.beginPath();
              ctx.arc(cx, cy, cellSize * 0.45, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
      }

      // Draw logo if present
      if (logoFile) {
        const img = new Image();
        img.onload = () => {
          const logoSize = actualSize * 0.22;
          const logoX = (actualSize - logoSize) / 2;
          const logoY = (actualSize - logoSize) / 2;
          
          // White background behind logo
          ctx.fillStyle = "#ffffff";
          const pad = 4;
          ctx.fillRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2);
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          
          setQrDataUrl(canvas.toDataURL("image/png"));
        };
        img.src = logoFile;
      } else {
        setQrDataUrl(canvas.toDataURL("image/png"));
      }

      // SVG
      const svgParts: string[] = [];
      svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${actualSize} ${actualSize}" width="${actualSize}" height="${actualSize}">`);
      svgParts.push(`<rect width="${actualSize}" height="${actualSize}" fill="${bgColor}"/>`);
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = margin + col * cellSize;
            const y = margin + row * cellSize;
            if (dotStyle === "dots") {
              svgParts.push(`<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.45}" fill="${fgColor}"/>`);
            } else if (dotStyle === "rounded") {
              svgParts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.4}" fill="${fgColor}"/>`);
            } else {
              svgParts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>`);
            }
          }
        }
      }
      svgParts.push("</svg>");
      setQrSvg(svgParts.join(""));
    } catch {
      toast.error("QR Code generation failed!");
    }
  }, [getQrData, errorLevel, qrSize, margin, bgColor, fgColor, dotStyle, logoFile]);

  // Auto-generate on changes
  useEffect(() => {
    if (hasInput()) {
      const timer = setTimeout(generateQR, 300);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl(null);
      setQrSvg(null);
    }
  }, [generateQR, hasInput]);

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
    toast.success("PNG downloaded!");
    setShowDownloadMenu(false);
  };

  const downloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded!");
    setShowDownloadMenu(false);
  };

  const copyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("QR Code copied! 📋");
    } catch {
      toast.success("Text copied!");
    }
  };

  const shareQr = async () => {
    if (!qrDataUrl) return;
    try {
      if (navigator.share) {
        const res = await fetch(qrDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({ title: "QR Code", files: [file] });
      } else {
        await navigator.clipboard.writeText(getQrData());
        toast.success("Link copied!");
      }
    } catch {
      toast.info("Sharing cancelled");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[hsl(230,25%,97%)]">
      <SideMenu />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-white border-b border-[hsl(230,20%,90%)]">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-[hsl(230,80%,55%)] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[hsl(230,30%,15%)]">
              QR Code Generator
            </h1>
          </div>
          <p className="text-[hsl(230,15%,55%)] text-sm">
            Create customized QR codes — Free, Fast & Private
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AdBanner />

        {/* QR Type Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[hsl(230,20%,92%)] overflow-hidden">
          <div className="flex overflow-x-auto border-b border-[hsl(230,20%,92%)] scrollbar-hide">
            {QR_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = qrType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                    isActive
                      ? "border-[hsl(230,80%,55%)] text-[hsl(230,80%,55%)] bg-[hsl(230,80%,97%)]"
                      : "border-transparent text-[hsl(230,15%,50%)] hover:text-[hsl(230,30%,30%)] hover:bg-[hsl(230,20%,97%)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Main Content: Left (Input + Design) | Right (Preview) */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel */}
            <div className="flex-1 p-5 lg:p-6 border-r-0 lg:border-r border-[hsl(230,20%,92%)]">
              {/* Step 1: Content */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[hsl(230,80%,55%)] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="font-semibold text-[hsl(230,30%,15%)]">Complete the content</h2>
                </div>

                {qrType === "website" && (
                  <div>
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Enter your Website</Label>
                    <Input
                      placeholder="E.g. https://www.myweb.com/"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="h-11 text-sm border-[hsl(230,20%,88%)] focus:border-[hsl(230,80%,55%)] focus:ring-[hsl(230,80%,55%)]"
                    />
                  </div>
                )}

                {qrType === "text" && (
                  <div>
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Enter your text</Label>
                    <Textarea
                      placeholder="Enter any text or message..."
                      value={plainText}
                      onChange={(e) => setPlainText(e.target.value)}
                      className="min-h-[100px] text-sm border-[hsl(230,20%,88%)]"
                      maxLength={2000}
                    />
                    <span className="text-xs text-[hsl(230,15%,60%)] mt-1 block text-right">{plainText.length}/2000</span>
                  </div>
                )}

                {qrType === "wifi" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Network Name (SSID)</Label>
                      <Input placeholder="WiFi Name" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Password</Label>
                      <Input type="password" placeholder="WiFi Password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Encryption</Label>
                      <div className="flex gap-2">
                        {["WPA", "WEP", "nopass"].map((enc) => (
                          <button
                            key={enc}
                            onClick={() => setWifiEncryption(enc)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              wifiEncryption === enc
                                ? "bg-[hsl(230,80%,55%)] text-white"
                                : "bg-[hsl(230,20%,95%)] text-[hsl(230,15%,40%)] hover:bg-[hsl(230,20%,90%)]"
                            }`}
                          >
                            {enc === "nopass" ? "None" : enc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {qrType === "email" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Email Address</Label>
                      <Input placeholder="example@email.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Subject</Label>
                      <Input placeholder="Email subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Body</Label>
                      <Textarea placeholder="Email body..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="min-h-[80px] text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                  </div>
                )}

                {qrType === "phone" && (
                  <div>
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Phone Number</Label>
                    <Input placeholder="+91 9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                  </div>
                )}

                {qrType === "sms" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Phone Number</Label>
                      <Input placeholder="+91 9876543210" value={smsNumber} onChange={(e) => setSmsNumber(e.target.value)} className="h-11 text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-1.5 block">Message</Label>
                      <Textarea placeholder="SMS message..." value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} className="min-h-[80px] text-sm border-[hsl(230,20%,88%)]" />
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-[hsl(230,20%,92%)] mb-6" />

              {/* Step 2: Design */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[hsl(230,80%,55%)] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="font-semibold text-[hsl(230,30%,15%)]">Design your QR</h2>
                </div>

                {/* Design Sub-tabs */}
                <div className="flex gap-1 mb-4 bg-[hsl(230,20%,96%)] rounded-lg p-1">
                  {[
                    { id: "colors", label: "Colors" },
                    { id: "shape", label: "Shape" },
                    { id: "logo", label: "Logo" },
                    { id: "level", label: "Level" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDesignTab(tab.id)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        designTab === tab.id
                          ? "bg-white text-[hsl(230,80%,55%)] shadow-sm"
                          : "text-[hsl(230,15%,50%)] hover:text-[hsl(230,30%,30%)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Colors Tab */}
                {designTab === "colors" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Foreground Color</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setFgColor(c)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              fgColor === c ? "border-[hsl(230,80%,55%)] scale-110" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-9 h-9 rounded-lg border border-[hsl(230,20%,88%)] cursor-pointer" />
                        <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex-1 font-mono text-sm h-9 border-[hsl(230,20%,88%)]" maxLength={7} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Background Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-9 h-9 rounded-lg border border-[hsl(230,20%,88%)] cursor-pointer" />
                        <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 font-mono text-sm h-9 border-[hsl(230,20%,88%)]" maxLength={7} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Shape Tab */}
                {designTab === "shape" && (
                  <div className="space-y-4">
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Dot Style</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "square" as DotStyle, label: "Square", icon: <Square className="w-6 h-6" /> },
                        { id: "rounded" as DotStyle, label: "Rounded", icon: <div className="w-6 h-6 rounded-md bg-current" /> },
                        { id: "dots" as DotStyle, label: "Dots", icon: <Circle className="w-6 h-6" /> },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setDotStyle(s.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            dotStyle === s.id
                              ? "border-[hsl(230,80%,55%)] bg-[hsl(230,80%,97%)] text-[hsl(230,80%,55%)]"
                              : "border-[hsl(230,20%,92%)] text-[hsl(230,15%,50%)] hover:border-[hsl(230,20%,80%)]"
                          }`}
                        >
                          {s.icon}
                          <span className="text-xs font-medium">{s.label}</span>
                        </button>
                      ))}
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Size: {qrSize}px</Label>
                      <Slider value={[qrSize]} onValueChange={(v) => setQrSize(v[0])} min={150} max={500} step={10} />
                    </div>
                    <div>
                      <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Margin: {margin}px</Label>
                      <Slider value={[margin]} onValueChange={(v) => setMargin(v[0])} min={0} max={20} step={2} />
                    </div>
                  </div>
                )}

                {/* Logo Tab */}
                {designTab === "logo" && (
                  <div className="space-y-4">
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Upload Logo (center of QR)</Label>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    {logoFile ? (
                      <div className="flex items-center gap-3 p-3 bg-[hsl(230,20%,96%)] rounded-xl">
                        <img src={logoFile} alt="Logo" className="w-14 h-14 rounded-lg object-cover border border-[hsl(230,20%,90%)]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[hsl(230,30%,20%)]">Logo uploaded</p>
                          <p className="text-xs text-[hsl(230,15%,55%)]">Will appear in QR center</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setLogoFile(null)} className="text-[hsl(0,60%,50%)]">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full p-6 border-2 border-dashed border-[hsl(230,20%,85%)] rounded-xl hover:border-[hsl(230,80%,55%)] hover:bg-[hsl(230,80%,98%)] transition-all flex flex-col items-center gap-2 text-[hsl(230,15%,50%)]"
                      >
                        <Upload className="w-8 h-8" />
                        <span className="text-sm font-medium">Click to upload logo</span>
                        <span className="text-xs">PNG, JPG, SVG</span>
                      </button>
                    )}
                    <p className="text-xs text-[hsl(230,15%,60%)]">
                      💡 Use "H" error correction level for best results with logo
                    </p>
                  </div>
                )}

                {/* Level Tab */}
                {designTab === "level" && (
                  <div className="space-y-3">
                    <Label className="text-sm text-[hsl(230,15%,40%)] mb-2 block">Error Correction Level</Label>
                    {[
                      { id: "L" as ErrorLevel, label: "Low (7%)", desc: "Smallest QR, less error tolerance" },
                      { id: "M" as ErrorLevel, label: "Medium (15%)", desc: "Good balance of size and recovery" },
                      { id: "Q" as ErrorLevel, label: "Quartile (25%)", desc: "Better recovery, slightly larger" },
                      { id: "H" as ErrorLevel, label: "High (30%)", desc: "Best for logos, largest QR size" },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setErrorLevel(lvl.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          errorLevel === lvl.id
                            ? "border-[hsl(230,80%,55%)] bg-[hsl(230,80%,97%)]"
                            : "border-[hsl(230,20%,92%)] hover:border-[hsl(230,20%,80%)]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          errorLevel === lvl.id ? "border-[hsl(230,80%,55%)]" : "border-[hsl(230,20%,80%)]"
                        }`}>
                          {errorLevel === lvl.id && <div className="w-2.5 h-2.5 rounded-full bg-[hsl(230,80%,55%)]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${errorLevel === lvl.id ? "text-[hsl(230,80%,55%)]" : "text-[hsl(230,30%,20%)]"}`}>{lvl.label}</p>
                          <p className="text-xs text-[hsl(230,15%,55%)]">{lvl.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-full lg:w-[320px] p-5 lg:p-6 bg-[hsl(230,20%,98%)]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-7 h-7 rounded-full bg-[hsl(230,80%,55%)] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="font-semibold text-[hsl(230,30%,15%)]">Download your QR</h2>
              </div>

              <div className="bg-white rounded-2xl border border-[hsl(230,20%,92%)] p-4 flex items-center justify-center min-h-[220px] mb-4">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="max-w-full h-auto" style={{ imageRendering: dotStyle === "square" ? "pixelated" : "auto" }} />
                ) : (
                  <div className="text-center py-6">
                    <QrCode className="w-20 h-20 mx-auto text-[hsl(230,20%,85%)] mb-3" />
                    <p className="text-sm text-[hsl(230,15%,55%)]">Your QR will appear here</p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <div className="relative mb-3">
                <Button
                  onClick={() => qrDataUrl ? setShowDownloadMenu(!showDownloadMenu) : null}
                  disabled={!qrDataUrl}
                  className="w-full h-11 bg-[hsl(230,80%,55%)] hover:bg-[hsl(230,80%,48%)] text-white font-medium rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
                {showDownloadMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[hsl(230,20%,90%)] overflow-hidden z-10">
                    <button onClick={downloadPng} className="w-full px-4 py-3 text-sm text-left hover:bg-[hsl(230,20%,97%)] flex items-center gap-2 text-[hsl(230,30%,20%)]">
                      <Download className="w-4 h-4" /> Download PNG
                    </button>
                    <button onClick={downloadSvg} className="w-full px-4 py-3 text-sm text-left hover:bg-[hsl(230,20%,97%)] flex items-center gap-2 text-[hsl(230,30%,20%)] border-t border-[hsl(230,20%,92%)]">
                      <Download className="w-4 h-4" /> Download SVG
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button onClick={copyQrImage} disabled={!qrDataUrl} variant="outline" className="flex-1 h-10 rounded-xl border-[hsl(230,20%,88%)] text-[hsl(230,15%,40%)]">
                  <Copy className="w-4 h-4 mr-1.5" /> Copy
                </Button>
                <Button onClick={shareQr} disabled={!qrDataUrl} variant="outline" className="flex-1 h-10 rounded-xl border-[hsl(230,20%,88%)] text-[hsl(230,15%,40%)]">
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner />

        {/* Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[hsl(230,20%,92%)] p-5 text-center">
            <Shield className="w-9 h-9 text-[hsl(230,80%,55%)] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[hsl(230,30%,15%)]">No Data Stored</p>
            <p className="text-xs text-[hsl(230,15%,55%)] mt-1">Your data never leaves your browser</p>
          </div>
          <div className="bg-white rounded-xl border border-[hsl(230,20%,92%)] p-5 text-center">
            <Lock className="w-9 h-9 text-[hsl(230,80%,55%)] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[hsl(230,30%,15%)]">Generated in Browser</p>
            <p className="text-xs text-[hsl(230,15%,55%)] mt-1">100% client-side processing</p>
          </div>
          <div className="bg-white rounded-xl border border-[hsl(230,20%,92%)] p-5 text-center">
            <CheckCircle className="w-9 h-9 text-[hsl(230,80%,55%)] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[hsl(230,30%,15%)]">Safe & Private</p>
            <p className="text-xs text-[hsl(230,15%,55%)] mt-1">Your privacy is fully protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
