import { Search, Image, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef } from "react";
import { CoolMode } from "./ui/cool-mode";
import { useToast } from "./ui/use-toast";

interface SearchBarProps {
  onSubmit?: (query: string, image?: File) => void;
  setIsChatVisible?: (isVisible: boolean) => void;
  handleSendMessage?: (query: string, image?: File) => void;
}

export const SearchBar = ({ onSubmit, setIsChatVisible, handleSendMessage }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((query.trim() || selectedImage) && onSubmit) {
      if (setIsChatVisible) {
        setIsChatVisible(true);
      }
      onSubmit(query, selectedImage || undefined);
      setQuery("");
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const startRecording = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        
        toast({
          title: "Voice input received",
          description: "Your speech has been converted to text!",
        });
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Failed to process voice input. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now... Click the microphone again to stop.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Speech recognition not supported in this browser.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Type your question"
          className="w-full pl-4 pr-32 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/40 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute right-2 flex gap-2">
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <CoolMode>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${selectedImage ? 'text-primary' : ''}`}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Image className="h-5 w-5" />
            </Button>
          </CoolMode>
          <CoolMode>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
              onClick={toggleRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </CoolMode>
          <CoolMode>
            <Button type="submit" className="px-6">
              <Search className="h-5 w-5" />
            </Button>
          </CoolMode>
        </div>
      </div>
      {selectedImage && (
        <div className="mt-2 p-2 bg-secondary rounded-lg">
          <p className="text-sm text-secondary-foreground">
            Selected image: {selectedImage.name}
          </p>
        </div>
      )}
    </form>
  );
};