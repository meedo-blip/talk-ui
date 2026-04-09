
import { Message } from '@/types/types';
import { useEffect, useRef } from 'react';
    
interface ScrollAnimationProps {
    messages: Message[];
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ messages }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    let isInitialLoad = true;

    useEffect(() => {
        console.log("Messages updated, scrolling to bottom...");
        if (containerRef.current) {
            if (isInitialLoad) {
                isInitialLoad = false;
                containerRef.current?.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            } else if (containerRef.current.scrollHeight - containerRef.current.scrollTop > containerRef.current.clientHeight + 100) {
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
    }, [messages]);

    return (
        <div
            ref={containerRef}
            style={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="flex-1 min-h-0 overflow-y-auto space-y-1 text-sm text-gray-300"
        >
            {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-row flex-wrap items-start gap-2 mb-1">
                  <img
                    src={msg.sender?.details?.image}
                    alt={msg.sender?.details?.name}
                    className="w-10 h-10 rounded-full flex-shrink-0 antialiased"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-left bg-none text-sm font-semibold break-words whitespace-pre-wrap">
                      {msg.sender?.details?.name}
                    </p>
                    <p className="text-left text-base break-words whitespace-pre-wrap leading-6">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
        </div>
    );
};