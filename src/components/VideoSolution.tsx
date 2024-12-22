import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2, Video } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface VideoSolutionProps {
  text: string;
}

export const VideoSolution = ({ text }: VideoSolutionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const generateVideo = async () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 640;
      canvas.height = 360;

      // Setup canvas recording
      const stream = canvas.captureStream(30); // 30 FPS
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const combinedStream = new MediaStream([
        ...stream.getTracks(),
        ...audioStream.getTracks()
      ]);

      const chunks: BlobPart[] = [];
      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsGenerating(false);
        toast({
          title: "Video Generated",
          description: "Your explanation video is ready!",
        });
      };

      // Start recording
      mediaRecorderRef.current.start();

      // Create text-to-speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Animation function
      let currentLine = 0;
      const lines = text.split('. ').filter(line => line.trim());
      const wordsPerLine = 5;
      const lineHeight = 30;

      function animate() {
        if (!ctx || currentLine >= lines.length) return;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#2a2a2a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';

        const words = lines[currentLine].split(' ');
        for (let i = 0; i < words.length; i += wordsPerLine) {
          const lineText = words.slice(i, i + wordsPerLine).join(' ');
          ctx.fillText(
            lineText,
            canvas.width / 2,
            canvas.height / 2 + (Math.floor(i / wordsPerLine) * lineHeight)
          );
        }

        requestAnimationFrame(animate);
      }

      // Start animation
      animate();

      // Handle speech events
      utterance.onend = () => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          combinedStream.getTracks().forEach(track => track.stop());
        }
      };

      utterance.onboundary = (event) => {
        if (event.charIndex) {
          const spokenText = text.substring(0, event.charIndex);
          currentLine = spokenText.split('. ').length - 1;
        }
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />
      {!videoUrl ? (
        <Button 
          onClick={generateVideo} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Generate Video Explanation
            </>
          )}
        </Button>
      ) : (
        <div className="mt-4">
          <video controls src={videoUrl} className="w-full rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};