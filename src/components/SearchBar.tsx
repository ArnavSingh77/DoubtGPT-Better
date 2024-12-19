import { Search, Image } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef } from "react";

interface SearchBarProps {
  onSubmit?: (query: string, imageFile?: File) => void;
}

export const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((query.trim() || selectedImage) && onSubmit) {
      onSubmit(query, selectedImage || undefined);
      setQuery("");
      setSelectedImage(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Type your question"
          className="w-full pl-4 pr-32 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/40 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="absolute right-2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`hover:bg-primary/10 ${selectedImage ? 'text-primary' : ''}`}
            onClick={handleImageClick}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button type="submit" className="px-6">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {selectedImage && (
        <div className="mt-2 text-sm text-muted-foreground">
          Selected image: {selectedImage.name}
        </div>
      )}
    </form>
  );
};