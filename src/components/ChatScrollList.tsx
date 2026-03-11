"use client";
import { Message } from '@/types/types';
import { useEffect, useRef } from 'react';
    
interface ScrollAnimationProps {
    messages: Message[];
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ messages }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("Messages updated, scrolling to bottom...");
        //console.log("containerRef:", containerRef.current);
        if (containerRef.current) {
                    containerRef.current.scrollTo({
                        top: containerRef.current.scrollHeight,
                        behavior: 'smooth',
                    });

                    containerRef.current.lastChild?.animate([
                        { backgroundColor: 'color-mix(in srgb, var(--color-gray-900), darkorange)', opacity: 1 },
                        { backgroundColor: 'transparent', opacity: 1 }
                    ], {
                        duration: 300,
                        easing: 'ease-out' 
                    });
                        
        }

    }, [messages]); // Re-run when children change

    return (
        <div
            ref={containerRef}            
            style={{
                overflowY: 'auto',
                height: 'calc(100% -7.1rem)',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="absolute bottom-14 z-[1] w-[calc(100%-7.1rem)] bg-none text-sm text-gray-400"
        >
            {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-row mb-2">
                  <img
                    src={msg.sender?.image}
                    alt={msg.sender?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p>
                    <strong>{msg.sender?.name }</strong><br />
                    {msg.content}
                  </p>
                </div>
              ))}
        </div>
    );
};