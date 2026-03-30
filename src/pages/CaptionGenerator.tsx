import { useState } from "react";
import { Copy, RefreshCw, Hash, Type, Sparkles, Instagram, Twitter, Facebook, Youtube, Briefcase, Heart, Utensils, Plane, Dumbbell, Camera, Music, Book, Code, Palette, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SideMenu from "@/components/SideMenu";
import AdBanner from "@/components/AdBanner";

type Platform = "instagram" | "twitter" | "facebook" | "youtube";
type Category = "motivation" | "love" | "food" | "travel" | "fitness" | "photography" | "music" | "education" | "tech" | "art" | "nature" | "business" | "funny" | "attitude" | "festival";
type Language = "english" | "hindi" | "hinglish";

const PLATFORMS = [
  { id: "instagram" as Platform, label: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
  { id: "twitter" as Platform, label: "Twitter/X", icon: Twitter, color: "from-blue-400 to-blue-600" },
  { id: "facebook" as Platform, label: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-800" },
  { id: "youtube" as Platform, label: "YouTube", icon: Youtube, color: "from-red-500 to-red-700" },
];

const CATEGORIES = [
  { id: "motivation" as Category, label: "Motivation", icon: Star, emoji: "💪" },
  { id: "love" as Category, label: "Love", icon: Heart, emoji: "❤️" },
  { id: "food" as Category, label: "Food", icon: Utensils, emoji: "🍕" },
  { id: "travel" as Category, label: "Travel", icon: Plane, emoji: "✈️" },
  { id: "fitness" as Category, label: "Fitness", icon: Dumbbell, emoji: "🏋️" },
  { id: "photography" as Category, label: "Photography", icon: Camera, emoji: "📸" },
  { id: "music" as Category, label: "Music", icon: Music, emoji: "🎵" },
  { id: "education" as Category, label: "Education", icon: Book, emoji: "📚" },
  { id: "tech" as Category, label: "Technology", icon: Code, emoji: "💻" },
  { id: "art" as Category, label: "Art & Design", icon: Palette, emoji: "🎨" },
  { id: "nature" as Category, label: "Nature", icon: Leaf, emoji: "🌿" },
  { id: "business" as Category, label: "Business", icon: Briefcase, emoji: "📈" },
  { id: "funny" as Category, label: "Funny", icon: Sparkles, emoji: "😂" },
  { id: "attitude" as Category, label: "Attitude", icon: Star, emoji: "😎" },
  { id: "festival" as Category, label: "Festival", icon: Sparkles, emoji: "🎉" },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "english", label: "English" },
  { id: "hindi", label: "हिंदी" },
  { id: "hinglish", label: "Hinglish" },
];

// Caption database
const CAPTIONS: Record<Category, Record<Language, string[]>> = {
  motivation: {
    english: [
      "Dream big, work hard, stay focused. 🌟",
      "Your only limit is your mind. Break free! 🔥",
      "Success is not final, failure is not fatal. Keep going! 💪",
      "Be the energy you want to attract. ✨",
      "Hustle in silence, let success make the noise. 🚀",
      "The best time to start was yesterday. The next best time is now. ⏰",
      "Don't stop until you're proud. 🏆",
      "Stars can't shine without darkness. 🌟",
      "Your vibe attracts your tribe. 💫",
      "Make yourself a priority. 👑",
    ],
    hindi: [
      "सपने बड़े देखो, मेहनत और बड़ी करो। 🌟",
      "जो हार नहीं मानता, उसे कोई हरा नहीं सकता। 💪",
      "कामयाबी उनको मिलती है जो कोशिश करना नहीं छोड़ते। 🔥",
      "अपनी मंज़िल खुद बनाओ, राह अपने आप बन जाएगी। ✨",
      "जब तक डरोगे, तब तक हारोगे। 🚀",
      "जीत उसी की होती है, जो खुद पर भरोसा रखता है। 🏆",
      "संघर्ष ही सफलता की पहली सीढ़ी है। 💫",
      "कोशिश करने वालों की कभी हार नहीं होती। 👑",
    ],
    hinglish: [
      "Apna time aayega, bas mehnat karte raho! 🔥",
      "Zindagi mein risk lo, kyunki jo darr gaya woh mar gaya! 💪",
      "Sapne wo nahi jo neend mein aaye, sapne wo hain jo neend udaa de! 🌟",
      "Struggle temporary hai, success permanent hoga! 🚀",
      "Jab tak todenge nahi, tab tak chodenge nahi! ✨",
      "Aaj ki mehnat kal ka success hai! 🏆",
      "Winners never quit, quitters never win! 💫",
    ],
  },
  love: {
    english: [
      "You are my today and all of my tomorrows. ❤️",
      "Every love story is beautiful, but ours is my favorite. 💕",
      "I fell in love the way you fall asleep: slowly, then all at once. 🌹",
      "Together is a wonderful place to be. 💑",
      "You are the reason I believe in love. 💗",
      "My heart is and always will be yours. 💘",
      "In your arms, I've found my home. 🏠❤️",
      "You make my heart smile. 😊💕",
    ],
    hindi: [
      "तेरे बिना ये दिल अधूरा है। ❤️",
      "मोहब्बत वो है जो दिल से हो, दिखावे से नहीं। 💕",
      "तू मेरी ज़िंदगी का सबसे खूबसूरत हिस्सा है। 🌹",
      "तेरी मुस्कान मेरी दुनिया है। 💗",
      "प्यार में कोई शर्त नहीं होती। 💘",
      "तू है तो सब कुछ है। 💑",
    ],
    hinglish: [
      "Tere bina ye dil adhoora hai! ❤️",
      "Tu meri zindagi ka sabse khoobsurat chapter hai! 💕",
      "Teri smile dekh ke duniya bhool jaata hoon! 🌹",
      "Pyaar mein pagal hona zaroori hai! 💗",
      "Tu hai toh sab kuch hai, tu nahi toh kuch nahi! 💘",
    ],
  },
  food: {
    english: [
      "Good food, good mood. 🍕",
      "Life is short, eat dessert first! 🍰",
      "Food is my love language. 🍔❤️",
      "Eat well, travel often. 🌮✈️",
      "First we eat, then we do everything else. 🍽️",
      "Happiness is homemade. 🏠🍳",
      "You can't make everyone happy, you're not pizza. 🍕😂",
    ],
    hindi: [
      "खाने का मज़ा दोस्तों के साथ और बढ़ जाता है। 🍕",
      "पेट भरा हो तो दुनिया अच्छी लगती है। 🍔",
      "माँ के हाथ का खाना सबसे best! 🍳❤️",
      "खाना बनाना एक कला है और खाना एक शौक! 🍽️",
    ],
    hinglish: [
      "Khaana khao, khush raho! 🍕",
      "Maa ke haath ka khaana > everything else! 🍳❤️",
      "Diet kal se, aaj toh party hai! 🍰😂",
      "Food coma is real, aur mujhe pyaar hai isse! 🍔",
    ],
  },
  travel: {
    english: [
      "Adventure awaits! Pack your bags. ✈️",
      "Travel far enough to meet yourself. 🌍",
      "Life is short, and the world is wide. 🗺️",
      "Collect moments, not things. 📸",
      "Wanderlust and city dust. 🏙️",
      "Let's find some beautiful place to get lost. 🌄",
      "Travel is the only thing you buy that makes you richer. 💰✈️",
    ],
    hindi: [
      "दुनिया देखो, ज़िंदगी जियो! ✈️",
      "सफ़र में मज़ा है, मंज़िल तो बस एक बहाना है। 🌍",
      "पहाड़ों से प्यार, समंदर से लगाव। 🏔️🌊",
      "घूमो, फिरो, ज़िंदगी का मज़ा लो! 🗺️",
    ],
    hinglish: [
      "Ghumne ka plan bana, baaki sab sort ho jayega! ✈️",
      "Pahaadon mein sukoon hai, sheher mein shor! 🏔️",
      "Travel karo, memories banao! 📸",
      "Duniya gol hai, toh ghoom ke aa jayenge! 🌍",
    ],
  },
  fitness: {
    english: [
      "Sweat is just fat crying. 💪",
      "Your body can stand almost anything. It's your mind you have to convince. 🏋️",
      "No pain, no gain. 🔥",
      "Be stronger than your excuses. 💥",
      "Fitness is not about being better than someone else. It's about being better than you used to be. 🏆",
      "Train insane or remain the same. 🏃",
    ],
    hindi: [
      "आज की मेहनत कल का स्वास्थ्य है। 💪",
      "शरीर एक मंदिर है, इसे स्वस्थ रखो। 🏋️",
      "जो दर्द आज सहोगे, वो ताकत कल बनेगी। 🔥",
      "स्वस्थ शरीर में स्वस्थ मन बसता है। 🧘",
    ],
    hinglish: [
      "Gym jaao, body banaao! 💪",
      "No excuse, only results! 🔥",
      "Pain hai toh gain bhi hoga! 🏋️",
      "Fitness is a lifestyle, not a hobby! 🏆",
    ],
  },
  photography: {
    english: [
      "Life is like a camera. Focus on what's important. 📸",
      "Every picture tells a story. 🖼️",
      "Capture the moment, it's all we have. ✨",
      "Photography is the story I fail to put into words. 📷",
      "The best camera is the one you have with you. 📱",
    ],
    hindi: [
      "हर तस्वीर एक कहानी कहती है। 📸",
      "लम्हों को कैद कर लो, वक़्त रुकता नहीं। 🖼️",
      "कैमरे से दुनिया और खूबसूरत दिखती है। ✨",
    ],
    hinglish: [
      "Ek photo toh banti hai! 📸",
      "Camera mein duniya alag dikhti hai! 🖼️",
      "Pic lelo yaar, memories banaalo! ✨",
    ],
  },
  music: {
    english: [
      "Where words fail, music speaks. 🎵",
      "Music is the soundtrack of your life. 🎶",
      "Without music, life would be a mistake. 🎸",
      "Turn up the music and turn down the drama. 🔊",
      "Music is my escape from everything. 🎧",
    ],
    hindi: [
      "संगीत वो भाषा है जो हर दिल समझता है। 🎵",
      "जहाँ शब्द खत्म होते हैं, वहाँ संगीत शुरू होता है। 🎶",
      "गाना सुनो, दुनिया भूल जाओ। 🎧",
    ],
    hinglish: [
      "Music on, duniya off! 🎵",
      "Gaana sun ke mood ban jaata hai! 🎶",
      "Life mein music zaroori hai! 🎸",
    ],
  },
  education: {
    english: [
      "Education is the most powerful weapon to change the world. 📚",
      "The more you learn, the more you earn. 💡",
      "Knowledge is power. 🧠",
      "Study hard, dream big. 🎓",
      "Invest in your mind, it pays the best interest. 📖",
    ],
    hindi: [
      "शिक्षा सबसे शक्तिशाली हथियार है। 📚",
      "पढ़ाई करो, सपने पूरे करो। 🎓",
      "ज्ञान ही असली धन है। 💡",
    ],
    hinglish: [
      "Padho likho, aage badho! 📚",
      "Education is the key to success! 🎓",
      "Books padhne se duniya badal jaati hai! 📖",
    ],
  },
  tech: {
    english: [
      "Code, create, innovate. 💻",
      "Technology is best when it brings people together. 🌐",
      "The future is digital. Are you ready? 🚀",
      "Innovation distinguishes between a leader and a follower. 💡",
      "First, solve the problem. Then, write the code. 🖥️",
    ],
    hindi: [
      "तकनीक ने दुनिया बदल दी है। 💻",
      "डिजिटल दुनिया का भविष्य उज्ज्वल है। 🌐",
      "कोडिंग सीखो, भविष्य बनाओ। 🚀",
    ],
    hinglish: [
      "Code karo, duniya badlo! 💻",
      "Tech ka zamana hai, update raho! 🌐",
      "Innovation hi success ki key hai! 🚀",
    ],
  },
  art: {
    english: [
      "Every artist was first an amateur. 🎨",
      "Art is not what you see, but what you make others see. 🖌️",
      "Creativity takes courage. 💫",
      "Colors speak louder than words. 🌈",
      "Art washes away the dust of everyday life. ✨",
    ],
    hindi: [
      "कला वो है जो दिल से आए। 🎨",
      "हर रंग एक कहानी कहता है। 🌈",
      "रचनात्मकता में असली ताकत है। 💫",
    ],
    hinglish: [
      "Art se duniya khoobsurat lagti hai! 🎨",
      "Creativity ko koi rok nahi sakta! 🖌️",
      "Colors mein magic hai! 🌈",
    ],
  },
  nature: {
    english: [
      "In every walk with nature, one receives far more than they seek. 🌿",
      "The earth has music for those who listen. 🌍",
      "Nature never goes out of style. 🌺",
      "Keep close to Nature's heart. 🌳",
      "Sky above, earth below, peace within. 🌅",
    ],
    hindi: [
      "प्रकृति से बड़ा कोई कलाकार नहीं। 🌿",
      "पेड़ लगाओ, जीवन बचाओ। 🌳",
      "प्रकृति की गोद में सुकून मिलता है। 🌺",
    ],
    hinglish: [
      "Nature ke paas jaao, sukoon milega! 🌿",
      "Greenery mein asli beauty hai! 🌳",
      "Sunset dekhna ek therapy hai! 🌅",
    ],
  },
  business: {
    english: [
      "Entrepreneurship is living a few years of your life like most people won't. 📈",
      "Don't wait for opportunity, create it. 💼",
      "Success is not owned, it's rented. And rent is due every day. 🏆",
      "Think big, start small, act now. 🚀",
      "Your network is your net worth. 🤝",
    ],
    hindi: [
      "व्यापार में जोखिम लेना ज़रूरी है। 📈",
      "सफलता उनको मिलती है जो हिम्मत नहीं हारते। 💼",
      "अपना ब्रांड बनाओ, दुनिया पहचानेगी। 🏆",
    ],
    hinglish: [
      "Business mein risk lena padta hai! 📈",
      "Hustle karo, result aayega! 💼",
      "Apna brand banao, duniya pehchanegi! 🚀",
    ],
  },
  funny: {
    english: [
      "I'm not lazy, I'm on energy-saving mode. 😴",
      "My bed is a magical place where I suddenly remember everything I forgot to do. 😂",
      "I need a six-month vacation, twice a year. 🏖️",
      "I'm not arguing, I'm just explaining why I'm right. 🤷",
      "Friday is my second favorite F word. Food is my first. 🍔😂",
    ],
    hindi: [
      "मैं आलसी नहीं हूँ, energy save कर रहा हूँ। 😴",
      "ज़िंदगी में सबसे मुश्किल काम सुबह उठना है। 😂",
      "पैसे पेड़ पर नहीं उगते, काश उगते! 💸",
    ],
    hinglish: [
      "Main aalsi nahi hoon, energy save kar raha hoon! 😴",
      "Monday ko ban karna chahiye, petition sign karo! 😂",
      "Diet kal se, aaj toh chill hai! 🍕",
      "Paise kamana easy hai, bachana mushkil! 💸",
    ],
  },
  attitude: {
    english: [
      "I'm not perfect, but I'm limited edition. 😎",
      "My attitude is based on how you treat me. 💯",
      "Be yourself, everyone else is already taken. 👑",
      "I don't have an attitude problem, you have a perception problem. 🔥",
      "Born to express, not to impress. ✨",
    ],
    hindi: [
      "अपनी अकड़ में रहो, लोगों की परवाह मत करो। 😎",
      "शेर की चाल हमेशा अलग होती है। 🦁",
      "हम वो हैं जो अपने दम पर चमकते हैं। 👑",
      "जो अपनी मर्ज़ी से जीता है, वही असली बादशाह है। 🔥",
    ],
    hinglish: [
      "Apna style hai, copy mat karo! 😎",
      "Hum woh hain jo apne dum par chalte hain! 👑",
      "Attitude toh apna signature hai! 🔥",
      "Log kya kahenge? Log kya karenge? Hum toh yahi hain! 💯",
    ],
  },
  festival: {
    english: [
      "May this festival bring joy, peace and prosperity! 🎉",
      "Celebrate every moment, life is a festival! 🎊",
      "Wishing you a festival full of love and laughter! 💕",
      "Lights, love, and celebrations! ✨🎆",
      "Festival vibes only! 🎉🥳",
    ],
    hindi: [
      "त्योहार की ढेर सारी शुभकामनाएँ! 🎉",
      "खुशियों का त्योहार मनाओ, सबको गले लगाओ! 🎊",
      "रोशनी और खुशियों से भरा हो ये त्योहार! ✨🎆",
      "हर त्योहार प्यार और एकता का संदेश देता है। 💕",
    ],
    hinglish: [
      "Festival ki bahut saari shubhkamnayein! 🎉",
      "Celebration mode on! 🎊",
      "Tyohaar hai toh mithaai toh banti hai! 🍬",
      "Lights, love aur dher saari khushiyaan! ✨🎆",
    ],
  },
};

// Hashtag database
const HASHTAGS: Record<Category, string[]> = {
  motivation: ["#motivation", "#inspirational", "#hustle", "#grind", "#nevergiveup", "#success", "#mindset", "#goals", "#dreamsbig", "#keepgoing", "#believe", "#positivevibes", "#motivationalquotes", "#hardwork", "#selfimprovement", "#focusonyourself", "#riseandgrind", "#successmindset", "#dailymotivation", "#motivationdaily"],
  love: ["#love", "#lovequotes", "#couplegoals", "#relationship", "#truelove", "#romance", "#forever", "#soulmate", "#lovestory", "#heartfelt", "#loveyou", "#inlove", "#lovelife", "#mylove", "#loveisintheair", "#romanticquotes", "#couplequotes", "#loveforever"],
  food: ["#food", "#foodie", "#foodporn", "#yummy", "#delicious", "#homemade", "#cooking", "#foodlover", "#instafood", "#foodphotography", "#tasty", "#recipe", "#chef", "#foodblogger", "#healthyfood", "#dessert", "#foodgasm", "#streetfood", "#foodstagram"],
  travel: ["#travel", "#wanderlust", "#explore", "#adventure", "#travelgram", "#travelphotography", "#vacation", "#trip", "#instatravel", "#nature", "#travelblogger", "#traveltheworld", "#roadtrip", "#tourism", "#beautifuldestinations", "#traveler", "#wanderer", "#globetrotter"],
  fitness: ["#fitness", "#gym", "#workout", "#fit", "#bodybuilding", "#training", "#health", "#fitnessmotivation", "#exercise", "#muscle", "#gains", "#fitnessjourney", "#gymmotivation", "#healthy", "#lifestyle", "#fitfam", "#strong", "#nopainnogain"],
  photography: ["#photography", "#photo", "#photographer", "#photooftheday", "#instagood", "#picoftheday", "#camera", "#portrait", "#photoshoot", "#art", "#streetphotography", "#naturephotography", "#photographylovers", "#canonphotography", "#mobilephotography"],
  music: ["#music", "#musician", "#song", "#singer", "#rap", "#hiphop", "#beats", "#musiclover", "#livemusic", "#newmusic", "#musically", "#songwriter", "#guitar", "#dj", "#musicproducer", "#melody", "#musiclife", "#indie"],
  education: ["#education", "#learning", "#study", "#students", "#knowledge", "#school", "#college", "#exam", "#success", "#studygram", "#motivation", "#teacher", "#books", "#science", "#math", "#studyhard", "#learneveryday"],
  tech: ["#technology", "#tech", "#coding", "#programming", "#developer", "#software", "#ai", "#innovation", "#digital", "#startup", "#code", "#webdevelopment", "#python", "#javascript", "#machinelearning", "#cybersecurity", "#blockchain"],
  art: ["#art", "#artist", "#artwork", "#painting", "#drawing", "#creative", "#design", "#illustration", "#sketch", "#digitalart", "#artoftheday", "#creativity", "#contemporaryart", "#fineart", "#artistsoninstagram", "#watercolor", "#abstract"],
  nature: ["#nature", "#naturephotography", "#landscape", "#sunset", "#sunrise", "#mountains", "#ocean", "#wildlife", "#outdoors", "#green", "#earthday", "#environment", "#trees", "#flowers", "#sky", "#river", "#forest", "#beautiful"],
  business: ["#business", "#entrepreneur", "#startup", "#marketing", "#branding", "#success", "#leadership", "#money", "#growth", "#ceo", "#businessowner", "#hustle", "#investment", "#finance", "#networking", "#smallbusiness", "#digitalmarketing"],
  funny: ["#funny", "#lol", "#memes", "#humor", "#comedy", "#haha", "#fun", "#laugh", "#jokes", "#meme", "#funnymemes", "#hilarious", "#funnyvideos", "#entertainment", "#viral", "#trending", "#relatable"],
  attitude: ["#attitude", "#swag", "#style", "#savage", "#boss", "#king", "#queen", "#royal", "#confidence", "#bold", "#fierce", "#strong", "#power", "#selflove", "#bereal", "#ownit", "#unstoppable", "#limitless"],
  festival: ["#festival", "#celebration", "#festive", "#happyholidays", "#diwali", "#holi", "#eid", "#christmas", "#newyear", "#party", "#lights", "#joy", "#traditions", "#culture", "#familytime", "#festiveseason", "#happiness"],
};

const CaptionGenerator = () => {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [category, setCategory] = useState<Category>("motivation");
  const [language, setLanguage] = useState<Language>("english");
  const [keyword, setKeyword] = useState("");
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [hashtagCount, setHashtagCount] = useState(15);

  const generateCaptions = () => {
    const captions = [...CAPTIONS[category][language]];
    // Shuffle
    for (let i = captions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [captions[i], captions[j]] = [captions[j], captions[i]];
    }
    setGeneratedCaptions(captions.slice(0, 5));

    // Generate hashtags
    const allHashtags = [...HASHTAGS[category]];
    if (keyword.trim()) {
      allHashtags.unshift(`#${keyword.trim().replace(/\s+/g, "").toLowerCase()}`);
    }
    for (let i = allHashtags.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allHashtags[i], allHashtags[j]] = [allHashtags[j], allHashtags[i]];
    }
    setGeneratedHashtags(allHashtags.slice(0, hashtagCount));
    toast.success("Captions & Hashtags generated! ✨");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
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
            <Sparkles className="w-4 h-4" />
            Caption & Hashtag Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Caption & Hashtag Generator ✍️
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Social media ke liye perfect captions aur trending hashtags generate karo! Instagram, Twitter, Facebook, YouTube sab ke liye.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <AdBanner />

        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Platform Select Karo
          </Label>
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

        {/* Language Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">🌐 Language</Label>
          <div className="flex gap-3 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                  language === l.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Category Select Karo
          </Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                  category === c.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-xs font-medium text-foreground">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keyword & Hashtag Count */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-medium">🔑 Custom Keyword (Optional)</Label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. reels, trending, viral"
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-medium"># Hashtag Count: {hashtagCount}</Label>
            <input
              type="range"
              min={5}
              max={30}
              value={hashtagCount}
              onChange={(e) => setHashtagCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateCaptions}
          className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Captions & Hashtags ✨
        </Button>

        {/* Results */}
        {generatedCaptions.length > 0 && (
          <div className="space-y-6">
            {/* Captions */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                Generated Captions
              </h2>
              <div className="space-y-3">
                {generatedCaptions.map((caption, idx) => (
                  <div
                    key={idx}
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
                  Generated Hashtags
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllHashtags}
                  className="gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy All
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((tag, idx) => (
                    <button
                      key={idx}
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
              Regenerate 🔄
            </Button>
          </div>
        )}

        <AdBanner />
      </div>
    </div>
  );
};

export default CaptionGenerator;
