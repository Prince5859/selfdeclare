import { forwardRef } from "react";
import baseDocument from "@/assets/self-declaration-base.jpg";

interface GovDocumentPreviewProps {
  applicantName: string;
  fatherName: string;
  age: string;
  occupation: string;
  address: string;
  place: string;
  date: string;
  showNewYearBadge?: boolean;
}

const GovDocumentPreview = forwardRef<HTMLDivElement, GovDocumentPreviewProps>(
  ({ applicantName, fatherName, age, occupation, address, place, date, showNewYearBadge }, ref) => {
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const yr = d.getFullYear();
      return `${day}/${month}/${yr}`;
    };

    return (
      <div
        ref={ref}
        className="gov-document-paper relative"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "595px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Base scanned document image */}
        <img
          src={baseDocument}
          alt="Self Declaration Form"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        {/* New Year Badge - Only visible in preview, not in download */}
        {showNewYearBadge && (
          <div
            className="absolute top-2 right-2 text-[10px] font-medium px-2 py-1 rounded z-10 flex items-center gap-1 print:hidden"
            data-html2canvas-ignore="true"
            style={{
              background:
                "linear-gradient(135deg, hsl(45 100% 55% / 0.2), hsl(45 100% 65% / 0.3))",
              color: "hsl(40 100% 35%)",
              border: "1px solid hsl(45 100% 55% / 0.4)",
            }}
          >
            <span>✨</span> Happy New Year 2026
          </div>
        )}

        {/* Text overlays - positioned precisely on dotted lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
            color: "#1a1a1a",
            fontSize: "13px",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          {/* Name after "मैं" */}
          {applicantName && (
            <div
              style={{
                position: "absolute",
                top: "22.9%",
                left: "11.5%",
                maxWidth: "41%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {applicantName}
            </div>
          )}

          {/* Father/Husband name after "पुत्र/पुत्री/श्री" */}
          {fatherName && (
            <div
              style={{
                position: "absolute",
                top: "22.9%",
                left: "58.8%",
                maxWidth: "31%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {fatherName}
            </div>
          )}

          {/* Age on "उम्र ...... वर्ष" */}
          {age && (
            <div
              style={{
                position: "absolute",
                top: "26.55%",
                left: "13.9%",
                maxWidth: "10%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {age}
            </div>
          )}

          {/* Occupation after "व्यवसाय" */}
          {occupation && (
            <div
              style={{
                position: "absolute",
                top: "26.55%",
                left: "31.3%",
                maxWidth: "25%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {occupation}
            </div>
          )}

          {/* Address after "निवासी" */}
          {address && (
            <div
              style={{
                position: "absolute",
                top: "26.55%",
                left: "60.8%",
                maxWidth: "34%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {address}
            </div>
          )}

          {/* Place after "स्थान" */}
          {place && (
            <div
              style={{
                position: "absolute",
                top: "52.1%",
                left: "13.8%",
                maxWidth: "22%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {place}
            </div>
          )}

          {/* Date after "दिनांक" */}
          {date && (
            <div
              style={{
                position: "absolute",
                top: "55.6%",
                left: "13.8%",
                maxWidth: "22%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {formatDate(date)}
            </div>
          )}

          {/* Applicant name at bottom right line */}
          {applicantName && (
            <div
              style={{
                position: "absolute",
                top: "55.6%",
                left: "71.5%",
                maxWidth: "24%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {applicantName}
            </div>
          )}
        </div>
      </div>
    );
  }
);

GovDocumentPreview.displayName = "GovDocumentPreview";

export default GovDocumentPreview;
