import { useState, useRef, useCallback, useEffect } from "react";
import { Crop, RotateCcw, Check, X, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragType, setDragType] = useState<"move" | "resize" | "draw" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Manual input values
  const [manualWidth, setManualWidth] = useState<string>("");
  const [manualHeight, setManualHeight] = useState<string>("");

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
      
      // Set initial manual values
      setManualWidth(Math.round(cropW).toString());
      setManualHeight(Math.round(cropH).toString());
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Update manual inputs when crop area changes
  useEffect(() => {
    if (cropArea.width > 0) {
      setManualWidth(Math.round(cropArea.width).toString());
      setManualHeight(Math.round(cropArea.height).toString());
    }
  }, [cropArea.width, cropArea.height]);

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

  // Apply manual size
  const applyManualSize = () => {
    const width = parseInt(manualWidth) || cropArea.width;
    const height = parseInt(manualHeight) || cropArea.height;
    
    const constrainedWidth = Math.min(Math.max(50, width), imageSize.width);
    const constrainedHeight = Math.min(Math.max(50, height), imageSize.height);
    
    setCropArea(prev => ({
      x: Math.min(prev.x, imageSize.width - constrainedWidth),
      y: Math.min(prev.y, imageSize.height - constrainedHeight),
      width: constrainedWidth,
      height: constrainedHeight,
    }));
  };

  const getMousePosition = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.width / 2;
    const imageOffsetX = containerCenterX - imageSize.width / 2;
    
    return {
      x: e.clientX - rect.left - imageOffsetX,
      y: e.clientY - rect.top,
    };
  }, [imageSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  // Start drawing new crop area
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    
    // Check if click is within image bounds
    if (pos.x < 0 || pos.x > imageSize.width || pos.y < 0 || pos.y > imageSize.height) {
      return;
    }
    
    // Check if click is inside existing crop area (don't start new draw)
    if (
      pos.x >= cropArea.x &&
      pos.x <= cropArea.x + cropArea.width &&
      pos.y >= cropArea.y &&
      pos.y <= cropArea.y + cropArea.height
    ) {
      return;
    }
    
    e.preventDefault();
    setIsDrawing(true);
    setDragType("draw");
    setDrawStart(pos);
    setCropArea({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  }, [getMousePosition, imageSize, cropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isDrawing) return;

    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio)?.value;

    if (isDrawing && dragType === "draw") {
      const pos = getMousePosition(e);
      
      let newWidth = Math.abs(pos.x - drawStart.x);
      let newHeight = ratio ? newWidth / ratio : Math.abs(pos.y - drawStart.y);
      
      const newX = pos.x < drawStart.x ? pos.x : drawStart.x;
      const newY = pos.y < drawStart.y ? pos.y : drawStart.y;
      
      // Constrain to image bounds
      const constrainedWidth = Math.min(newWidth, imageSize.width - newX);
      const constrainedHeight = ratio 
        ? constrainedWidth / ratio 
        : Math.min(newHeight, imageSize.height - newY);
      
      setCropArea({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: Math.max(20, constrainedWidth),
        height: Math.max(20, constrainedHeight),
      });
      return;
    }

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

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
  }, [isDragging, isDrawing, dragType, dragStart, drawStart, aspectRatio, imageSize, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsDrawing(false);
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

      {/* Manual Size Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Manual Size (pixels)</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Width</Label>
            <Input
              type="number"
              value={manualWidth}
              onChange={(e) => setManualWidth(e.target.value)}
              onBlur={applyManualSize}
              onKeyDown={(e) => e.key === "Enter" && applyManualSize()}
              className="h-8"
              min="50"
            />
          </div>
          <span className="text-muted-foreground mt-5">×</span>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Height</Label>
            <Input
              type="number"
              value={manualHeight}
              onChange={(e) => setManualHeight(e.target.value)}
              onBlur={applyManualSize}
              onKeyDown={(e) => e.key === "Enter" && applyManualSize()}
              className="h-8"
              min="50"
              disabled={aspectRatio !== "free"}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={applyManualSize}
            className="mt-5"
          >
            Apply
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Tip: Click और drag करके नया crop area बनाएं
        </p>
      </div>

      {/* Crop Area */}
      <div
        ref={containerRef}
        className="relative bg-muted rounded-lg overflow-hidden mx-auto cursor-crosshair"
        style={{ width: "100%", height: 300 }}
        onMouseDown={handleContainerMouseDown}
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
          {cropArea.width > 0 && cropArea.height > 0 && (
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
                className="absolute object-contain pointer-events-none"
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                  left: -cropArea.x,
                  top: -cropArea.y,
                }}
                draggable={false}
              />
              
              {/* Move indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/80 rounded-full p-1">
                <Move className="w-4 h-4 text-primary-foreground" />
              </div>
              
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
              
              {/* Size display */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
              </div>
            </div>
          )}
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
