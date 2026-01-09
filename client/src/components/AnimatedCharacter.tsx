import React, { useState, useEffect, useRef } from "react";

interface AnimatedCharacterProps {
  showPassword: boolean;
  isTypingPassword: boolean;
  errorTrigger?: number;
}

export default function AnimatedCharacter({ showPassword, isTypingPassword, errorTrigger = 0 }: AnimatedCharacterProps) {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [shaking, setShaking] = useState(false);
  const characterRef = useRef(null);

  useEffect(() => {
    if (errorTrigger > 0) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [errorTrigger]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const element = characterRef.current as HTMLDivElement | null;
      if (element && !showPassword && !isTypingPassword) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const maxMove = 8;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(maxMove, distance / 20) : 0;
        const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(maxMove, distance / 20) : 0;
        
        setEyePosition({ x: normalizedX, y: normalizedY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showPassword, isTypingPassword]);

  return (
    <div ref={characterRef} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <svg 
        width="280" 
        height="280" 
        viewBox="0 0 280 280" 
        style={{ 
          overflow: "visible",
          animation: shaking ? "headShake 0.5s ease-in-out" : "none"
        }}
      >
        <style>{`
          @keyframes headShake {
            0%, 100% { transform: translateX(0) rotate(0); }
            15% { transform: translateX(-12px) rotate(-5deg); }
            30% { transform: translateX(10px) rotate(4deg); }
            45% { transform: translateX(-8px) rotate(-3deg); }
            60% { transform: translateX(6px) rotate(2deg); }
            75% { transform: translateX(-4px) rotate(-1deg); }
          }
        `}</style>
        <defs>
          <clipPath id="leftEyeClip">
            <ellipse cx="110" cy="115" rx="22" ry="24" />
          </clipPath>
          <clipPath id="rightEyeClip">
            <ellipse cx="170" cy="115" rx="22" ry="24" />
          </clipPath>
        </defs>
        
        {/* Body */}
        <ellipse cx="140" cy="220" rx="70" ry="45" fill="#6366f1" />
        <ellipse cx="120" cy="210" rx="25" ry="15" fill="#818cf8" opacity="0.5" />
        
        {/* Head */}
        <circle cx="140" cy="120" r="80" fill="#fcd34d" />
        <ellipse cx="100" cy="90" rx="30" ry="20" fill="#fef08a" opacity="0.6" />
        
        {/* Ears */}
        <ellipse cx="70" cy="70" rx="25" ry="30" fill="#fcd34d" />
        <ellipse cx="70" cy="70" rx="15" ry="18" fill="#fbbf24" />
        <ellipse cx="210" cy="70" rx="25" ry="30" fill="#fcd34d" />
        <ellipse cx="210" cy="70" rx="15" ry="18" fill="#fbbf24" />
        
        {/* Face area */}
        <ellipse cx="140" cy="135" rx="55" ry="45" fill="#fef3c7" />
        
        {/* Left eye white */}
        <ellipse cx="110" cy="115" rx="22" ry="24" fill="white" />
        {/* Right eye white */}
        <ellipse cx="170" cy="115" rx="22" ry="24" fill="white" />
        
        {/* Pupils - hidden when password visible */}
        <g style={{
          opacity: showPassword ? 0 : 1,
          transition: "opacity 0.25s ease"
        }}>
          {/* Left pupil */}
          <circle 
            cx={110 + eyePosition.x} 
            cy={115 + (isTypingPassword ? 3 : eyePosition.y)}
            r={isTypingPassword ? 10 : 12}
            fill="#1f2937"
            style={{ transition: "all 0.2s ease-out" }}
          />
          <circle 
            cx={106 + eyePosition.x} 
            cy={111 + (isTypingPassword ? 3 : eyePosition.y)}
            r={isTypingPassword ? 3 : 4}
            fill="white"
            style={{ transition: "all 0.2s ease-out" }}
          />
          
          {/* Right pupil */}
          <circle 
            cx={170 + eyePosition.x} 
            cy={115 + (isTypingPassword ? 3 : eyePosition.y)}
            r={isTypingPassword ? 10 : 12}
            fill="#1f2937"
            style={{ transition: "all 0.2s ease-out" }}
          />
          <circle 
            cx={166 + eyePosition.x} 
            cy={111 + (isTypingPassword ? 3 : eyePosition.y)}
            r={isTypingPassword ? 3 : 4}
            fill="white"
            style={{ transition: "all 0.2s ease-out" }}
          />
        </g>
        
        {/* Eyelids - slide down to cover eyes */}
        {/* Left eyelid */}
        <ellipse 
          cx="110" 
          cy={showPassword ? 115 : 75}
          rx="24" 
          ry="26" 
          fill="#fcd34d"
          style={{ 
            transition: "cy 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          clipPath="url(#leftEyeClip)"
        />
        {/* Right eyelid */}
        <ellipse 
          cx="170" 
          cy={showPassword ? 115 : 75}
          rx="24" 
          ry="26" 
          fill="#fcd34d"
          style={{ 
            transition: "cy 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          clipPath="url(#rightEyeClip)"
        />
        
        {/* Eyelid lines (closed eye lines) */}
        <path 
          d="M88 115 Q110 120, 132 115" 
          stroke="#92400e" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
          style={{
            opacity: showPassword ? 1 : 0,
            transition: "opacity 0.2s ease 0.15s"
          }}
        />
        <path 
          d="M148 115 Q170 120, 192 115" 
          stroke="#92400e" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
          style={{
            opacity: showPassword ? 1 : 0,
            transition: "opacity 0.2s ease 0.15s"
          }}
        />
        
        {/* Eyebrows */}
        <path 
          d={shaking 
            ? "M92 92 Q110 100, 128 92"
            : isTypingPassword 
              ? "M92 100 Q110 96, 128 100" 
              : "M88 95 Q110 88, 132 95"}
          stroke="#92400e" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
          style={{ transition: "d 0.3s ease" }}
        />
        <path 
          d={shaking 
            ? "M152 92 Q170 100, 188 92"
            : isTypingPassword 
              ? "M152 100 Q170 96, 188 100" 
              : "M148 95 Q170 88, 192 95"}
          stroke="#92400e" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
          style={{ transition: "d 0.3s ease" }}
        />
        
        {/* Blush - small and subtle */}
        <circle 
          cx="80" cy="138" r="8" fill="#fca5a5" 
          style={{
            opacity: showPassword ? 0.4 : 0,
            transition: "opacity 0.3s ease 0.1s"
          }}
        />
        <circle 
          cx="200" cy="138" r="8" fill="#fca5a5"
          style={{
            opacity: showPassword ? 0.4 : 0,
            transition: "opacity 0.3s ease 0.1s"
          }}
        />
        
        {/* Nose */}
        <ellipse cx="140" cy="138" rx="8" ry="6" fill="#fbbf24" />
        
        {/* Mouth - morphs between states */}
        <path 
          d={shaking 
            ? "M120 165 Q140 152, 160 165"
            : showPassword 
              ? "M125 158 Q140 165, 155 158" 
              : isTypingPassword 
                ? "M130 155 Q140 162, 150 155"
                : "M120 155 Q140 172, 160 155"
          }
          stroke="#92400e" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
          style={{ transition: "d 0.3s ease" }}
        />
        
        {/* Arms on body */}
        <ellipse cx="85" cy="210" rx="20" ry="25" fill="#6366f1" />
        <ellipse cx="195" cy="210" rx="20" ry="25" fill="#6366f1" />
        
        {/* Feet */}
        <ellipse cx="110" cy="255" rx="25" ry="12" fill="#4f46e5" />
        <ellipse cx="170" cy="255" rx="25" ry="12" fill="#4f46e5" />
      </svg>
      
      <p style={{
        marginTop: "1rem",
        fontSize: "1.1rem",
        fontWeight: "600",
        color: shaking ? "#ef4444" : "#6366f1",
        textAlign: "center",
        transition: "color 0.2s ease",
        minHeight: "1.5em"
      }}>
        {shaking 
          ? "Oops! Try again :("
          : showPassword 
            ? "I'm not looking! 🙈" 
            : isTypingPassword 
              ? "Typing secret... 🤫" 
              : "Hi there! 👋"}
      </p>
    </div>
  );
}
