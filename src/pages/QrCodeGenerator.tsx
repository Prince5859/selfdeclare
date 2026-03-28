import { useState, useRef, useCallback, useEffect } from "react";
import {
  Globe, FileText, Wifi, Mail, Phone, MessageSquare,
  Download, Copy, Share2, Shield, Lock, CheckCircle,
  QrCode, ChevronDown, Upload, X, RotateCcw,
  Frame, Shapes, Image, Settings2,
  PhoneCall, Link2, MapPin, Radio, CalendarDays, Contact
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import qrcode from "qrcode-generator";

type QrType = "website" | "text" | "wifi" | "email" | "phone" | "sms";
type DotStyle = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded" | "diamond" | "star" | "fluid";
type CornerStyle = "square" | "rounded" | "dot" | "extra-rounded";
type ErrorLevel = "L" | "M" | "Q" | "H";
type FrameStyle = "none" | "simple" | "rounded" | "badge" | "banner" | "ticket";

const QR_TYPES = [
  { id: "website" as QrType, label: "Website", icon: Globe },
  { id: "text" as QrType, label: "Text", icon: FileText },
  { id: "wifi" as QrType, label: "WiFi", icon: Wifi },
  { id: "email" as QrType, label: "Email", icon: Mail },
  { id: "phone" as QrType, label: "Phone", icon: Phone },
  { id: "sms" as QrType, label: "SMS", icon: MessageSquare },
];

const PRESET_FG_COLORS = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#533483", "#2b9348", "#ff6b35",
  "#1d3557", "#457b9d", "#e63946", "#6a4c93",
];

const PRESET_BG_COLORS = [
  "#ffffff", "#f8f9fa", "#fff3cd", "#d1ecf1",
  "#f5f5dc", "#e8f5e9", "#fce4ec", "#e3f2fd",
];

