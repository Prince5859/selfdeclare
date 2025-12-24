import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { FileText, Download, Loader2, RotateCcw, X, MessageCircle, Send, Link } from "lucide-react";
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
  const [showShareNudge, setShowShareNudge] = useState(false);
  const [hasShownShareNudge, setHasShownShareNudge] = useState(false);
  const [showAffiliate, setShowAffiliate] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'copy') => {
    const shareText = "इस वेबसाइट से आसानी से स्वप्रमाणित घोषणा-पत्र बनाएं - ";
    const fullUrl = `${shareText}${siteUrl}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(fullUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(siteUrl);
        toast.success("लिंक कॉपी हो गया!");
        break;
    }
  };

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
      
      // Show share nudge and affiliate only once per session
      setShowAffiliate(true);
      if (!hasShownShareNudge) {
        setTimeout(() => {
          setShowShareNudge(true);
          setHasShownShareNudge(true);
        }, 1500);
      }
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
                <div className="border-b-4 border-double border-foreground/30 pb-4 mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground tracking-wide">
                    स्वप्रमाणित घोषणा-पत्र
                  </h1>
                </div>

                <div className="space-y-6 text-foreground leading-relaxed text-base md:text-lg">
                  <p className="text-justify indent-8">
                    मैं, <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(applicantName)}</span>, 
                    पुत्र/पुत्री श्री <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(fatherName)}</span>, 
                    उम्र <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(age)}</span> वर्ष, 
                    वर्ष <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(year)}</span>, 
                    व्यवसाय <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(occupation)}</span>, 
                    निवासी <span className="font-semibold underline decoration-dotted underline-offset-4">{getValue(address)}</span>, 
                    प्रमाणित करते हुए घोषणा करता/करती हूँ कि आवेदन पत्र में दिये गये विवरण/तथ्य मेरी व्यक्तिगत जानकारी एवं विश्वास में शुद्ध एवं सत्य हैं।
                  </p>

                  <p className="text-justify indent-8">
                    मैं मिथ्या विवरण/तथ्यों को देने के परिणामों से भली-भाँति अवगत हूँ।
                  </p>

                  <p className="text-justify indent-8">
                    यदि आवेदन पत्र में दिये गये कोई विवरण/तथ्य मिथ्या पाये जाते हैं, 
                    तो मैं भारतीय दण्ड संहिता 1960 की धारा-199 व 200 एवं किसी अन्य प्रभावी विधि के अंतर्गत 
                    अभियोजन एवं दण्ड के लिये स्वयं उत्तरदायी होऊँगा/होऊँगी।
                  </p>
                </div>

                <div className="mt-16 space-y-8">
                  <div className="flex flex-col gap-2 text-foreground">
                    <p>
                      <span className="font-semibold">स्थान :</span>{" "}
                      <span className="underline decoration-dotted underline-offset-4">{getValue(place)}</span>
                    </p>
                    <p>
                      <span className="font-semibold">दिनांक :</span>{" "}
                      <span className="underline decoration-dotted underline-offset-4">{formatDate(date)}</span>
                    </p>
                  </div>

                  <div className="text-right space-y-6 pt-8">
                    <div>
                      <p className="font-semibold text-foreground">आवेदक/आवेदिका के हस्ताक्षर</p>
                      <div className="mt-2 border-b border-foreground/40 w-48 ml-auto"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        आवेदक/आवेदिका का नाम :{" "}
                        <span className="underline decoration-dotted underline-offset-4">
                          {getValue(applicantName)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Nudge Modal */}
      {showShareNudge && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-xl border border-border relative">
            <button
              onClick={() => setShowShareNudge(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center space-y-4">
              <p className="text-lg text-foreground">
                📲 किसी दोस्त को भेजें — उसका भी समय बचेगा।
              </p>
              
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5C] transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Link className="w-4 h-4" />
                  Copy
                </button>
              </div>
              
              <button
                onClick={() => setShowShareNudge(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                अभी नहीं
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Popup - Shows only after download */}
      {showAffiliate && (() => {
        // Text variations for dynamic rotation
        const textVariations = [
          {
            title: "🖨️ सही और साफ प्रिंट चाहिए?",
            text: "सरकारी दस्तावेज़ के लिए sharp और official print जरूरी है",
            button: "🔥 HP Ink Tank 419 – Trusted Choice"
          },
          {
            title: "⚠️ गलत प्रिंट से फॉर्म रिजेक्ट!",
            text: "धुंधला या गलत प्रिंट आवेदन रोक सकता है",
            button: "✅ Safe Printer Option देखें"
          },
          {
            title: "💰 साइबर कैफे का खर्च बचाएं",
            text: "घर बैठे कम ink cost में सही प्रिंट निकालें",
            button: "🔥 Best Budget Printer देखें"
          },
          {
            title: "🏛️ Cyber Cafe की पहली पसंद",
            text: "सरकारी फॉर्म प्रिंट के लिए भरोसेमंद printer",
            button: "⭐ HP Ink Tank 419 देखें"
          },
          {
            title: "😊 आसान और सुरक्षित प्रिंट",
            text: "Self Declaration जैसे दस्तावेज़ के लिए perfect",
            button: "👉 Recommended Printer देखें"
          },
          {
            title: "⏳ आवेदन से पहले ध्यान दें",
            text: "सबमिट करने से पहले साफ प्रिंट बेहद जरूरी",
            button: "🔥 Official Print Solution"
          }
        ];
        
        // Get random variation avoiding immediate repeat
        const getVariation = () => {
          const lastIndex = parseInt(localStorage.getItem('lastAffiliateVariation') || '-1');
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * textVariations.length);
          } while (newIndex === lastIndex && textVariations.length > 1);
          localStorage.setItem('lastAffiliateVariation', newIndex.toString());
          return textVariations[newIndex];
        };
        
        const variation = getVariation();
        
        // Micro design variations
        const designVariations = [
          { borderRadius: 'rounded-[18px]', shadow: 'shadow-lg' },
          { borderRadius: 'rounded-[16px]', shadow: 'shadow-xl' },
          { borderRadius: 'rounded-2xl', shadow: 'shadow-lg' }
        ];
        const design = designVariations[Math.floor(Math.random() * designVariations.length)];
        
        return (
          <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
            <div 
              className="rounded-t-3xl px-5 py-6 md:py-8 relative"
              style={{ 
                minHeight: '20vh', 
                maxHeight: '30vh',
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.15))',
                boxShadow: '0 -8px 30px hsl(var(--primary) / 0.15)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAffiliate(false)}
                className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--primary) / 0.15)',
                  color: 'hsl(var(--primary))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--accent) / 0.25)';
                  e.currentTarget.style.color = 'hsl(var(--accent))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.15)';
                  e.currentTarget.style.color = 'hsl(var(--primary))';
                }}
                aria-label="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="max-w-lg mx-auto space-y-3">
                {/* Title */}
                <h3 
                  className="text-lg md:text-xl font-bold"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  {variation.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: 'hsl(var(--foreground) / 0.85)' }}
                >
                  {variation.text}
                </p>
                
                {/* Trust Line */}
                <p 
                  className="text-xs flex items-center gap-1"
                  style={{ color: 'hsl(var(--primary) / 0.8)' }}
                >
                  <span>⚠️</span> धुंधला प्रिंट होने पर फॉर्म रिजेक्ट हो सकता है
                </p>
                
                {/* CTA Button */}
                <a
                  href="https://fktr.in/Wv9Mb50"
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className={`animate-slow-pulse block w-full text-center py-4 px-6 font-bold ${design.borderRadius} transition-all duration-200 ${design.shadow} hover:shadow-xl text-base md:text-lg`}
                  style={{
                    background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
                    color: 'hsl(var(--primary-foreground))'
                  }}
                >
                  👉 {variation.button}
                </a>
                
                {/* Disclaimer */}
                <p 
                  className="text-[11px] text-center pt-1"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  (यह केवल एक सहायक सुझाव है, खरीदना अनिवार्य नहीं है)
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Disclaimer Section */}
      <div className="bg-[#f5f5f5] border-t border-[#e0e0e0] py-5 px-4 select-text">
        <div className="container mx-auto max-w-3xl">
          <div className="text-[12px] md:text-[13px] leading-[1.5] text-gray-700 text-center">
            <p className="font-semibold mb-2">⚠️ अस्वीकरण (Disclaimer):</p>
            <p className="mb-2">
              यह वेबसाइट केवल स्वप्रमाणित घोषणा-पत्र (Self Declaration) का प्रारूप / ड्राफ्ट तैयार करने हेतु है,
              जो आय / जाति / निवास प्रमाण-पत्र जैसे सरकारी आवेदनों में
              सहायक दस्तावेज (Supporting Document) के रूप में उपयोग किया जा सकता है।
            </p>
            <p className="mb-2">
              यह कोई सरकारी वेबसाइट नहीं है, न ही यह किसी प्रकार का सरकारी प्रमाण-पत्र जारी करती है।
            </p>
            <p className="mb-2">
              घोषणा-पत्र में भरी गई जानकारी की पूर्ण जिम्मेदारी आवेदक की स्वयं की होगी।
            </p>
            <p>
              अंतिम सत्यापन एवं प्रमाण-पत्र जारी करने का अधिकार
              संबंधित तहसील / एसडीएम / राजस्व विभाग के पास सुरक्षित है।
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-card border-t border-border py-4">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            यह टूल केवल शैक्षणिक उद्देश्य के लिए है। कानूनी उपयोग से पहले विशेषज्ञ से परामर्श लें।
          </p>
          <p className="text-xs text-green-india/70">
            💡 अगली बार भी यहीं से बनाएं — आसान, तेज़ और सुरक्षित।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
