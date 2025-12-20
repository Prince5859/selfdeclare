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
      const canvas = await html2canvas(documentRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFEF7',
        logging: false,
      });

      const link = document.createElement('a');
      const sanitizedName = applicantName.trim().replace(/\s+/g, '_') || 'Document';
      link.download = `Ghoshna_Patra_${sanitizedName}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();

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
                className="document-paper rounded-lg p-8 md:p-12 mx-auto"
                style={{
                  width: '100%',
                  maxWidth: '210mm',
                  minHeight: '297mm',
                  backgroundColor: '#FFFEF7',
                }}
              >
                {/* Header with reference number */}
                <p className="text-sm text-foreground/70 mb-8">
                  संख्या— 874/एक—9—2014—रा—9,दिनॉक 16 जून,2014 का संलग्नक
                </p>

                {/* Title with underline */}
                <h1 className="text-xl md:text-2xl font-bold text-center text-foreground mb-10 underline underline-offset-4">
                  स्वप्रमाणित घोषणा—पत्र
                </h1>

                {/* Document content with dotted line format */}
                <div className="text-foreground leading-loose text-base md:text-lg space-y-2">
                  <p className="text-center">
                    मैं,<span className="inline-block border-b border-dotted border-foreground/60 min-w-[180px] px-2 mx-1">{applicantName || ""}</span>पुत्र / पुत्री / श्री<span className="inline-block border-b border-dotted border-foreground/60 min-w-[150px] px-2 mx-1">{fatherName || ""}</span>
                  </p>
                  
                  <p>
                    ...उम्र<span className="inline-block border-b border-dotted border-foreground/60 min-w-[40px] px-1 mx-1 text-center">{age || ""}</span>वर्ष<span className="inline-block border-b border-dotted border-foreground/60 min-w-[40px] px-1 mx-1 text-center">{year || ""}</span>व्यवसाय<span className="inline-block border-b border-dotted border-foreground/60 min-w-[100px] px-2 mx-1">{occupation || ""}</span>निवासी<span className="inline-block border-b border-dotted border-foreground/60 min-w-[150px] px-2 mx-1">{address || ""}</span>
                  </p>

                  <p className="border-b border-dotted border-foreground/60 pb-1">
                    <span className="inline-block min-w-[200px]"></span>प्रमाणित करते हुये घोषणा करता / करती हूँ
                  </p>

                  <p className="text-justify leading-relaxed mt-4">
                    कि आवेदन पत्र में दिये गये विवरण/तथ्य मेरी व्यक्तिगत जानकारी एवं विश्वास में शुद्ध एवं सत्य हैं । मैं मिथ्या विवरणों /तथ्यों को देने के परिणामों से भली—भाँति अवगत हूँ । यदि आवेदन पत्र में दिये गये कोई विवरण/तथ्य मिथ्या पाये जाते हैं,तो मैं,मेरे विरूद्ध भा0द0वि0 1960 की धारा—199 व 200 एवं प्रभावी किसी अन्य विधि के अंतर्गत अभियोजन एवं दण्ड के लिये,स्वयं उत्तरदायी होऊँगा / होऊँगी।
                  </p>
                </div>

                {/* Footer section */}
                <div className="mt-16 flex justify-between items-start text-foreground">
                  <div className="space-y-4">
                    <p>
                      स्थान<span className="inline-block border-b border-dotted border-foreground/60 min-w-[120px] px-2 ml-2">{place || ""}</span>
                    </p>
                    <p>
                      दिनॉक<span className="inline-block border-b border-dotted border-foreground/60 min-w-[120px] px-2 ml-2">{formatDate(date)}</span>
                    </p>
                  </div>
                  
                  <div className="text-right space-y-4">
                    <p>
                      आवेदक / आवेदिका के हस्ताक्षर<span className="inline-block border-b border-dotted border-foreground/60 min-w-[100px] ml-2"></span>
                    </p>
                    <p>
                      आवेदक / आवेदिका का नाम<span className="inline-block border-b border-dotted border-foreground/60 min-w-[100px] px-2 ml-2">{applicantName || ""}</span>
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
