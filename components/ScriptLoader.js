'use client';
import { useEffect } from 'react';

export default function ScriptLoader({ src, id, onLoad }) {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.getElementById(id);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      
      // Add onload handler if provided
      if (onLoad) {
        script.onload = onLoad;
      }
      
      document.body.appendChild(script);
      
      // Cleanup function to remove script when component unmounts
      return () => {
        const scriptToRemove = document.getElementById(id);
        if (scriptToRemove) {
          document.body.removeChild(scriptToRemove);
        }
      };
    } else if (onLoad) {
      // If script already exists and onLoad handler is provided, call it
      onLoad();
    }
  }, [src, id, onLoad]);
  
  return null;
}