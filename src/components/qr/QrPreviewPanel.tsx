import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Copy, Share2, QrCode, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { QrStyleOptions } from "./QrCustomizationPanel";
import QRCodeStyling from "qr-code-styling";

interface QrPreviewPanelProps {
  data: string;
  options: QrStyleOptions;
}

const QrPreviewPanel = ({ data, options }: QrPreviewPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [hasQr, setHasQr] = useState(false);

  const buildQrOptions = useCallback(() => {
    const dotsOptions: any = { type: options.dotsStyle };

    if (options.gradientEnabled) {
      dotsOptions.gradient = {
        type: options.gradientType,
        colorStops: [
          { offset: 0, color: options.gradientColor1 },
          { offset: 1, color: options.gradientColor2 },
        ],
      };
    } else {
      dotsOptions.color = options.fgColor;
    }

    return {
      width: options.size,
      height: options.size,
      data: data || "https://example.com",
      margin: options.margin,
      type: "canvas" as const,
      dotsOptions,
      cornersSquareOptions: {
        type: options.cornersSquareStyle,
        color: options.gradientEnabled ? options.gradientColor1 : options.fgColor,
      },
      cornersDotOptions: {
        type: options.cornersDotStyle,
        color: options.gradientEnabled ? options.gradientColor2 : options.fgColor,
      },
      backgroundOptions: {
        color: options.transparentBg ? "transparent" : options.bgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.3,
      },
      image: options.logoImage || undefined,
      qrOptions: {
        errorCorrectionLevel: options.errorCorrection,
      },
    };
  }, [data, options]);

  useEffect(() => {
    if (!data.trim()) {
      setHasQr(false);
      if (containerRef.current) containerRef.current.innerHTML = "";
      return;
    }

    const qrOptions = buildQrOptions();

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(qrOptions as any);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qrRef.current.append(containerRef.current);
      }
    } else {
      qrRef.current.update(qrOptions as any);
    }
    setHasQr(true);
  }, [data, buildQrOptions]);

  const downloadAs = async (format: "png" | "svg" | "jpeg") => {
    if (!qrRef.current) return;
    try {
      await qrRef.current.download({
        name: "qrcode",
        extension: format,
      });
      toast.success(`${format.toUpperCase()} downloaded! ✅`);
    } catch {
      toast.error("Download failed");
    }
  };

  const copyQr = async () => {
    if (!qrRef.current || !containerRef.current) return;
    try {
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/png");
        });
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("QR Code copied! 📋");
      }
    } catch {
      if (data) {
        await navigator.clipboard.writeText(data);
        toast.success("Data copied to clipboard!");
      }
    }
  };

  const shareQr = async () => {
    if (!qrRef.current || !containerRef.current) return;
    try {
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas && navigator.share) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/png");
        });
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({ title: "QR Code", files: [file] });
      } else {
        await navigator.clipboard.writeText(data);
        toast.success("Link copied!");
      }
    } catch {
      toast.info("Sharing cancelled");
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex items-center justify-center min-h-[280px] bg-muted/30 rounded-xl border-2 border-dashed border-border p-6">
        {hasQr && data.trim() ? (
          <div
            ref={containerRef}
            className="flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-lg"
          />
        ) : (
          <div className="text-center space-y-3">
            <QrCode className="w-20 h-20 mx-auto text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm font-medium">QR Code Preview</p>
            <p className="text-xs text-muted-foreground">Enter data and it will appear here</p>
            <div ref={containerRef} className="hidden" />
          </div>
        )}
      </div>

      {/* Download & Actions */}
      {hasQr && data.trim() && (
        <div className="space-y-3">
          {/* Download Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => downloadAs("png")}
              className="flex items-center gap-2"
              size="sm"
            >
              <Image className="w-4 h-4" />
              PNG
            </Button>
            <Button
              onClick={() => downloadAs("svg")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              SVG
            </Button>
            <Button
              onClick={() => downloadAs("jpeg")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              JPG
            </Button>
          </div>

          {/* Copy & Share */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={copyQr} variant="secondary" size="sm" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy Image
            </Button>
            <Button onClick={shareQr} variant="secondary" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrPreviewPanel;
