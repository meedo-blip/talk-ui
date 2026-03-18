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
            if(containerRef.current.scrollHeight - containerRef.current.scrollTop > containerRef.current.clientHeight + 100) {
                console.log("User is not near the bottom, skipping auto-scroll.");
                return;
            }
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });

            const last = containerRef.current.lastElementChild as HTMLElement | null;
            last?.animate([
                { backgroundColor: 'color-mix(in srgb, var(--color-gray-900), darkorange)', opacity: 1 },
                { backgroundColor: 'transparent', opacity: 1 }
            ], {
                duration: 300,
                easing: 'ease-out',
            });
        }

    }, [messages]); // Re-run when children change

    return (
        <div
            ref={containerRef}
            //onScroll={(e) => console.log("current scroll top: " + e.currentTarget.scrollTop)}
            style={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="flex-1 min-h-0 overflow-y-auto space-y-2 text-sm text-gray-300"
        >
            {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-row mb-2">
                  <img
                    src={msg.sender?.image}
                    alt={msg.sender?.name}
                    className="w-13 h-13 rounded-full mr-2 antialiased"
                  />
                  <p className="text-left bg-none text-2xl">
                    <strong>{msg.sender?.name}</strong><br />
                    {msg.content}
                  </p>
                </div>
              ))}
        </div>
    );
};