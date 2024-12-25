import { Brain, Clock, CheckCircle, ReceiptIndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { ChatInterface } from "./../components/ChatInterface";
import { SearchBar } from "./../components/SearchBar";
import { FeatureCard } from "./../components/FeatureCard";
import { StatCard } from "./../components/StatCard";
import Meteors from "./../components/ui/meteors";
import { BorderBeam } from "./../components/ui/border-beam";
import MorphingText from "@/components/magicui/morphing-text";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { Footer } from "@/components/Footer";

const texts = [
  "Hello,",
  "DoubtGPT",
];

const Index = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialImage, setInitialImage] = useState<File | undefined>();

  const handleSearchSubmit = (query: string, image?: File) => {
    setInitialQuery(query);
    setInitialImage(image);
  };

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const searchBar = document.querySelector('.search-container');
      if (searchBar && event.target instanceof Node && searchBar.contains(event.target)) {
        return;
      }
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const imageFile = files[0];
        if (imageFile.type.startsWith('image/')) {
          handleSearchSubmit("", imageFile);
        }
      }
    };

    const handlePaste = async (event: ClipboardEvent) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                event.preventDefault();
                const blob = await new Promise<Blob | null>((resolve) => {
                  item.getAsString(async (data) => {
                    if (data) {
                      const byteString = atob(data.split(',')[1]);
                      const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
                      const ab = new ArrayBuffer(byteString.length);
                      const ia = new Uint8Array(ab);
                      for (let i = 0; i < byteString.length; i++) {
                          ia[i] = byteString.charCodeAt(i);
                      }
                      resolve(new Blob([ab], { type: mimeString }));
                    } else {
                      resolve(null);
                    }
                  });
                });
                if (blob) {
                  handleSearchSubmit("", blob as File);
                }
                return;
            }
        }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-secondary bg-background md:shadow-xl">
      <Meteors number={30} />
      <div className="container px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <MorphingText texts={texts} />
          <p className="text-xl text-muted-foreground">
            Padhlo chahe kahin se, doubts poocho yahin se.
          </p>
        </div>

        {/* Search/Chat Section with smooth transitions */}
        <div 
          className={`
            transition-all duration-500 ease-in-out transform
            ${isChatVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {isChatVisible ? (
            <ChatInterface initialQuery={initialQuery} initialImage={initialImage} />
          ) : null}
        </div>

        <div 
          className={`
            search-container transition-all duration-500 ease-in-out transform
            ${isChatVisible ? 'scale-95 opacity-0 hidden' : 'scale-100 opacity-100'}
          `}
        >
          <SearchBar onSubmit={handleSearchSubmit} setIsChatVisible={setIsChatVisible} />
        </div>

        {/* Meet the Creator Button */}
        <div className="flex justify-center mt-8">
          <a 
            href="https://bento.me/arnavsingh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              className="group relative overflow-hidden rounded-full px-6 py-2 transition-all duration-300 
              hover:shadow-xl shadow-lg bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 
              hover:shadow-purple-100/50 text-purple-800"
            >
              <PartyPopper className="mr-2 h-5 w-5 inline-block" />
              <span>Meet the Creator</span>
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </a>
        </div>

        {/* Features Section with hover effects */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 mt-16">  {/* Changed mb-16 to mb-8 */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <FeatureCard
              icon={Brain}
              title="AI Generated Solutions"
              description="Get detailed, step-by-step solutions to complex academic problems."
            />
            
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <FeatureCard
              icon={CheckCircle}
              title="Multiple Learning Formats"
              description="Support for text, images, and formulas. Upload screenshots or type your questions in any format."
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <FeatureCard
              icon={ReceiptIndianRupee}
              title="100% FREE"
              description="This application is made by a student for students, and is completely free to use."
            />
          </div>
          
        </div>

        {/* Stats Section with glass morphism effect */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in -mt-4" style={{ animationDelay: "0.8s" }}> {/* Added -mt-4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="1K+" label="Questions Solved" />
            <StatCard value="100+" label="Happy Students" />
            <StatCard value="3+" label="Subjects Covered" />
            <StatCard value="95%" label="Accuracy Rate" />
          </div>
          <BorderBeam size={250} duration={12} delay={0} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
