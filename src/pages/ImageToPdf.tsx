import { useState, useRef } from "react";
import { Upload, FileText, Plus, Trash2, ArrowUp, ArrowDown, Shield, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import { jsPDF } from "jspdf";

const ImageToPdf = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const newImages: { file: File; preview: string }[] = [];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target?.result as string,
          });
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Move image up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
  };

  // Move image down
  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImages(newImages);
  };

  // Convert to PDF
  const handleConvertToPdf = async () => {
    if (images.length === 0) {
      toast.error("कृपया पहले इमेज अपलोड करें");
      return;
    }

    setProcessing(true);
    
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        // Create image element to get dimensions
        const imgElement = new Image();
        imgElement.src = img.preview;
        
        await new Promise((resolve) => {
          imgElement.onload = () => {
            const imgWidth = imgElement.width;
            const imgHeight = imgElement.height;
            
            // Calculate dimensions to fit on PDF page (A4: 210x297mm)
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            let finalWidth = pageWidth - 20; // 10mm margin each side
            let finalHeight = (imgHeight * finalWidth) / imgWidth;
            
            // If height exceeds page, scale down
            if (finalHeight > pageHeight - 20) {
              finalHeight = pageHeight - 20;
              finalWidth = (imgWidth * finalHeight) / imgHeight;
            }
            
            // Center image on page
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;
            
            if (i > 0) {
              pdf.addPage();
            }
            
            pdf.addImage(img.preview, "JPEG", x, y, finalWidth, finalHeight);
            resolve(true);
          };
        });
      }
      
      pdf.save("converted-images.pdf");
      toast.success("PDF सफलतापूर्वक बना दी गई!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("PDF बनाने में error आया। कृपया दोबारा कोशिश करें।");
    }
    
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text mb-2">
            Image to PDF Converter
          </h1>
          <p className="text-muted-foreground hindi-text">
            कई इमेज को एक PDF में बदलें
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
                  multiple
                />
                <Upload className="h-12 w-12 text-primary mb-4" />
                <p className="text-lg font-medium hindi-text">इमेज अपलोड करें</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Multiple images supported (JPG, PNG)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image List */}
          {images.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text flex items-center justify-between">
                  <span>अपलोड की गई इमेज ({images.length})</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add More
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                  >
                    <img
                      src={img.preview}
                      alt={`Image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{img.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(img.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDown(index)}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  className="w-full btn-primary mt-4"
                  onClick={handleConvertToPdf}
                  disabled={processing}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {processing ? "Processing..." : "Convert to PDF"}
                </Button>
              </CardContent>
            </Card>
          )}

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

export default ImageToPdf;
