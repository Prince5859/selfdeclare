import { useState, useRef, useCallback, useEffect } from "react";
import { Crop, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

type AspectRatio = "free" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "passport";

const ASPECT_RATIOS: { id: AspectRatio; label: string; value: number | null }[] = [
  { id: "free", label: "Free", value: null },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:4", label: "3:4", value: 3 / 4 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
  { id: "passport", label: "Passport", value: 35 / 45 },
];

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"move" | "resize" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Initialize crop area when image loads
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = 300;
      
      const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;

      setImageSize({ width: displayWidth, height: displayHeight });
      
      // Initial crop area - 80% of image
      const cropW = displayWidth * 0.8;
      const cropH = displayHeight * 0.8;
      setCropArea({
        x: (displayWidth - cropW) / 2,
        y: (displayHeight - cropH) / 2,
        width: cropW,
        height: cropH,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Apply aspect ratio constraint
  useEffect(() => {
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio)?.value;
    if (ratio === null || ratio === undefined) return;

    setCropArea(prev => {
      const newWidth = Math.min(prev.width, imageSize.width - prev.x);
      const newHeight = newWidth / ratio;
      
      if (prev.y + newHeight > imageSize.height) {
        const adjustedHeight = imageSize.height - prev.y;
        const adjustedWidth = adjustedHeight * ratio;
        return { ...prev, width: adjustedWidth, height: adjustedHeight };
      }
      
      return { ...prev, width: newWidth, height: newHeight };
    });
  }, [aspectRatio, imageSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio)?.value;

    setCropArea(prev => {
      if (dragType === "move") {
        const newX = Math.max(0, Math.min(imageSize.width - prev.width, prev.x + deltaX));
        const newY = Math.max(0, Math.min(imageSize.height - prev.height, prev.y + deltaY));
        return { ...prev, x: newX, y: newY };
      } else if (dragType === "resize") {
        let newWidth = Math.max(50, prev.width + deltaX);
        let newHeight = ratio ? newWidth / ratio : Math.max(50, prev.height + deltaY);
        
        // Constrain to image bounds
        if (prev.x + newWidth > imageSize.width) {
          newWidth = imageSize.width - prev.x;
          if (ratio) newHeight = newWidth / ratio;
        }
        if (prev.y + newHeight > imageSize.height) {
          newHeight = imageSize.height - prev.y;
          if (ratio) newWidth = newHeight * ratio;
        }
        
        return { ...prev, width: newWidth, height: newHeight };
      }
      return prev;
    });
  }, [isDragging, dragType, dragStart, aspectRatio, imageSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  const handleCrop = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      
      // Calculate actual crop coordinates
      const scaleX = img.width / imageSize.width;
      const scaleY = img.height / imageSize.height;
      
      const actualX = cropArea.x * scaleX;
      const actualY = cropArea.y * scaleY;
      const actualWidth = cropArea.width * scaleX;
      const actualHeight = cropArea.height * scaleY;
      
      canvas.width = actualWidth;
      canvas.height = actualHeight;
      
      ctx.drawImage(
        img,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, actualWidth, actualHeight
      );
      
      onCropComplete(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.src = imageSrc;
  }, [imageSrc, cropArea, imageSize, onCropComplete]);

  const resetCrop = () => {
    const cropW = imageSize.width * 0.8;
    const cropH = imageSize.height * 0.8;
    setCropArea({
      x: (imageSize.width - cropW) / 2,
      y: (imageSize.height - cropH) / 2,
      width: cropW,
      height: cropH,
    });
    setAspectRatio("free");
  };

  return (
    <div className="space-y-4">
      {/* Aspect Ratio Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Aspect Ratio</Label>
        <RadioGroup
          value={aspectRatio}
          onValueChange={(v) => setAspectRatio(v as AspectRatio)}
          className="flex flex-wrap gap-2"
        >
          {ASPECT_RATIOS.map((ratio) => (
            <div key={ratio.id} className="flex items-center">
              <RadioGroupItem value={ratio.id} id={ratio.id} className="peer sr-only" />
              <Label
                htmlFor={ratio.id}
                className="px-3 py-1.5 text-xs rounded-full border border-input cursor-pointer 
                         peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground
                         peer-data-[state=checked]:border-primary hover:bg-accent transition-colors"
              >
                {ratio.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Crop Area */}
      <div
        ref={containerRef}
        className="relative bg-muted rounded-lg overflow-hidden mx-auto"
        style={{ width: "100%", height: 300 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative mx-auto"
          style={{ width: imageSize.width, height: imageSize.height }}
        >
          {/* Original Image (darkened) */}
          <img
            src={imageSrc}
            alt="Crop preview"
            className="absolute inset-0 w-full h-full object-contain opacity-40"
            draggable={false}
          />
          
          {/* Crop overlay */}
          <div
            className="absolute border-2 border-primary bg-transparent cursor-move"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, "move")}
          >
            {/* Cropped area visible */}
            <img
              src={imageSrc}
              alt="Crop area"
              className="absolute object-contain"
              style={{
                width: imageSize.width,
                height: imageSize.height,
                left: -cropArea.x,
                top: -cropArea.y,
              }}
              draggable={false}
            />
            
            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-tl-lg cursor-se-resize flex items-center justify-center"
              onMouseDown={(e) => handleMouseDown(e, "resize")}
            >
              <Crop className="w-3 h-3 text-primary-foreground" />
            </div>
            
            {/* Corner indicators */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={resetCrop} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleCrop} className="flex-1 btn-primary">
          <Check className="w-4 h-4 mr-2" />
          Apply Crop
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
