import { useState, useEffect, useRef } from "react";

/**
 * TypeWriter — reveals text character by character.
 *
 * Props:
 *   text       — the full string to reveal
 *   speed      — ms per character (default 18)
 *   onComplete — callback when reveal finishes
 *   className  — optional CSS class
 */
export default function TypeWriter({ text, speed = 18, onComplete, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset on new text
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(false);
    indexRef.current = 0;

    if (!text) {
      setDone(true);
      onComplete?.();
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor">|</span>}
    </span>
  );
}
