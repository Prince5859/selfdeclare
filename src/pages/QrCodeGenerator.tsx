import { useState, useCallback } from "react";
import { QrCode, Shield, Lock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import QrInputPanel, { type InputType } from "@/components/qr/QrInputPanel";
import QrCustomizationPanel, { type QrStyleOptions } from "@/components/qr/QrCustomizationPanel";
import QrPreviewPanel from "@/components/qr/QrPreviewPanel";

const defaultOptions: QrStyleOptions = {
  size: 300,
  margin: 10,
  fgColor: "#000000",
  bgColor: "#ffffff",
  dotsStyle: "rounded",
  cornersSquareStyle: "extra-rounded",
  cornersDotStyle: "dot",
  errorCorrection: "M",
  gradientEnabled: false,
  gradientColor1: "#000000",
  gradientColor2: "#4a00e0",
  gradientType: "linear",
  transparentBg: false,
  logoImage: null,
};

const QrCodeGenerator = () => {
  const [qrData, setQrData] = useState("");
  const [inputType, setInputType] = useState<InputType>("text");
  const [options, setOptions] = useState<QrStyleOptions>(defaultOptions);

  const handleDataChange = useCallback((data: string, type: InputType) => {
    setQrData(data);
    setInputType(type);
    // Auto-set error correction to H when logo is present
    if (options.logoImage && options.errorCorrection !== "H") {
      setOptions((prev) => ({ ...prev, errorCorrection: "H" }));
    }
  }, [options.logoImage, options.errorCorrection]);

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Create custom QR codes for URLs, text, WiFi, vCard & more — 100% Private & Free
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AdBanner />

        {/* Main Layout: Left (Input + Options) | Right (Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Choose Input Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QrInputPanel onDataChange={handleDataChange} />
              </CardContent>
            </Card>

            {/* Customization */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Customize QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <QrCustomizationPanel options={options} onChange={setOptions} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <QrPreviewPanel data={qrData} options={options} />
              </CardContent>
            </Card>
          </div>
        </div>

        <AdBanner />

        {/* Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">No Data Stored</p>
            <p className="text-xs text-muted-foreground">कोई डेटा सर्वर पर नहीं जाता</p>
          </Card>
          <Card className="text-center p-4">
            <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Works in Your Browser</p>
            <p className="text-xs text-muted-foreground">100% Client-side processing</p>
          </Card>
          <Card className="text-center p-4">
            <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Private & Secure</p>
            <p className="text-xs text-muted-foreground">आपकी privacy सुरक्षित है</p>
          </Card>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 text-xs text-muted-foreground leading-relaxed">
          ⚠️ यह टूल केवल QR Code generate करने के लिए है। कोई भी डेटा सर्वर पर store नहीं किया जाता। सभी processing आपके browser में होती है।
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
