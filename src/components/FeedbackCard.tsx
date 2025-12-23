import { useState, useEffect } from "react";
import { X, ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackCardProps {
  show: boolean;
  onClose: () => void;
}

const FEEDBACK_SESSION_KEY = "feedback_submitted";
const FEEDBACK_DATA_KEY = "feedback_data";

const FeedbackCard = ({ show, onClose }: FeedbackCardProps) => {
  const [feedbackType, setFeedbackType] = useState<"YES" | "NO" | null>(null);
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    // Check if feedback was already submitted in this session
    const hasSubmitted = sessionStorage.getItem(FEEDBACK_SESSION_KEY);
    if (hasSubmitted) {
      setAlreadySubmitted(true);
    }
  }, []);

  const reasons = [
    { id: "language", label: "भाषा समझने में कठिनाई" },
    { id: "format", label: "फॉर्मेट में समस्या" },
    { id: "download", label: "डाउनलोड से जुड़ी समस्या" },
    { id: "other", label: "अन्य" },
  ];

  const handleFeedback = (type: "YES" | "NO") => {
    setFeedbackType(type);
    if (type === "NO") {
      setShowReasons(true);
    } else {
      submitFeedback(type, []);
    }
  };

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonId)
        ? prev.filter((r) => r !== reasonId)
        : [...prev, reasonId]
    );
  };

  const submitFeedback = (type: "YES" | "NO", reasons: string[]) => {
    // Store feedback in localStorage (anonymous)
    const existingData = localStorage.getItem(FEEDBACK_DATA_KEY);
    const feedbackList = existingData ? JSON.parse(existingData) : [];
    
    feedbackList.push({
      feedbackType: type,
      selectedReason: reasons,
      timestamp: new Date().toISOString(),
    });
    
    localStorage.setItem(FEEDBACK_DATA_KEY, JSON.stringify(feedbackList));
    sessionStorage.setItem(FEEDBACK_SESSION_KEY, "true");
    
    setSubmitted(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const handleSubmitReasons = () => {
    submitFeedback("NO", selectedReasons);
  };

  const handleSkip = () => {
    submitFeedback("NO", []);
  };

  // Don't show if already submitted in session or not triggered
  if (!show || alreadySubmitted) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-30 animate-slide-up">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          // Thank you message
          <div className="text-center py-3">
            <p className="text-foreground font-medium">
              धन्यवाद! आपकी राय हमारे लिए महत्वपूर्ण है 🙏
            </p>
          </div>
        ) : showReasons ? (
          // Reasons selection (only shown after "No" click)
          <div className="space-y-4">
            <p className="text-sm text-foreground font-medium pr-6">
              कृपया बताएं किस कारण से उपयोगी नहीं लगा?
            </p>
            
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason.id}
                  className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason.id)}
                    onChange={() => handleReasonToggle(reason.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {reason.label}
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmitReasons}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                जमा करें
              </button>
              <button
                onClick={handleSkip}
                className="py-2 px-4 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
              >
                छोड़ें
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              यह फीडबैक पूरी तरह गुमनाम है
            </p>
          </div>
        ) : (
          // Initial question
          <div className="space-y-4">
            <p className="text-sm text-foreground font-medium pr-6">
              क्या यह स्वप्रमाणित घोषणा-पत्र टूल आपके लिए उपयोगी था?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleFeedback("YES")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-sm font-medium transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                👍 हाँ
              </button>
              <button
                onClick={() => handleFeedback("NO")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-sm font-medium transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                👎 नहीं
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              यह फीडबैक पूरी तरह गुमनाम है
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
