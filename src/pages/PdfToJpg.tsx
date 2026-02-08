import { useState, useRef, useEffect } from "react";
import { Upload, Image, Trash2, Download, Shield, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker using legacy build
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const PdfToJpg = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF upload
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("कृपया सिर्फ PDF फाइल अपलोड करें");
      return;
    }

    setPdfFile(file);
    setImages([]);
    toast.success("PDF अपलोड हो गई!");

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Convert PDF to images
  const handleConvert = async () => {
    if (!pdfFile) {
      toast.error("कृपया पहले PDF अपलोड करें");
      return;
    }

    setProcessing(true);
    setImages([]);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const convertedImages: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2; // Higher scale for better quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imageUrl = canvas.toDataURL("image/jpeg", 0.9);
        convertedImages.push(imageUrl);
      }

      setImages(convertedImages);
      toast.success(`${numPages} pages convert हो गए!`);
    } catch (error) {
      console.error("PDF conversion error:", error);
      toast.error("PDF convert करने में error आया। कृपया दोबारा कोशिश करें।");
    }

    setProcessing(false);
  };

  // Download single image
  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `page-${index + 1}.jpg`;
    link.click();
    toast.success(`Page ${index + 1} download हो गई!`);
  };

  // Download all images
  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => {
        downloadImage(img, index);
      }, index * 500);
    });
  };

  // Clear everything
  const clearAll = () => {
    setPdfFile(null);
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text mb-2">
            PDF to JPG Converter
          </h1>
          <p className="text-muted-foreground hindi-text">
            PDF के हर page को JPG image में बदलें
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
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <Upload className="h-12 w-12 text-primary mb-4" />
                <p className="text-lg font-medium hindi-text">PDF अपलोड करें</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click करके PDF select करें
                </p>
              </div>
            </CardContent>
          </Card>

          {/* PDF Info */}
          {pdfFile && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text flex items-center justify-between">
                  <span>अपलोड की गई PDF</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAll}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">PDF</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{pdfFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full btn-primary mt-4"
                  onClick={handleConvert}
                  disabled={processing}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {processing ? "Converting..." : "Convert to JPG"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Converted Images */}
          {images.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hindi-text flex items-center justify-between">
                  <span>Converted Images ({images.length})</span>
                  <Button variant="outline" size="sm" onClick={downloadAll}>
                    <Download className="h-4 w-4 mr-1" />
                    Download All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border"
                    >
                      <img
                        src={img}
                        alt={`Page ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(img, index)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        Page {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Ad Banner after download */}
                <div className="mt-4">
                  <AdBanner />
                </div>
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
                <span className="text-sm hindi-text">High quality output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToJpg;
