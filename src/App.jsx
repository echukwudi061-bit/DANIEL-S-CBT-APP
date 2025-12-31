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
  Settings,
  User,
  LayoutGrid,
  Type,
  Menu,
  Award,
  BarChart3
} from 'lucide-react';

// --- INITIAL DATA FROM CSV ---
const INITIAL_QUESTIONS = [
  {
    "id": "1",
    "text": "which of the following is not an embryogical term",
    "optionA": "zygote",
    "optionB": "ovum",
    "optionC": "cleavage",
    "optionD": "neuron",
    "correctAnswer": "optionD"
  },
  {
    "id": "2",
    "text": "process by which unspecialized cells change into specialized cells with functions is called",
    "optionA": "morphogenesis",
    "optionB": "cytodiffrentiation",
    "optionC": "proliferation",
    "optionD": "Gastrulation",
    "correctAnswer": "optionB"
  },
  {
    "id": "3",
    "text": "gestational age counts from the first day of the mother's last__________",
    "optionA": "ovulation cycle",
    "optionB": "intercourse",
    "optionC": "fertilization date",
    "optionD": "menstrual period",
    "correctAnswer": "optionD"
  },
  {
    "id": "4",
    "text": "__________ is used to assess the stages of embryonic and fetal well-being",
    "optionA": "x-ray",
    "optionB": "MRI",
    "optionC": "ultrasonography",
    "optionD": "Aminocentesis",
    "correctAnswer": "optionC"
  },
  {
    "id": "5",
    "text": "one of these is the outermost layer of the testis",
    "optionA": "Tunica vaginalis",
    "optionB": "Tunica vasculosa",
    "optionC": "Tunica Albuginea",
    "optionD": "Dartos fascia",
    "correctAnswer": "optionA"
  },
  {
    "id": "6",
    "text": "what is the source of testosterone",
    "optionA": "sertoli cells",
    "optionB": "spermatogonia",
    "optionC": "leydig cells",
    "optionD": "Epididymal cells",
    "correctAnswer": "optionC"
  },
  {
    "id": "7",
    "text": "_______ is the process by which primordial germ cells become spermatocytes",
    "optionA": "spermatogenesis",
    "optionB": "spermatocytogenesis",
    "optionC": "spermiogenesis",
    "optionD": "capacitation",
    "correctAnswer": "optionB"
  },
  {
    "id": "8",
    "text": "which of the following undergoes ist meiotic division",
    "optionA": "spermatogonia",
    "optionB": "secondary spermatocytes",
    "optionC": "primary spermatocytes",
    "optionD": "sertoli cells",
    "correctAnswer": "optionC"
  },
  {
    "id": "9",
    "text": "what is the name of the process by which spermatids turn into spermatozoa",
    "optionA": "spermiogenesis",
    "optionB": "meiosis",
    "optionC": "spermatocytogenesis",
    "optionD": "capacitation",
    "correctAnswer": "optionA"
  },
  {
    "id": "10",
    "text": "The dense fibrocellular tissue in the ovary is called",
    "optionA": "Tunica Albuginea",
    "optionB": "stroma",
    "optionC": "germinal epithelium",
    "optionD": "Medulla",
    "correctAnswer": "optionB"
  },
  {
    "id": "11",
    "text": "what part of the ovary is the egg-producing and hormone-producing part",
    "optionA": "Medulla",
    "optionB": "Germinal epithelium",
    "optionC": "stroma",
    "optionD": "parenchyma",
    "correctAnswer": "optionD"
  },
  {
    "id": "12",
    "text": "________is a white scar left after the corpus luteum breaks down",
    "optionA": "corpus albicans",
    "optionB": "corpus spongiosum",
    "optionC": "corpus callosum",
    "optionD": "NOTA",
    "correctAnswer": "optionA"
  },
  {
    "id": "13",
    "text": "_______ is the yellow body formed after ovulation from a follicle that released the egg",
    "optionA": "corpus cavernosum",
    "optionB": "corpus spongiosum",
    "optionC": "NOTA",
    "optionD": "corpus luteum",
    "correctAnswer": "optionD"
  },
  {
    "id": "14",
    "text": "a follicle that started to grow but stopped and died is called_____",
    "optionA": "Antral follicle",
    "optionB": "atretic follicle",
    "optionC": "Graafian follicle",
    "optionD": "primordial follicle",
    "correctAnswer": "optionB"
  },
  {
    "id": "15",
    "text": "_________ is the smallest and most immature follicle",
    "optionA": "primordial follicle",
    "optionB": "primary follicle",
    "optionC": "secondary follicle",
    "optionD": "Graafian follicle",
    "correctAnswer": "optionA"
  },
  {
    "id": "16",
    "text": "__________immediately rises after ovulation",
    "optionA": "oestrogen",
    "optionB": "progesterone",
    "optionC": "Luteinizing Hormone(LH)",
    "optionD": "follicle stimulating hormone(FSH)",
    "correctAnswer": "optionB"
  },
  {
    "id": "17",
    "text": "which male hormone does females have in small amount",
    "optionA": "inhibin",
    "optionB": "Androstenedione",
    "optionC": "Testosterone",
    "optionD": "Luteinizing Hormone",
    "correctAnswer": "optionC"
  },
  {
    "id": "18",
    "text": "primary Oocytes are______and secondary Oocytes are______",
    "optionA": "NOTA",
    "optionB": "Haploid & diploid",
    "optionC": "Haploid & triploid",
    "optionD": "diploid & haploid",
    "correctAnswer": "optionD"
  },
  {
    "id": "19",
    "text": "_________cells convert androgens to oestrogen",
    "optionA": "Therca interna cells",
    "optionB": "granulosa cells",
    "optionC": "leydig cells",
    "optionD": "sertoli cells",
    "correctAnswer": "optionB"
  },
  {
    "id": "20",
    "text": "which phase are the primary Oocytes arrested at until puberty",
    "optionA": "prophase of meiosis 1",
    "optionB": "metaphase of meiosis I",
    "optionC": "anaphase of meiosis 1",
    "optionD": "prophase of meiosis II",
    "correctAnswer": "optionA"
  },
  {
    "id": "21",
    "text": "______ are the cyclic changes that occur in the ovaries",
    "optionA": "menstrual cycle",
    "optionB": "ovarian cycle",
    "optionC": "follicular cycle",
    "optionD": "Endometrial cycle",
    "correctAnswer": "optionB"
  },
  {
    "id": "22",
    "text": "______, _______ and _________ are the layers of the endometrium",
    "optionA": "Superficial, deep, and intermediate",
    "optionB": "compact, spongy and basal",
    "optionC": "Mucosa, submucosa, and muscularis",
    "optionD": "Perimetrium, myometrium, and endometrium",
    "correctAnswer": "optionB"
  },
  {
    "id": "23",
    "text": "_________ is the longest phase of the menstrual cycle",
    "optionA": "follicular phase",
    "optionB": "luteal phase",
    "optionC": "ovulatory phase",
    "optionD": "menstrual phase",
    "correctAnswer": "optionA"
  },
  {
    "id": "24",
    "text": "_________layer of the endometrium does not shed during menstruation",
    "optionA": "compact layer",
    "optionB": "functional layer",
    "optionC": "spongy layer",
    "optionD": "Basal layer",
    "correctAnswer": "optionB"
  },
  {
    "id": "25",
    "text": "when relating ovarian cycle to uterine cycle, follicular phase is equal to_______________",
    "optionA": "Ovulation and Secretory phase",
    "optionB": "Menstrual phase and Secretory phase",
    "optionC": "menstrual phase and proliferative phase",
    "optionD": "Proliferative phase and Secretory phase",
    "correctAnswer": "optionC"
  },
  {
    "id": "26",
    "text": "__________ is the final maturation step sperm undergo inside the female reproductive tract",
    "optionA": "fertilization",
    "optionB": "ovulation",
    "optionC": "spermiogenesis",
    "optionD": "capacitation",
    "correctAnswer": "optionD"
  },
  {
    "id": "27",
    "text": "which of the following is not a membrane protecting the eggs cytoplasms",
    "optionA": "The corona radiata",
    "optionB": "The zona pellucida",
    "optionC": "The vitelline membrane",
    "optionD": "cell membrane",
    "correctAnswer": "optionD"
  },
  {
    "id": "28",
    "text": "_________induces the acrosome reaction",
    "optionA": "The corona radiata",
    "optionB": "The vitelline membrane",
    "optionC": "The zona pellucida",
    "optionD": "The previtelline space",
    "correctAnswer": "optionC"
  },
  {
    "id": "29",
    "text": "what region does fertilization occur in the uterine tube",
    "optionA": "Ampullary region",
    "optionB": "infundibulum",
    "optionC": "isthmus",
    "optionD": "Uterine part(intramural)",
    "correctAnswer": "optionA"
  },
  {
    "id": "30",
    "text": "_________are granulosa cells that still stick to the egg when it leaves the follicle",
    "optionA": "antral cells",
    "optionB": "corona cells",
    "optionC": "zona pellucida",
    "optionD": "Theca interna cells",
    "correctAnswer": "optionB"
  },
  {
    "id": "31",
    "text": "cleavage is the process of___________",
    "optionA": "Fusion of egg and sperm",
    "optionB": "subdivision of zygote into smaller cells",
    "optionC": "formation of placenta",
    "optionD": "formation of gamates",
    "correctAnswer": "optionB"
  },
  {
    "id": "32",
    "text": "The 2-cell stage occurs approximately how long after fertilization",
    "optionA": "10 hours",
    "optionB": "30 hours",
    "optionC": "72 hours",
    "optionD": "5 days",
    "correctAnswer": "optionB"
  },
  {
    "id": "33",
    "text": "which of the following forms after repeated mitotic divisions of the zygote?",
    "optionA": "morula",
    "optionB": "Trophoblast",
    "optionC": "Blastomeres",
    "optionD": "Zona pellucida",
    "correctAnswer": "optionC"
  },
  {
    "id": "34",
    "text": "Which process helps blastomeres form a compact ball after the 8-cell stage?",
    "optionA": "cleavage",
    "optionB": "compaction",
    "optionC": "ovulation",
    "optionD": "Hatching",
    "correctAnswer": "optionB"
  },
  {
    "id": "35",
    "text": "where does implantation of the blastocyst occur?",
    "optionA": "fallopian tube",
    "optionB": "uterine wall",
    "optionC": "ovary",
    "optionD": "cervix",
    "correctAnswer": "optionB"
  },
  {
    "id": "36",
    "text": "________ is the period of organogenesis",
    "optionA": "embryonic period",
    "optionB": "fetal period",
    "optionC": "Germinal period",
    "optionD": "pre-embryonic period",
    "correctAnswer": "optionA"
  },
  {
    "id": "37",
    "text": "__________is the process where the ectoderm forms the neural tube",
    "optionA": "neurulation",
    "optionB": "Gastrulation",
    "optionC": "Blastulation",
    "optionD": "somitogenesis",
    "correctAnswer": "optionA"
  },
  {
    "id": "38",
    "text": "__________ part forms the spinal cord",
    "optionA": "The spinal part",
    "optionB": "The caudal part",
    "optionC": "Neural crest",
    "optionD": "Notochord",
    "correctAnswer": "optionB"
  },
  {
    "id": "39",
    "text": "which of the following are not neural crest cells derivatives",
    "optionA": "odontoblasts",
    "optionB": "schawann cells",
    "optionC": "Glial cells",
    "optionD": "granulosa cells",
    "correctAnswer": "optionD"
  },
  {
    "id": "40",
    "text": "The ectodermal germ layer gives rise to the following except",
    "optionA": "The central nervous system",
    "optionB": "peripheral nervous system",
    "optionC": "epidermis of the hair and nails",
    "optionD": "skeletal system",
    "correctAnswer": "optionD"
  },
  {
    "id": "41",
    "text": "________ forms somites",
    "optionA": "paraxial mesoderm",
    "optionB": "lateral plate mesoderm",
    "optionC": "intermediate mesoderm",
    "optionD": "parietal mesoderm",
    "correctAnswer": "optionA"
  },
  {
    "id": "42",
    "text": "______ which germ layers produce the blood vessels",
    "optionA": "ectodermal germ layer",
    "optionB": "mesodermal germ layer",
    "optionC": "endodermal germ layer",
    "optionD": "NOTA",
    "correctAnswer": "optionB"
  },
  {
    "id": "43",
    "text": "which germ layer gives rise to the inner lining of the stomach",
    "optionA": "endodermal germ layer",
    "optionB": "ectodermal germ layer",
    "optionC": "mesodermal germ layer",
    "optionD": "NOTA",
    "correctAnswer": "optionA"
  },
  {
    "id": "44",
    "text": "______ is the formation of the shape of the embryo",
    "optionA": "morphogenesis",
    "optionB": "Differentiation",
    "optionC": "Gastrulation",
    "optionD": "Neurulation",
    "correctAnswer": "optionA"
  },
  {
    "id": "45",
    "text": "_______ process is the expansion of already existing blood vessels",
    "optionA": "Vasculogenesis",
    "optionB": "angiogenesis",
    "optionC": "Gastrulation",
    "optionD": "Differentiation",
    "correctAnswer": "optionB"
  },
  {
    "id": "46",
    "text": "which of the following is the part of the blastocyst that forms the placenta",
    "optionA": "embryoblast",
    "optionB": "Trophoblast",
    "optionC": "morula",
    "optionD": "Zona pellucida",
    "correctAnswer": "optionB"
  },
  {
    "id": "47",
    "text": "The specific part of the mother's uterus where the placenta attaches itself is called?",
    "optionA": "Decidua capsularis",
    "optionB": "endometrium lining",
    "optionC": "chorionic vili",
    "optionD": "Decidua basalis",
    "correctAnswer": "optionD"
  },
  {
    "id": "48",
    "text": "Exchange of nutrients and waste between mother and fetus occurs through the?",
    "optionA": "Decidua basalis",
    "optionB": "chorionic vili",
    "optionC": "Amniotic sac",
    "optionD": "free vili",
    "correctAnswer": "optionB"
  },
  {
    "id": "49",
    "text": "what is the name of the process by which the three germ layers are established",
    "optionA": "Neurulation",
    "optionB": "Gastrulation",
    "optionC": "cleavage",
    "optionD": "implantation",
    "correctAnswer": "optionB"
  },
  {
    "id": "50",
    "text": "which of the following represents the future opening of the oral cavity",
    "optionA": "Cloacal membrane",
    "optionB": "primitive streak",
    "optionC": "Buccopharyngeal membrane",
    "optionD": "neural plate",
    "correctAnswer": "optionC"
  }
];

