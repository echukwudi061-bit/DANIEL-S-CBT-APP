import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp,
  updateDoc,
  addDoc,
  writeBatch,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { 
  Clock, Menu, X, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Lock, 
  LayoutDashboard, Users, FileText, LogOut, Save, Trash2, Edit2, AlertTriangle, 
  Upload, Settings, Type, Phone, Power, MessageCircle, Link as LinkIcon, User, 
  Image as ImageIcon, Maximize2, Mail, PlusCircle, Youtube, Facebook, Twitter, 
  Instagram, Linkedin, Github, Globe, RefreshCcw, ExternalLink, Download, Filter, 
  Calendar, FileSpreadsheet, File as FileIcon, Eye, EyeOff, Shuffle, HelpCircle, 
  Hash, Layout, Printer, Home, MousePointerClick
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCyyG8ELDMbDZNfYxhZBggRoIQ4taDIO-nk",
  authDomain: "danielo-s-project-524d0.firebaseapp.com",
  projectId: "danielo-s-project-524d0",
  storageBucket: "danielo-s-project-524d0.firebasestorage.app",
  messagingSenderId: "728841872480",
  appId: "1:728841872480:web:163e376dd9a1011d2eb706",
  measurementId: "G-83252FBPSK"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Constants & Data ---
const ADMIN_EMAIL = "admin@example.com"; // CHANGE THIS
const DEFAULT_DURATION = 20; // Minutes
const PASS_MARK = 40;

// --- Helper Components ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('welcome'); // welcome, quiz, result, admin
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION * 60);
  const [score, setScore] = useState(0);
  const [studentDetails, setStudentDetails] = useState({ name: '', regNo: '' });
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email === ADMIN_EMAIL) setIsAdmin(true);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Timer
  useEffect(() => {
    if (view === 'quiz' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && view === 'quiz') {
      submitQuiz();
    }
  }, [view, timeLeft]);

  // Fetch Questions (Simulated or from DB)
  const fetchQuestions = async () => {
    // In a real app, fetch from Firestore:
    // const qSnap = await getDocs(collection(db, "questions"));
    // setQuestions(qSnap.docs.map(d => ({id: d.id, ...d.data()})));
    
    // For now, using your initial data structure:
    const mockQuestions = [
      { id: 'q1', text: "Another word for digital annularis is called what?", options: { A: "index finger", B: "ring finger", C: "little finger", D: "middle finger" }, answer: "option B" },
      { id: 'q2', text: "What do we call a vertical plane that runs side to side and divides the body into anterior and posterior parts?", options: { A: "coronal plane", B: "sagittal plane", C: "midsagitial plane", D: "oblique plane" }, answer: "option A" },
      { id: 'q3', text: "An imaginary plane that divides the body into lower and upper parts is called?", options: { A: "median plane", B: "transverse plane", C: "sagittal plane", D: "coronal plane" }, answer: "option B" },
    ];
    setQuestions(mockQuestions);
  };

  const startQuiz = async () => {
    if (!studentDetails.name || !studentDetails.regNo) return alert("Please enter details");
    await fetchQuestions();
    setView('quiz');
    setTimeLeft(DEFAULT_DURATION * 60);
  };

  const handleAnswer = (opt) => {
    setAnswers({ ...answers, [currentQIndex]: opt });
  };

  const submitQuiz = async () => {
    let calcScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === `option ${q.answer.replace('option ', '')}`) calcScore++; 
      // Note: Adjust logic depending on if answer is stored as "option A" or just "A"
      // Based on your data: answer: "option B" -> options keys are "A", "B"
      const correctKey = q.answer.split(' ')[1]; // "B"
      if (answers[idx] === correctKey) calcScore++;
    });
    
    setScore(calcScore);
    setView('result');

    // Save Result to Firestore
    if (user) {
      await addDoc(collection(db, "results"), {
        studentName: studentDetails.name,
        regNo: studentDetails.regNo,
        score: calcScore,
        total: questions.length,
        timestamp: serverTimestamp()
      });
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // --- VIEWS ---

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">DANIEL'S ANATOMY CBT</h1>
          <p className="text-gray-500 mb-6">Enter your details to begin.</p>
          
          <input 
            className="w-full p-3 mb-3 border rounded" 
            placeholder="Full Name"
            onChange={(e) => setStudentDetails({...studentDetails, name: e.target.value})}
          />
          <input 
            className="w-full p-3 mb-6 border rounded" 
            placeholder="Reg Number"
            onChange={(e) => setStudentDetails({...studentDetails, regNo: e.target.value})}
          />
          
          <Button onClick={startQuiz} className="w-full">Start Test</Button>
          
          <div className="mt-4 text-xs text-gray-400 cursor-pointer" onClick={() => setView('admin_login')}>
            Admin Login
          </div>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    const q = questions[currentQIndex];
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 shadow flex justify-between items-center sticky top-0 z-10">
          <div className="font-bold text-gray-700">Question {currentQIndex + 1}/{questions.length}</div>
          <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-4 max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-medium mb-6">{q?.text}</h2>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full text-left p-4 rounded-lg border transition ${
                    answers[currentQIndex] === opt 
                      ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="font-bold mr-2 text-gray-500">{opt}.</span> {q?.options[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="secondary" 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            
            {currentQIndex === questions.length - 1 ? (
              <Button variant="success" onClick={submitQuiz}>Submit Test</Button>
            ) : (
              <Button onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}>
                Next <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            {score >= (questions.length / 2) ? 
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" /> : 
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            }
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Submitted</h2>
          <p className="text-gray-500 mb-8">You have completed the assessment.</p>
          
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="text-sm text-gray-500 uppercase tracking-wide">Your Score</div>
            <div className="text-5xl font-bold text-gray-800 my-2">{score} <span className="text-2xl text-gray-400">/ {questions.length}</span></div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              score >= (questions.length / 2) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {Math.round((score/questions.length)*100)}%
            </div>
          </div>
          
          <Button onClick={() => window.location.reload()} className="w-full">Back to Home</Button>
        </div>
      </div>
    );
  }

  return <div>Admin View Placeholder (Implement Admin Logic Here)</div>;
}
