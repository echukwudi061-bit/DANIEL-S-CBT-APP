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
  Lock,
  Upload,
  Trash2,
  Edit2,
  LogOut,
  X,
  Plus
} from 'lucide-react';

// --- Initial Sample Data ---
const INITIAL_QUESTIONS = [
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
  }
];

export default function App() {
  // --- State ---
  const [view, setView] = useState('welcome'); // 'welcome' | 'test' | 'result' | 'admin'
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  
  // Test Taking State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const DURATION_MINUTES = 10;
  const [timeLeft, setTimeLeft] = useState(DURATION_MINUTES * 60);

  // Admin State
  const [adminPassInput, setAdminPassInput] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null); // If not null, shows edit modal
  const fileInputRef = useRef(null);

  // --- Timer Logic ---
  useEffect(() => {
    if (view === 'test' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (view === 'test' && timeLeft === 0) {
      handleSubmit(); 
    }
  }, [view, timeLeft]);

  // --- Test Handlers ---
  const startTest = () => {
    if (questions.length === 0) {
      alert("No questions available! Please login as admin and add some.");
      return;
    }
    setAnswers({});
    setScore(0);
    setCurrentQIndex(0);
    setTimeLeft(DURATION_MINUTES * 60);
    setView('test');
  };

  const handleAnswerSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setView('result');
  };

  // --- Admin Handlers ---

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassInput === 'BrainyBlessing08148800047') {
      setView('admin');
      setAdminPassInput('');
    } else {
      alert("Incorrect Password");
    }
  };

  const handleDeleteQuestion = (id) => {
    if(window.confirm("Delete this question?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setEditingQuestion(null);
  };

  // Simple CSV Parser
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newQuestions = [];
      
      // Assumes CSV Format: Question Text, OptionA, OptionB, OptionC, OptionD, CorrectAnswerKey
      lines.forEach((line, idx) => {
        // Simple regex to split by comma but ignore commas inside quotes
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // Skip header or empty lines
        if (parts.length >= 6 && idx > 0) {
           const clean = (str) => str?.replace(/^"|"$/g, '').trim() || '';
           
           // Basic mapping
           let correctKey = clean(parts[5]).toLowerCase();
           // Normalize answer key (e.g., if csv says "A" convert to "optionA")
           if (correctKey === 'a' || correctKey.includes('option a')) correctKey = 'optionA';
           else if (correctKey === 'b' || correctKey.includes('option b')) correctKey = 'optionB';
           else if (correctKey === 'c' || correctKey.includes('option c')) correctKey = 'optionC';
           else if (correctKey === 'd' || correctKey.includes('option d')) correctKey = 'optionD';
           else correctKey = 'optionA'; // Default fallback

           newQuestions.push({
             id: Date.now() + Math.random().toString(), // Generate unique ID
             text: clean(parts[0]),
             optionA: clean(parts[1]),
             optionB: clean(parts[2]),
             optionC: clean(parts[3]),
             optionD: clean(parts[4]),
             correctAnswer: correctKey
           });
        }
      });

      if (newQuestions.length > 0) {
        setQuestions(prev => [...prev, ...newQuestions]);
        alert(`Successfully added ${newQuestions.length} questions!`);
      } else {
        alert("Could not parse questions. Check CSV format.");
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = ''; // Reset input
  };

  // --- Helper: Format Time ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ---------------- RENDERING ----------------

  // 1. EDIT MODAL (Overlay)
  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Edit Question</h3>
          <button onClick={() => setEditingQuestion(null)}><X className="w-6 h-6"/></button>
        </div>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Question Text</label>
            <textarea 
              className="w-full border p-2 rounded" 
              value={editingQuestion.text}
              onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['optionA', 'optionB', 'optionC', 'optionD'].map(opt => (
              <div key={opt}>
                <label className="block text-xs font-bold uppercase mb-1">{opt}</label>
                <input 
                  className="w-full border p-2 rounded"
                  value={editingQuestion[opt]}
                  onChange={e => setEditingQuestion({...editingQuestion, [opt]: e.target.value})}
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Correct Answer</label>
            <select 
              className="w-full border p-2 rounded"
              value={editingQuestion.correctAnswer}
              onChange={e => setEditingQuestion({...editingQuestion, correctAnswer: e.target.value})}
            >
              <option value="optionA">Option A</option>
              <option value="optionB">Option B</option>
              <option value="optionC">Option C</option>
              <option value="optionD">Option D</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Save Changes</button>
        </form>
      </div>
    </div>
  );

  // 2. ADMIN VIEW
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-900">
        {editingQuestion && renderEditModal()}
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600"/> Admin Panel
            </h1>
            <button 
              onClick={() => setView('welcome')}
              className="flex items-center text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded"
            >
              <LogOut className="w-5 h-5 mr-2"/> Exit
            </button>
          </div>

          {/* Actions Toolbar */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef}
              onChange={handleCSVUpload}
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
            >
              <Upload className="w-5 h-5 mr-2"/> Import CSV
            </button>
            <button 
              onClick={() => { if(window.confirm("Delete ALL questions?")) setQuestions([]); }}
              className="flex items-center bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-bold"
            >
              <Trash2 className="w-5 h-5 mr-2"/> Clear All
            </button>
            <div className="ml-auto font-bold text-gray-500">
              Total Questions: {questions.length}
            </div>
          </div>

          {/* Question List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Question</th>
                  <th className="p-4 w-32">Answer</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-400">{idx + 1}</td>
                    <td className="p-4 font-medium">{q.text}</td>
                    <td className="p-4 uppercase text-green-700 font-bold">{q.correctAnswer.replace('option','')}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setEditingQuestion(q)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded mr-2"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400">
                      No questions yet. Import a CSV file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 3. WELCOME SCREEN
  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-blue-100">
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ANATOMY CBT</h1>
          <p className="text-gray-500 mb-8">Test your knowledge.</p>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-8 space-y-2">
            <p className="flex items-center"><Clock className="w-4 h-4 mr-2"/> <strong>Time Limit:</strong> {DURATION_MINUTES} Minutes</p>
            <p className="flex items-center"><FileText className="w-4 h-4 mr-2"/> <strong>Questions:</strong> {questions.length}</p>
          </div>

          <button 
            onClick={startTest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center mb-6"
          >
            <Play className="w-5 h-5 mr-2" /> Start Test
          </button>

          {/* Admin Login Section */}
          <div className="border-t pt-6">
            <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">Admin Access</p>
            <form onSubmit={handleAdminLogin} className="flex gap-2">
              <input 
                type="password"
                placeholder="Password"
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-gray-800 text-white px-3 py-2 rounded text-sm font-bold hover:bg-black"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 4. TEST SCREEN
  if (view === 'test') {
    const question = questions[currentQIndex];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-bold text-gray-800 text-lg uppercase">Anatomy Test</h1>
          <div className={`font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'} flex items-center`}>
            <Clock className="w-5 h-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Question {currentQIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
              {question.text}
            </h2>

            <div className="space-y-3">
              {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey) => (
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
                  <span className="text-gray-700 font-medium capitalize">
                    <span className="font-bold mr-2 uppercase">{optKey.replace('option', '')}.</span>
                    {question[optKey]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              <button 
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="flex items-center text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-500 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </button>
              
              {currentQIndex === questions.length - 1 ? (
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

  // 5. RESULT SCREEN
  if (view === 'result') {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const isPass = percentage >= 50;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="mb-6 flex justify-center">
            {isPass ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed</h2>
          <div className="flex justify-center items-center gap-4 mb-8">
             <div className="text-center bg-gray-50 p-4 rounded-xl w-1/2">
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Score</span>
                <span className={`text-4xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                    {score}/{questions.length}
                </span>
             </div>
             <div className="text-center bg-gray-50 p-4 rounded-xl w-1/2">
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Percentage</span>
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
      
