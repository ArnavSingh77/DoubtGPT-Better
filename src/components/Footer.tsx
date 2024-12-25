export const Footer = () => {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <a 
            href="https://bento.me/arnavsingh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            @arnavsingh
          </a>
          <span>•</span>
          <a 
            href="https://pzfrmzw1s3a.typeform.com/to/zxkfXD86?utm_source=xxxxx"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            Bugs, Feedback, Suggestions?
          </a>
        </div>
        
        <div className="text-xs">
          Built with ❤️ by a fellow JEEtard.
        </div>
      </div>
    </footer>
  );
};
