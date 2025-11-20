import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ICONS } from '../constants';

// Declare native API for TypeScript
declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  static getSupportedFormats(): Promise<string[]>;
  detect(image: ImageBitmapSource): Promise<any[]>;
}

interface ScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionLoopRef = useRef<number | null>(null);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (detectionLoopRef.current) {
      cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Check for BarcodeDetector support (Android standard)
        if (!('BarcodeDetector' in window)) {
            // Note: In a real production app, you would load a polyfill or jsQR here.
            // For this standalone example, we enforce native support.
            throw new Error("Este dispositivo não suporta a API nativa de leitura de códigos. Tente usar o Chrome atualizado no Android.");
        }

        // 2. Get Camera Stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          await new Promise((resolve) => {
             if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => resolve(true);
             }
          });
          await videoRef.current.play();
          
          // 3. Start Detection Loop
          // @ts-ignore - Native API
          const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
          
          const detect = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                if (rawValue) {
                   stopScanner();
                   onScan(rawValue);
                   return; // Stop loop
                }
              }
            } catch (e) {
              // Detection errors are usually transient frames, ignore
            }
            
            detectionLoopRef.current = requestAnimationFrame(detect);
          };

          detect();
          setLoading(false);
        }

      } catch (err: any) {
        console.error(err);
        setError(err.name === 'NotAllowedError' 
          ? 'Permissão da câmera negada. Por favor, ative nas configurações.' 
          : err.message || 'Erro ao acessar a câmera.');
        setLoading(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan, stopScanner]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Header / Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/70 to-transparent">
        <span className="text-white font-semibold drop-shadow-md">Escaneando...</span>
        <button 
          onClick={onClose}
          className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition"
        >
          {ICONS.CLOSE}
        </button>
      </div>

      {/* Video Feed */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover"
          playsInline 
          muted
        />
        
        {/* Overlay Guide */}
        {!error && !loading && (
           <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-primary/50 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-10">
             {/* Corner accents */}
             <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl -mt-1 -ml-1"></div>
             <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl -mt-1 -mr-1"></div>
             <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl -mb-1 -ml-1"></div>
             <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl -mb-1 -mr-1"></div>
             
             {/* Scan animation */}
             <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_infinite_ease-in-out]"></div>
           </div>
        )}

        {/* Feedback States */}
        {loading && (
           <div className="z-20 text-white flex flex-col items-center gap-2">
             <div className="w-8 h-8 border-4 border-white/30 border-t-primary rounded-full animate-spin"></div>
             <p className="text-sm font-medium">Iniciando câmera...</p>
           </div>
        )}
        
        {error && (
          <div className="z-20 px-6 text-center max-w-md">
            <div className="bg-red-500/90 backdrop-blur-sm p-4 rounded-xl text-white shadow-xl">
              <p className="font-bold mb-1">Ops!</p>
              <p>{error}</p>
              <button onClick={onClose} className="mt-4 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm">
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
