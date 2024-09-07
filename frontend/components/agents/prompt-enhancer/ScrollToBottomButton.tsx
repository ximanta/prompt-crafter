import { useState, useEffect } from "react"
import { ArrowDownIcon } from 'lucide-react'

export function ScrollToBottomButton() {
    
        const [isVisible, setIsVisible] = useState(false);
      
        useEffect(() => {
          const toggleVisibility = () => {
            if (window.pageYOffset > 100) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          };
      
          window.addEventListener('scroll', toggleVisibility);
          toggleVisibility();
      
          return () => window.removeEventListener('scroll', toggleVisibility);
        }, []);
      
        const scrollToBottom = () => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        };
      
        return (
          <>
            {isVisible && (
              <button
                onClick={scrollToBottom}
                className="fixed bottom-5 right-5 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                aria-label="Scroll to bottom"
              >
                <ArrowDownIcon size={24} />
              </button>
            )}
          </>
        );
      };
    