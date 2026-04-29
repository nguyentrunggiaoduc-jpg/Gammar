import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { CircleCheck, CircleX, Send, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { QUESTIONS, Question } from './data/questions';

type MessageType = 'bot' | 'user' | 'system' | 'question' | 'error' | 'success';

interface Message {
  id: string;
  type: MessageType;
  content: string | React.ReactNode;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mode, setMode] = useState<'campaign' | 'practice'>('campaign');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting and first question
  useEffect(() => {
    const initGame = async () => {
      addMessage('system', 'Khởi tạo hệ thống Quét Ổ Gà Ngữ Pháp...');
      await new Promise((r) => setTimeout(r, 600));
      addMessage('bot', 'Chào mừng bạn đến với Cầu Ngữ Pháp! Tôi là Kỹ Sư Ngữ Pháp, chuyên "truy tìm lỗi ổ gà" để hành trình giao tiếp của bạn mượt mà hơn. Xin lưu ý: Mỗi câu dưới đây có 1 "ổ gà" nguy hiểm. Hãy tìm và sửa lại cho đúng nhé!');
      await new Promise((r) => setTimeout(r, 1200));
      askQuestion(0);
    };
    initGame();
  }, []);

  const addMessage = (type: MessageType, content: string | React.ReactNode) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), type, content }]);
  };

  const switchMode = (newMode: 'campaign' | 'practice') => {
    if (newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setInputValue('');
    if (newMode === 'campaign') {
      setCurrentQuestionIndex(0);
      setScore(0);
      setRetryCount(0);
      setIsGameOver(false);
      addMessage('system', 'Khởi tạo hệ thống Quét Ổ Gà Ngữ Pháp...');
      setTimeout(() => {
        addMessage('bot', 'Chào mừng bạn trở lại Chiến dịch Cầu Ngữ Pháp!');
        setTimeout(() => askQuestion(0), 1000);
      }, 600);
    } else {
      setIsGameOver(false);
      addMessage('system', 'Khởi tạo Chế độ Luyện Tập Tự Do...');
      setTimeout(() => {
        addMessage('bot', 'Chào mừng đến với Chế độ Luyện Tập! Hãy gõ bất kỳ câu tiếng Anh nào bạn muốn, tôi sẽ kiểm tra và "rải nhựa" ổ gà giúp bạn!');
      }, 600);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const askQuestion = (index: number) => {
    if (index >= QUESTIONS.length) {
      setIsGameOver(true);
      addMessage('success', `🎉 HOÀN THÀNH XUẤT SẮC! Cầu đã thông xe hoàn toàn. Tổng điểm của bạn: ${score}/${QUESTIONS.length * 10} điểm!`);
      return;
    }
    const q = QUESTIONS[index];
    addMessage('question', (
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <div className="mb-4 sm:mb-6 text-center">
          <h3 className="text-white/60 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-1">
            CÂU SỐ [{q.level < 10 ? `0${q.level}` : q.level}] — Level {q.difficulty}
          </h3>
          <h1 className="text-white text-center text-xl sm:text-3xl font-light tracking-tight">
            Hệ Thống Phân Tích Đường Xá
          </h1>
        </div>
        <div className="w-full max-w-2xl bg-white/5 border border-white/20 rounded-[32px] p-6 sm:p-10 backdrop-blur-2xl shadow-inner text-center">
          <p className="text-white/60 text-sm sm:text-lg mb-6 italic font-serif">
            "Sửa lỗi để xe chạy thông suốt"
          </p>
          <div className="py-6 px-4 sm:py-8 sm:px-8 bg-black/20 rounded-2xl border border-dashed border-white/20 inline-block w-full">
            <div className="text-white text-lg sm:text-3xl font-medium tracking-tight leading-relaxed">
              {q.sentencePre} 
              <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 sm:py-1.5 mx-1.5 rounded-xl border border-yellow-400/30 font-mono inline-block shadow-sm">
                [{q.wordBracket}]
              </span> 
              {q.sentencePost}
            </div>
          </div>
        </div>
      </div>
    ));
    // Auto focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || (isGameOver && mode === 'campaign')) return;

    const userAns = inputValue.trim();
    setInputValue('');
    addMessage('user', userAns);

    if (mode === 'practice') {
      setMessages(prev => [...prev, { id: 'loading', type: 'system', content: 'Kỹ sư đang phân tích...' }]);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userAns,
          config: {
            systemInstruction: `Bạn là Kỹ Sư Ngữ Pháp Tiếng Anh chuyên "truy tìm lỗi ổ gà" trên cầu câu. Giọng điệu vui vẻ, dùng hình ảnh ẩn dụ giao thông để mô tả lỗi ngữ pháp. 
Học sinh sẽ nhập một câu tiếng Anh tự do. 
Nhiệm vụ của bạn:
1. Đánh giá câu có đúng ngữ pháp tiếng Anh không.
2. Nếu sai, chỉ ra "ổ gà", giải thích định dạng công thức, cung cấp phiên bản "đã rải nhựa" (chính xác).
3. Nếu đúng, khen ngợi và hô "THÔNG XE!"
Hãy trả về văn bản ngắn gọn, in đậm những từ ngữ bị sai, không cần in đậm toàn bộ văn bản.`,
          }
        });

        setMessages(prev => prev.filter(m => m.id !== 'loading'));
        addMessage('bot', <div className="whitespace-pre-wrap leading-relaxed">{response.text}</div>);
      } catch (error) {
        console.error(error);
        setMessages(prev => prev.filter(m => m.id !== 'loading'));
        addMessage('error', 'Lỗi bộ đàm! Không kết nối được với tổng đài Kỹ Sư. Xin thử lại.');
      }
      return;
    }

    if (!currentQuestion) return;
    const isCorrect = validateAnswer(userAns, currentQuestion);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer(userAns);
    }
  };

  const validateAnswer = (userInput: string, q: Question) => {
    const rawInput = userInput.replace(/[.,!?]$/, "").trim().toLowerCase();
    const correct = q.correctWord.toLowerCase();
    
    // Nếu chỉ nhập mỗi từ đúng
    if (rawInput === correct) return true;
    
    // Nếu nhập cả câu
    const compress = (str: string) => str.replace(/\s+/g, ' ').trim();
    const fullSentence = compress(`${q.sentencePre}${correct}${q.sentencePost}`.toLowerCase().replace(/[.,!?]$/, ""));
    const compressedInput = compress(rawInput);
    
    // So sánh chuỗi nén
    if (compressedInput === fullSentence) return true;
    
    // Khoan dung: nếu trong câu trả lời có chứa từ đúng và dài hơn 2 từ thì cũng có thể xem xét,
    // nhưng để an toàn và chính xác, chỉ kiểm tra đúng từ hoặc câu.
    // Tuy nhiên, người dùng có thể gõ: "She goes to school every day"
    return fullSentence === compressedInput;
  };

  const handleCorrectAnswer = () => {
    setScore(s => s + 10);
    addMessage('success', (
      <div className="flex flex-col gap-1">
        <strong className="text-green-400 flex items-center gap-1.5"><CircleCheck size={16}/> THÔNG XE!</strong>
        <span>Xuất sắc! Xe tiếp tục chạy mượt mà trên cầu câu! (+10 điểm)</span>
      </div>
    ));
    
    // Reset retry and next
    setRetryCount(0);
    setTimeout(() => {
      setCurrentQuestionIndex(i => {
        const next = i + 1;
        askQuestion(next);
        return next;
      });
    }, 1500);
  };

  const handleWrongAnswer = (ans: string) => {
    const newRetry = retryCount + 1;
    setRetryCount(newRetry);

    if (newRetry === 1) {
      // Sai lần 1: Gợi ý công thức
      addMessage('error', (
        <div className="flex flex-col gap-2">
          <strong className="text-rose-400 flex items-center gap-1.5"><AlertTriangle size={16}/> CẦU GÃY!</strong>
          <span>Nguy hiểm quá! Chú ý ổ gà thuộc phạm vi: <strong>{currentQuestion.grammarTense}</strong>.</span>
          <div className="bg-indigo-900/40 border border-indigo-500/30 p-2.5 rounded-lg text-sm text-indigo-200 font-mono mt-1">
            <strong>Công thức:</strong> {currentQuestion.formula}
          </div>
          <span className="text-xs text-rose-300">Vẫn còn cơ hội! Bạn có 1 lần sửa chữa nữa.</span>
        </div>
      ));
    } else {
      // Sai lần 2: Đưa đáp án và qua câu
      addMessage('error', (
        <div className="flex flex-col gap-1">
          <strong className="text-rose-500 flex items-center gap-1.5"><CircleX size={16}/> RẦM! Cầu thủng rồi!</strong>
          <span>Gói cứu trợ đã rải nhựa đường. Đáp án đúng là: <strong className="text-amber-400 text-lg px-2 bg-amber-500/20 py-0.5 rounded">{currentQuestion.correctWord}</strong></span>
        </div>
      ));
      
      setRetryCount(0);
      setTimeout(() => {
        setCurrentQuestionIndex(i => {
          const next = i + 1;
          askQuestion(next);
          return next;
        });
      }, 3000);
    }
  };

  const renderMessageContent = (msg: Message) => {
    let containerClass = "bg-white/10 text-gray-100 px-6 py-4 rounded-2xl rounded-tl-sm shadow-inner border border-white/10 max-w-[90%] self-start backdrop-blur-md";
    let isUser = false;
    
    if (msg.type === 'user') {
      containerClass = "bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-white px-6 py-4 rounded-2xl rounded-tr-sm shadow-inner border border-blue-400/30 max-w-[85%] self-end backdrop-blur-md";
      isUser = true;
    } else if (msg.type === 'system') {
      containerClass = "bg-transparent text-white/40 text-[11px] font-medium tracking-wide uppercase italic text-center w-full my-2";
    } else if (msg.type === 'success') {
      containerClass = "bg-green-500/10 text-green-100 px-6 py-4 rounded-2xl rounded-tl-sm shadow-inner border border-green-400/20 max-w-[85%] self-start backdrop-blur-md";
    } else if (msg.type === 'error') {
      containerClass = "bg-rose-500/10 text-rose-100 px-6 py-4 rounded-2xl rounded-tl-sm shadow-inner border border-rose-400/20 max-w-[85%] self-start backdrop-blur-md";
    } else if (msg.type === 'question') {
      containerClass = "w-full my-4 flex justify-center";
    }

    return (
      <div className={containerClass}>
        {msg.type !== 'system' && msg.type !== 'user' && msg.type !== 'question' && (
          <div className="mb-1.5 text-[10px] uppercase font-bold tracking-wider opacity-50 flex items-center gap-1.5">
             <Sparkles size={11} className="text-yellow-400" /> Kỹ Sư Ngữ Pháp
          </div>
        )}
        {msg.content}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 font-sans antialiased select-none" style={{ background: 'radial-gradient(circle at top left, #6366f1 0%, #a855f7 25%, #ec4899 50%, #f97316 75%, #eab308 100%)' }}>
      <div className="w-full max-w-[1200px] h-[85vh] max-h-[850px] bg-white/20 backdrop-blur-3xl rounded-[40px] border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">
        
        {/* MacOS Title Bar */}
        <div className="h-12 flex items-center px-4 sm:px-6 border-b border-white/20 relative shrink-0">
          <div className="flex space-x-2 w-20 sm:w-32">
            <div className="w-3 h-3 bg-[#FF5F57] rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-[#FEBC2E] rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-[#28C840] rounded-full shadow-sm"></div>
          </div>
          
          <div className="flex-1 flex justify-center items-center">
            <div className="flex gap-1 bg-black/20 p-1 rounded-full border border-white/10">
              <button 
                onClick={() => switchMode('campaign')}
                className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider transition-all ${mode === 'campaign' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
              >Chiến dịch</button>
              <button 
                onClick={() => switchMode('practice')}
                className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider transition-all ${mode === 'practice' ? 'bg-purple-500 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
              >Luyện tập</button>
            </div>
          </div>

          <div className="w-20 sm:w-32 text-right">
            {mode === 'campaign' && (
              <span className="bg-white/10 border border-white/20 text-white px-2 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-mono font-bold shadow-sm inline-flex items-center gap-1 sm:gap-2">
                ĐIỂM: <span className="text-yellow-400">{score}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: Road Map */}
          {mode === 'campaign' && (
          <div className="w-72 bg-black/10 backdrop-blur-md border-r border-white/10 p-6 flex-col hidden lg:flex overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h2 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Current Route</h2>
              <div className="space-y-3">
                {QUESTIONS.map((q, i) => {
                  const isActive = i === currentQuestionIndex && !isGameOver;
                  const isPassed = i < currentQuestionIndex || (isGameOver && i === currentQuestionIndex);
                  return (
                    <div key={q.id} className={`flex items-center space-x-3 p-2 rounded-xl transition-all ${isActive ? 'bg-white/10 border border-white/10 text-white/90 shadow-inner' : 'border border-transparent text-white/50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-green-400/20 text-green-400' : isPassed ? 'bg-blue-400/20 text-blue-400' : 'bg-white/5'}`}>
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </div>
                      <span className="text-sm font-medium truncate flex-1" title={q.difficulty}>
                        Lv.{q.level} - {q.difficulty}
                      </span>
                      {isActive && <div className="ml-auto text-[9px] bg-green-500 px-1.5 py-0.5 rounded text-white font-bold tracking-wider">ACTIVE</div>}
                      {isPassed && <div className="ml-auto text-blue-400"><CircleCheck size={14} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-inner">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-white/60 text-xs italic font-serif">Fuel Level</span>
                  <span className="text-white font-bold text-lg leading-none">{score} HP</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000" 
                    style={{ width: `${Math.max(5, (score / (QUESTIONS.length * 10)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col p-4 sm:p-8 relative overflow-hidden bg-transparent">
            {/* Warning Badge (conditionally rendered for current question) */}
            {!isGameOver && currentQuestion && mode === 'campaign' && (
              <div className="absolute top-6 right-8 hidden sm:flex items-center space-x-3 bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 z-10 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]"></div>
                <span className="text-white/80 text-xs font-bold tracking-widest uppercase truncate max-w-[200px]">Cẩn thận: {currentQuestion.grammarTense}</span>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 relative pr-2 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {renderMessageContent(msg)}
                  </motion.div>
                ))}
                <div ref={bottomRef} className="h-4 w-full shrink-0"/>
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="pt-4 shrink-0 mt-2 z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
              <form onSubmit={handleInputSubmit} className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={mode === 'campaign' ? "Nhập từ hoặc viết lại câu đúng để lấp ổ gà..." : "Gõ bất kỳ câu tiếng Anh nào để kiểm tra giao thông..."}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-16 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all text-sm shadow-inner backdrop-blur-sm"
                  disabled={isGameOver && mode === 'campaign'}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-white/20 text-[10px] uppercase font-bold tracking-tighter hidden sm:inline mr-2">Press Enter</span>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || (isGameOver && mode === 'campaign')}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:opacity-90 active:scale-[0.95] transition-all disabled:opacity-50 disabled:grayscale disabled:active:scale-100 shadow-md shadow-blue-500/20"
                  >
                    <Send size={18} className="ml-[-2px]" />
                  </button>
                </div>
              </form>
            </div>
            
            {/* Footer Advice */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-white/40 gap-2 px-2 max-w-2xl mx-auto w-full">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-medium tracking-wide uppercase truncate max-w-[200px] sm:max-w-md">{mode === 'campaign' ? "Mẹo kỹ sư: Nhìn kỹ gợi ý khi gãy cầu!" : "Gõ thỏa thích, không lo rớt đài!"}</span>
              </div>
              <div className="text-[10px] font-medium tracking-wide uppercase italic">
                {(isGameOver && mode === 'campaign') ? 'Hệ thống đã ngoại tuyến' : 'Đang chờ lệnh sửa chữa...'}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
