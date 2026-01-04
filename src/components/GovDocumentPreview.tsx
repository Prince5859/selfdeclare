import { forwardRef } from "react";

interface GovDocumentPreviewProps {
  applicantName: string;
  fatherName: string;
  age: string;
  year: string;
  occupation: string;
  address: string;
  place: string;
  date: string;
  showNewYearBadge?: boolean;
}

const GovDocumentPreview = forwardRef<HTMLDivElement, GovDocumentPreviewProps>(
  ({ applicantName, fatherName, age, year, occupation, address, place, date, showNewYearBadge }, ref) => {
    
    const getDottedValue = (value: string, minDots: number = 20) => {
      if (value.trim()) {
        return value.trim();
      }
      return '.'.repeat(minDots);
    };

    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '....................';
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const yr = d.getFullYear();
      return `${day}/${month}/${yr}`;
    };

    return (
      <div
        ref={ref}
        className="gov-document-paper relative"
        style={{
          fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
          backgroundColor: '#FAFAFA',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          padding: '50px 60px',
          minHeight: '800px',
          color: '#1a1a1a',
          lineHeight: '2.2',
          fontSize: '16px',
          letterSpacing: '0.02em',
        }}
      >
        {/* New Year Badge - Only visible in preview, not in download */}
        {showNewYearBadge && (
          <div 
            className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded z-10 flex items-center gap-1 print:hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 55% / 0.2), hsl(45 100% 65% / 0.3))',
              color: 'hsl(40 100% 35%)',
              border: '1px solid hsl(45 100% 55% / 0.4)'
            }}
          >
            <span>✨</span> Happy New Year 2026
          </div>
        )}

        {/* Header Reference Number */}
        <div 
          className="text-center mb-12"
          style={{ 
            fontSize: '14px',
            color: '#333',
            opacity: 0.85
          }}
        >
          <span style={{ borderBottom: '1px solid #333' }}>
            संख्या— 874 / एक—9—2014—रा—9,दिनॉक 16 जून,2014 का संलग्नक
          </span>
        </div>

        {/* Title */}
        <h1 
          className="text-center mb-14"
          style={{ 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.1em',
            textDecoration: 'underline',
            textUnderlineOffset: '6px',
            color: '#1a1a1a'
          }}
        >
          स्वप्रमाणित घोषणा—पत्र
        </h1>

        {/* Document Body */}
        <div style={{ textAlign: 'justify', lineHeight: '2.4' }}>
          {/* Line 1: मैं ............... पुत्र/पुत्री/श्री ............... */}
          <p className="mb-1" style={{ textIndent: '2em' }}>
            मैं<span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: applicantName ? 'auto' : '280px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(applicantName, 45)}</span>पुत्र / पुत्री / श्री<span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: fatherName ? 'auto' : '200px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(fatherName, 35)}</span>
          </p>

          {/* Line 2: ...उम्र......वर्ष......व्यवसाय......निवासी...... */}
          <p className="mb-1">
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              padding: '0 4px'
            }}>..उम्र</span>
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: age ? 'auto' : '40px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(age, 6)}</span>
            <span>वर्ष</span>
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: year ? 'auto' : '50px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(year, 8)}</span>
            <span>व्यवसाय</span>
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: occupation ? 'auto' : '140px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(occupation, 22)}</span>
            <span>निवासी</span>
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: address ? 'auto' : '160px',
              padding: '0 8px',
              textAlign: 'center'
            }}>{getDottedValue(address, 25)}</span>
          </p>

          {/* Line 3: ............प्रमाणित करते हुए घोषणा करता/करती हूँ */}
          <p className="mb-4">
            <span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              width: '300px'
            }}></span>
            <span>प्रमाणित करते हुये घोषणा करता / करती हूँ</span>
          </p>

          {/* Paragraph 1 */}
          <p className="mb-4">
            कि आवेदन पत्र में दिये गये विवरण/तथ्य मेरी व्यक्तिगत जानकारी एवं विश्वास में शुद्ध एवं सत्य हैं । मैं मिथ्या विवरणों / तथ्यों को देने के परिणामों से भली–भाँति अवगत हूँ । यदि आवेदन पत्र में दिये गये कोई विवरण/तथ्य मिथ्या पाये जाते हैं,तो मैं,मेरे विरूद्ध भा०द०वि० 1960 की धारा—199 व 200 एवं प्रभावी किसी अन्य विधि के अंतर्गत अभियोजन एवं दण्ड के लिये,स्वयं उत्तरदायी होऊँगा / होऊँगी।
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-16 flex justify-between items-end">
          {/* Left side: स्थान & दिनांक */}
          <div style={{ lineHeight: '2' }}>
            <p>
              स्थान<span style={{ 
                borderBottom: '1px dotted #333',
                display: 'inline-block',
                minWidth: place ? 'auto' : '150px',
                padding: '0 8px',
                marginLeft: '8px'
              }}>{getDottedValue(place, 24)}</span>
            </p>
            <p>
              दिनॉक<span style={{ 
                borderBottom: '1px dotted #333',
                display: 'inline-block',
                minWidth: '150px',
                padding: '0 8px',
                marginLeft: '8px'
              }}>{date ? formatDate(date) : getDottedValue('', 24)}</span>
            </p>
          </div>

          {/* Right side: Signature */}
          <div style={{ textAlign: 'right' }}>
            <p className="mb-1">आवेदक / आवेदिका के हस्ताक्षर<span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              width: '100px',
              marginLeft: '8px'
            }}></span></p>
            <p>आवेदक / आवेदिका का नाम<span style={{ 
              borderBottom: '1px dotted #333',
              display: 'inline-block',
              minWidth: applicantName ? 'auto' : '100px',
              padding: '0 8px',
              marginLeft: '8px'
            }}>{getDottedValue(applicantName, 16)}</span></p>
          </div>
        </div>
      </div>
    );
  }
);

GovDocumentPreview.displayName = 'GovDocumentPreview';

export default GovDocumentPreview;
