import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { FileText, Download, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [applicantName, setApplicantName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setApplicantName("");
    setFatherName("");
    setAge("");
    setYear("");
    setOccupation("");
    setAddress("");
    setPlace("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  const setTodayDate = () => {
    setDate(new Date().toISOString().split('T')[0]);
  };

  const getValue = (value: string) => {
    return value.trim() || "____________";
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "____________";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isFormComplete = () => {
    return applicantName.trim() && fatherName.trim() && age.trim() && year.trim() && occupation.trim() && address.trim() && place.trim() && date.trim();
  };

  const handleDownload = async () => {
    if (!documentRef.current) {
      toast.error("दस्तावेज़ लोड नहीं हुआ");
      return;
    }

    if (!isFormComplete()) {
      toast.error("कृपया सभी फ़ील्ड भरें");
      return;
    }

    setIsDownloading(true);
    toast.info("JPG बन रहा है...");

    try {
      // A4 dimensions at 96 DPI: 794 x 1123 pixels
      const A4_WIDTH = 794;
      const A4_HEIGHT = 1123;
      const PADDING = 60; // Padding for content
      
      // Create a temporary container for A4-sized rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: ${A4_WIDTH}px;
        padding: ${PADDING}px;
        background-color: #FFFEF7;
        box-sizing: border-box;
        font-family: inherit;
      `;
      tempContainer.innerHTML = documentRef.current.innerHTML;
      document.body.appendChild(tempContainer);
      
      // Capture the content
      const contentCanvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFEF7',
        logging: false,
        width: A4_WIDTH,
      });
      
      document.body.removeChild(tempContainer);
      
      // Create final A4 canvas with proper height (content height + some bottom padding)
      const contentHeight = Math.min(contentCanvas.height / 2, A4_HEIGHT - 40);
      const finalHeight = Math.max(contentHeight + 80, A4_HEIGHT * 0.85); // At least 85% of A4 height
      
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = A4_WIDTH * 2;
      finalCanvas.height = finalHeight * 2;
      
      const ctx = finalCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFEF7';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(contentCanvas, 0, 0);
      }
      
      const canvas = finalCanvas;

      // Target file size: 20KB to 50KB
      const minSize = 20 * 1024;
      const maxSize = 50 * 1024;
      
      let finalBlob: Blob | null = null;
      let bestQuality = 0.5;
      
      // Binary search for optimal quality
      let low = 0.1;
      let high = 0.9;
      
      for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const testBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg', mid);
        });
        
        if (testBlob) {
          if (testBlob.size < minSize) {
            low = mid;
          } else if (testBlob.size > maxSize) {
            high = mid;
          } else {
            finalBlob = testBlob;
            bestQuality = mid;
            break;
          }
          finalBlob = testBlob;
          bestQuality = mid;
        }
      }
      
      // If still not in range, try one more time with best quality found
      if (!finalBlob || finalBlob.size < minSize || finalBlob.size > maxSize) {
        finalBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg', bestQuality);
        });
      }

      if (finalBlob) {
        const link = document.createElement('a');
        const sanitizedName = applicantName.trim().replace(/\s+/g, '_') || 'Document';
        link.download = `Ghoshna_Patra_${sanitizedName}.jpg`;
        link.href = URL.createObjectURL(finalBlob);
        link.click();
        URL.revokeObjectURL(link.href);
        console.log(`Downloaded image size: ${(finalBlob.size / 1024).toFixed(2)} KB`);
      }

      toast.success("डाउनलोड सफल!");
    } catch {
      toast.error("डाउनलोड में त्रुटि हुई");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-hindi">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                स्वप्रमाणित घोषणा-पत्र जनरेटर
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                भारत सरकार फॉर्मेट में दस्तावेज़ बनाएं
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border animate-fade-in">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                फॉर्म भरें
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    आवेदक का नाम <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="अपना पूरा नाम लिखें"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    पिता का नाम <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="पिता/अभिभावक का नाम"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    उम्र (वर्ष में) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="उम्र"
                    min="1"
                    max="150"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    वर्ष <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="जैसे: 2025"
                    min="1900"
                    max="2100"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    व्यवसाय <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="जैसे: नौकरी, व्यापार, छात्र, गृहिणी"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    निवासी (पूरा पता) <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="गाँव/मोहल्ला, पोस्ट, थाना, जिला, राज्य, पिन कोड"
                    rows={3}
                    className="form-field resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    स्थान <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="जैसे: पटना, दिल्ली, मुंबई"
                    className="form-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    दिनांक <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="form-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={setTodayDate}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors whitespace-nowrap"
                    >
                      आज की तारीख
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    रीसेट करें
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !isFormComplete()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    बन रहा है...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    JPG डाउनलोड करें
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            <div className="hidden lg:block">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !isFormComplete()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    बन रहा है...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    JPG डाउनलोड करें
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-green-india rounded-full"></span>
                दस्तावेज़ प्रीव्यू
              </h2>

              <div
                ref={documentRef}
                className="document-paper rounded-lg p-6 md:p-10 mx-auto"
                style={{
                  backgroundColor: '#FFFEF7',
                }}
              >
                {/* Header */}
                <p className="text-sm text-foreground/80 underline mb-8">
                  संख्या– 874/एक–9–2014–रा–9, दिनॉक 16 जून, 2014 का संलग्नक
                </p>

                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold text-center text-foreground mb-8 underline">
                  स्वप्रमाणित घोषणा–पत्र
                </h1>

                {/* Main Content */}
                <div className="text-foreground leading-loose text-base">
                  <p className="text-center mb-4">
                    मैं,<span className="inline-block border-b border-dotted border-foreground min-w-[180px] mx-1">{applicantName.trim() || ''}</span>पुत्र/पुत्री/श्री<span className="inline-block border-b border-dotted border-foreground min-w-[180px] mx-1">{fatherName.trim() || ''}</span>
                  </p>
                  
                  <p className="mb-4">
                    ...उम्र<span className="inline-block border-b border-dotted border-foreground min-w-[40px] mx-1">{age.trim() || ''}</span>वर्ष<span className="inline-block border-b border-dotted border-foreground min-w-[40px] mx-1">{year.trim() || ''}</span>व्यवसाय<span className="inline-block border-b border-dotted border-foreground min-w-[120px] mx-1">{occupation.trim() || ''}</span>निवासी<span className="inline-block border-b border-dotted border-foreground min-w-[150px] mx-1">{address.trim() || ''}</span>
                  </p>

                  <p className="text-justify mb-4">
                    <span className="inline-block border-b border-dotted border-foreground min-w-[200px]"></span>प्रमाणित करते हुये घोषणा करता/करती हूँ कि आवेदन पत्र में दिये गये विवरण/तथ्य मेरी व्यक्तिगत जानकारी एवं विश्वास में शुद्ध एवं सत्य हैं। मैं मिथ्या विवरणों /तथ्यों को देने के परिणामों से भली–भाँति अवगत हूँ। यदि आवेदन पत्र में दिये गये कोई विवरण/तथ्य मिथ्या पाये जाते हैं,तो मैं,मेरे विरूद्ध भा0द0वि0 1960 की धारा–199 व 200 एवं प्रभावी किसी अन्य विधि के अंतर्गत अभियोजन एवं दण्ड के लिये,स्वयं उत्तरदायी होऊँगा/होऊँगी।
                  </p>
                </div>

                {/* Footer Section */}
                <div className="mt-12 flex justify-between text-foreground">
                  <div className="space-y-4">
                    <p>
                      स्थान<span className="inline-block border-b border-dotted border-foreground min-w-[120px] mx-1">{place.trim() || ''}</span>
                    </p>
                    <p>
                      दिनॉक<span className="inline-block border-b border-dotted border-foreground min-w-[120px] mx-1">{formatDate(date)}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-4">
                    <p>
                      आवेदक/आवेदिका के हस्ताक्षर<span className="inline-block border-b border-dotted border-foreground min-w-[100px] mx-1"></span>
                    </p>
                    <p>
                      आवेदक/आवेदिका का नाम<span className="inline-block border-b border-dotted border-foreground min-w-[120px] mx-1">{applicantName.trim() || ''}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            यह टूल केवल शैक्षणिक उद्देश्य के लिए है। कानूनी उपयोग से पहले विशेषज्ञ से परामर्श लें।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
