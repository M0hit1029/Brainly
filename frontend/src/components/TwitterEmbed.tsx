import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twttr?: any;
  }
}

export const TwitterEmbed = ({ link }: { link: string }) => {
  const tweetContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Load Twitter widgets.js if not already loaded
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
    }
  }, [link]); // Runs every time link changes

  return (
    <div ref={tweetContainer}>
      <blockquote className="twitter-tweet">
        <a href={link}></a>
      </blockquote>
    </div>
  );
};
