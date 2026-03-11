import { useState } from 'react';

const HoverLabel = (
    { children, label } : { children: React.ReactNode, label: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{ position: 'relative', display: 'inline-block' }}
    >
      
      {children}
      {isHovered && (
        <span className='bg-gray-600' 
        style={{
          position: 'absolute',
          zIndex: 100,
          left: '150%',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--color-gray-700)',
          padding: '5px',
          borderRadius: '3px'
        }}
        >
          {label}
          <span style={{
          position: 'absolute',
          zIndex: 100,
          right: '100%',
          top: '50%',
          width: '10px',
          height: '10px',
          clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--color-gray-700)',
        }}></span>
        </span>
        
      )}
    </div>
  );
};

export default HoverLabel;