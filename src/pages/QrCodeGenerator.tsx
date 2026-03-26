import { useState, useRef, useCallback } from "react";
import { QrCode, Download, Copy, Share2, Shield, Lock, CheckCircle, Palette, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import qrcode from "qrcode-generator";

const QrCodeGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return /^(https?:\/\/|www\.)/i.test(text);
    }
  };

  const generateQR = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("कृपया कोई text या URL दर्ज करें");
      return;
    }

    setGenerating(true);

    try {
      // Auto-prefix www. URLs
      let data = inputText.trim();
      if (/^www\./i.test(data)) {
        data = "https://" + data;
      }

      // Determine error correction level
      const typeNumber = 0; // auto
      const errorCorrection = "M";
      const qr = qrcode(typeNumber, errorCorrection);
      qr.addData(data);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor((qrSize - margin * 2) / moduleCount);
      const actualSize = cellSize * moduleCount + margin * 2;

      // Draw on canvas for PNG
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = actualSize;
        canvas.height = actualSize;
        const ctx = canvas.getContext("2d")!;

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, actualSize, actualSize);

        // QR modules
        ctx.fillStyle = fgColor;
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(
                margin + col * cellSize,
                margin + row * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }

        setQrDataUrl(canvas.toDataURL("image/png"));
      }

      // Generate SVG
      const svgParts: string[] = [];
      svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${actualSize} ${actualSize}" width="${actualSize}" height="${actualSize}">`);
      svgParts.push(`<rect width="${actualSize}" height="${actualSize}" fill="${bgColor}"/>`);
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            svgParts.push(`<rect x="${margin + col * cellSize}" y="${margin + row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>`);
          }
        }
      }
      svgParts.push("</svg>");
      setQrSvg(svgParts.join(""));

      toast.success("QR Code generated successfully! ✅");
    } catch (err) {
      toast.error("QR Code generation failed. कृपया input छोटा करें।");
    } finally {
      setGenerating(false);
    }
  }, [inputText, qrSize, fgColor, bgColor, margin]);

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
    toast.success("PNG download हो रहा है!");
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
    toast.success("SVG download हो रहा है!");
  };

  const copyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("QR Code copied to clipboard! 📋");
    } catch {
      // Fallback: copy text
      await navigator.clipboard.writeText(inputText);
      toast.success("Text copied to clipboard!");
    }
  };

  const shareQr = async () => {
    if (!qrDataUrl) return;
    try {
      if (navigator.share) {
        const res = await fetch(qrDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({
          title: "QR Code",
          text: inputText,
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText(inputText);
        toast.success("Link copied! Share करें।");
      }
    } catch {
      toast.info("Sharing cancelled");
    }
  };

  const inputType = inputText.trim() ? (isUrl(inputText.trim()) ? "🔗 URL detected" : "📝 Text detected") : "";

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">
              QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm hindi-text">
            Text, URL या कोई भी message का QR Code बनाएं — 100% Private & Free
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Ad Banner */}
        <AdBanner />

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg hindi-text flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Enter Text or URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="hindi-text text-sm mb-1 block">Text, URL या Message दर्ज करें</Label>
              <Textarea
                placeholder="https://example.com या कोई भी text..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[100px] text-base"
                maxLength={2000}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-primary font-medium">{inputType}</span>
                <span className="text-xs text-muted-foreground">{inputText.length}/2000</span>
              </div>
            </div>

            {/* Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Size */}
              <div>
                <Label className="hindi-text text-sm flex items-center gap-1 mb-2">
                  <Maximize className="w-4 h-4" /> QR Size: {qrSize}px
                </Label>
                <Slider
                  value={[qrSize]}
                  onValueChange={(v) => setQrSize(v[0])}
                  min={128}
                  max={512}
                  step={32}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Small</span><span>Medium</span><span>Large</span>
                </div>
              </div>

              {/* Margin */}
              <div>
                <Label className="hindi-text text-sm mb-2 block">Margin: {margin}px</Label>
                <Slider
                  value={[margin]}
                  onValueChange={(v) => setMargin(v[0])}
                  min={0}
                  max={20}
                  step={2}
                />
              </div>

              {/* Foreground Color */}
              <div>
                <Label className="hindi-text text-sm flex items-center gap-1 mb-2">
                  <Palette className="w-4 h-4" /> Foreground Color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <Label className="hindi-text text-sm flex items-center gap-1 mb-2">
                  <Palette className="w-4 h-4" /> Background Color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateQR}
              disabled={generating || !inputText.trim()}
              className="w-full h-12 text-base font-semibold hindi-text"
              size="lg"
            >
              {generating ? "Generating..." : "🔲 QR Code Generate करें"}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg hindi-text">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              {qrDataUrl ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-md">
                    <Button onClick={downloadPng} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Download className="w-4 h-4" />
                      <span className="text-xs">PNG</span>
                    </Button>
                    <Button onClick={downloadSvg} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Download className="w-4 h-4" />
                      <span className="text-xs">SVG</span>
                    </Button>
                    <Button onClick={copyQrImage} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Copy className="w-4 h-4" />
                      <span className="text-xs">Copy</span>
                    </Button>
                    <Button onClick={shareQr} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-10 space-y-3">
                  <QrCode className="w-16 h-16 mx-auto opacity-20" />
                  <p className="hindi-text text-sm">QR Code यहाँ दिखेगा</p>
                  <p className="text-xs">Text या URL enter करके Generate बटन दबाएं</p>
                </div>
              )}
            </div>

            {/* Hidden canvas for rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Ad Banner after download */}
        <AdBanner />

        {/* Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm hindi-text">No Data Stored</p>
            <p className="text-xs text-muted-foreground hindi-text">कोई डेटा सर्वर पर नहीं जाता</p>
          </Card>
          <Card className="text-center p-4">
            <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm hindi-text">Browser में Generate</p>
            <p className="text-xs text-muted-foreground hindi-text">100% Client-side processing</p>
          </Card>
          <Card className="text-center p-4">
            <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm hindi-text">Safe & Private</p>
            <p className="text-xs text-muted-foreground hindi-text">आपकी privacy सुरक्षित है</p>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-xs text-muted-foreground leading-relaxed hindi-text">
          ⚠️ यह टूल केवल QR Code generate करने के लिए है। कोई भी डेटा सर्वर पर store नहीं किया जाता। सभी processing आपके browser में होती है।
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
