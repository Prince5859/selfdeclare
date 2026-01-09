import { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAUpdatePopup = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    // Register service worker and listen for updates
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        // Check for updates immediately
        registration.update();

        // Listen for new service worker waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update popup
                setNeedRefresh(true);
              }
            });
          }
        });

        // Check if there's already a waiting service worker
        if (registration.waiting) {
          setNeedRefresh(true);
        }
      });

      // Listen for controller change (when update is applied)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // When app loads from home screen, check for updates
      if (isStandalone) {
        // Force check for updates when PWA opens
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Show install banner only if not already installed
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already offline ready
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setOfflineReady(true);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const updateServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      // Tell waiting service worker to take over
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }
      
      // The page will reload automatically when controller changes
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    // Store in session to not show again this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show install banner if dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('pwa-install-dismissed')) {
      setShowInstallBanner(false);
    }
  }, []);

  return (
    <>
      {/* Update Required Popup - Non-dismissable */}
      {needRefresh && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-border animate-fade-in">
            <div className="text-center">
              {/* Update Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-bold text-foreground mb-2">
                🔄 नया अपडेट उपलब्ध
              </h2>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                सरकारी दस्तावेज़ फॉर्मेट में नया अपडेट आया है। पुराने फॉर्मेट से बचने के लिए अभी अपडेट करें।
              </p>
              
              {/* Update Button - No close option */}
              <button
                onClick={updateServiceWorker}
                className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
              >
                <RefreshCw className="w-5 h-5" />
                अभी अपडेट करें
              </button>
              
              {/* Warning */}
              <p className="text-xs text-muted-foreground mt-4">
                ⚠️ पुराना कैश हटाकर नया संस्करण लोड होगा
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Install Banner */}
      {showInstallBanner && installPrompt && !needRefresh && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
          <div className="bg-card rounded-xl p-4 shadow-lg border border-border max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">
                  ऐप इंस्टॉल करें
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  होम स्क्रीन पर जोड़ें - बिना इंटरनेट भी चलेगा
                </p>
              </div>
              <button
                onClick={dismissInstallBanner}
                className="text-muted-foreground hover:text-foreground text-lg leading-none p-1"
              >
                ×
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={dismissInstallBanner}
                className="flex-1 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                बाद में
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium"
              >
                इंस्टॉल करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Ready Toast - Shows briefly */}
      {offlineReady && !needRefresh && !showInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-none">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs mx-auto animate-fade-in opacity-0" 
               style={{ animation: 'fadeInOut 3s ease-in-out forwards' }}>
            ✓ ऑफलाइन उपयोग के लिए तैयार
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default PWAUpdatePopup;
