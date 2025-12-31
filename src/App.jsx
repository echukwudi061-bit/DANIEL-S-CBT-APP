import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  RotateCcw
} from 'lucide-react';

// --- Types ---
type OptionKey = 'optionA' | 'optionB' | 'optionC' | 'optionD';

interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: OptionKey; 
}

// --- Sample Data (Replace this with your own or fetch from JSON) ---
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: "Which of the following is the primary site of fertilization in humans?",
    optionA: "Uterus",
    optionB: "Ampulla of Uterine Tube",
    optionC: "Ovary",
    optionD: "Cervix",
    correctAnswer: "optionB"
  },
  {
    id: '2',
    text: "The blastocyst normally implants into which layer of the uterus?",
    optionA: "Myometrium",
    optionB: "Perimetrium",
    optionC: "Endometrium",
    optionD: "Epimetrium",
    correctAnswer: "optionC"
  },
  {
    id: '3',
    text: "Which germ layer gives rise to the nervous system?",
    optionA: "Ectoderm",
    optionB: "Mesoderm",
    optionC: "Endoderm",
    optionD: "None of the above",
    correctAnswer: "optionA"
  }
];

export default function SimpleCBT() {
  // --- State ---
  const [view, setView] = useState<'welcome' | 'test' | 'result'>('welcome');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [score, setScore] = useState(0);
  
  // Timer State
  const DURATION_MINUTES = 10;
  const [timeLeft, setTimeLeft] = useState(DURATION_MINUTES * 60);

  // --- Timer Logic ---
  useEffect(() => {
    if (view === 'test' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (view === 'test' && timeLeft === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [view, timeLeft]);

  // --- Handlers ---
  const startTest = () => {
    setAnswers({});
    setScore(0);
    setCurrentQIndex(0);
    setTimeLeft(DURATION_MINUTES * 60);
    setView('test');
  };

  const handleAnswerSelect = (qId: string, option: OptionKey) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    SAMPLE_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        newScore += 1; // 1 mark per question
      }
    });
    setScore(newScore);
    setView('result');
  };

  // --- Format Time Helper ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Views ---

  // 1. WELCOME VIEW
  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-blue-100">
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ANATOMY CBT</h1>
          <p className="text-gray-500 mb-8">Test your knowledge on General Embryology.</p>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-8 space-y-2">
            <p className="flex items-center"><Clock className="w-4 h-4 mr-2"/> <strong>Time:</strong> {DURATION_MINUTES} Minutes</p>
            <p className="flex items-center"><FileText className="w-4 h-4 mr-2"/> <strong>Questions:</strong> {SAMPLE_QUESTIONS.length}</p>
          </div>

          <button 
            onClick={startTest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" /> Start Test
          </button>
        </div>
      </div>
    );
  }

  // 2. TEST VIEW
  if (view === 'test') {
    const question = SAMPLE_QUESTIONS[currentQIndex];
    const isAnswered = !!answers[question.id];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-bold text-gray-800 text-lg">Anatomy Test</h1>
          <div className={`font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'} flex items-center`}>
            <Clock className="w-5 h-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
        </header>

        {/* Main Question Area */}
        <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            
            {/* Question Counter */}
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Question {currentQIndex + 1} of {SAMPLE_QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
              {question.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {(['optionA', 'optionB', 'optionC', 'optionD'] as OptionKey[]).map((optKey) => (
                <button
                  key={optKey}
                  onClick={() => handleAnswerSelect(question.id, optKey)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group
                    ${answers[question.id] === optKey 
                      ? 'border-blue-500 bg-blue-50 text-blue-900' 
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0
                    ${answers[question.id] === optKey ? 'border-blue-500' : 'border-gray-300'}
                  `}>
                    {answers[question.id] === optKey && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                  </div>
                  <span className="text-gray-700 font-medium">{question[optKey]}</span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              <button 
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="flex items-center text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-500 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </button>
              
              {currentQIndex === SAMPLE_QUESTIONS.length - 1 ? (
                 <button 
                   onClick={() => {
                     if(window.confirm("Are you sure you want to submit?")) handleSubmit();
                   }}
                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition"
                 >
                   Submit Test
                 </button>
              ) : (
                <button 
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. RESULT VIEW
  if (view === 'result') {
    const percentage = Math.round((score / SAMPLE_QUESTIONS.length) * 100);
    const isPass = percentage >= 50;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          
          <div className="mb-6 flex justify-center">
            {isPass ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed</h2>
          <p className="text-gray-500 mb-8">You scored:</p>

          <div className="flex justify-center items-center gap-4 mb-8">
             <div className="text-center bg-gray-50 p-4 rounded-xl">
                <span className="block text-sm text-gray-400 uppercase font-bold">Total Score</span>
                <span className={`text-4xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                    {score}/{SAMPLE_QUESTIONS.length}
                </span>
             </div>
             <div className="text-center bg-gray-50 p-4 rounded-xl">
                <span className="block text-sm text-gray-400 uppercase font-bold">Percentage</span>
                <span className={`text-4xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                    {percentage}%
                </span>
             </div>
          </div>

          <button 
            onClick={() => setView('welcome')}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
    }
              
