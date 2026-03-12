import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const PrivacyPolicy = () => {
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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">गोपनीयता नीति (Privacy Policy)</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="hindi-text">
              अंतिम अपडेट: मार्च 2026
            </p>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">1. परिचय</h2>
              <p className="hindi-text">
                हमारी वेबसाइट ("स्वप्रमाणित घोषणा | Self Declaration") पर आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। यह गोपनीयता नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">2. हम कौन सी जानकारी एकत्र करते हैं</h2>
              <ul className="list-disc pl-5 space-y-1 hindi-text">
                <li>ब्राउज़र का प्रकार और संस्करण</li>
                <li>ऑपरेटिंग सिस्टम</li>
                <li>IP एड्रेस</li>
                <li>पेज विज़िट और उपयोग पैटर्न</li>
                <li>डिवाइस की जानकारी</li>
              </ul>
              <p className="mt-2 hindi-text">
                <strong>नोट:</strong> यह टूल पूरी तरह क्लाइंट-साइड पर काम करता है। आपके द्वारा भरी गई जानकारी (नाम, पता आदि) हमारे सर्वर पर कभी नहीं भेजी जाती। सारा डेटा आपके ब्राउज़र में ही प्रोसेस होता है।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">3. कुकीज़ और विज्ञापन</h2>
              <p className="hindi-text">
                हम Google AdSense और तृतीय-पक्ष विज्ञापन सेवाओं का उपयोग करते हैं जो कुकीज़ का उपयोग करके विज्ञापन प्रदर्शित करते हैं। Google, DART कुकी का उपयोग करके, आपकी वेबसाइट और इंटरनेट पर अन्य साइटों पर विज़िट के आधार पर विज्ञापन दिखाता है।
              </p>
              <p className="mt-2 hindi-text">
                आप Google विज्ञापन सेटिंग्स पेज पर जाकर वैयक्तिकृत विज्ञापन से ऑप्ट-आउट कर सकते हैं।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">4. तृतीय-पक्ष सेवाएं</h2>
              <p className="hindi-text">
                हम निम्नलिखित तृतीय-पक्ष सेवाओं का उपयोग कर सकते हैं:
              </p>
              <ul className="list-disc pl-5 space-y-1 hindi-text">
                <li>Google AdSense - विज्ञापन प्रदर्शन के लिए</li>
                <li>Google Analytics - वेबसाइट ट्रैफिक विश्लेषण के लिए</li>
                <li>Google Fonts - फ़ॉन्ट लोड करने के लिए</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">5. डेटा सुरक्षा</h2>
              <p className="hindi-text">
                हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपाय करते हैं। हमारी वेबसाइट HTTPS एन्क्रिप्शन का उपयोग करती है।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">6. बच्चों की गोपनीयता</h2>
              <p className="hindi-text">
                हमारी सेवा 13 वर्ष से कम आयु के बच्चों के लिए नहीं है। हम जानबूझकर 13 वर्ष से कम आयु के बच्चों से कोई व्यक्तिगत जानकारी एकत्र नहीं करते।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">7. नीति में बदलाव</h2>
              <p className="hindi-text">
                हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। किसी भी बदलाव को इस पेज पर पोस्ट किया जाएगा।
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2 hindi-text">8. संपर्क करें</h2>
              <p className="hindi-text">
                गोपनीयता संबंधी किसी भी प्रश्न के लिए, कृपया हमारे <Link to="/contact" className="text-primary hover:underline">संपर्क पेज</Link> पर जाएं।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
