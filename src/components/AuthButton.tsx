import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";

export const AuthButton = () => {
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!session ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="group relative overflow-hidden rounded-full px-6 py-2 
                transition-all duration-300 hover:shadow-xl shadow-lg 
                bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#8B5CF6]
                hover:shadow-purple-400/30 text-white border-none
                animate-fade-in hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6BCFA] via-[#9b87f5] to-[#8B5CF6] 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <LogIn className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Login
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
                Login or Sign up
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Login to save your chat history
              </DialogDescription>
            </DialogHeader>
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#8B5CF6',
                      brandAccent: '#7E69AB',
                    },
                  },
                },
              }}
              theme="light"
              providers={[]}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleSignOut} 
          className="group relative overflow-hidden rounded-full px-6 py-2 
            transition-all duration-300 hover:shadow-xl shadow-lg 
            bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600
            hover:shadow-rose-400/30 text-white border-none
            animate-fade-in hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            <LogOut className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            Logout
          </span>
        </Button>
      )}
    </div>
  );
};