import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const Disclaimer = () => {
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
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">अस्वीकरण (Disclaimer)</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="hindi-text">अंतिम अपडेट: मार्च 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">सामान्य अस्वीकरण</h2>
              <p className="hindi-text">
                इस वेबसाइट पर उपलब्ध सभी जानकारी और टूल्स केवल सामान्य सूचना और सहायता के उद्देश्य से हैं। हम इस जानकारी की पूर्णता, विश्वसनीयता, सटीकता या उपलब्धता के बारे में कोई गारंटी नहीं देते।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">कानूनी अस्वीकरण</h2>
              <p className="hindi-text">
                यह वेबसाइट कानूनी सलाह प्रदान नहीं करती। यहां बनाए गए दस्तावेज़ केवल प्रारूप (templates) हैं और इन्हें कानूनी दस्तावेज़ के रूप में उपयोग करने से पहले योग्य कानूनी सलाहकार से परामर्श अवश्य करें।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">दस्तावेज़ की मान्यता</h2>
              <p className="hindi-text">
                इस टूल से बनाए गए दस्तावेज़ों की कानूनी मान्यता विभिन्न सरकारी विभागों और संस्थानों पर निर्भर करती है। हम किसी भी दस्तावेज़ की स्वीकृति की गारंटी नहीं देते।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">बाहरी लिंक्स</h2>
              <p className="hindi-text">
                इस वेबसाइट में तृतीय-पक्ष वेबसाइटों के लिंक हो सकते हैं। हम इन बाहरी साइटों की सामग्री, गोपनीयता नीतियों या प्रथाओं के लिए जिम्मेदार नहीं हैं।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">विज्ञापन अस्वीकरण</h2>
              <p className="hindi-text">
                इस वेबसाइट पर दिखाए जाने वाले विज्ञापन तृतीय-पक्ष विज्ञापन नेटवर्क द्वारा प्रदान किए जाते हैं। विज्ञापनों में दिखाए गए उत्पादों या सेवाओं का हम समर्थन नहीं करते।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">डेटा सुरक्षा</h2>
              <p className="hindi-text">
                यह टूल पूरी तरह आपके ब्राउज़र में काम करता है। आपके द्वारा दर्ज की गई जानकारी हमारे सर्वर पर नहीं भेजी जाती। फिर भी, हम इंटरनेट पर डेटा ट्रांसमिशन की पूर्ण सुरक्षा की गारंटी नहीं दे सकते।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">संपर्क</h2>
              <p className="hindi-text">
                किसी भी प्रश्न के लिए, कृपया हमारे <Link to="/contact" className="text-primary hover:underline">संपर्क पेज</Link> पर जाएं।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
