import { Link } from "react-router-dom";
import { ArrowLeft, Info, FileText, Image, FilePlus } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="hindi-text">होम पर जाएं</span>
        </Link>

        <div className="bg-card rounded-xl border border-border p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">हमारे बारे में (About Us)</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">हमारा उद्देश्य</h2>
              <p className="hindi-text">
                "स्वप्रमाणित घोषणा" एक मुफ्त ऑनलाइन टूल है जो भारतीय नागरिकों को आसानी से स्वप्रमाणित घोषणा-पत्र (Self Declaration / Affidavit) बनाने में मदद करता है। हमारा लक्ष्य है कि हर व्यक्ति बिना किसी खर्चे के, अपने मोबाइल या कंप्यूटर से ही आधिकारिक फॉर्मेट में दस्तावेज़ तैयार कर सके।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">हमारे टूल्स</h2>
              <div className="grid gap-4 mt-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
                  <FileText className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground hindi-text">स्वप्रमाणित घोषणा-पत्र</h3>
                    <p className="text-sm hindi-text">भारत सरकार के आधिकारिक फॉर्मेट में घोषणा-पत्र बनाएं और JPG में डाउनलोड करें।</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
                  <Image className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground hindi-text">Image Resizer</h3>
                    <p className="text-sm hindi-text">अपनी तस्वीरों का आकार बदलें - पासपोर्ट साइज़, आधार साइज़ आदि।</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
                  <FilePlus className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground hindi-text">Image to PDF / PDF to JPG</h3>
                    <p className="text-sm hindi-text">इमेज को PDF में और PDF को JPG में कन्वर्ट करें।</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">विशेषताएं</h2>
              <ul className="list-disc pl-5 space-y-1 hindi-text">
                <li>100% मुफ्त - कोई रजिस्ट्रेशन नहीं</li>
                <li>ऑफलाइन भी काम करता है (PWA)</li>
                <li>आपका डेटा सुरक्षित - सब कुछ ब्राउज़र में ही प्रोसेस होता है</li>
                <li>मोबाइल और डेस्कटॉप दोनों पर उपयोग करें</li>
                <li>हिंदी और अंग्रेज़ी दोनों में उपलब्ध</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">अस्वीकरण</h2>
              <p className="hindi-text">
                यह वेबसाइट केवल सहायता के लिए है। यहां बनाए गए दस्तावेज़ कानूनी सलाह नहीं हैं। किसी भी कानूनी मामले के लिए योग्य वकील से संपर्क करें।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
