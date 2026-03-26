import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Type, Phone, Mail, MessageCircle, Wifi, UserCircle } from "lucide-react";

export type InputType = "text" | "url" | "phone" | "email" | "whatsapp" | "wifi" | "vcard";

interface QrInputPanelProps {
  onDataChange: (data: string, type: InputType) => void;
}

const QrInputPanel = ({ onDataChange }: QrInputPanelProps) => {
  const [activeTab, setActiveTab] = useState<InputType>("text");

  // Text/URL
  const [textInput, setTextInput] = useState("");
  // Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  // Email
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  // WhatsApp
  const [waNumber, setWaNumber] = useState("");
  const [waMessage, setWaMessage] = useState("");
  // WiFi
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  // vCard
  const [vcName, setVcName] = useState("");
  const [vcPhone, setVcPhone] = useState("");
  const [vcEmail, setVcEmail] = useState("");
  const [vcOrg, setVcOrg] = useState("");

  const buildData = (type: InputType) => {
    switch (type) {
      case "text":
      case "url": {
        let d = textInput.trim();
        if (d && /^www\./i.test(d)) d = "https://" + d;
        return d;
      }
      case "phone":
        return phoneNumber.trim() ? `tel:${phoneNumber.trim()}` : "";
      case "email": {
        let mailto = `mailto:${emailTo.trim()}`;
        const params: string[] = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        if (params.length) mailto += "?" + params.join("&");
        return emailTo.trim() ? mailto : "";
      }
      case "whatsapp": {
        const num = waNumber.trim().replace(/[^0-9]/g, "");
        const msg = waMessage.trim();
        let url = `https://wa.me/${num}`;
        if (msg) url += `?text=${encodeURIComponent(msg)}`;
        return num ? url : "";
      }
      case "wifi":
        return wifiSSID.trim()
          ? `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`
          : "";
      case "vcard":
        return vcName.trim()
          ? `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcOrg}\nEND:VCARD`
          : "";
      default:
        return "";
    }
  };

  const handleChange = (type: InputType) => {
    // Small delay so state updates
    setTimeout(() => {
      const data = buildData(type);
      onDataChange(data, type);
    }, 0);
  };

  const updateAndNotify = (setter: Function, value: string, type: InputType) => {
    setter(value);
    // We need the new value so build manually
    setTimeout(() => {
      onDataChange(buildData(type), type);
    }, 10);
  };

  const tabItems = [
    { value: "text", label: "Text", icon: Type },
    { value: "url", label: "URL", icon: Link2 },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "wifi", label: "WiFi", icon: Wifi },
    { value: "vcard", label: "vCard", icon: UserCircle },
  ] as const;

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as InputType);
          handleChange(v as InputType);
        }}
      >
        <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto gap-1 bg-transparent p-0">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border border-border data-[state=active]:border-primary"
            >
              <Icon className="w-4 h-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Text / URL */}
        <TabsContent value="text" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Enter text or message</Label>
            <Textarea
              placeholder="Type any text, message, or data..."
              value={textInput}
              onChange={(e) => updateAndNotify(setTextInput, e.target.value, "text")}
              className="min-h-[100px] text-base"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{textInput.length}/2000</p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Enter URL</Label>
            <Input
              placeholder="https://example.com"
              value={textInput}
              onChange={(e) => updateAndNotify(setTextInput, e.target.value, "url")}
              className="text-base"
            />
          </div>
        </TabsContent>

        <TabsContent value="phone" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Phone Number</Label>
            <Input
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => updateAndNotify(setPhoneNumber, e.target.value, "phone")}
              className="text-base"
            />
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Email Address</Label>
            <Input
              placeholder="example@email.com"
              value={emailTo}
              onChange={(e) => updateAndNotify(setEmailTo, e.target.value, "email")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Subject (optional)</Label>
            <Input
              placeholder="Subject line..."
              value={emailSubject}
              onChange={(e) => updateAndNotify(setEmailSubject, e.target.value, "email")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Body (optional)</Label>
            <Textarea
              placeholder="Email body..."
              value={emailBody}
              onChange={(e) => updateAndNotify(setEmailBody, e.target.value, "email")}
              className="min-h-[60px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">WhatsApp Number (with country code)</Label>
            <Input
              placeholder="919876543210"
              value={waNumber}
              onChange={(e) => updateAndNotify(setWaNumber, e.target.value, "whatsapp")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Message (optional)</Label>
            <Textarea
              placeholder="Pre-filled message..."
              value={waMessage}
              onChange={(e) => updateAndNotify(setWaMessage, e.target.value, "whatsapp")}
              className="min-h-[60px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="wifi" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Network Name (SSID)</Label>
            <Input
              placeholder="MyWiFi"
              value={wifiSSID}
              onChange={(e) => updateAndNotify(setWifiSSID, e.target.value, "wifi")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={wifiPassword}
              onChange={(e) => updateAndNotify(setWifiPassword, e.target.value, "wifi")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Encryption</Label>
            <Select value={wifiEncryption} onValueChange={(v) => { setWifiEncryption(v); setTimeout(() => onDataChange(buildData("wifi"), "wifi"), 10); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None (Open)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="vcard" className="mt-4 space-y-3">
          <div>
            <Label className="text-sm mb-1.5 block">Full Name</Label>
            <Input
              placeholder="John Doe"
              value={vcName}
              onChange={(e) => updateAndNotify(setVcName, e.target.value, "vcard")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Phone</Label>
            <Input
              placeholder="+91 98765 43210"
              value={vcPhone}
              onChange={(e) => updateAndNotify(setVcPhone, e.target.value, "vcard")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Email</Label>
            <Input
              placeholder="email@example.com"
              value={vcEmail}
              onChange={(e) => updateAndNotify(setVcEmail, e.target.value, "vcard")}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Organization (optional)</Label>
            <Input
              placeholder="Company name"
              value={vcOrg}
              onChange={(e) => updateAndNotify(setVcOrg, e.target.value, "vcard")}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QrInputPanel;
