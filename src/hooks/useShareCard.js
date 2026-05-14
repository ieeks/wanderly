import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

export function useShareCard() {
  const cardRef = useRef(null);

  const generateAndShare = useCallback(async (tripName) => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 0.7,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    );

    const slug = tripName.toLowerCase().replace(/\s+/g, '-');
    const file = new File([blob], `wanderly-${slug}.jpg`, { type: 'image/jpeg' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `${tripName} · wanderly` });
    } else {
      // Fallback: direct download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wanderly-${slug}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return { cardRef, generateAndShare };
}
