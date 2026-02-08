import { useState, useRef, useCallback } from "react";
import { Upload, Download, Plus, Minus, Shield, Lock, CheckCircle, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import ImageCropper from "@/components/ImageCropper";

// Preset configurations for government certificates
const PRESETS = [
  { id: "aay", name: "आय प्रमाण पत्र (Aay)", targetKB: 45 },
  { id: "jati", name: "जाति प्रमाण पत्र (Jati)", targetKB: 45 },
  { id: "nivas", name: "निवास प्रमाण पत्र (Nivas)", targetKB: 45 },
];

const ImageResizer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [finalSize, setFinalSize] = useState<number>(0);
  const [showCropper, setShowCropper] = useState(false);
  
  // Manual resize controls
  const [targetSize, setTargetSize] = useState<number>(50);
  const [sizeUnit, setSizeUnit] = useState<"KB" | "MB">("KB");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("कृपया JPG, JPEG या PNG फाइल अपलोड करें");
      return;
    }

    setSelectedImage(file);
    setOriginalSize(file.size);
    setProcessedImage(null);
    setFinalSize(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Compress image to target size using canvas
  const compressImage = useCallback(async (
    imageSrc: string,
    targetSizeBytes: number
  ): Promise<{ dataUrl: string; size: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let width = img.width;
        let height = img.height;
        
        // Start with original dimensions
        canvas.width = width;
        canvas.height = height;

        // Binary search for optimal quality
        let minQuality = 0.1;
        let maxQuality = 1.0;
        let bestDataUrl = "";
        let bestSize = Infinity;

        // Also try reducing dimensions if quality alone isn't enough
        let scaleFactor = 1.0;
        
        const compress = () => {
          // Apply scale factor
          canvas.width = Math.floor(width * scaleFactor);
          canvas.height = Math.floor(height * scaleFactor);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Binary search for quality
          for (let i = 0; i < 10; i++) {
            const quality = (minQuality + maxQuality) / 2;
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            const size = Math.round((dataUrl.length * 3) / 4 - 
              (dataUrl.endsWith("==") ? 2 : dataUrl.endsWith("=") ? 1 : 0));

            if (size <= targetSizeBytes) {
              if (size > bestSize * 0.5 || bestDataUrl === "") {
                bestDataUrl = dataUrl;
                bestSize = size;
              }
              minQuality = quality;
            } else {
              maxQuality = quality;
            }
          }

          // If still too large, reduce dimensions
          if (bestSize > targetSizeBytes && scaleFactor > 0.3) {
            scaleFactor -= 0.1;
            minQuality = 0.1;
            maxQuality = 1.0;
            compress();
          } else {
            resolve({ dataUrl: bestDataUrl, size: bestSize });
          }
        };

        compress();
      };
      img.src = imageSrc;
    });
  }, []);

  // Handle preset button click
  const handlePresetResize = async (targetKB: number) => {
    if (!imagePreview) {
      toast.error("कृपया पहले इमेज अपलोड करें");
      return;
    }

    setProcessing(true);
    try {
      const targetBytes = targetKB * 1024;
      const result = await compressImage(imagePreview, targetBytes);
      setProcessedImage(result.dataUrl);
      setFinalSize(result.size);
      toast.success(`इमेज ${(result.size / 1024).toFixed(1)} KB में compress हो गई`);
    } catch (error) {
      toast.error("इमेज प्रोसेस करने में समस्या हुई");
    } finally {
      setProcessing(false);
    }
  };

  // Handle manual resize
  const handleManualResize = async () => {
    if (!imagePreview) {
      toast.error("कृपया पहले इमेज अपलोड करें");
      return;
    }

    setProcessing(true);
    try {
      const targetBytes = sizeUnit === "MB" 
        ? targetSize * 1024 * 1024 
        : targetSize * 1024;
      
      const result = await compressImage(imagePreview, targetBytes);
      setProcessedImage(result.dataUrl);
      setFinalSize(result.size);
      toast.success(`इमेज ${(result.size / 1024).toFixed(1)} KB में compress हो गई`);
    } catch (error) {
      toast.error("इमेज प्रोसेस करने में समस्या हुई");
    } finally {
      setProcessing(false);
    }
  };

  // Download processed image
  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `resized_image_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("इमेज डाउनलोड हो गई!");
  };

  // Format size for display
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text mb-2">
            Image Resizer Tool
          </h1>
          <p className="text-muted-foreground hindi-text">
            सरकारी फॉर्म के लिए इमेज को सही साइज में बनाएं
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
                    />
                    <p className="text-center mt-3 text-sm text-muted-foreground">
                      Original Size: <span className="font-semibold text-foreground">{formatSize(originalSize)}</span>
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      (दूसरी इमेज के लिए क्लिक करें)
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-medium hindi-text">इमेज अपलोड करें</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, JPEG, PNG supported
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crop Tool */}
          {selectedImage && showCropper && imagePreview && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text flex items-center gap-2">
                  <Crop className="h-5 w-5" />
                  Crop Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageCropper
                  imageSrc={imagePreview}
                  onCropComplete={(croppedImage) => {
                    setImagePreview(croppedImage);
                    // Update file size estimate
                    const base64Length = croppedImage.length - "data:image/jpeg;base64,".length;
                    const sizeInBytes = Math.round((base64Length * 3) / 4);
                    setOriginalSize(sizeInBytes);
                    setShowCropper(false);
                    setProcessedImage(null);
                    toast.success("Image cropped successfully!");
                  }}
                  onCancel={() => setShowCropper(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Crop Button */}
          {selectedImage && !showCropper && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCropper(true)}
              disabled={processing}
            >
              <Crop className="h-4 w-4 mr-2" />
              Crop Image
            </Button>
          )}

          {/* Preset Buttons */}
          {selectedImage && !showCropper && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text">Quick Presets (Under 50 KB)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="h-auto py-3 px-4 hindi-text"
                      onClick={() => handlePresetResize(preset.targetKB)}
                      disabled={processing}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Resize Controls */}
          {selectedImage && !showCropper && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text">Manual Resize</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Size Input with +/- buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTargetSize(Math.max(10, targetSize - 10))}
                    disabled={processing}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={targetSize}
                      onChange={(e) => setTargetSize(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center text-lg font-semibold"
                      min="1"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTargetSize(targetSize + 10)}
                    disabled={processing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <Select value={sizeUnit} onValueChange={(v) => setSizeUnit(v as "KB" | "MB")}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KB">KB</SelectItem>
                      <SelectItem value="MB">MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Slider for quick adjustment */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Quick Adjust (KB)</Label>
                  <Slider
                    value={[sizeUnit === "KB" ? targetSize : targetSize * 1024]}
                    onValueChange={(v) => {
                      if (sizeUnit === "KB") {
                        setTargetSize(v[0]);
                      } else {
                        setTargetSize(v[0] / 1024);
                      }
                    }}
                    min={10}
                    max={500}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10 KB</span>
                    <span>500 KB</span>
                  </div>
                </div>

                <Button
                  className="w-full btn-primary"
                  onClick={handleManualResize}
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Resize to ${targetSize} ${sizeUnit}`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Processed Image Result */}
          {processedImage && (
            <Card className="border-green-500/50 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  इमेज तैयार है!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Final Size: <span className="font-bold text-green-700">{formatSize(finalSize)}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({((1 - finalSize / originalSize) * 100).toFixed(0)}% smaller)
                  </p>
                </div>
                <Button
                  className="w-full btn-primary"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ad Banner */}
          <AdBanner />

          {/* Trust Indicators */}
          <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-center hindi-text mb-4">
              🔒 आपकी Privacy सुरक्षित है
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <Shield className="h-5 w-5 text-green-600 shrink-0" />
                <span className="text-sm hindi-text">No server upload</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <Lock className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="text-sm hindi-text">Browser में ही process</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm hindi-text">Safe for govt. forms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
