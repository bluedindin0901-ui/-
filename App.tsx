import React, { useState, useEffect, useCallback, useRef } from 'react';
import Background from './components/Background';
import Card from './components/Card';
import { FULL_DECK, MODE_CONFIG } from './constants';
import { GameState, TarotCardData, ReadingRequest, ReadingMode, SelectedCard } from './types';
import { getTarotReading } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [deck, setDeck] = useState<TarotCardData[]>([]);
  const [question, setQuestion] = useState("");
  const [readingMode, setReadingMode] = useState<ReadingMode>(ReadingMode.SINGLE);
  
  // Stores indices from the deck
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  // Stores the final resolved card objects with reversal state
  const [finalSpread, setFinalSpread] = useState<SelectedCard[]>([]);
  
  const [readingText, setReadingText] = useState<string>("");
  const [gentleReminder, setGentleReminder] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const readingRef = useRef<HTMLDivElement>(null);
  const spreadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeck([...FULL_DECK]);
  }, []);

  // Extract the "Gentle Reminder" from the text whenever readingText updates
  useEffect(() => {
    if (readingText) {
      const match = readingText.match(/溫柔提醒[：:]?\s*\n?>?\s*(.*)/i) || readingText.match(/>\s*(.*$)/m);
      if (match && match[1]) {
        setGentleReminder(match[1].trim());
      } else {
        setGentleReminder("相信直覺，宇宙與你同在。");
      }
    }
  }, [readingText]);

  const handleStart = () => {
    if (!question.trim()) {
      alert("請輸入你想詢問的問題，讓塔羅指引方向。");
      return;
    }
    setGameState(GameState.INPUT);
  };

  const selectMode = (mode: ReadingMode) => {
    setReadingMode(mode);
    shuffleDeck();
  };

  const shuffleDeck = useCallback(() => {
    setGameState(GameState.SHUFFLING);
    
    setTimeout(() => {
      // Fisher-Yates
      const newDeck = [...FULL_DECK];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      setDeck(newDeck);
      setSelectedIndices([]);
      setFinalSpread([]);
      setReadingText("");
      setGentleReminder("");
      setGameState(GameState.SPREAD);
    }, 2000);
  }, []);

  const handleCardClick = (index: number) => {
    if (gameState !== GameState.SPREAD) return;
    
    const maxCards = MODE_CONFIG[readingMode].count;

    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      if (selectedIndices.length < maxCards) {
        setSelectedIndices(prev => [...prev, index]);
      }
    }
  };

  const revealCards = async () => {
    const requiredCount = MODE_CONFIG[readingMode].count;
    if (selectedIndices.length !== requiredCount) return;
    
    const spreadData: SelectedCard[] = selectedIndices.map(i => ({
      data: deck[i],
      isReversed: Math.random() < 0.4
    }));

    setFinalSpread(spreadData);
    setGameState(GameState.REVEAL);
    setIsLoading(true);

    const request: ReadingRequest = {
      question,
      mode: readingMode,
      cards: spreadData
    };

    try {
      const text = await getTarotReading(request);
      setReadingText(text);
    } catch (e) {
      setReadingText("連結宇宙訊號失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
      setGameState(GameState.READING);
      setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const resetGame = () => {
    setGameState(GameState.INTRO);
    setQuestion("");
    setSelectedIndices([]);
    setFinalSpread([]);
    setReadingText("");
    setGentleReminder("");
    setDeck([...FULL_DECK]); 
  };

  // Helper to get labels based on mode
  const getCardLabel = (index: number) => {
      if (readingMode === ReadingMode.THREE_TRIANGLE) return ['過去', '現在', '未來'][index];
      if (readingMode === ReadingMode.RELATIONSHIP) return ['您的狀態', '對方的狀態', '關係現狀', '未來發展'][index];
      if (readingMode === ReadingMode.TWO_PATHS) return ['核心/現況', 'A:過程', 'A:結果', 'B:過程', 'B:結果'][index];
      return '指引';
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden relative font-sans flex flex-col bg-[#0f172a]">
      <Background />

      {/* Marquee Background Effect */}
      {(gameState === GameState.INTRO || gameState === GameState.INPUT) && (
        <div className="fixed top-16 inset-x-0 z-0 opacity-40 pointer-events-none flex flex-col gap-6 overflow-hidden">
            {/* Top Row moving Left */}
            <div className="flex animate-marquee min-w-full w-max">
                {[...FULL_DECK, ...FULL_DECK].map((card, i) => (
                    <div key={`row1-${i}`} className="w-20 h-32 mx-1 rounded shadow-md opacity-80 overflow-hidden bg-slate-800">
                         <img 
                            src={card.image} 
                            className="w-full h-full object-cover" 
                            alt="" 
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            {/* Bottom Row moving Right */}
            <div className="flex animate-marquee-reverse min-w-full w-max">
                {[...FULL_DECK, ...FULL_DECK].reverse().map((card, i) => (
                    <div key={`row2-${i}`} className="w-20 h-32 mx-1 rounded shadow-md opacity-80 overflow-hidden bg-slate-800">
                        <img 
                           src={card.image} 
                           className="w-full h-full object-cover" 
                           alt="" 
                           loading="lazy"
                       />
                   </div>
                ))}
            </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex flex-col">
           <h1 className="text-2xl md:text-3xl text-yellow-500 font-mystic tracking-[0.2em] drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
             ARCANA TAROT
           </h1>
           <span className="text-[10px] text-slate-400 tracking-widest uppercase">AI Interactive Divination</span>
        </div>
        
        {gameState !== GameState.INTRO && (
           <button 
             onClick={resetGame}
             className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-300 px-3 py-1 rounded transition-all bg-black/50 backdrop-blur"
           >
             結束占卜
           </button>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center w-full mx-auto">
        
        {/* 1. INTRO / QUESTION INPUT */}
        {(gameState === GameState.INTRO || gameState === GameState.INPUT) && (
          <div className="text-center animate-fade-in max-w-xl w-full my-10 px-4 relative z-20">
            <h2 className="text-4xl md:text-6xl font-mystic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-100 drop-shadow-lg">
              心靈塔羅
            </h2>
            <p className="text-slate-300 mb-8 font-light tracking-wide text-sm md:text-base drop-shadow-md bg-black/30 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
              在心中默念你的問題，讓宇宙為你指引方向。
            </p>
            
            <div className="w-full bg-black/60 p-1 rounded-xl backdrop-blur-md border border-slate-600/50 shadow-2xl mb-8">
               <input 
                 type="text" 
                 value={question}
                 onChange={(e) => setQuestion(e.target.value)}
                 placeholder="請輸入你想詢問的問題 (例如：最近的工作運勢...)"
                 className="w-full bg-transparent text-center text-white placeholder-slate-400 px-4 py-4 focus:outline-none font-light text-lg"
                 onKeyDown={(e) => e.key === 'Enter' && handleStart()}
               />
            </div>

            {gameState === GameState.INTRO ? (
                <button
                onClick={handleStart}
                className="px-10 py-3 bg-slate-800 hover:bg-slate-700 text-yellow-500 border border-yellow-500/30 rounded-full font-mystic tracking-widest transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] shadow-xl"
                >
                開始旅程
                </button>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                    {Object.entries(MODE_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => selectMode(key as ReadingMode)}
                            className="flex flex-col items-center p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all hover:scale-105 group backdrop-blur-sm shadow-lg"
                        >
                            <span className="text-yellow-500 font-bold mb-1 group-hover:text-yellow-300">{config.label}</span>
                            <span className="text-xs text-slate-400">{config.desc}</span>
                        </button>
                    ))}
                </div>
            )}
          </div>
        )}

        {/* 2. SHUFFLING */}
        {gameState === GameState.SHUFFLING && (
          <div className="flex flex-col items-center justify-center h-64">
             <div className="relative w-32 h-48">
               {[0, 1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 bg-slate-800 border-2 border-yellow-900/50 rounded-xl shadow-xl"
                    style={{ 
                        zIndex: i,
                        animation: `shuffle${i % 2 === 0 ? 'Left' : 'Right'} 1s infinite alternate ease-in-out`,
                        animationDelay: `${i * 0.1}s`
                    }}
                  >
                     <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 to-black opacity-90 rounded-lg"></div>
                  </div>
               ))}
             </div>
             <p className="mt-12 text-yellow-500/80 font-mystic animate-pulse tracking-widest">洗牌中... 請保持專注</p>
          </div>
        )}

        {/* 3. SPREAD / SELECTION (HORIZONTAL SCROLL) */}
        {gameState === GameState.SPREAD && (
          <div className="w-full flex flex-col items-center h-full justify-center">
            
            <div className="text-center mb-4 animate-fade-in px-4">
                <h3 className="text-xl md:text-2xl font-mystic text-yellow-100 mb-1">
                 請從牌桌上選擇 {MODE_CONFIG[readingMode].count} 張牌
                </h3>
                <p className="text-sm text-yellow-500/80">
                  {selectedIndices.length === 0 ? "您可以左右滑動牌桌，尋找有感應的牌" : 
                   selectedIndices.length < MODE_CONFIG[readingMode].count ? `已選 ${selectedIndices.length} 張，還需 ${MODE_CONFIG[readingMode].count - selectedIndices.length} 張` : 
                   "命運已定，請按下揭曉"}
                </p>
                {selectedIndices.length === MODE_CONFIG[readingMode].count && (
                    <button
                        onClick={revealCards}
                        className="mt-4 px-8 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-mystic font-bold rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all animate-bounce"
                    >
                        揭曉牌陣
                    </button>
                )}
            </div>
            
            {/* Horizontal Scroll Container */}
            <div 
                ref={spreadContainerRef}
                className="w-full overflow-x-auto hide-scrollbar py-16 px-4 md:px-10 flex items-center min-h-[50vh] touch-pan-x cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center min-w-max pl-[40vw] pr-[40vw]">
                {deck.map((card, idx) => (
                    <div 
                        key={card.id} 
                        className={`
                            relative -ml-20 md:-ml-24 first:ml-0 transition-all duration-300 ease-out flex-shrink-0
                            ${selectedIndices.includes(idx) ? '-translate-y-12 z-50 scale-105' : 'hover:-translate-y-6 hover:z-40'}
                        `}
                    >
                        <Card 
                            index={idx}
                            card={card}
                            isRevealed={false}
                            isSelected={selectedIndices.includes(idx)}
                            onClick={() => handleCardClick(idx)}
                            mode="spread"
                        />
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. REVEAL / READING */}
        {(gameState === GameState.REVEAL || gameState === GameState.READING) && (
          <div className="w-full flex flex-col items-center pb-20 pt-10 px-4">
            
            {/* CARD DISPLAY AREA */}
            <div className="w-full flex flex-col items-center bg-[#0f172a] p-8 rounded-xl max-w-6xl mx-auto border border-slate-800/50 shadow-2xl">
                {/* Header */}
                {gameState === GameState.READING && (
                    <div className="mb-8 text-center opacity-80">
                        <h2 className="text-yellow-500 font-mystic text-2xl tracking-[0.3em]">ARCANA TAROT</h2>
                        <div className="h-[1px] w-20 bg-yellow-600/50 mx-auto my-2"></div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()} • DIVINATION RESULT</p>
                    </div>
                )}

                {/* Selected Cards Grid */}
                <div className={`grid grid-cols-1 gap-12 w-full place-items-center
                    ${readingMode === ReadingMode.SINGLE ? 'md:grid-cols-1' : ''}
                    ${readingMode === ReadingMode.THREE_TRIANGLE ? 'md:grid-cols-3' : ''}
                    ${readingMode === ReadingMode.RELATIONSHIP ? 'md:grid-cols-2 lg:grid-cols-4' : ''}
                    ${readingMode === ReadingMode.TWO_PATHS ? 'md:grid-cols-3 lg:grid-cols-5' : ''}
                `}>
                {finalSpread.map((selectedCard, i) => {
                    const positionLabel = getCardLabel(i);

                    return (
                    <div key={i} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="flex flex-col items-center mb-4">
                            <span className="text-yellow-500 text-[10px] tracking-[0.2em] uppercase mb-1 font-bold bg-black/50 px-3 py-1 rounded-full border border-yellow-900/30">{positionLabel}</span>
                        </div>
                        <div className="scale-100 mb-5 drop-shadow-2xl">
                            <Card 
                                card={selectedCard.data}
                                index={0}
                                totalCards={1}
                                isRevealed={true}
                                isReversed={selectedCard.isReversed}
                                mode="static"
                            />
                        </div>
                        {/* 牌名顯示區域 */}
                        <div className="text-center">
                            <p className={`text-lg font-bold font-mystic ${selectedCard.isReversed ? 'text-red-400' : 'text-yellow-100'}`}>
                                {selectedCard.data.name} 
                                <span className="text-xs ml-1 opacity-75 font-normal">
                                    {selectedCard.isReversed ? '(逆位)' : ''}
                                </span>
                            </p>
                            <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-1 font-serif italic">
                                {selectedCard.data.englishName}
                            </p>
                        </div>
                    </div>
                    );
                })}
                </div>

                {/* Gentle Reminder */}
                {gentleReminder && gameState === GameState.READING && (
                    <div className="mt-10 pt-8 border-t border-slate-700/50 w-full max-w-2xl text-center relative">
                        <span className="absolute top-8 left-[50%] -translate-x-1/2 -mt-4 text-4xl text-yellow-600/20 font-serif">"</span>
                        <p className="text-slate-500 text-[10px] mb-3 uppercase tracking-[0.3em]">Universe Message</p>
                        <p className="font-mystic text-lg md:text-xl text-yellow-500/90 leading-relaxed font-light italic px-4">
                            {gentleReminder}
                        </p>
                    </div>
                )}
            </div>

            {/* AI Analysis Section (Text Reading) */}
            <div ref={readingRef} className="w-full max-w-4xl bg-[#0a0510]/90 backdrop-blur-xl border border-slate-700/50 p-6 md:p-12 rounded-2xl shadow-2xl min-h-[300px] transition-all duration-1000 relative overflow-hidden mt-8">
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-600/50 rounded-tl-lg"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-600/50 rounded-tr-lg"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-600/50 rounded-bl-lg"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-600/50 rounded-br-lg"></div>

               {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-64">
                   <div className="relative w-16 h-16 mb-6">
                     <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
                   </div>
                   <p className="font-mystic text-slate-300 animate-pulse text-lg">正在連結宇宙意識，請稍候...</p>
                   <p className="text-xs text-slate-500 mt-2">AI 正在為您撰寫個人化解讀</p>
                 </div>
               ) : (
                 <div className="prose prose-invert prose-lg max-w-none">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
                        <div>
                            <h3 className="text-2xl text-yellow-500 font-mystic m-0">塔羅解讀</h3>
                            <p className="text-sm text-slate-500 mt-1">問題：{question}</p>
                        </div>
                    </div>
                    
                    <div className="leading-relaxed opacity-0 animate-fade-in-slow text-slate-300 whitespace-pre-line text-justify" style={{ animationFillMode: 'forwards' }}>
                      <React.Fragment>
                         {readingText}
                      </React.Fragment>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-800 text-center">
                         <button 
                            onClick={resetGame}
                            className="inline-block px-8 py-2 border border-slate-600 text-slate-400 hover:border-yellow-600 hover:text-yellow-500 transition-all rounded-full text-sm font-bold tracking-widest"
                         >
                            再次占卜
                         </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
