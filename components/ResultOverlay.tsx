
import React from 'react';

interface Props {
  mission: string;
  title: string;
  onRestart: () => void;
}

const ResultOverlay: React.FC<Props> = ({ mission, title, onRestart }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-gradient-to-b from-red-600 to-red-900 p-8 rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,0.5)] border-2 border-white/20 text-center flex flex-col items-center">
        <div className="text-6xl mb-4 animate-bounce">💥</div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight italic">{title}</h2>
        
        <div className="w-full h-px bg-white/20 my-6"></div>
        
        <p className="text-yellow-300 text-xs font-bold uppercase tracking-[0.3em] mb-2">Hình phạt dành cho bạn:</p>
        <p className="text-2xl font-black text-white mb-10 leading-tight">
          {mission}
        </p>

        <button 
          onClick={onRestart}
          className="w-full py-4 bg-white text-red-600 font-black text-xl rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          TIẾP TỤC CUỘC VUI 🍺
        </button>
      </div>
      
      <p className="mt-8 text-white/40 text-[10px] font-medium uppercase tracking-[0.5em]">Lượt tiếp theo bắt đầu sau khi uống xong</p>
    </div>
  );
};

export default ResultOverlay;
