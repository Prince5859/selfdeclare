import { useState, useRef } from "react";
import { Copy, RefreshCw, Hash, Sparkles, Instagram, Twitter, Facebook, Youtube, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";

type Platform = "instagram" | "twitter" | "facebook" | "youtube";

const PLATFORMS = [
  { id: "instagram" as Platform, label: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500", maxChars: 2200, hashtagLimit: 30 },
  { id: "twitter" as Platform, label: "Twitter/X", icon: Twitter, color: "from-blue-400 to-blue-600", maxChars: 280, hashtagLimit: 5 },
  { id: "facebook" as Platform, label: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-800", maxChars: 63206, hashtagLimit: 10 },
  { id: "youtube" as Platform, label: "YouTube", icon: Youtube, color: "from-red-500 to-red-700", maxChars: 5000, hashtagLimit: 15 },
];

// Viral caption templates - {topic} will be replaced
const CAPTION_TEMPLATES = [
  "🔥 {topic} ke baare mein ye jaanke aap shocked ho jaoge!",
  "✨ {topic} - Ek aisi cheez jo aapki zindagi badal degi!",
  "💯 {topic} ka asli secret jo koi nahi batata!",
  "🚀 {topic} mein expert banna hai? Ye padho!",
  "👑 {topic} - Why this is trending right now!",
  "⚡ The ultimate guide to {topic} that nobody talks about!",
  "🎯 {topic} tips that will blow your mind!",
  "💪 How {topic} changed everything - Must watch!",
  "🌟 {topic} - Viral content incoming!",
  "🔑 Secret {topic} tricks the pros don't share!",
  "😱 You won't believe what {topic} can do!",
  "📈 {topic} growth hacks that actually work in 2025!",
  "💡 {topic} se related best tips & tricks!",
  "🏆 {topic} - Number 1 trending topic!",
  "❤️ Why everyone is talking about {topic} right now!",
  "🎬 {topic} - Watch till the end for surprise!",
  "💰 {topic} se paisa kaise kamaye? Full guide!",
  "🤯 Mind-blowing {topic} facts you didn't know!",
  "✅ {topic} - Complete breakdown for beginners!",
  "🌈 {topic} vibes only! Share if you agree!",
  "📸 {topic} ke best moments captured!",
  "🎵 {topic} anthem - Tag someone who needs this!",
  "💫 {topic} magic - Before vs After!",
  "🔥 Stop scrolling! {topic} content you NEED to see!",
  "⭐ {topic} review - Honest opinion inside!",
  "🎯 3 things about {topic} you're doing wrong!",
  "💎 {topic} premium tips - Save this for later!",
  "🗣️ Unpopular opinion about {topic} - Do you agree?",
  "📊 {topic} stats that will surprise you!",
  "🎉 Celebrating {topic} - Join the trend!",
  "🧠 {topic} IQ test - How much do you really know?",
  "🔥 {topic} challenge accepted! Try this now!",
  "💥 {topic} exposed - The truth revealed!",
  "🌍 {topic} is taking over the world - Here's why!",
  "⏰ {topic} update 2025 - Everything you need to know!",
  "🎭 The two sides of {topic} nobody talks about!",
  "📱 {topic} hack that went viral overnight!",
  "💣 {topic} bombshell - Breaking news!",
  "🏅 Top 5 {topic} moments of all time!",
  "🤔 {topic} - What's your take on this?",
];

// Generate hashtags based on topic
const generateTopicHashtags = (topic: string): string[] => {
  const cleanTopic = topic.trim().toLowerCase();
  const topicTag = `#${cleanTopic.replace(/\s+/g, "")}`;
  const topicWords = cleanTopic.split(/\s+/);
  
  const viralTags = [
    "#viral", "#trending", "#explore", "#fyp", "#foryou", "#foryoupage",
    "#viralpost", "#viralcontent", "#trendingnow", "#explorepage",
    "#reels", "#reelsinstagram", "#reelsviral", "#reelitfeelit",
    "#follow", "#like", "#share", "#comment", "#save",
    "#growth", "#engagement", "#contentcreator", "#creator",
    "#socialmedia", "#digitalmarketing", "#influencer",
    "#lifestyle", "#daily", "#instagood", "#photooftheday",
    "#love", "#motivation", "#inspiration", "#success",
    "#india", "#hindi", "#desi", "#indian",
    "#2025", "#new", "#latest", "#update",
    "#tips", "#tricks", "#hacks", "#guide",
    "#amazing", "#awesome", "#best", "#top",
    "#mustwatch", "#mustsee", "#donmissit", "#watchnow",
    "#followforfollowback", "#likeforlikes", "#commentbelow",
    "#sharethis", "#savethis", "#followme",
  ];

  // Create topic-specific tags
  const topicSpecific = [
    topicTag,
    ...topicWords.map(w => `#${w}`),
    `#${cleanTopic.replace(/\s+/g, "")}lover`,
    `#${cleanTopic.replace(/\s+/g, "")}life`,
    `#${cleanTopic.replace(/\s+/g, "")}vibes`,
    `#${cleanTopic.replace(/\s+/g, "")}daily`,
    `#${cleanTopic.replace(/\s+/g, "")}lovers`,
    `#${cleanTopic.replace(/\s+/g, "")}gram`,
    `#${cleanTopic.replace(/\s+/g, "")}world`,
    `#${cleanTopic.replace(/\s+/g, "")}community`,
    `#best${cleanTopic.replace(/\s+/g, "")}`,
    `#${cleanTopic.replace(/\s+/g, "")}2025`,
  ];

  // Combine and deduplicate
  const allTags = [...new Set([...topicSpecific, ...viralTags])];
  
  // Shuffle
  for (let i = allTags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTags[i], allTags[j]] = [allTags[j], allTags[i]];
  }

  return allTags;
};

const CaptionGenerator = () => {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [topic, setTopic] = useState("");
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const usedIndicesRef = useRef<Set<number>>(new Set());
  const lastTopicRef = useRef("");

  const selectedPlatform = PLATFORMS.find(p => p.id === platform)!;

  const generateCaptions = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first! ✏️");
      return;
    }

    // Reset used indices if topic changed
    if (lastTopicRef.current !== topic.trim()) {
      usedIndicesRef.current = new Set();
      lastTopicRef.current = topic.trim();
    }

    // Get available indices (not yet used)
    const allIndices = Array.from({ length: CAPTION_TEMPLATES.length }, (_, i) => i);
    let availableIndices = allIndices.filter(i => !usedIndicesRef.current.has(i));
    
    // If all used, reset and use all again
    if (availableIndices.length < 5) {
      usedIndicesRef.current = new Set();
      availableIndices = [...allIndices];
    }

    // Shuffle available indices
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    // Pick 5 unique captions
    const selectedIndices = availableIndices.slice(0, 5);
    selectedIndices.forEach(i => usedIndicesRef.current.add(i));

    const captions = selectedIndices.map(i =>
      CAPTION_TEMPLATES[i].replace(/\{topic\}/g, topic.trim())
    );
    setGeneratedCaptions(captions);

    // Generate hashtags
    const hashtags = generateTopicHashtags(topic);
    setGeneratedHashtags(hashtags.slice(0, selectedPlatform.hashtagLimit));

    toast.success("Viral captions & hashtags generated! 🔥");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied! 📋");
  };

  const copyAllHashtags = () => {
    navigator.clipboard.writeText(generatedHashtags.join(" "));
    toast.success("All hashtags copied! 📋");
  };

  const copyCaptionWithHashtags = (caption: string) => {
    const text = `${caption}\n\n${generatedHashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    toast.success("Caption + Hashtags copied! 📋");
  };

  return (
    <div className="min-h-screen bg-background">
      <SideMenu />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Viral Caption Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Viral Caption & Hashtag Generator 🔥
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sirf topic dalo, platform select karo — viral titles aur trending hashtags instant milenge!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <AdBanner />

        {/* Topic Input */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Topic Enter Karo
          </Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. fitness, cooking, travel, coding, cricket..."
            className="bg-card text-lg py-6 px-4"
            onKeyDown={(e) => e.key === "Enter" && generateCaptions()}
          />
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">📱 Platform Select Karo</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  platform === p.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <p.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateCaptions}
          className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Viral Captions 🔥
        </Button>

        {/* Results */}
        {generatedCaptions.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Captions */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Viral Titles / Captions
              </h2>
              <div className="space-y-3">
                {generatedCaptions.map((caption, idx) => (
                  <div
                    key={`${caption}-${idx}`}
                    className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3 hover:shadow-md transition-shadow"
                  >
                    <p className="text-foreground flex-1 leading-relaxed">{caption}</p>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(caption)}
                        title="Copy caption"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyCaptionWithHashtags(caption)}
                        title="Copy caption + hashtags"
                      >
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Trending Hashtags ({generatedHashtags.length})
                </h2>
                <Button variant="outline" size="sm" onClick={copyAllHashtags} className="gap-1">
                  <Copy className="w-3 h-3" />
                  Copy All
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((tag, idx) => (
                    <button
                      key={`${tag}-${idx}`}
                      onClick={() => copyToClipboard(tag)}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Regenerate */}
            <Button
              variant="outline"
              onClick={generateCaptions}
              className="w-full gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate (Alag Results) 🔄
            </Button>
          </div>
        )}

        <AdBanner />
      </div>
    </div>
  );
};

export default CaptionGenerator;
