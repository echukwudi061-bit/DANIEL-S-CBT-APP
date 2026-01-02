import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  FileText,
  Menu,
  X,
  LayoutGrid
} from 'lucide-react';

// --- HELPER: FISHER-YATES SHUFFLE ---
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- COMPONENT: GUEST ID BADGE ---
const GuestIdBadge = ({ id, className = "" }) => (
  <div className={`bg-blue-50 text-blue-800 border border-blue-100 rounded-full px-2 py-1 text-[10px] font-bold tracking-wide whitespace-nowrap ${className}`}>
    {id}
  </div>
);

// --- COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ message, show }) => (
  <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 font-bold text-sm ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
    {message}
  </div>
);

export default function App() {
  // --- 1. CONFIGURATION STATE ---
  const [appName] = useState(() => localStorage.getItem('cbt_appName') || "DANIEL'S ANATOMY CBT APP");
  const [testTitle] = useState(() => localStorage.getItem('cbt_testTitle') || "ANAT 213: GENERAL EMBRYO AND GENETICS");
  const [testDuration] = useState(() => {
    const saved = localStorage.getItem('cbt_duration');
    return saved ? parseInt(saved, 10) : 20;
  });
  const [marksPerQuestion] = useState(() => {
    const saved = localStorage.getItem('cbt_marks');
    return saved ? parseInt(saved, 10) : 2;
  });

  // --- 2. QUESTIONS STATE ---
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('cbt_questions');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 3. VIEW STATE (LAZY INIT - INSTANT RESUME) ---
  const [view, setView] = useState(() => {
    // A. Check if a test is currently running (Valid End Time)
    const savedEndTime = localStorage.getItem('cbt_endTime');
    if (savedEndTime && parseInt(savedEndTime, 10) > Date.now()) {
      return 'test';
    }
    // B. Check if a result is waiting in session (Survives Refresh)
    const savedResult = sessionStorage.getItem('cbt_currentResult');
    if (savedResult) {
      return 'result';
    }
    // C. Default
    return 'welcome';
  });

  // --- 4. TEST TAKING STATE ---
  const [guestId] = useState(() => {
    const saved = localStorage.getItem('cbt_guestId');
    if (saved) return saved;
    const newId = `GUEST ID: ${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('cbt_guestId', newId);
    return newId;
  });

  const [currentQIndex, setCurrentQIndex] = useState(() => {
    const saved = localStorage.getItem('cbt_currentIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('cbt_answers');
    return saved ? JSON.parse(saved) : {};
  });

  // LAZY TIMER INIT
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem('cbt_endTime');
    if (savedEndTime) {
      const diff = Math.ceil((parseInt(savedEndTime, 10) - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Ref for double-tap logic
  const lastBackPress = useRef(0);
  // --- CRITICAL FIX: REF TO TRACK PROGRAMMATIC EXIT ---
  const isProgrammaticExit = useRef(false);

  // --- EFFECT: LOAD QUESTIONS FROM CSV ON MOUNT ---
  useEffect(() => {
    if (questions.length === 0) {
        fetch('/Questions.csv')
            .then(res => res.ok ? res.text() : Promise.reject("CSV not found"))
            .then(text => {
                const lines = text.split('\n');
                const newQuestions = [];
                lines.forEach((line, idx) => {
                   const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                   if (parts.length >= 6 && idx > 0) {
                      const clean = (str) => str?.replace(/^"|"$/g, '').trim() || '';
                      let correctKey = clean(parts[5]).toLowerCase();
                      
                      if (['a','b','c','d'].includes(correctKey) || correctKey.includes('option')) {
                          if(correctKey.includes('a')) correctKey = 'optionA';
                          else if(correctKey.includes('b')) correctKey = 'optionB';
                          else if(correctKey.includes('c')) correctKey = 'optionC';
                          else if(correctKey.includes('d')) correctKey = 'optionD';
                      } else { correctKey = 'optionA'; }

                      if (clean(parts[0])) {
                         newQuestions.push({
                             id: `q-${Date.now()}-${idx}`,
                             text: clean(parts[0]),
                             optionA: clean(parts[1]),
                             optionB: clean(parts[2]),
                             optionC: clean(parts[3]),
                             optionD: clean(parts[4]),
                             correctAnswer: correctKey
                         });
                      }
                   }
                });
                if (newQuestions.length > 0) {
                    const shuffled = shuffleArray(newQuestions);
                    setQuestions(shuffled);
                    localStorage.setItem('cbt_questions', JSON.stringify(shuffled));
                }
            })
            .catch(err => console.log("Auto-load info:", err));
    }
  }, []);

  // --- EFFECT: PERSIST CURRENT QUESTION INDEX ---
  useEffect(() => {
    if (view === 'test') {
      localStorage.setItem('cbt_currentIndex', currentQIndex.toString());
    }
  }, [currentQIndex, view]);

  // --- LOGIC: TIMER & END TIME CALCULATION ---
  useEffect(() => {
    let interval;
    if (view === 'test') {
      const savedEndTime = localStorage.getItem('cbt_endTime');
      
      const updateTimer = () => {
        if (!savedEndTime) return;
        const end = parseInt(savedEndTime, 10);
        const now = Date.now();
        const diff = Math.ceil((end - now) / 1000);
        
        if (diff <= 0) {
          setTimeLeft(0);
          handleSubmit(); 
        } else {
          setTimeLeft(diff);
        }
      };

      updateTimer(); 
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [view]);

  // --- CRITICAL FIX 2: ROBUST HISTORY MANAGEMENT (PREVENTS STACK BUILDUP) ---
  useEffect(() => {
    const handlePopState = (event) => {
      // 1. SKIP IF PROGRAMMATIC EXIT (Prevents trap from firing during cleanup)
      if (isProgrammaticExit.current) return;

      // SCENARIO A: TEST VIEW (Confirmation Trap)
      if (view === 'test') {
        const confirmLeave = window.confirm("Are you sure you want to quit? Your progress will be lost.");
        
        if (confirmLeave) {
          handleExitToWelcome(true); // Passed 'true' because user pressed Back
        } else {
          // Push state back to maintain trap
          setTimeout(() => {
            // FIX: Only push if not already trapped
            if (!window.history.state?.trapped) {
               window.history.pushState({ trapped: true }, '', window.location.href);
            }
          }, 50);
        }
      } 
      // SCENARIO B: RESULT VIEW (Double Tap)
      else if (view === 'result') {
        const now = Date.now();
        const timeDiff = now - lastBackPress.current;
        
        if (timeDiff < 2000) {
          handleExitToWelcome(true); // Passed 'true' because user pressed Back
        } else {
          lastBackPress.current = now;
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
          setTimeout(() => {
             // FIX: Only push if not already trapped
             if (!window.history.state?.trapped) {
               window.history.pushState({ trapped: true }, '', window.location.href);
             }
          }, 50);
        }
      }
    };

    if (view === 'test' || view === 'result') {
      // ESTABLISH TRAP: Only push if we haven't already trapped this specific state.
      // This prevents the "stack growing on refresh" bug.
      if (!window.history.state?.trapped) {
        window.history.pushState({ trapped: true }, '', window.location.href);
      }
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  // --- HANDLERS ---

  const startTest = () => {
    if (questions.length === 0) {
      alert("Loading questions... Please wait or refresh if stuck.");
      return;
    }
    
    // 1. Shuffle
    const randomized = shuffleArray([...questions]);
    setQuestions(randomized);
    localStorage.setItem('cbt_questions', JSON.stringify(randomized));

    // 2. Setup Session Data
    const endTime = Date.now() + (testDuration * 60 * 1000);
    localStorage.setItem('cbt_endTime', endTime.toString());
    localStorage.setItem('cbt_answers', JSON.stringify({}));
    localStorage.setItem('cbt_currentIndex', '0');
    
    // 3. Clear old session result
    sessionStorage.removeItem('cbt_currentResult');
    
    // 4. Update State
    setAnswers({});
    setCurrentQIndex(0);
    setView('test');
    setIsMobileMenuOpen(false);
  };

  const handleAnswerSelect = (qId, option) => {
    const newAnswers = { ...answers, [qId]: option };
    setAnswers(newAnswers);
    localStorage.setItem('cbt_answers', JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    let rawScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) rawScore += 1;
    });

    const finalScore = rawScore * marksPerQuestion;
    const totalPossible = questions.length * marksPerQuestion;
    const percentage = totalPossible > 0 ? Math.round((finalScore / totalPossible) * 100) : 0;

    const resultData = {
      score: finalScore,
      total: totalPossible,
      percentage: percentage,
      questions: questions,
      answers: answers
    };

    sessionStorage.setItem('cbt_currentResult', JSON.stringify(resultData));

    localStorage.removeItem('cbt_endTime');
    localStorage.removeItem('cbt_answers');
    localStorage.removeItem('cbt_currentIndex');
    
    // CRITICAL: Push a clean state before switching so Result has its own history entry
    window.history.pushState({}, '', window.location.href);
    setView('result');
  };

  // --- CRITICAL FIX 3: SMOOTH EXIT (NO RELOAD) ---
  const handleExitToWelcome = (fromBackPress = false) => {
    // 1. Signal listeners to ignore the next popstate events
    isProgrammaticExit.current = true;

    // 2. Clean EVERYTHING
    localStorage.removeItem('cbt_endTime');
    localStorage.removeItem('cbt_answers');
    localStorage.removeItem('cbt_currentIndex');
    sessionStorage.removeItem('cbt_currentResult');

    // 3. Strategy Switch (Unwind History instead of Reloading)
    if (fromBackPress) {
        // SCENARIO: User pressed Device Back Button
        // Browser has already popped one state (the trap).
        if (view === 'result') {
            // If on result, we usually have 'test' sitting behind us.
            // We pop again to reach welcome/start state.
            window.history.back();
        }
        // Fallback: Manually update view (React will re-render)
        setTimeout(() => {
            setView('welcome');
            isProgrammaticExit.current = false; 
        }, 50);
    } else {
        // SCENARIO: User clicked UI Button (Quit / Home)
        // SOLUTION: Unwind history manually to avoid leaving traps in the stack.
        
        if (view === 'test') {
            // Current state is trapped. Go back 1 to remove trap.
            window.history.back();
        } else if (view === 'result') {
            // Current is trapped, and previous (Test) was also history entry.
            // Go back 2 to clear Result + Test.
            window.history.go(-2);
        }

        setTimeout(() => {
            setView('welcome');
            isProgrammaticExit.current = false;
        }, 50);
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ---------------- RENDER: WELCOME ----------------
  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-blue-100 relative">
          
          <div className="absolute top-4 right-4">
             <GuestIdBadge id={guestId} />
          </div>

          <div className="mb-6 flex flex-col items-center justify-center gap-3">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 uppercase tracking-tight">{appName}</h1>
          <p className="text-gray-500 font-medium mb-6 uppercase text-xs md:text-sm">{testTitle}</p>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-8 space-y-2">
            <p className="flex items-center"><Clock className="w-4 h-4 mr-2"/> <strong>Time Limit:</strong> {testDuration} Minutes</p>
            <p className="flex items-center"><FileText className="w-4 h-4 mr-2"/> <strong>Questions:</strong> {questions.length}</p>
            <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> <strong>Scoring:</strong> {marksPerQuestion} Marks / Question</p>
          </div>

          <button 
            onClick={startTest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center mb-6"
          >
             <Play className="w-5 h-5 mr-2" /> Start Test
          </button>
        </div>
      </div>
    );
  }

  // ---------------- RENDER: TEST ----------------
  if (view === 'test') {
    const question = questions[currentQIndex];
    if(!question) return null;

    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;

    return (
      <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
        <header className="bg-white shadow-sm px-3 md:px-6 py-3 flex justify-between items-center z-20 flex-shrink-0 w-full relative">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-600"/>
            </button>

            <div className="flex flex-col overflow-hidden min-w-0 items-start">
               <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase truncate">{appName}</span>
               <h1 className="font-bold text-black text-xs md:text-lg uppercase truncate leading-tight mb-1">{testTitle}</h1>
               <GuestIdBadge id={guestId} />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className={`font-mono font-bold text-sm md:text-xl ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'} flex items-center`}>
              <Clock className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              {formatTime(timeLeft)}
            </div>
            
            <button 
              onClick={() => { if(window.confirm("Are you sure you want to submit?")) handleSubmit(); }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-md transition text-xs md:text-base whitespace-nowrap"
            >
              Submit
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {isMobileMenuOpen && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            <aside className={`
                absolute inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-xl
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:shadow-none md:z-10 md:w-72
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 flex items-center text-sm md:text-base">
                        <LayoutGrid className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600"/> Navigator
                    </h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 text-gray-500">
                      <X className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                   <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = idx === currentQIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => { setCurrentQIndex(idx); setIsMobileMenuOpen(false); }}
                                    className={`
                                        h-8 w-8 md:h-10 md:w-10 rounded-lg text-xs md:text-sm font-bold transition flex items-center justify-center border
                                        ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 border-blue-600 z-10' : ''}
                                        ${isAnswered ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs font-medium space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-gray-600"><div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"/> Answered</span>
                        <span className="font-bold">{answeredCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-gray-600"><div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full mr-2"/> Unanswered</span>
                        <span className="font-bold">{totalCount - answeredCount}</span>
                    </div>
                    
                    {/* --- UI FIX 1: ROUNDED HOLLOW CIRCLE FOR CURRENT INDICATOR --- */}
                    <div className="flex justify-between items-center mt-2">
                         <span className="flex items-center text-gray-600">
                             <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-blue-600 mr-2" />
                             Current
                         </span>
                         <span className="font-bold">#{currentQIndex + 1}</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-8 w-full">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-10 min-h-[50vh]">
                        <div className="mb-4 md:mb-6 flex justify-between items-center">
                             {/* BADGE 1: Question Index */}
                            <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Question {currentQIndex + 1} of {questions.length}
                            </span>
                            {/* BADGE 2: Mobile Counter */}
                            <span className="md:hidden bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                  {answeredCount}/{totalCount} Done
                            </span>
                        </div>

                        <h2 className="text-lg md:text-2xl font-medium text-gray-800 mb-6 md:mb-8 leading-relaxed break-words">
                            {question.text}
                        </h2>

                        <div className="space-y-3">
                            {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey) => (
                                <button
                                    key={optKey}
                                    onClick={() => handleAnswerSelect(question.id, optKey)}
                                    className={`
                                        w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 flex items-start md:items-center group
                                        ${answers[question.id] === optKey 
                                            ? 'border-blue-500 bg-blue-50 text-blue-900' 
                                            : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mr-3 md:mr-4 flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0
                                        ${answers[question.id] === optKey ? 'border-blue-500' : 'border-gray-300'}
                                    `}>        
                                        {answers[question.id] === optKey && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-sm md:text-base text-gray-700 font-medium break-words">
                                        <span className="font-bold mr-2 uppercase text-xs md:text-sm">{optKey.replace('option', '')}.</span>
                                        {question[optKey]}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-gray-100">
                            <button 
                                disabled={currentQIndex === 0}
                                onClick={() => setCurrentQIndex(prev => prev - 1)}
                                className="flex items-center text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-500 font-medium text-sm md:text-base"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" /> Previous
                            </button>
                              
                            <button 
                                 disabled={currentQIndex === questions.length - 1}
                                 onClick={() => setCurrentQIndex(prev => prev + 1)}
                                 className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-30 disabled:hover:text-blue-600 font-medium text-sm md:text-base"
                              >
                                    Next <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
                              </button>
                        </div>
                    </div>
                </div>
            </main>
      </div>
    );
  }

  // ---------------- RENDER: RESULT ----------------
  if (view === 'result') {
    const resultDataStr = sessionStorage.getItem('cbt_currentResult');
    if (!resultDataStr) {
      setView('welcome');
      return null;
    }
    const resultData = JSON.parse(resultDataStr);
    const isPass = resultData.percentage >= 40;

    return (
      <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900 overflow-y-auto">
        <Toast message="Tap again to exit" show={showToast} />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center">
            
            <h3 className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider mb-1">{appName}</h3>
            <p className="text-blue-600 font-bold mb-4 uppercase text-sm md:text-base">{testTitle}</p>

            <div className="mb-4 flex justify-center">
              {isPass ? <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500" /> : <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500" />}
            </div>
          
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Test Completed</h2>
            
            <div className="flex justify-center mb-6">
               <GuestIdBadge id={guestId} />
            </div>
          
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 mt-6">
               <div className="text-center bg-gray-50 p-4 rounded-xl w-full md:w-1/3">
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Score</span>
                  <span className={`text-3xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                      {resultData.score} / {resultData.total}
                  </span>
               </div>
              
               <div className="text-center bg-gray-50 p-4 rounded-xl w-full md:w-1/3">
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Percentage</span>
                  <span className={`text-3xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                      {resultData.percentage}%
                  </span>
               </div>
            </div>
            
            <button 
              onClick={() => handleExitToWelcome(false)}
              className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition flex items-center justify-center mx-auto w-full md:w-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Back to Home
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                Detailed Test Review
             </div>
             <div className="divide-y divide-gray-100">
                {resultData.questions.map((q, idx) => {
                    const userAns = resultData.answers[q.id];
                    const isCorrect = userAns === q.correctAnswer;
                    const skipped = !userAns;
                    return (
                        <div key={q.id} className="p-4 md:p-6">
                            <div className="flex gap-3">
                                <span className="font-bold text-gray-400 text-sm md:text-base">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 mb-3 text-sm md:text-base break-words">{q.text}</p>
                                    <div className="flex flex-col gap-2 text-xs md:text-sm">
                                        <div className={`flex items-start p-2 rounded ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                            <span className="font-bold w-20 md:w-24 flex-shrink-0 uppercase text-[10px] md:text-xs mt-0.5">Your Answer:</span>
                                            <span className="break-words">
                                                {skipped ? <span className="italic text-gray-500">Skipped</span> : 
                                                    <span><span className="font-bold uppercase mr-1">{userAns.replace('option','')}</span> {q[userAns]}</span>
                                                }
                                                {isCorrect && <CheckCircle className="inline w-3 h-3 md:w-4 md:h-4 ml-2"/>}
                                                {!isCorrect && !skipped && <XCircle className="inline w-3 h-3 md:w-4 md:h-4 ml-2"/>}
                                            </span>
                                        </div>

                                        {!isCorrect && (
                                            <div className="flex items-start p-2 rounded bg-green-50 text-green-800">
                                                <span className="font-bold w-20 md:w-24 flex-shrink-0 uppercase text-[10px] md:text-xs mt-0.5">Correct Answer:</span>
                                                <span className="break-words">
                                                    <span className="font-bold uppercase mr-1">{q.correctAnswer.replace('option','')}</span>
                                                    {q[q.correctAnswer]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
        }
        
