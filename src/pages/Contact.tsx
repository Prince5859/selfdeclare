import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/SideMenu";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since no backend, open mailto
    const subject = encodeURIComponent(`संपर्क फॉर्म: ${name}`);
    const body = encodeURIComponent(`नाम: ${name}\nईमेल: ${email}\n\nसंदेश:\n${message}`);
    window.open(`mailto:contact@example.com?subject=${subject}&body=${body}`, "_blank");
    toast.success("ईमेल ऐप खोला गया!");
    setName("");
    setEmail("");
    setMessage("");
  };

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
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground hindi-text">संपर्क करें (Contact Us)</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="hindi-text">
              किसी भी प्रश्न, सुझाव या शिकायत के लिए नीचे दिए गए फॉर्म के माध्यम से हमसे संपर्क करें। हम जल्द से जल्द आपके संदेश का उत्तर देने का प्रयास करेंगे।
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1 hindi-text">आपका नाम</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none hindi-text"
                  placeholder="अपना नाम लिखें"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1 hindi-text">ईमेल एड्रेस</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1 hindi-text">संदेश</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none hindi-text resize-none"
                  placeholder="अपना संदेश यहां लिखें..."
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                <span className="hindi-text">संदेश भेजें</span>
              </Button>
            </form>

            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm hindi-text">
                  आप हमें सीधे ईमेल भी कर सकते हैं: <a href="mailto:contact@example.com" className="text-primary hover:underline">contact@example.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
