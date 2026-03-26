import { useState } from "react";
import { ChevronDown, ChevronRight, Palette, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface QrStyleOptions {
  size: number;
  margin: number;
  fgColor: string;
  bgColor: string;
  dotsStyle: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
  cornersSquareStyle: "square" | "extra-rounded" | "dot";
  cornersDotStyle: "square" | "dot";
  errorCorrection: "L" | "M" | "Q" | "H";
  gradientEnabled: boolean;
  gradientColor1: string;
  gradientColor2: string;
  gradientType: "linear" | "radial";
  transparentBg: boolean;
  logoImage: string | null;
}

interface QrCustomizationPanelProps {
  options: QrStyleOptions;
  onChange: (options: QrStyleOptions) => void;
}

const QrCustomizationPanel = ({ options, onChange }: QrCustomizationPanelProps) => {
  const [styleOpen, setStyleOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [logoOpen, setLogoOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const update = (partial: Partial<QrStyleOptions>) => {
    onChange({ ...options, ...partial });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update({ logoImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const CollapsibleSection = ({
    title,
    open,
    onOpenChange,
    children,
  }: {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={open} onOpenChange={onOpenChange} className="border border-border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors rounded-lg">
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-3">
      {/* Size & Margin */}
      <div className="space-y-3 p-3 border border-border rounded-lg">
        <div>
          <Label className="text-sm flex items-center justify-between mb-2">
            <span>QR Size</span>
            <span className="text-muted-foreground">{options.size}px</span>
          </Label>
          <Slider
            value={[options.size]}
            onValueChange={(v) => update({ size: v[0] })}
            min={100}
            max={1000}
            step={10}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100px</span><span>1000px</span>
          </div>
        </div>
        <div>
          <Label className="text-sm flex items-center justify-between mb-2">
            <span>Margin</span>
            <span className="text-muted-foreground">{options.margin}px</span>
          </Label>
          <Slider
            value={[options.margin]}
            onValueChange={(v) => update({ margin: v[0] })}
            min={0}
            max={50}
            step={5}
          />
        </div>
      </div>

      {/* Style */}
      <CollapsibleSection title="🎨 QR Style" open={styleOpen} onOpenChange={setStyleOpen}>
        <div>
          <Label className="text-sm mb-1.5 block">Dots Shape</Label>
          <Select value={options.dotsStyle} onValueChange={(v: any) => update({ dotsStyle: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="dots">Dots (Circle)</SelectItem>
              <SelectItem value="classy">Classy</SelectItem>
              <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm mb-1.5 block">Corner Square Style</Label>
          <Select value={options.cornersSquareStyle} onValueChange={(v: any) => update({ cornersSquareStyle: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="extra-rounded">Rounded</SelectItem>
              <SelectItem value="dot">Dot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm mb-1.5 block">Corner Dot Style</Label>
          <Select value={options.cornersDotStyle} onValueChange={(v: any) => update({ cornersDotStyle: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="dot">Dot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection title="🎨 Colors" open={colorOpen} onOpenChange={setColorOpen}>
        <div className="flex items-center justify-between">
          <Label className="text-sm">Use Gradient</Label>
          <Switch
            checked={options.gradientEnabled}
            onCheckedChange={(v) => update({ gradientEnabled: v })}
          />
        </div>

        {options.gradientEnabled ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Color 1</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={options.gradientColor1} onChange={(e) => update({ gradientColor1: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
                  <Input value={options.gradientColor1} onChange={(e) => update({ gradientColor1: e.target.value })} className="font-mono text-xs" maxLength={7} />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Color 2</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={options.gradientColor2} onChange={(e) => update({ gradientColor2: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
                  <Input value={options.gradientColor2} onChange={(e) => update({ gradientColor2: e.target.value })} className="font-mono text-xs" maxLength={7} />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Gradient Type</Label>
              <Select value={options.gradientType} onValueChange={(v: any) => update({ gradientType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div>
            <Label className="text-xs mb-1 block">Foreground Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={options.fgColor} onChange={(e) => update({ fgColor: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
              <Input value={options.fgColor} onChange={(e) => update({ fgColor: e.target.value })} className="font-mono text-xs" maxLength={7} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-sm">Transparent Background</Label>
          <Switch
            checked={options.transparentBg}
            onCheckedChange={(v) => update({ transparentBg: v })}
          />
        </div>

        {!options.transparentBg && (
          <div>
            <Label className="text-xs mb-1 block">Background Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={options.bgColor} onChange={(e) => update({ bgColor: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
              <Input value={options.bgColor} onChange={(e) => update({ bgColor: e.target.value })} className="font-mono text-xs" maxLength={7} />
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* Logo */}
      <CollapsibleSection title="🖼️ Logo Inside QR" open={logoOpen} onOpenChange={setLogoOpen}>
        {options.logoImage ? (
          <div className="flex items-center gap-3">
            <img src={options.logoImage} alt="Logo" className="w-12 h-12 rounded border border-border object-contain" />
            <Button variant="outline" size="sm" onClick={() => update({ logoImage: null })}>
              <X className="w-3 h-3 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div>
            <Label htmlFor="logo-upload" className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload logo (PNG, JPG)</span>
            </Label>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </div>
        )}
        <p className="text-xs text-muted-foreground">Logo auto-scales to fit center. Use error correction H for best results with logo.</p>
      </CollapsibleSection>

      {/* Advanced */}
      <CollapsibleSection title="⚙️ Advanced" open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <div>
          <Label className="text-sm mb-1.5 block">Error Correction Level</Label>
          <Select value={options.errorCorrection} onValueChange={(v: any) => update({ errorCorrection: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%) — Best with logo</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Higher correction = more reliable scanning but larger QR.</p>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default QrCustomizationPanel;