const PRESET_LOGOS = [
  { id: "none", icon: X, label: "None", color: "#999" },
  { id: "phone", icon: PhoneCall, label: "Phone", color: "#25D366" },
  { id: "link", icon: Link2, label: "Link", color: "#6366f1" },
  { id: "location", icon: MapPin, label: "Location", color: "#ef4444" },
  { id: "wifi", icon: Radio, label: "WiFi", color: "#22c55e" },
  { id: "calendar", icon: CalendarDays, label: "Calendar", color: "#3b82f6" },
  { id: "email", icon: Mail, label: "Email", color: "#f59e0b" },
  { id: "contact", icon: Contact, label: "Contact", color: "#8b5cf6" },
  { id: "globe", icon: Globe, label: "Website", color: "#06b6d4" },
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

  // Design - Shape
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>("square");
  const [shapeSubTab, setShapeSubTab] = useState<"style" | "edge">("style");

  // Design - Frame
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("none");
  const [frameColor, setFrameColor] = useState("#000000");
  const [frameText, setFrameText] = useState("SCAN ME");

  // Design - Logo
  const [selectedPresetLogo, setSelectedPresetLogo] = useState("none");
  const [logoFile, setLogoFile] = useState<string | null>(null);

  // Design - Level
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");

  // Settings
  const [qrSize, setQrSize] = useState(280);
  const [margin, setMargin] = useState(4);

  // Design tab
  const [designTab, setDesignTab] = useState("frame");

  // Mobile step toggle
  const [mobileStep, setMobileStep] = useState<"content" | "design">("content");

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
      case "text": return plainText.trim();
      case "wifi": return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email": return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone": return `tel:${phoneNumber}`;
      case "sms": return `smsto:${smsNumber}:${smsMessage}`;
      default: return "";
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

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: DotStyle) => {
    switch (style) {
      case "dots": {
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "rounded": {
        const r = size * 0.35;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + size - r, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + r);
        ctx.lineTo(x + size, y + size - r);
        ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
        ctx.lineTo(x + r, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
        break;
      }
      case "classy": {
        ctx.fillRect(x, y, size, size);
        // Add small notch
        ctx.clearRect(x + size * 0.7, y, size * 0.3, size * 0.3);
        ctx.fill();
        break;
      }
      case "classy-rounded": {
        const cr = size * 0.25;
        ctx.beginPath();
        ctx.moveTo(x + cr, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size - cr);
        ctx.quadraticCurveTo(x + size, y + size, x + size - cr, y + size);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x, y + cr);
        ctx.quadraticCurveTo(x, y, x + cr, y);
        ctx.fill();
        break;
      }
      case "extra-rounded": {
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.48, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "diamond": {
        const cx = x + size / 2;
        const cy = y + size / 2;
        const half = size * 0.45;
        ctx.beginPath();
        ctx.moveTo(cx, cy - half);
        ctx.lineTo(cx + half, cy);
        ctx.lineTo(cx, cy + half);
        ctx.lineTo(cx - half, cy);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "star": {
        const cx2 = x + size / 2;
        const cy2 = y + size / 2;
        const outerR = size * 0.45;
        const innerR = size * 0.2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (Math.PI / 2) * -1 + (i * 2 * Math.PI) / 5;
          const innerAngle = outerAngle + Math.PI / 5;
          if (i === 0) ctx.moveTo(cx2 + outerR * Math.cos(outerAngle), cy2 + outerR * Math.sin(outerAngle));
          else ctx.lineTo(cx2 + outerR * Math.cos(outerAngle), cy2 + outerR * Math.sin(outerAngle));
          ctx.lineTo(cx2 + innerR * Math.cos(innerAngle), cy2 + innerR * Math.sin(innerAngle));
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "fluid": {
        const cr2 = size * 0.48;
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size / 2, cr2, cr2 * 0.8, Math.random() * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      default:
        ctx.fillRect(x, y, size, size);
    }
  };

  const drawCorner = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: CornerStyle) => {
    const outerSize = size * 7;
    const innerSize = size * 3;
    const innerOffset = size * 2;

    ctx.fillStyle = fgColor;

    switch (style) {
      case "rounded": {
        const r = outerSize * 0.25;
        // Outer
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + outerSize - r, y);
        ctx.quadraticCurveTo(x + outerSize, y, x + outerSize, y + r);
        ctx.lineTo(x + outerSize, y + outerSize - r);
        ctx.quadraticCurveTo(x + outerSize, y + outerSize, x + outerSize - r, y + outerSize);
        ctx.lineTo(x + r, y + outerSize);
        ctx.quadraticCurveTo(x, y + outerSize, x, y + outerSize - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
        // Inner (cut)
        ctx.fillStyle = bgColor;
        const ir = innerSize * 0.2;
        const ix = x + size;
        const iy = y + size;
        const iw = outerSize - size * 2;
        ctx.beginPath();
        ctx.moveTo(ix + ir, iy);
        ctx.lineTo(ix + iw - ir, iy);
        ctx.quadraticCurveTo(ix + iw, iy, ix + iw, iy + ir);
        ctx.lineTo(ix + iw, iy + iw - ir);
        ctx.quadraticCurveTo(ix + iw, iy + iw, ix + iw - ir, iy + iw);
        ctx.lineTo(ix + ir, iy + iw);
        ctx.quadraticCurveTo(ix, iy + iw, ix, iy + iw - ir);
        ctx.lineTo(ix, iy + ir);
        ctx.quadraticCurveTo(ix, iy, ix + ir, iy);
        ctx.fill();
        // Center dot
        ctx.fillStyle = fgColor;
        const cr2 = innerSize * 0.15;
        ctx.beginPath();
        ctx.moveTo(x + innerOffset + cr2, y + innerOffset);
        ctx.lineTo(x + innerOffset + innerSize - cr2, y + innerOffset);
        ctx.quadraticCurveTo(x + innerOffset + innerSize, y + innerOffset, x + innerOffset + innerSize, y + innerOffset + cr2);
        ctx.lineTo(x + innerOffset + innerSize, y + innerOffset + innerSize - cr2);
        ctx.quadraticCurveTo(x + innerOffset + innerSize, y + innerOffset + innerSize, x + innerOffset + innerSize - cr2, y + innerOffset + innerSize);
        ctx.lineTo(x + innerOffset + cr2, y + innerOffset + innerSize);
        ctx.quadraticCurveTo(x + innerOffset, y + innerOffset + innerSize, x + innerOffset, y + innerOffset + innerSize - cr2);
        ctx.lineTo(x + innerOffset, y + innerOffset + cr2);
        ctx.quadraticCurveTo(x + innerOffset, y + innerOffset, x + innerOffset + cr2, y + innerOffset);
        ctx.fill();
        break;
      }
      case "dot": {
        ctx.beginPath();
        ctx.arc(x + outerSize / 2, y + outerSize / 2, outerSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(x + outerSize / 2, y + outerSize / 2, outerSize / 2 - size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fgColor;
        ctx.beginPath();
        ctx.arc(x + outerSize / 2, y + outerSize / 2, innerSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "extra-rounded": {
        const er = outerSize * 0.4;
        ctx.beginPath();
        ctx.moveTo(x + er, y);
        ctx.lineTo(x + outerSize - er, y);
        ctx.quadraticCurveTo(x + outerSize, y, x + outerSize, y + er);
        ctx.lineTo(x + outerSize, y + outerSize - er);
        ctx.quadraticCurveTo(x + outerSize, y + outerSize, x + outerSize - er, y + outerSize);
        ctx.lineTo(x + er, y + outerSize);
        ctx.quadraticCurveTo(x, y + outerSize, x, y + outerSize - er);
        ctx.lineTo(x, y + er);
        ctx.quadraticCurveTo(x, y, x + er, y);
        ctx.fill();
        ctx.fillStyle = bgColor;
        const ier = (outerSize - size * 2) * 0.35;
        ctx.beginPath();
        const ix2 = x + size, iy2 = y + size, iw2 = outerSize - size * 2;
        ctx.moveTo(ix2 + ier, iy2);
        ctx.lineTo(ix2 + iw2 - ier, iy2);
        ctx.quadraticCurveTo(ix2 + iw2, iy2, ix2 + iw2, iy2 + ier);
        ctx.lineTo(ix2 + iw2, iy2 + iw2 - ier);
        ctx.quadraticCurveTo(ix2 + iw2, iy2 + iw2, ix2 + iw2 - ier, iy2 + iw2);
        ctx.lineTo(ix2 + ier, iy2 + iw2);
        ctx.quadraticCurveTo(ix2, iy2 + iw2, ix2, iy2 + iw2 - ier);
        ctx.lineTo(ix2, iy2 + ier);
        ctx.quadraticCurveTo(ix2, iy2, ix2 + ier, iy2);
        ctx.fill();
        ctx.fillStyle = fgColor;
        ctx.beginPath();
        ctx.arc(x + outerSize / 2, y + outerSize / 2, innerSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      default: {
        // Square
        ctx.fillRect(x, y, outerSize, outerSize);
        ctx.fillStyle = bgColor;
        ctx.fillRect(x + size, y + size, outerSize - size * 2, outerSize - size * 2);
        ctx.fillStyle = fgColor;
        ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize);
      }
    }
  };

  const generateQR = useCallback(() => {
    const data = getQrData();
    if (!data) return;

    try {
      const qr = qrcode(0, errorLevel);
      qr.addData(data);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const extraBottom = frameStyle !== "none" ? 40 : 0;
      const cellSize = Math.floor((qrSize - margin * 2) / moduleCount);
      const qrActualSize = cellSize * moduleCount + margin * 2;
      const canvasHeight = qrActualSize + extraBottom;

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = qrActualSize;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d")!;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, qrActualSize, canvasHeight);

      // Draw frame background if needed
      if (frameStyle !== "none") {
        ctx.fillStyle = frameColor;
        const pad = 6;
        if (frameStyle === "simple") {
          ctx.fillRect(0, 0, qrActualSize, canvasHeight);
          ctx.fillStyle = bgColor;
          ctx.fillRect(pad, pad, qrActualSize - pad * 2, qrActualSize - pad * 2);
        } else if (frameStyle === "rounded") {
          const r = 12;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(qrActualSize - r, 0);
          ctx.quadraticCurveTo(qrActualSize, 0, qrActualSize, r);
          ctx.lineTo(qrActualSize, canvasHeight - r);
          ctx.quadraticCurveTo(qrActualSize, canvasHeight, qrActualSize - r, canvasHeight);
          ctx.lineTo(r, canvasHeight);
          ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.fill();
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          const ir = 8;
          ctx.moveTo(pad + ir, pad);
          ctx.lineTo(qrActualSize - pad - ir, pad);
          ctx.quadraticCurveTo(qrActualSize - pad, pad, qrActualSize - pad, pad + ir);
          ctx.lineTo(qrActualSize - pad, qrActualSize - pad - ir);
          ctx.quadraticCurveTo(qrActualSize - pad, qrActualSize - pad, qrActualSize - pad - ir, qrActualSize - pad);
          ctx.lineTo(pad + ir, qrActualSize - pad);
          ctx.quadraticCurveTo(pad, qrActualSize - pad, pad, qrActualSize - pad - ir);
          ctx.lineTo(pad, pad + ir);
          ctx.quadraticCurveTo(pad, pad, pad + ir, pad);
          ctx.fill();
        } else if (frameStyle === "badge") {
          ctx.fillRect(0, qrActualSize - 4, qrActualSize, extraBottom + 4);
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, qrActualSize, qrActualSize - 4);
        } else if (frameStyle === "banner") {
          ctx.fillRect(0, 0, qrActualSize, canvasHeight);
          ctx.fillStyle = bgColor;
          ctx.fillRect(pad, pad, qrActualSize - pad * 2, qrActualSize - pad * 2);
        } else if (frameStyle === "ticket") {
          ctx.fillRect(0, 0, qrActualSize, canvasHeight);
          ctx.fillStyle = bgColor;
          ctx.fillRect(pad, pad, qrActualSize - pad * 2, qrActualSize - pad * 2);
          // Ticket notches
          ctx.fillStyle = frameColor;
          ctx.beginPath();
          ctx.arc(0, qrActualSize, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(qrActualSize, qrActualSize, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(0, qrActualSize, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(qrActualSize, qrActualSize, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Frame text
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(12, qrActualSize * 0.06)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(frameText, qrActualSize / 2, qrActualSize + extraBottom / 2);
      }

      // Identify corner positions (finder patterns: 7x7 modules)
      const cornerPositions = [
        { row: 0, col: 0 },
        { row: 0, col: moduleCount - 7 },
        { row: moduleCount - 7, col: 0 },
      ];

      const isInCorner = (row: number, col: number) => {
        for (const cp of cornerPositions) {
          if (row >= cp.row && row < cp.row + 7 && col >= cp.col && col < cp.col + 7) return true;
        }
        return false;
      };

      // Draw corners with custom style
      if (cornerStyle !== "square" || dotStyle !== "square") {
        for (const cp of cornerPositions) {
          drawCorner(ctx, margin + cp.col * cellSize, margin + cp.row * cellSize, cellSize, cornerStyle);
        }
      }

      // Draw QR data modules (skip corners)
      ctx.fillStyle = fgColor;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (isInCorner(row, col)) {
            if (cornerStyle === "square" && dotStyle === "square") {
              // Default corner drawing
              if (qr.isDark(row, col)) {
                ctx.fillStyle = fgColor;
                ctx.fillRect(margin + col * cellSize, margin + row * cellSize, cellSize, cellSize);
              }
            }
            continue;
          }
          if (qr.isDark(row, col)) {
            ctx.fillStyle = fgColor;
            drawDot(ctx, margin + col * cellSize, margin + row * cellSize, cellSize, dotStyle);
          }
        }
      }

      // Draw logo
      const drawLogo = () => {
        const logoSrc = logoFile || getPresetLogoSvg();
        if (!logoSrc) {
          setQrDataUrl(canvas.toDataURL("image/png"));
          return;
        }

        const img = document.createElement("img");
        img.onload = () => {
          const logoSize = qrActualSize * 0.2;
          const logoX = (qrActualSize - logoSize) / 2;
          const logoY = (qrActualSize - logoSize) / 2;

          // White circle background
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(qrActualSize / 2, qrActualSize / 2, logoSize * 0.65, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          setQrDataUrl(canvas.toDataURL("image/png"));
        };
        img.onerror = () => {
          setQrDataUrl(canvas.toDataURL("image/png"));
        };
        img.src = logoSrc;
      };

      if (logoFile || selectedPresetLogo !== "none") {
        drawLogo();
      } else {
        setQrDataUrl(canvas.toDataURL("image/png"));
      }

      // SVG generation
      const svgHeight = qrActualSize + extraBottom;
      const svgParts: string[] = [];
      svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qrActualSize} ${svgHeight}" width="${qrActualSize}" height="${svgHeight}">`);
      svgParts.push(`<rect width="${qrActualSize}" height="${svgHeight}" fill="${bgColor}"/>`);
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = margin + col * cellSize;
            const y = margin + row * cellSize;
            if (dotStyle === "dots" || dotStyle === "extra-rounded") {
              svgParts.push(`<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.42}" fill="${fgColor}"/>`);
            } else if (dotStyle === "rounded" || dotStyle === "classy-rounded") {
              svgParts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.35}" fill="${fgColor}"/>`);
            } else if (dotStyle === "diamond") {
              const cx = x + cellSize / 2;
              const cy = y + cellSize / 2;
              const h = cellSize * 0.45;
              svgParts.push(`<polygon points="${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}" fill="${fgColor}"/>`);
            } else {
              svgParts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>`);
            }
          }
        }
      }
      if (frameStyle !== "none") {
        svgParts.push(`<rect y="${qrActualSize}" width="${qrActualSize}" height="${extraBottom}" fill="${frameColor}"/>`);
        svgParts.push(`<text x="${qrActualSize / 2}" y="${qrActualSize + extraBottom / 2}" fill="white" font-size="${Math.max(12, qrActualSize * 0.06)}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${frameText}</text>`);
      }
      svgParts.push("</svg>");
      setQrSvg(svgParts.join(""));
    } catch {
      toast.error("QR Code generation failed!");
    }
  }, [getQrData, errorLevel, qrSize, margin, bgColor, fgColor, dotStyle, cornerStyle, frameStyle, frameColor, frameText, logoFile, selectedPresetLogo]);

  const getPresetLogoSvg = (): string | null => {
    if (selectedPresetLogo === "none") return null;
    const preset = PRESET_LOGOS.find(l => l.id === selectedPresetLogo);
    if (!preset) return null;
    // Create a simple SVG icon
    const color = preset.color;
    const svgMap: Record<string, string> = {
      phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><path d="M15 18c0-1 .5-6 9-6s9 5 9 6v2c0 .5-.5 1-1 1h-3c-.5 0-1-.5-1-1v-2h-8v2c0 .5-.5 1-1 1h-3c-.5 0-1-.5-1-1v-2zm2 8h14v8c0 1-1 2-2 2H19c-1 0-2-1-2-2v-8z" fill="white"/></svg>`,
      link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><path d="M20 28l8-8M16 24l4-4c2-2 5-2 7 0M21 29l4-4c2-2 5-2 7 0l0 0" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><path d="M24 12c-5 0-9 4-9 9 0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9zm0 12a3 3 0 110-6 3 3 0 010 6z" fill="white"/></svg>`,
      wifi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><path d="M12 22c3-4 7-6 12-6s9 2 12 6M16 26c2-3 5-4 8-4s6 1 8 4M20 30c1-2 2-3 4-3s3 1 4 3" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="24" cy="34" r="2" fill="white"/></svg>`,
      calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><rect x="13" y="15" width="22" height="20" rx="3" fill="none" stroke="white" stroke-width="2"/><line x1="13" y1="21" x2="35" y2="21" stroke="white" stroke-width="2"/><line x1="19" y1="12" x2="19" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="12" x2="29" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
      email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><rect x="12" y="16" width="24" height="16" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M12 16l12 10 12-10" stroke="white" stroke-width="2" fill="none"/></svg>`,
      contact: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><circle cx="24" cy="20" r="5" fill="white"/><path d="M15 34c0-5 4-9 9-9s9 4 9 9" stroke="white" stroke-width="2" fill="none"/></svg>`,
      globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="${color}"/><circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><ellipse cx="24" cy="24" rx="5" ry="10" fill="none" stroke="white" stroke-width="1.5"/><line x1="14" y1="24" x2="34" y2="24" stroke="white" stroke-width="1.5"/></svg>`,
    };
    const svg = svgMap[selectedPresetLogo];
    if (!svg) return null;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  };

  // Auto-generate
  useEffect(() => {
    if (hasInput()) {
      const timer = setTimeout(generateQR, 300);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl(null);
      setQrSvg(null);
    }
  }, [generateQR, hasInput]);

  const downloadFile = (type: "png" | "svg") => {
    if (type === "png" && qrDataUrl) {
      const a = document.createElement("a");
      a.href = qrDataUrl;
      a.download = "qrcode.png";
      a.click();
      toast.success("PNG downloaded!");
    } else if (type === "svg" && qrSvg) {
      const blob = new Blob([qrSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("SVG downloaded!");
    }
    setShowDownloadMenu(false);
  };

  const copyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("QR Code copied! 📋");
    } catch { toast.info("Text copied!"); }
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
    } catch { toast.info("Sharing cancelled"); }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large! Max 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoFile(reader.result as string);
      setSelectedPresetLogo("none");
    };
    reader.readAsDataURL(file);
  };

  const invertColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  // Input field rendering
  const renderInputFields = () => {
    const inputClass = "h-11 text-sm border-[hsl(var(--input))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]";
    switch (qrType) {
      case "website":
        return (
          <div>
            <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Enter your Website</Label>
            <Input placeholder="E.g. https://www.myweb.com/" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={inputClass} />
          </div>
        );
      case "text":
        return (
          <div>
            <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Enter your text</Label>
            <Textarea placeholder="Enter any text or message..." value={plainText} onChange={(e) => setPlainText(e.target.value)} className="min-h-[100px] text-sm border-[hsl(var(--input))]" maxLength={2000} />
            <span className="text-xs text-[hsl(var(--muted-foreground))] mt-1 block text-right">{plainText.length}/2000</span>
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Network Name (SSID)</Label>
              <Input placeholder="WiFi Name" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Password</Label>
              <Input type="password" placeholder="WiFi Password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Encryption</Label>
              <div className="flex gap-2">
                {["WPA", "WEP", "nopass"].map((enc) => (
                  <button key={enc} onClick={() => setWifiEncryption(enc)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${wifiEncryption === enc ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"}`}
                  >{enc === "nopass" ? "None" : enc}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-3">
            <div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Email Address</Label><Input placeholder="example@email.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className={inputClass} /></div>
            <div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Subject</Label><Input placeholder="Email subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className={inputClass} /></div>
            <div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Body</Label><Textarea placeholder="Email body..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="min-h-[80px] text-sm border-[hsl(var(--input))]" /></div>
          </div>
        );
      case "phone":
        return (<div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Phone Number</Label><Input placeholder="+91 9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} /></div>);
      case "sms":
        return (
          <div className="space-y-3">
            <div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Phone Number</Label><Input placeholder="+91 9876543210" value={smsNumber} onChange={(e) => setSmsNumber(e.target.value)} className={inputClass} /></div>
            <div><Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Message</Label><Textarea placeholder="SMS message..." value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} className="min-h-[80px] text-sm border-[hsl(var(--input))]" /></div>
          </div>
        );
    }
  };

  const DOT_STYLES: { id: DotStyle; label: string }[] = [
    { id: "square", label: "Square" },
    { id: "rounded", label: "Rounded" },
    { id: "dots", label: "Dots" },
    { id: "classy", label: "Classy" },
    { id: "classy-rounded", label: "Classy R" },
    { id: "extra-rounded", label: "Circle" },
    { id: "diamond", label: "Diamond" },
    { id: "star", label: "Star" },
    { id: "fluid", label: "Fluid" },
  ];

  const CORNER_STYLES: { id: CornerStyle; label: string }[] = [
    { id: "square", label: "Square" },
    { id: "rounded", label: "Rounded" },
    { id: "dot", label: "Circle" },
    { id: "extra-rounded", label: "Smooth" },
  ];

  const FRAME_STYLES: { id: FrameStyle; label: string }[] = [
    { id: "none", label: "None" },
    { id: "simple", label: "Simple" },
    { id: "rounded", label: "Rounded" },
    { id: "badge", label: "Badge" },
    { id: "banner", label: "Banner" },
    { id: "ticket", label: "Ticket" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <SideMenu />
      <canvas ref={canvasRef} className="hidden" />
      <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />

      {/* Header */}
      <div className="bg-white border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <QrCode className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-[hsl(var(--foreground))]">QR Code Generator</h1>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] text-xs">Customize with your color, shape and logo in 3 simple steps</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-5">
        <AdBanner />

        {/* QR Type Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[hsl(var(--border))] overflow-hidden">
          <div className="flex overflow-x-auto border-b border-[hsl(var(--border))]">
            {QR_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = qrType === type.id;
              return (
                <button key={type.id} onClick={() => setQrType(type.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${isActive ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary) / 0.1)]" : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel */}
            <div className="flex-1 border-r-0 lg:border-r border-[hsl(var(--border))]">

              {/* Mobile: Content/Design toggle */}
              <div className="lg:hidden flex border-b border-[hsl(var(--border))]">
                <button onClick={() => setMobileStep("content")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${mobileStep === "content" ? "bg-[hsl(var(--primary) / 0.1)] text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  Content
                </button>
                <button onClick={() => setMobileStep("design")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${mobileStep === "design" ? "bg-[hsl(var(--primary) / 0.1)] text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[hsl(var(--accent))] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  Design
                </button>
              </div>

              {/* Step 1: Content (always visible on desktop, toggled on mobile) */}
              <div className={`p-5 ${mobileStep !== "content" ? "hidden lg:block" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  <h2 className="font-semibold text-sm text-[hsl(var(--foreground))]">Complete the content</h2>
                </div>
                {renderInputFields()}
              </div>

              <hr className={`border-[hsl(var(--border))] ${mobileStep !== "content" ? "hidden lg:block" : "hidden lg:block"}`} />

              {/* Step 2: Design (always visible on desktop, toggled on mobile) */}
              <div className={`p-5 ${mobileStep !== "design" ? "hidden lg:block" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--accent))] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  <h2 className="font-semibold text-sm text-[hsl(var(--foreground))]">Design your QR</h2>
                </div>

                {/* Design Sub-tabs */}
                <div className="flex gap-0.5 mb-4 border-b border-[hsl(var(--border))]">
                  {[
                    { id: "frame", label: "Frame", icon: Frame },
                    { id: "shape", label: "Shape", icon: Shapes },
                    { id: "logo", label: "Logo", icon: Image },
                    { id: "level", label: "Level", icon: Settings2 },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setDesignTab(tab.id)}
                        className={`flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${designTab === tab.id ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
                      >
                        <TabIcon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Frame Tab */}
                {designTab === "frame" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {FRAME_STYLES.map((f) => (
                        <button key={f.id} onClick={() => setFrameStyle(f.id)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${frameStyle === f.id ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary) / 0.1)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--input))]"}`}
                        >
                          <div className="w-10 h-12 mx-auto mb-1 flex items-center justify-center">
                            {f.id === "none" ? (
                              <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                            ) : (
                              <div className={`w-8 h-10 border-2 ${frameStyle === f.id ? "border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground))]"} ${f.id === "rounded" ? "rounded-lg" : f.id === "ticket" ? "rounded-sm" : ""} flex flex-col`}>
                                <div className="flex-1 flex items-center justify-center">
                                  <QrCode className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                </div>
                                <div className={`h-2.5 ${frameStyle === f.id ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted-foreground))]"} ${f.id === "rounded" ? "rounded-b-md" : ""}`} />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">{f.label}</span>
                        </button>
                      ))}
                    </div>
                    {frameStyle !== "none" && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Frame Text</Label>
                          <Input value={frameText} onChange={(e) => setFrameText(e.target.value)} placeholder="SCAN ME" className="h-10 text-sm border-[hsl(var(--input))]" maxLength={20} />
                        </div>
                        <div>
                          <Label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">Frame Color</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="w-9 h-9 rounded-lg border border-[hsl(var(--input))] cursor-pointer" />
                            <Input value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="flex-1 font-mono text-sm h-9 border-[hsl(var(--input))]" maxLength={7} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shape Tab */}
                {designTab === "shape" && (
                  <div className="space-y-4">
                    {/* Shape sub-tabs */}
                    <div className="flex gap-1 bg-[hsl(var(--secondary))] rounded-lg p-0.5">
                      <button onClick={() => setShapeSubTab("style")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${shapeSubTab === "style" ? "bg-white text-[hsl(var(--primary))] shadow-sm" : "text-[hsl(var(--muted-foreground))]"}`}
                      >Shape style</button>
                      <button onClick={() => setShapeSubTab("edge")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${shapeSubTab === "edge" ? "bg-white text-[hsl(var(--primary))] shadow-sm" : "text-[hsl(var(--muted-foreground))]"}`}
                      >Edge and center</button>
                    </div>

                    {shapeSubTab === "style" ? (
                      <>
                        <div>
                          <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-2 block font-semibold">Shape style</Label>
                          <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                            {DOT_STYLES.map((s) => (
                              <button key={s.id} onClick={() => setDotStyle(s.id)}
                                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${dotStyle === s.id ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary) / 0.1)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--input))]"}`}
                              >
                                <DotPreview style={s.id} active={dotStyle === s.id} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[hsl(var(--secondary))] rounded-xl p-3 space-y-3">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5 block">Border colour</Label>
                              <div className="flex items-center gap-1.5">
                                <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="font-mono text-xs h-8 border-[hsl(var(--input))]" maxLength={7} />
                                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded border border-[hsl(var(--input))] cursor-pointer" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5 block">Background colour</Label>
                              <div className="flex items-center gap-1.5">
                                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-xs h-8 border-[hsl(var(--input))]" maxLength={7} />
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border border-[hsl(var(--input))] cursor-pointer" />
                              </div>
                            </div>
                          </div>
                          <button onClick={invertColors} className="flex items-center gap-1.5 text-[hsl(var(--primary))] text-xs font-medium hover:underline">
                            <RotateCcw className="w-3.5 h-3.5" /> Invert
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-2 block font-semibold">Corner style</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {CORNER_STYLES.map((c) => (
                              <button key={c.id} onClick={() => setCornerStyle(c.id)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${cornerStyle === c.id ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary) / 0.1)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--input))]"}`}
                              >
                                <CornerPreview style={c.id} active={cornerStyle === c.id} />
                                <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] mt-1 block">{c.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-2 block">Size: {qrSize}px</Label>
                          <Slider value={[qrSize]} onValueChange={(v) => setQrSize(v[0])} min={150} max={500} step={10} />
                        </div>
                        <div>
                          <Label className="text-xs text-[hsl(var(--muted-foreground))] mb-2 block">Margin: {margin}px</Label>
                          <Slider value={[margin]} onValueChange={(v) => setMargin(v[0])} min={0} max={20} step={2} />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Logo Tab */}
                {designTab === "logo" && (
                  <div className="space-y-4">
                    <Label className="text-xs text-[hsl(var(--muted-foreground))] font-semibold block">Select a logo</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_LOGOS.map((logo) => {
                        const LogoIcon = logo.icon;
                        const isActive = !logoFile && selectedPresetLogo === logo.id;
                        return (
                          <button key={logo.id}
                            onClick={() => { setSelectedPresetLogo(logo.id); setLogoFile(null); }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${isActive ? "border-[hsl(var(--primary))] scale-110" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]"}`}
                            style={{ backgroundColor: logo.id === "none" ? "#f0f0f0" : logo.color + "20" }}
                          >
                            <LogoIcon className="w-5 h-5" style={{ color: logo.color }} />
                          </button>
                        );
                      })}
                    </div>

                    <button onClick={() => logoInputRef.current?.click()}
                      className="w-full p-5 border-2 border-dashed border-[hsl(var(--input))] rounded-xl hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary) / 0.05)] transition-all flex flex-col items-center gap-1.5 text-[hsl(var(--muted-foreground))]"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm font-medium">Upload a logo</span>
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">(JPG, JPEG, or PNG / 2MB max)</span>
                    </button>

                    {logoFile && (
                      <div className="flex items-center gap-3 p-3 bg-[hsl(var(--secondary))] rounded-xl">
                        <img src={logoFile} alt="Logo" className="w-12 h-12 rounded-lg object-cover border" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[hsl(var(--foreground))]">Custom logo uploaded</p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Will appear in QR center</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setLogoFile(null)} className="text-[hsl(var(--destructive))] h-8 w-8">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] bg-[hsl(45,80%,95%)] p-2 rounded-lg">
                      💡 Tip: Use "H" (High) error correction level for best results with logo
                    </p>
                  </div>
                )}

                {/* Level Tab */}
                {designTab === "level" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-[hsl(var(--muted-foreground))] font-semibold block">Error Correction Level</Label>
                    {[
                      { id: "L" as ErrorLevel, label: "Low (7%)", desc: "Smallest QR, less error tolerance" },
                      { id: "M" as ErrorLevel, label: "Medium (15%)", desc: "Good balance of size and recovery" },
                      { id: "Q" as ErrorLevel, label: "Quartile (25%)", desc: "Better recovery, slightly larger" },
                      { id: "H" as ErrorLevel, label: "High (30%)", desc: "Best for logos, most robust" },
                    ].map((lvl) => (
                      <button key={lvl.id} onClick={() => setErrorLevel(lvl.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${errorLevel === lvl.id ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary) / 0.1)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--input))]"}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${errorLevel === lvl.id ? "border-[hsl(var(--primary))]" : "border-[hsl(var(--input))]"}`}>
                          {errorLevel === lvl.id && <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${errorLevel === lvl.id ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>{lvl.label}</p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{lvl.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-full lg:w-[300px] p-5 bg-[hsl(var(--card))]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                <h2 className="font-semibold text-sm text-[hsl(var(--foreground))]">Download your QR</h2>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 flex items-center justify-center min-h-[200px] mb-4 shadow-sm">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="max-w-full h-auto" style={{ imageRendering: dotStyle === "square" ? "pixelated" : "auto", maxHeight: "240px" }} />
                ) : (
                  <div className="text-center py-4">
                    <QrCode className="w-16 h-16 mx-auto text-[hsl(var(--muted))] mb-2" />
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Your QR will appear here</p>
                  </div>
                )}
              </div>

              {/* Download */}
              <div className="relative mb-3">
                <Button onClick={() => qrDataUrl ? setShowDownloadMenu(!showDownloadMenu) : null}
                  disabled={!qrDataUrl}
                  className="w-full h-10 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary) / 0.85)] text-white font-medium rounded-xl text-sm"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Download QR <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                </Button>
                {showDownloadMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[hsl(var(--border))] overflow-hidden z-10">
                    <button onClick={() => downloadFile("png")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-[hsl(var(--secondary))] flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Download PNG
                    </button>
                    <button onClick={() => downloadFile("svg")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-[hsl(var(--secondary))] flex items-center gap-2 border-t border-[hsl(var(--border))]">
                      <Download className="w-3.5 h-3.5" /> Download SVG
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={copyQrImage} disabled={!qrDataUrl} variant="outline" className="flex-1 h-9 rounded-xl border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] text-xs">
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                </Button>
                <Button onClick={shareQr} disabled={!qrDataUrl} variant="outline" className="flex-1 h-9 rounded-xl border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] text-xs">
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AdBanner />

        {/* Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Shield, title: "No Data Stored", desc: "Your data never leaves your browser" },
            { icon: Lock, title: "Generated in Browser", desc: "100% client-side processing" },
            { icon: CheckCircle, title: "Safe & Private", desc: "Your privacy is fully protected" },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-[hsl(var(--border))] p-4 text-center">
              <t.icon className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-1.5" />
              <p className="font-semibold text-sm text-[hsl(var(--foreground))]">{t.title}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dot preview mini-component
const DotPreview = ({ style, active }: { style: DotStyle; active: boolean }) => {
  const color = active ? "hsl(var(--primary))" : "hsl(230,15%,30%)";
  const size = 6;
  const gap = 2;

  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const x = 3 + c * (size + gap);
          const y = 3 + r * (size + gap);
          const show = !((r === 1 && c === 1) || (r === 0 && c === 2));
          if (!show) return null;
          switch (style) {
            case "dots":
            case "extra-rounded":
              return <circle key={`${r}-${c}`} cx={x + size / 2} cy={y + size / 2} r={size * 0.42} fill={color} />;
            case "rounded":
            case "classy-rounded":
              return <rect key={`${r}-${c}`} x={x} y={y} width={size} height={size} rx={size * 0.35} fill={color} />;
            case "diamond":
              return <polygon key={`${r}-${c}`} points={`${x + size / 2},${y} ${x + size},${y + size / 2} ${x + size / 2},${y + size} ${x},${y + size / 2}`} fill={color} />;
            case "star":
              return <circle key={`${r}-${c}`} cx={x + size / 2} cy={y + size / 2} r={size * 0.4} fill={color} />;
            default:
              return <rect key={`${r}-${c}`} x={x} y={y} width={size} height={size} fill={color} />;
          }
        })
      )}
    </svg>
  );
};

// Corner preview mini-component
const CornerPreview = ({ style, active }: { style: CornerStyle; active: boolean }) => {
  const color = active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="mx-auto">
      {style === "dot" ? (
        <>
          <circle cx="14" cy="14" r="12" fill={color} />
          <circle cx="14" cy="14" r="8" fill="white" />
          <circle cx="14" cy="14" r="4" fill={color} />
        </>
      ) : style === "rounded" || style === "extra-rounded" ? (
        <>
          <rect x="2" y="2" width="24" height="24" rx={style === "extra-rounded" ? 10 : 6} fill={color} />
          <rect x="5" y="5" width="18" height="18" rx={style === "extra-rounded" ? 7 : 4} fill="white" />
          <rect x="9" y="9" width="10" height="10" rx={style === "extra-rounded" ? 5 : 2} fill={color} />
        </>
      ) : (
        <>
          <rect x="2" y="2" width="24" height="24" fill={color} />
          <rect x="5" y="5" width="18" height="18" fill="white" />
          <rect x="9" y="9" width="10" height="10" fill={color} />
        </>
      )}
    </svg>
  );
};

export default QrCodeGenerator;
