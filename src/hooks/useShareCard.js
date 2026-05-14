import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

export function useShareCard() {
  const cardRef = useRef(null);

  const generateAndShare = useCallback(async (tripName) => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      width: 1080,
      height: 1080,
      scale: 1,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, 'image/png', 1.0)
    );

    const slug = tripName.toLowerCase().replace(/\s+/g, '-');
    const file = new File([blob], `wanderly-${slug}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `${tripName} · wanderly` });
    } else {
      // Fallback: direct download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wanderly-${slug}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return { cardRef, generateAndShare };
}
