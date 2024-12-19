import { Search, Image } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSubmit?: (query: string, image?: File) => void;
}

export const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const maxLength = 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((query.trim() || selectedImage) && onSubmit) {
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

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Type your question"
          className="w-full pl-4 pr-32 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/40 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={maxLength}
        />
        <div className="absolute right-2 flex gap-2 items-center">
          <span className="text-xs text-muted-foreground mr-2">
            {query.length}/{maxLength}
          </span>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`hover:bg-primary/10 ${selectedImage ? 'text-primary' : ''}`}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button type="submit" className="px-6">
            <Search className="h-5 w-5" />
          </Button>
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