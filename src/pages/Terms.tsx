import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const Terms = () => {
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
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">नियम और शर्तें (Terms & Conditions)</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="hindi-text">अंतिम अपडेट: मार्च 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">1. सेवा की शर्तें</h2>
              <p className="hindi-text">
                इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों से सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया इस वेबसाइट का उपयोग न करें।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">2. सेवा का विवरण</h2>
              <p className="hindi-text">
                यह वेबसाइट निम्नलिखित मुफ्त ऑनलाइन टूल्स प्रदान करती है:
              </p>
              <ul className="list-disc pl-5 space-y-1 hindi-text">
                <li>स्वप्रमाणित घोषणा-पत्र जनरेटर</li>
                <li>Image Resizer</li>
                <li>Image to PDF कनवर्टर</li>
                <li>PDF to JPG कनवर्टर</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">3. उपयोगकर्ता की जिम्मेदारी</h2>
              <ul className="list-disc pl-5 space-y-1 hindi-text">
                <li>आप सही और सटीक जानकारी भरने के लिए जिम्मेदार हैं</li>
                <li>दस्तावेज़ों का कानूनी उपयोग आपकी अपनी जिम्मेदारी है</li>
                <li>इस टूल का दुरुपयोग (जालसाज़ी, धोखाधड़ी आदि) कानूनन अपराध है</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">4. अस्वीकरण (Disclaimer)</h2>
              <p className="hindi-text">
                यह वेबसाइट केवल सहायता उपकरण है और कानूनी सलाह प्रदान नहीं करती। यहां बनाए गए दस्तावेज़ प्रारूप (templates) हैं। इनकी कानूनी मान्यता संबंधित अधिकारियों द्वारा तय की जाती है। किसी भी कानूनी मामले में योग्य वकील से परामर्श लें।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">5. बौद्धिक संपदा</h2>
              <p className="hindi-text">
                इस वेबसाइट की सामग्री, डिज़ाइन और कोड कॉपीराइट द्वारा संरक्षित हैं। बिना अनुमति के इसकी प्रतिलिपि बनाना या वितरित करना प्रतिबंधित है।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">6. विज्ञापन</h2>
              <p className="hindi-text">
                यह वेबसाइट Google AdSense और अन्य विज्ञापन नेटवर्क के माध्यम से विज्ञापन प्रदर्शित कर सकती है। विज्ञापनों की सामग्री तृतीय-पक्ष द्वारा नियंत्रित होती है।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">7. सीमित देयता</h2>
              <p className="hindi-text">
                इस वेबसाइट के उपयोग से होने वाली किसी भी प्रत्यक्ष या अप्रत्यक्ष हानि के लिए हम जिम्मेदार नहीं हैं। सभी टूल्स "जैसा है" (as-is) आधार पर प्रदान किए जाते हैं।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">8. संशोधन</h2>
              <p className="hindi-text">
                हम किसी भी समय इन नियमों और शर्तों को बदलने का अधिकार रखते हैं। बदलाव इस पेज पर प्रकाशित किए जाएंगे।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">9. संपर्क</h2>
              <p className="hindi-text">
                इन शर्तों के बारे में किसी भी प्रश्न के लिए, कृपया हमारे <Link to="/contact" className="text-primary hover:underline">संपर्क पेज</Link> पर जाएं।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
