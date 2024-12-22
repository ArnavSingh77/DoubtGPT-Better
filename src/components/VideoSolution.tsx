import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Video } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface VideoSolutionProps {
  text: string;
}

export const VideoSolution = ({ text }: VideoSolutionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateVideo = async () => {
    setIsGenerating(true);
    try {
      // Create a new SpeechSynthesisUtterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Create an audio context
      const audioContext = new AudioContext();
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(mediaStream);
      const audioChunks: BlobPart[] = [];

      // Record the speech
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVideoUrl(audioUrl);
        setIsGenerating(false);
        toast({
          title: "Video Generated",
          description: "Your explanation video is ready!",
        });
      };

      // Start recording and speaking
      mediaRecorder.start();
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        mediaRecorder.stop();
        mediaStream.getTracks().forEach(track => track.stop());
      };

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
          <audio controls src={videoUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};