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
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login or Sign up</DialogTitle>
              <DialogDescription>
                Login to save your chat history
              </DialogDescription>
            </DialogHeader>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="outline" onClick={handleSignOut} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      )}
    </div>
  );
};