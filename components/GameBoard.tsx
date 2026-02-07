import React, { useState, useEffect, useRef } from "react";
import { GameState } from "../App";

interface Props {
  gameState: GameState;
  onExplode: (mission: string, title: string) => void;
  direction: "CW" | "CCW";
}

const MISSIONS = [
  "Uống cạn 1 ly!",
  "Uống nửa ly rồi mời người kế tiếp.",
  "Người bên trái uống thay bạn.",
  "Người bên phải uống thay bạn.",
  "Cả mâm cùng cạn ly!",
  "Đối diện bạn uống 1 ly!",
  "Thoát nạn! Người vừa truyền cho bạn phải uống.",
  "Uống gấp đôi!",
];

const TITLES = [
  "BÙM! CHẾT OAN RỒI!",
  "XONG ĐỜI!",
  "DỪNG LẠI!",
  "TỚI CÔNG CHUYỆN!",
  "HẾT GIỜ!",
];

const GameBoard: React.FC<Props> = ({ gameState, onExplode, direction }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState === "PLAYING") {
      // Random thời gian từ 5 - 15 giây
      const duration = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const tick = () => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          const randomMission =
            MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
          const randomTitle = TITLES[Math.floor(Math.random() * TITLES.length)];
          onExplode(randomMission, randomTitle);
        } else {
          setTimeLeft(diff / 1000);
          timerRef.current = requestAnimationFrame(tick);
        }
      };

      timerRef.current = requestAnimationFrame(tick);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [gameState, onExplode]);

  // Tính toán độ rung lắc dựa trên thời gian còn lại
  const shakeIntensity =
    gameState === "PLAYING" ? Math.max(0, (15 - timeLeft) / 3) : 0;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Vòng xoay hướng */}
      {gameState === "PLAYING" && (
        <div
          className={`absolute inset-0 border-4 border-dashed border-orange-500/20 rounded-full ${direction === "CW" ? "animate-spin-slow" : "animate-spin-reverse-slow"}`}
        ></div>
      )}

      {/* Quả bom / Ly rượu */}
      <div
        style={{
          transform:
            gameState === "PLAYING"
              ? `translate(${Math.random() * shakeIntensity - shakeIntensity / 2}px, ${Math.random() * shakeIntensity - shakeIntensity / 2}px) scale(${1 + (15 - timeLeft) * 0.02})`
              : "scale(1)",
          transition: "transform 0.05s linear",
        }}
        className={`relative z-10 w-48 h-48 bg-gradient-to-b from-slate-800 to-black rounded-full flex items-center justify-center shadow-2xl border-4 ${gameState === "PLAYING" ? "border-red-600" : "border-slate-700"}`}
      >
        <div className="text-7xl select-none">
          {gameState === "PLAYING" ? "💣" : "🍷"}
        </div>

        {/* Ngòi nổ */}
        {gameState === "PLAYING" && (
          <div className="absolute -top-4 right-1/4 w-2 h-8 bg-slate-600 origin-bottom transform rotate-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full blur-sm animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Hiệu ứng sóng âm */}
      {gameState === "PLAYING" && (
        <>
          <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping"></div>
          <div className="absolute inset-[-20px] bg-orange-600/10 rounded-full animate-ping [animation-delay:0.5s]"></div>
        </>
      )}
    </div>
  );
};

export default GameBoard;