// --- HELPER: FISHER-YATES SHUFFLE ---
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function App() {
  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [view, setView] = useState('welcome');

  // 1. Questions - Randomized on initial load if fresh
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('cbt_questions');
    // If we have saved questions, use them. If not, use a SHUFFLED version of initial questions.
    return saved ? JSON.parse(saved) : shuffleArray([...INITIAL_QUESTIONS]);
  });

  // 2. App Name
  const [appName, setAppName] = useState(() => {
    return localStorage.getItem('cbt_appName') || "DANIEL'S ANATOMY CBT APP";
  });

  // 3. Test Title
  const [testTitle, setTestTitle] = useState(() => {
    return localStorage.getItem('cbt_testTitle') || "ANAT 213: GENERAL EMBRYO AND GENETICS";
  });

  // 4. Duration
  const [testDuration, setTestDuration] = useState(() => {
    const saved = localStorage.getItem('cbt_duration');
    return saved ? parseInt(saved, 10) : 20;
  });

  // 5. Marks Per Question
  const [marksPerQuestion, setMarksPerQuestion] = useState(() => {
    const saved = localStorage.getItem('cbt_marks');
    return saved ? parseInt(saved, 10) : 2;
  });

  // 6. Student Results
  const [testResults, setTestResults] = useState(() => {
    const saved = localStorage.getItem('cbt_results');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Test Taking State ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Admin State ---
  const [adminPassInput, setAdminPassInput] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const fileInputRef = useRef(null);

  // --- EFFECT: SAVE TO LOCAL STORAGE ---
  useEffect(() => { localStorage.setItem('cbt_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('cbt_appName', appName); }, [appName]);
  useEffect(() => { localStorage.setItem('cbt_testTitle', testTitle); }, [testTitle]);
  useEffect(() => { localStorage.setItem('cbt_duration', testDuration.toString()); }, [testDuration]);
  useEffect(() => { localStorage.setItem('cbt_marks', marksPerQuestion.toString()); }, [marksPerQuestion]);
  useEffect(() => { localStorage.setItem('cbt_results', JSON.stringify(testResults)); }, [testResults]);

  // --- Timer Logic ---
  useEffect(() => {
    if (view === 'test' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (view === 'test' && timeLeft === 0) {
      handleSubmit(); 
    }
  }, [view, timeLeft]);

  // --- Handlers ---
  const startTest = () => {
    if (questions.length === 0) {
      alert("No questions available! Please login as admin and add some.");
      return;
    }
    
    // --- RANDOMIZE QUESTIONS FOR THIS ATTEMPT ---
    const randomizedQuestions = shuffleArray([...questions]);
    setQuestions(randomizedQuestions);
    
    setAnswers({});
    setScore(0);
    setCurrentQIndex(0);
    setTimeLeft(testDuration * 60); 
    setView('test');
    setIsMobileMenuOpen(false);
  };

  const handleAnswerSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    let rawScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        rawScore += 1;
      }
    });

    const finalScore = rawScore * marksPerQuestion;
    const totalPossible = questions.length * marksPerQuestion;
    const percentage = Math.round((finalScore / totalPossible) * 100);

    // Save Result
    const newResult = {
      id: Date.now(),
      score: finalScore,
      total: totalPossible,
      percentage: percentage,
      date: new Date().toLocaleString()
    };
    setTestResults(prev => [newResult, ...prev]);
    setScore(finalScore);
    setView('result');
  };

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

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newQuestions = [];
      
      lines.forEach((line, idx) => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 6 && idx > 0) {
           const clean = (str) => str?.replace(/^"|"$/g, '').trim() || '';
           let correctKey = clean(parts[5]).toLowerCase();
           
           if (correctKey === 'a' || correctKey.includes('option a')) correctKey = 'optionA';
           else if (correctKey === 'b' || correctKey.includes('option b')) correctKey = 'optionB';
           else if (correctKey === 'c' || correctKey.includes('option c')) correctKey = 'optionC';
           else if (correctKey === 'd' || correctKey.includes('option d')) correctKey = 'optionD';
           else correctKey = 'optionA';

           newQuestions.push({
             id: Date.now() + Math.random().toString(),
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
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Reset to Default (Admin Action) ---
  const handleResetDefaults = () => {
    if(window.confirm("Reset all settings and questions to default? This clears your changes.")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const handleClearResults = () => {
    if(window.confirm("Clear all student results?")) {
      setTestResults([]);
    }
  };

  // ---------------- RENDERING ----------------

  // 1. EDIT MODAL
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
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
            <h1 className="text-xl md:text-2xl font-bold flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600"/> Admin Panel
            </h1>
            <div className="flex gap-2">
                <button 
                onClick={handleResetDefaults}
                className="flex items-center text-gray-500 font-bold hover:bg-gray-200 px-3 py-2 rounded text-sm"
                >
                Reset Defaults
                </button>
                <button 
                onClick={() => setView('welcome')}
                className="flex items-center text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded"
                >
                <LogOut className="w-5 h-5 mr-2"/> Exit
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
              <Settings className="w-5 h-5 mr-2"/> Test Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Type className="w-4 h-4 mr-1 text-gray-400"/> App Name
                </label>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                <input 
                  type="text" 
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              {/* Duration Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                   <Clock className="w-4 h-4 mr-1 text-gray-400"/> Duration (Minutes)
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setTestDuration(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                  >-</button>
                  <span className="text-xl font-mono font-bold w-12 text-center">{testDuration}</span>
                  <button 
                    onClick={() => setTestDuration(prev => prev + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                  >+</button>
                </div>
              </div>

              {/* Marks Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-gray-400"/> Marks per Question
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setMarksPerQuestion(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                  >-</button>
                  <span className="text-xl font-mono font-bold w-12 text-center">{marksPerQuestion}</span>
                  <button 
                    onClick={() => setMarksPerQuestion(prev => prev + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                  >+</button>
                </div>
              </div>

            </div>
          </div>
                       {/* Student Results Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center text-gray-800">
                  <BarChart3 className="w-5 h-5 mr-2"/> Student Results
                </h2>
                <button 
                   onClick={handleClearResults}
                   className="text-red-500 text-sm font-bold hover:underline"
                >
                   Clear History
                </button>
             </div>
             
              <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 border-b">
                   <tr>
                     <th className="p-3">Score</th>
                     <th className="p-3">Percentage</th>
                     <th className="p-3 text-right">Date/Time</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {testResults.length === 0 ? (
                     <tr>
                       <td colSpan="3" className="p-4 text-center text-gray-400 italic">No results yet.</td>
                     </tr>
                   ) : (
                       testResults.map((res) => (
                       <tr key={res.id} className="hover:bg-gray-50">
                         <td className="p-3 font-bold">{res.score} / {res.total}</td>
                         <td className={`p-3 font-bold ${res.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                           {res.percentage}%
                         </td>
                         <td className="p-3 text-right text-gray-500">{res.date}</td>
                       </tr>
                     ))
                   )}
                 </tbody>
                </table>
               <p className="text-xs text-gray-400 mt-2 italic">* Only shows results taken on this specific device.</p>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef}
              onChange={handleCSVUpload}
              className="hidden" 
            />
            <div className="flex gap-2 w-full md:w-auto">
                <button 
                onClick={() => fileInputRef.current.click()}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
                >
                <Upload className="w-5 h-5 mr-2"/> Import CSV
                </button>
                <button 
                  onClick={() => { if(window.confirm("Delete ALL questions?")) setQuestions([]); }}
                className="flex-1 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-bold"
                >
                <Trash2 className="w-5 h-5 mr-2"/> Clear All
                </button>
            </div>
            <div className="md:ml-auto font-bold text-gray-500">
              Total: {questions.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
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
                    <td className="p-4 font-medium max-w-xs truncate">{q.text}</td>
                    <td className="p-4 uppercase text-green-700 font-bold">{q.correctAnswer.replace('option','')}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setEditingQuestion(q)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded mr-2"
                      >
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))}
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
              <button className="bg-gray-800 text-white px-3 py-2 rounded text-sm font-bold hover:bg-black">Login</button>
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
      <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
        {/* Header - Optimized for Mobile */}
        <header className="bg-white shadow-sm px-3 md:px-6 py-3 flex justify-between items-center z-20 flex-shrink-0 w-full relative">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-600"/>
            </button>

            <div className="flex flex-col overflow-hidden min-w-0">
               {/* --- UPDATE: App Name shown here --- */}
               <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase truncate">
                  {appName}
               </span>
              <h1 className="font-bold text-gray-800 text-xs md:text-lg uppercase truncate leading-tight">
                {testTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className={`font-mono font-bold text-sm md:text-xl ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'} flex items-center`}>
              <Clock className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              {formatTime(timeLeft)}
            </div>
            
            <button 
              onClick={() => {
                  if(window.confirm("Are you sure you want to submit?")) handleSubmit();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-md transition text-xs md:text-base whitespace-nowrap"
            >
              Submit
            </button>
          </div>
        </header>

        {/* Main Layout */}
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
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="md:hidden p-1 text-gray-500"
                    >
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
                                    onClick={() => {
                                      setCurrentQIndex(idx);
                                      setIsMobileMenuOpen(false);
                                    }}
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
                        <span className="font-bold">{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-gray-600"><div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full mr-2"/> Unanswered</span>
                        <span className="font-bold">{questions.length - Object.keys(answers).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center text-blue-600"><div className="w-2 h-2 md:w-3 md:h-3 border-2 border-blue-600 rounded-full mr-2"/> Current</span>
                        <span className="font-bold">#{currentQIndex + 1}</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-8 w-full">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-10 min-h-[50vh]">
                        <div className="mb-4 md:mb-6 flex justify-between items-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                Question {currentQIndex + 1} of {questions.length}
                            </span>
                            <span className="md:hidden text-[10px] font-bold text-gray-400">
                                {Object.keys(answers).length}/{questions.length} Done
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
                                `}>                              {answers[question.id] === optKey && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500" />}
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
      </div>
    );
        }
                                        // 5. RESULT SCREEN
  if (view === 'result') {
    const totalPossibleScore = questions.length * marksPerQuestion;
    const percentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
    const isPass = percentage >= 50;

    return (
      <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center">
            <div className="mb-4 flex justify-center">
              {isPass ? <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500" /> : <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500" />}
            </div>
            
            {/* --- UPDATE: App Name shown here --- */}
            <h3 className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider mb-1">{appName}</h3>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Test Completed</h2>
            <p className="text-gray-500 font-medium mb-6 uppercase text-sm md:text-base">{testTitle}</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 mt-6">
               <div className="text-center bg-gray-50 p-4 rounded-xl w-full md:w-1/3">
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Score</span>
                  <span className={`text-3xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                      {score} / {totalPossibleScore}
                  </span>
               </div>
              
               <div className="text-center bg-gray-50 p-4 rounded-xl w-full md:w-1/3">
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Percentage</span>
                  <span className={`text-3xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                      {percentage}%
                  </span>
               </div>
            </div>
            <button 
              onClick={() => setView('welcome')}
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
                {questions.map((q, idx) => {
                    const userAns = answers[q.id];
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
