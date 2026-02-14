import React, { useState } from 'react';
import { TarotCardData } from '../types';

interface CardProps {
  card: TarotCardData;
  isRevealed: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  index: number;
  mode: 'deck' | 'spread' | 'static';
  totalCards?: number; 
}

const Card: React.FC<CardProps> = ({ card, isRevealed, isReversed = false, onClick, isSelected, index, mode }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Directly use the image URL from card data
  const imageSrc = card.image;

  // Custom styles for specific modes
  const getCustomStyle = () => {
    if (mode === 'spread') {
      return {
        transform: isSelected ? 'translateY(-40px) scale(1.1)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        zIndex: isSelected ? 100 : index,
      };
    }
    if (mode === 'deck') {
      return {
        transform: `translate(${index * 0.5}px, ${index * 0.5}px)`,
        zIndex: index,
        position: 'absolute' as const,
        left: '50%',
        top: '50%',
        marginLeft: '-64px',
        marginTop: '-96px',
      };
    }
    return {};
  };

  const baseClasses = `
    relative w-32 h-48 cursor-pointer perspective-1000 select-none
    ${mode === 'static' ? 'transition-all duration-500' : ''}
  `;

  return (
    <div 
      className={baseClasses}
      style={getCustomStyle()}
      onClick={onClick}
    >
      <div 
        className={`
          w-full h-full relative transform-style-3d transition-transform duration-700 shadow-2xl rounded-xl
          ${isSelected && !isRevealed ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black' : ''}
        `}
        style={{ 
            // Only handle the FLIP (Reveal) here. 
            transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Card Back - Pure CSS Implementation (No External Images) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-slate-700 bg-slate-900 z-10 shadow-lg group">
           {/* Dark Gradient Base */}
           <div className="w-full h-full bg-slate-900 relative overflow-hidden">
             
             {/* Intricate Pattern Background */}
             <div className="absolute inset-0 opacity-30" style={{
                 backgroundImage: `radial-gradient(circle at 50% 50%, #334155 1px, transparent 1px), radial-gradient(circle at 0% 0%, #334155 1px, transparent 1px)`,
                 backgroundSize: '16px 16px',
                 backgroundPosition: '0 0, 8px 8px'
             }}></div>

             {/* Mystical Central Circle */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-yellow-700/50 flex items-center justify-center bg-black/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <div className="w-16 h-16 rounded-full border border-yellow-800/60 flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600/80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z" />
                    </svg>
                </div>
             </div>

             {/* Corner Ornaments */}
             <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-800/60 rounded-tl-sm"></div>
             <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-800/60 rounded-tr-sm"></div>
             <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-800/60 rounded-bl-sm"></div>
             <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-800/60 rounded-br-sm"></div>

             {/* Inner Border */}
             <div className="absolute inset-1 border border-slate-600/30 rounded-lg"></div>
           </div>
        </div>

        {/* Card Front */}
        <div 
            className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden bg-white border border-yellow-900 shadow-md"
            style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full flex items-center justify-center bg-slate-100 relative">
             {isLoading && !imgError && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                 <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
             )}
             
             {!imgError && imageSrc ? (
                 <img 
                  src={imageSrc} 
                  alt={card.name} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ transform: isRevealed && isReversed ? 'rotate(180deg)' : 'none' }}
                  loading="eager"
                  draggable={false}
                  referrerPolicy="no-referrer"
                  onLoad={() => setIsLoading(false)}
                  onError={(e) => {
                      console.error("Image Load Error:", card.englishName, imageSrc);
                      setImgError(true);
                      setIsLoading(false);
                  }}
                />
             ) : (
                 <div className="flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#fcf9f2] text-slate-800 border-4 border-double border-slate-300">
                    <div className="text-2xl mb-2">
                        {card.suit === '權杖' && '🪄'}
                        {card.suit === '聖杯' && '🏆'}
                        {card.suit === '寶劍' && '⚔️'}
                        {card.suit === '錢幣' && '🪙'}
                        {card.suit === '無' && '🃏'}
                    </div>
                    <span className="text-slate-900 font-bold font-mystic text-sm leading-tight">{card.name}</span>
                    <span className="text-slate-500 text-[10px] mt-1 italic">{card.englishName}</span>
                    <div className="mt-2 text-[9px] text-slate-400 border-t border-slate-300 pt-1 w-full">
                        {card.keywords[0]} • {card.keywords[1]}
                    </div>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;