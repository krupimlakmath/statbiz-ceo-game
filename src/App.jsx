```react
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, AlertCircle, ArrowRight, Star, Award, Briefcase, ChevronRight, Check, Users, TrendingUp } from 'lucide-react';

// --- STYLES & THEME ---
const THEME = {
  bg: 'bg-gradient-to-br from-indigo-900 via-blue-800 to-sky-900',
  card: 'bg-white rounded-3xl shadow-2xl border-0 p-4 md:p-8',
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200',
  secondary: 'bg-sky-100 hover:bg-sky-200 text-sky-800',
  text: 'text-slate-700',
  title: 'text-indigo-800 font-bold',
};

// --- DATA CONFIG ---
const generateRandomQueue = () => {
  const items = [...Array(8).fill('🧋'), ...Array(7).fill('🍵'), ...Array(5).fill('🍫')];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const PHASE_INFO = {
  1: {
    title: "ร้านเครื่องดื่มชานมไข่มุก 🧋",
    level: "เริ่มต้น",
    goal: "เรียนรู้การจัดระเบียบข้อมูลและคำนวณสถิติพื้นฐาน",
    color: "from-orange-400 to-amber-600",
    bgLight: "bg-orange-50",
    icon: "🧋"
  },
  2: {
    title: "ร้านเบเกอรี่แสนหวาน 🥐",
    level: "ปานกลาง",
    goal: "เรียนรู้ความสัมพันธ์ของข้อมูลแบบสองมิติและการนำเสนอข้อมูล",
    color: "from-amber-500 to-pink-500",
    bgLight: "bg-amber-50",
    icon: "🥐"
  },
  3: {
    title: "ร้านอาหาร Fine Dining 🥩",
    level: "ประยุกต์ขั้นสูง",
    goal: "วิเคราะห์ข้อมูลข้อความเชิงลึก และสรุปภาพรวมเพื่อการบริหาร",
    color: "from-rose-500 to-red-700",
    bgLight: "bg-rose-50",
    icon: "🥩"
  }
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [viewState, setViewState] = useState('intro'); // intro, phase_intro, playing, ending
  const [currentMission, setCurrentMission] = useState(1);
  const [score, setScore] = useState(100);
  const [playerInfo, setPlayerInfo] = useState({ name: '', classStr: '', number: '' });
  
  // Custom Overlays
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Font Injection
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
      .font-sarabun { font-family: 'Sarabun', sans-serif; }
      .swal-backdrop { animation: fadeIn 0.3s ease; }
      .swal-popup { animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .spin-slow { animation: spin 3s linear infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const currentPhase = currentMission <= 5 ? 1 : currentMission <= 10 ? 2 : 3;

  const showLoading = (callback) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 1200);
  };

  const startGame = () => showLoading(() => setViewState('phase_intro'));

  const handleCorrect = () => {
    setAlert({
      type: 'success',
      title: 'ยอดเยี่ยมมาก!',
      text: 'วิเคราะห์ข้อมูลได้อย่างถูกต้อง เฉียบขาดมากท่าน CEO',
      onConfirm: () => {
        setAlert(null);
        if (currentMission === 15) {
          showLoading(() => setViewState('ending'));
        } else if (currentMission === 5 || currentMission === 10) {
          setCurrentMission(prev => prev + 1);
          showLoading(() => setViewState('phase_intro'));
        } else {
          setCurrentMission(prev => prev + 1);
        }
      }
    });
  };

  const handleError = () => {
    setScore(prev => Math.max(0, prev - 2));
    setAlert({
      type: 'error',
      title: 'ข้อมูลคลาดเคลื่อน!',
      text: 'อ๊ะ! การตัดสินใจยังไม่ถูกต้อง ลองวิเคราะห์ข้อมูลใหม่อีกครั้งนะ ✌️',
      onConfirm: () => setAlert(null)
    });
  };

  const handleWarning = (msg) => {
    setAlert({
      type: 'warning',
      title: 'ข้อมูลไม่ครบถ้วน',
      text: msg || 'กรุณากรอกข้อมูลให้ครบทุกช่องก่อนดำเนินการครับ',
      onConfirm: () => setAlert(null)
    });
  };

  const resetGame = () => {
    showLoading(() => {
      setViewState('intro');
      setCurrentMission(1);
      setScore(100);
      setPlayerInfo({ name: '', classStr: '', number: '' });
    });
  };

  return (
    <div className={`min-h-screen ${THEME.bg} font-sarabun text-slate-800 flex flex-col relative`}>
      
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-3 md:p-8 z-10 pb-20">
        <div className="max-w-4xl w-full">
          {viewState === 'intro' && (
            <IntroScreen 
              onStart={startGame} 
              playerInfo={playerInfo} 
              setPlayerInfo={setPlayerInfo} 
              onWarning={handleWarning} 
            />
          )}
          {viewState === 'phase_intro' && (
            <PhaseIntroScreen 
              phase={currentPhase} 
              onStart={() => showLoading(() => setViewState('playing'))} 
            />
          )}
          {viewState === 'playing' && (
            <div className="space-y-4 md:space-y-6">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center bg-white/95 backdrop-blur rounded-2xl p-3 md:p-4 shadow-lg border-b-4" style={{ borderColor: currentPhase === 1 ? '#f97316' : currentPhase === 2 ? '#d97706' : '#be123c' }}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-inner ${PHASE_INFO[currentPhase].bgLight}`}>
                    {PHASE_INFO[currentPhase].icon}
                  </div>
                  <div>
                    <h2 className="text-base md:text-xl font-bold text-slate-800 leading-tight">
                      Phase {currentPhase}: {PHASE_INFO[currentPhase].title}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">ภารกิจที่ {currentMission}/15 • Level: {PHASE_INFO[currentPhase].level}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider hidden md:block">Performance</span>
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 md:px-3 md:py-1 rounded-full border border-slate-200">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg md:text-xl font-bold text-indigo-700">{score}</span>
                  </div>
                </div>
              </div>

              {/* Mission Content */}
              <div className={`${THEME.card}`}>
                {currentMission === 1 && <Mission1 onSuccess={handleCorrect} />}
                {currentMission === 2 && <Mission2 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 3 && <Mission3 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 4 && <Mission4 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 5 && <Mission5 onSuccess={handleCorrect} onError={handleError} />}
                
                {currentMission === 6 && <Mission6 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 7 && <Mission7 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 8 && <Mission8 onSuccess={handleCorrect} onError={handleError} />}
                {currentMission === 9 && <Mission9 onSuccess={handleCorrect} onError={handleError} />}
                {currentMission === 10 && <Mission10 onSuccess={handleCorrect} onError={handleError} />}
                
                {currentMission === 11 && <Mission11 onSuccess={handleCorrect} onError={handleError} onWarning={handleWarning} />}
                {currentMission === 12 && <Mission12 onSuccess={handleCorrect} onError={handleError} />}
                {currentMission === 13 && <Mission13 onSuccess={handleCorrect} onError={handleError} />}
                {currentMission === 14 && <Mission14 onSuccess={handleCorrect} onError={handleError} />}
                {currentMission === 15 && <Mission15 onSuccess={handleCorrect} onError={handleError} />}
              </div>
            </div>
          )}
          {viewState === 'ending' && <EndingScreen score={score} playerInfo={playerInfo} onRestart={resetGame} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-white/70 text-xs md:text-sm absolute bottom-0 font-medium z-0">
        © 2026 Copyright | พัฒนาโดย คุณครูพิมพ์ลักษณ์ เจริญวานิชกูร
      </footer>

      {/* --- OVERLAYS --- */}
      {isLoading && <LoadingOverlay />}
      {alert && <SweetAlert {...alert} />}

    </div>
  );
}

// ==========================================
// OVERLAYS (Loading & SweetAlert)
// ==========================================

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-indigo-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center swal-backdrop">
      <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-indigo-200 border-t-white rounded-full animate-spin mb-4"></div>
      <h3 className="text-white text-lg md:text-xl font-bold tracking-widest animate-pulse">กำลังประมวลผล...</h3>
    </div>
  );
}

function SweetAlert({ type, title, text, onConfirm }) {
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  
  let iconBg = 'bg-rose-100 text-rose-500';
  let btnBg = 'bg-rose-500 hover:bg-rose-600';
  let Icon = AlertCircle;

  if (isSuccess) {
    iconBg = 'bg-emerald-100 text-emerald-500';
    btnBg = 'bg-emerald-500 hover:bg-emerald-600';
    Icon = Check;
  } else if (isWarning) {
    iconBg = 'bg-amber-100 text-amber-500';
    btnBg = 'bg-amber-500 hover:bg-amber-600';
    Icon = AlertCircle;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 swal-backdrop">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl swal-popup flex flex-col items-center">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-inner ${iconBg}`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8">{text}</p>
        <button 
          onClick={onConfirm}
          className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 ${btnBg}`}
        >
          {isSuccess ? 'ลุยภารกิจต่อไป!' : 'ตกลง'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SCREENS
// ==========================================

function IntroScreen({ onStart, playerInfo, setPlayerInfo, onWarning }) {
  const handleStartClick = () => {
    if (!playerInfo.name.trim() || !playerInfo.classStr.trim() || !playerInfo.number.trim()) {
      onWarning('กรุณากรอกข้อมูล "ชื่อ-นามสกุล", "ชั้นเรียน" และ "เลขที่" ให้ครบถ้วนเพื่อเริ่มบริหารธุรกิจครับ');
      return;
    }
    onStart();
  };

  return (
    <div className={`${THEME.card} text-center space-y-6 md:space-y-8 py-10 md:py-14 relative overflow-hidden`}>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-50 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="bg-indigo-100 p-4 md:p-5 rounded-3xl shadow-inner">
            <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-2 tracking-tight">
          StatBiz CEO
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-500 font-semibold mb-4 tracking-wide">สถิติพิชิตธุรกิจ 📊</h2>
        
        <p className="text-slate-600 max-w-lg mx-auto leading-relaxed text-sm md:text-lg mb-6">
          ยินดีต้อนรับท่าน CEO คนใหม่! ภารกิจของคุณคือการบริหารธุรกิจ 3 ระดับ 
          โดยใช้ <b>"ข้อมูลเชิงคุณภาพ"</b> มาวิเคราะห์เพื่อการตัดสินใจ
        </p>

        {/* Player Form */}
        <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 max-w-lg mx-auto mb-8 text-left space-y-4 shadow-sm">
          <h3 className="font-bold text-indigo-900 text-base md:text-lg flex items-center gap-2 border-b border-indigo-100 pb-2">
            <Users className="w-5 h-5"/> ข้อมูลผู้บริหาร (CEO)
          </h3>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-600 mb-1">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
              placeholder="นาย / นางสาว"
              value={playerInfo.name}
              onChange={e => setPlayerInfo({...playerInfo, name: e.target.value})}
            />
          </div>
          <div className="flex gap-3 md:gap-4">
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-semibold text-slate-600 mb-1">ชั้นเรียน</label>
              <input 
                type="text" 
                className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                placeholder="เช่น ม.6/1"
                value={playerInfo.classStr}
                onChange={e => setPlayerInfo({...playerInfo, classStr: e.target.value})}
              />
            </div>
            <div className="w-24 md:w-32">
              <label className="block text-xs md:text-sm font-semibold text-slate-600 mb-1">เลขที่</label>
              <input 
                type="text" 
                inputMode="numeric"
                className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                placeholder="เลขที่"
                value={playerInfo.number}
                onChange={e => setPlayerInfo({...playerInfo, number: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleStartClick}
          className={`${THEME.primary} px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-lg md:text-xl flex items-center justify-center gap-3 mx-auto transform hover:scale-105 transition-all duration-300 w-full md:w-auto`}
        >
          <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> เข้าสู่ระบบบริหารงาน
        </button>
      </div>
    </div>
  );
}

function PhaseIntroScreen({ phase, onStart }) {
  const info = PHASE_INFO[phase];
  return (
    <div className={`${THEME.card} text-center space-y-6 md:space-y-8 py-10 md:py-12 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${info.color}`}></div>
      
      <div className="text-6xl md:text-7xl animate-bounce mb-2 md:mb-4">{info.icon}</div>
      
      <div className="space-y-2 md:space-y-4">
        <h3 className="text-indigo-500 font-bold tracking-widest uppercase text-xs md:text-sm">ยินดีต้อนรับท่าน CEO</h3>
        <h1 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
          บริหารธุรกิจ<br className="block md:hidden"/>{info.title}
        </h1>
        <div className="inline-block bg-slate-100 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-slate-600 font-semibold text-xs md:text-sm border border-slate-200 mt-2">
          Level: {info.level}
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 md:p-6 max-w-lg mx-auto shadow-sm">
        <h4 className="font-bold text-indigo-800 mb-2 flex items-center justify-center gap-2 text-sm md:text-base">
          <Award className="w-4 h-4 md:w-5 md:h-5" /> เป้าหมายการเรียนรู้
        </h4>
        <p className="text-slate-700 text-sm md:text-lg">{info.goal}</p>
      </div>

      <button 
        onClick={onStart}
        className={`bg-gradient-to-r ${info.color} text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg flex items-center justify-center gap-2 mx-auto transform hover:scale-105 transition-all shadow-lg w-full md:w-auto mt-4`}
      >
        เริ่มบริหารกิจการ <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function EndingScreen({ score, playerInfo, onRestart }) {
  // Logic สำหรับจัดสถานะและจำนวนลูกค้าตามคะแนน
  const getShopStatus = (type) => {
    if (score >= 80) { // สูง
      if (type === 'drink') return { text: "ลูกค้าเต็มร้านล้นทะลัก!", color: "text-emerald-600", dot: "bg-emerald-500", ping: "bg-emerald-400" };
      if (type === 'bakery') return { text: "คิวยาวทะลุซอย!", color: "text-emerald-600", dot: "bg-emerald-500", ping: "bg-emerald-400" };
      if (type === 'resto') return { text: "จองโต๊ะเต็มข้ามปี!", color: "text-emerald-600", dot: "bg-emerald-500", ping: "bg-emerald-400" };
    } else if (score >= 50) { // ปานกลาง
      if (type === 'drink') return { text: "ลูกค้าแวะมาเรื่อยๆ", color: "text-amber-600", dot: "bg-amber-500", ping: "bg-amber-400" };
      if (type === 'bakery') return { text: "ขายหมดพอดีตอนเย็น", color: "text-amber-600", dot: "bg-amber-500", ping: "bg-amber-400" };
      if (type === 'resto') return { text: "โต๊ะเต็มช่วงสุดสัปดาห์", color: "text-amber-600", dot: "bg-amber-500", ping: "bg-amber-400" };
    } else { // ต่ำ
      if (type === 'drink') return { text: "ลูกค้าน้อยไปนิด จัดโปรด่วน!", color: "text-rose-500", dot: "bg-rose-500", ping: "bg-rose-400" };
      if (type === 'bakery') return { text: "ขนมเหลือเพียบ...", color: "text-rose-500", dot: "bg-rose-500", ping: "bg-rose-400" };
      if (type === 'resto') return { text: "มีโต๊ะว่างหลายโต๊ะเลย", color: "text-rose-500", dot: "bg-rose-500", ping: "bg-rose-400" };
    }
  };

  const drinkStatus = getShopStatus('drink');
  const bakeryStatus = getShopStatus('bakery');
  const restoStatus = getShopStatus('resto');

  return (
    <div className={`${THEME.card} text-center space-y-6 md:space-y-8 py-8 md:py-10 relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
      
      {/* Header */}
      <div className="space-y-2 md:space-y-3">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800">StatBiz CEO</h1>
        <h2 className="text-2xl md:text-4xl font-black text-indigo-600">สถิติพิชิตธุรกิจ</h2>
        <p className="text-sm md:text-lg text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 inline-block px-4 py-1.5 rounded-full mt-2">สรุปผลการบริหารธุรกิจของ CEO</p>
      </div>

      {/* CEO Identity */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-900 px-4 py-3 md:px-8 md:py-4 rounded-2xl inline-flex flex-col md:flex-row items-center gap-2 md:gap-4 shadow-sm w-full md:w-auto">
        <div className="flex items-center gap-2 font-black text-lg md:text-2xl">
          <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" /> 
          <span>{playerInfo.name || 'ผู้บริหารนิรนาม'}</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-indigo-300"></div>
        <div className="text-sm md:text-base font-semibold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
          ชั้น {playerInfo.classStr || '-'} | เลขที่ {playerInfo.number || '-'}
        </div>
      </div>

      {/* The 3 Active Shops */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-md transform hover:scale-105 transition-all flex flex-col items-center">
          <div className="text-5xl md:text-6xl mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(251,146,60,0.6)]">🧋</div>
          <h3 className="font-bold text-orange-800 text-base md:text-lg">ร้านเครื่องดื่ม</h3>
          <div className={`text-xs md:text-sm flex justify-center gap-1 mt-1 items-center font-bold ${drinkStatus.color}`}>
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${drinkStatus.ping}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${drinkStatus.dot}`}></span>
            </span>
            {drinkStatus.text}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-md transform hover:scale-105 transition-all flex flex-col items-center" style={{animationDelay: '0.2s'}}>
          <div className="text-5xl md:text-6xl mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">🥐</div>
          <h3 className="font-bold text-amber-800 text-base md:text-lg">ร้านเบเกอรี่</h3>
          <div className={`text-xs md:text-sm flex justify-center gap-1 mt-1 items-center font-bold ${bakeryStatus.color}`}>
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bakeryStatus.ping}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${bakeryStatus.dot}`}></span>
            </span>
            {bakeryStatus.text}
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-md transform hover:scale-105 transition-all flex flex-col items-center" style={{animationDelay: '0.4s'}}>
          <div className="text-5xl md:text-6xl mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">🥩</div>
          <h3 className="font-bold text-rose-800 text-base md:text-lg">ร้านอาหาร</h3>
          <div className={`text-xs md:text-sm flex justify-center gap-1 mt-1 items-center font-bold ${restoStatus.color}`}>
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${restoStatus.ping}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${restoStatus.dot}`}></span>
            </span>
            {restoStatus.text}
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-200 flex flex-col items-center">
        <h3 className="font-bold text-slate-500 mb-3 tracking-wide uppercase text-xs md:text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /> กราฟสรุปคะแนนความแม่นยำ
        </h3>
        <div className="w-full max-w-md bg-slate-200 rounded-full h-6 md:h-8 relative overflow-hidden shadow-inner mb-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full flex items-center justify-end px-3 text-white font-black text-sm md:text-lg transition-all duration-1000 ease-out" 
            style={{ width: `${score}%` }}
          >
            {score}%
          </div>
        </div>
        <p className="text-base md:text-lg font-bold text-indigo-700">
          ระดับการบริหาร: {score >= 80 ? 'ผู้บริหารระดับสูง 🌟' : score >= 50 ? 'ผู้จัดการทั่วไป 👍' : 'พนักงานฝึกหัด 💡'}
        </p>
      </div>

      {/* Key Takeaway */}
      <div className="bg-indigo-900 text-white p-6 md:p-8 rounded-3xl max-w-3xl mx-auto shadow-xl text-left relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-white/5 w-32 h-32 md:w-40 md:h-40"><Award className="w-full h-full"/></div>
        <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 flex items-center gap-2 text-indigo-200">
          <Star className="w-5 h-5 md:w-6 md:h-6 fill-current text-yellow-400" /> Key Takeaway
        </h3>
        <p className="opacity-95 leading-relaxed text-sm md:text-xl font-medium text-indigo-50">
          "การเป็นนักบริหารที่ประสบความสำเร็จ ไม่ใช่การเดา แต่คือการใช้ข้อมูลเชิงคุณภาพมาเปลี่ยนเป็นสารสนเทศเพื่อตอบโจทย์ลูกค้าให้ตรงจุด"
        </p>
      </div>

      <div className="pt-2">
        <button 
          onClick={onRestart}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 w-full md:w-auto mx-auto"
        >
          กลับสู่หน้าเริ่มต้นใหม่
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PHASE 1: ร้านชานมไข่มุก (Missions 1-5)
// ==========================================

function Mission1({ onSuccess }) {
  const [queue, setQueue] = useState(() => generateRandomQueue());
  const [bins, setBins] = useState({ thai: [], cocoa: [], matcha: [] });

  const handleSort = (type) => {
    if (queue.length === 0) return;
    const item = queue[0];
    const isCorrect = (type === 'thai' && item === '🧋') || (type === 'cocoa' && item === '🍫') || (type === 'matcha' && item === '🍵');

    if (isCorrect) {
      const nextQueue = queue.slice(1);
      setQueue(nextQueue);
      setBins(prev => ({ ...prev, [type]: [...prev[type], item] }));
      
      if (nextQueue.length === 0) {
        setTimeout(onSuccess, 500);
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 1: จัดกลุ่มข้อมูลดิบ (Coding)" desc="พนักงานจดออเดอร์มามั่วไปหมด ช่วยแยกประเภทเครื่องดื่ม 20 แก้วลงถังให้ถูกต้อง (แตะที่ถังเพื่อจัดเก็บ)" />
      
      <div className="bg-slate-50 p-4 md:p-6 rounded-2xl min-h-[90px] md:min-h-[100px] flex flex-col justify-center items-center border border-slate-200 shadow-inner">
        {queue.length > 0 ? (
          <>
            <div className="text-4xl md:text-5xl animate-bounce mb-2 drop-shadow-md">{queue[0]}</div>
            <span className="text-slate-400 font-medium bg-white px-3 py-1 rounded-full text-xs md:text-sm border border-slate-100">เหลืออีก {queue.length} คิว</span>
          </>
        ) : (
          <span className="text-emerald-500 font-bold text-lg md:text-xl flex items-center gap-2"><CheckCircle/> จัดเรียงเสร็จสิ้น!</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Bin title="ชาไทย" icon="🧋" items={bins.thai} onClick={() => handleSort('thai')} color="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800" />
        <Bin title="โกโก้" icon="🍫" items={bins.cocoa} onClick={() => handleSort('cocoa')} color="bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800" />
        <Bin title="มัทฉะ" icon="🍵" items={bins.matcha} onClick={() => handleSort('matcha')} color="bg-green-50 hover:bg-green-100 border-green-200 text-green-800" />
      </div>
    </div>
  );
}

function Bin({ title, icon, items, onClick, color }) {
  return (
    <button onClick={onClick} className={`${color} border-2 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition-all hover:-translate-y-1 hover:shadow-md`}>
      <h4 className="font-bold text-xs md:text-base">{title}</h4>
      <div className="text-2xl md:text-4xl opacity-80 drop-shadow-sm">{icon}</div>
      <div className="flex flex-wrap gap-1 justify-center mt-1 md:mt-2 h-12 md:h-16 overflow-y-auto w-full bg-white/50 rounded-lg p-1">
        {items.map((item, i) => <span key={i} className="text-xs md:text-sm">{item}</span>)}
      </div>
      <div className="bg-white text-slate-800 px-3 py-0.5 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-bold shadow-sm border border-slate-100">{items.length}</div>
    </button>
  );
}

function Mission2({ onSuccess, onError, onWarning }) {
  const [ans, setAns] = useState({ thai: '', cocoa: '', matcha: '' });
  
  const checkAnswer = () => { 
    const t = String(ans.thai).trim();
    const c = String(ans.cocoa).trim();
    const m = String(ans.matcha).trim();

    if (!t || !c || !m) {
      onWarning('กรุณากรอกความถี่ให้ครบทั้ง 3 เมนูก่อนตรวจคำตอบครับ');
      return;
    }

    if (t === '8' && c === '5' && m === '7') {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 2: ตารางแจกแจงความถี่ (Frequency)" desc="จากข้อมูลที่แยกไว้ นำตัวเลขมากรอกลงตารางสรุปความถี่ (นับจำนวนแก้ว) ให้ถูกต้องรวม 20 แก้ว" />
      <div className="bg-slate-50 rounded-2xl p-3 md:p-6 overflow-x-auto border border-slate-200">
        <DataTable headers={['เมนูเครื่องดื่ม', 'ความถี่ (f)']}>
          <DataRow icon="🧋" label="ชาไทย" inputVal={ans.thai} onChange={v=>setAns({...ans, thai:v})} />
          <DataRow icon="🍫" label="โกโก้" inputVal={ans.cocoa} onChange={v=>setAns({...ans, cocoa:v})} />
          <DataRow icon="🍵" label="มัทฉะ" inputVal={ans.matcha} onChange={v=>setAns({...ans, matcha:v})} />
          <tr className="bg-indigo-50 font-bold text-indigo-900 border-t-2 border-indigo-100"><td className="p-3 md:p-4 text-right">รวม (N)</td><td className="p-3 md:p-4 text-center md:text-left">20</td></tr>
        </DataTable>
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function Mission3({ onSuccess, onError, onWarning }) {
  const [ans, setAns] = useState({ thai: '', cocoa: '', matcha: '' });
  
  const checkAnswer = () => { 
    const t = String(ans.thai).trim();
    const c = String(ans.cocoa).trim();
    const m = String(ans.matcha).trim();

    if (!t || !c || !m) {
      onWarning('กรุณากรอกสัดส่วนให้ครบทั้ง 3 เมนูก่อนตรวจคำตอบครับ');
      return;
    }

    if ((t === '0.40' || t === '0.4') && c === '0.25' && m === '0.35') {
      onSuccess();
    } else {
      onError(); 
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 3: สัดส่วนความถี่สัมพัทธ์" desc="คำนวณสัดส่วน (ทศนิยม 2 ตำแหน่ง) สูตร: ความถี่ ÷ จำนวนทั้งหมด (N=20)" />
      <div className="bg-slate-50 rounded-2xl p-3 md:p-6 overflow-x-auto border border-slate-200">
        <DataTable headers={['เมนู', 'ความถี่', 'สัดส่วน (f/N)']}>
          <DataRow3 icon="🧋" label="ชาไทย" f="8" inputVal={ans.thai} onChange={v=>setAns({...ans, thai:v})} />
          <DataRow3 icon="🍫" label="โกโก้" f="5" inputVal={ans.cocoa} onChange={v=>setAns({...ans, cocoa:v})} />
          <DataRow3 icon="🍵" label="มัทฉะ" f="7" inputVal={ans.matcha} onChange={v=>setAns({...ans, matcha:v})} />
          <tr className="bg-indigo-50 font-bold text-indigo-900 border-t-2 border-indigo-100"><td className="p-3 md:p-4">รวม</td><td className="p-3 md:p-4 text-center md:text-left">20</td><td className="p-3 md:p-4 text-center md:text-left">1.00</td></tr>
        </DataTable>
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function Mission4({ onSuccess, onError, onWarning }) {
  const [ans, setAns] = useState({ thai: '', cocoa: '', matcha: '' });
  
  const checkAnswer = () => { 
    const t = String(ans.thai).trim();
    const c = String(ans.cocoa).trim();
    const m = String(ans.matcha).trim();

    if (!t || !c || !m) {
      onWarning('กรุณากรอกร้อยละให้ครบทั้ง 3 เมนูก่อนตรวจคำตอบครับ');
      return;
    }

    if (t === '40' && c === '25' && m === '35') {
      onSuccess(); 
    } else {
      onError(); 
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 4: ร้อยละความถี่สัมพัทธ์" desc="แปลงค่าสัดส่วนให้เป็นร้อยละเพื่อรายงานผู้ถือหุ้น (สัดส่วน × 100)" />
      <div className="bg-slate-50 rounded-2xl p-3 md:p-6 overflow-x-auto border border-slate-200">
        <DataTable headers={['เมนู', 'สัดส่วน', 'ร้อยละ (%)']}>
          <DataRow3 icon="🧋" label="ชาไทย" f="0.40" inputVal={ans.thai} onChange={v=>setAns({...ans, thai:v})} suffix="%" />
          <DataRow3 icon="🍫" label="โกโก้" f="0.25" inputVal={ans.cocoa} onChange={v=>setAns({...ans, cocoa:v})} suffix="%" />
          <DataRow3 icon="🍵" label="มัทฉะ" f="0.35" inputVal={ans.matcha} onChange={v=>setAns({...ans, matcha:v})} suffix="%" />
          <tr className="bg-indigo-50 font-bold text-indigo-900 border-t-2 border-indigo-100"><td className="p-3 md:p-4">รวม</td><td className="p-3 md:p-4 text-center md:text-left">1.00</td><td className="p-3 md:p-4 text-center md:text-left">100 %</td></tr>
        </DataTable>
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function Mission5({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 5: หาฐานนิยม (Mode)" desc="เพื่อสั่งวัตถุดิบล็อตใหญ่ให้คุ้มที่สุด เราต้องรู้ว่าเมนูไหนคือ 'ฐานนิยม' (ข้อมูลที่มีความถี่สูงสุด) เลือกคำตอบ!" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <ChoiceButton onClick={() => onError()} icon="🍫" text="โกโก้ (25%)" />
        <ChoiceButton onClick={() => onSuccess()} icon="🧋" text="ชาไทย (40%)" isCorrect />
        <ChoiceButton onClick={() => onError()} icon="🍵" text="มัทฉะ (35%)" />
      </div>
    </div>
  );
}

// ==========================================
// PHASE 2: ร้านเบเกอรี่แสนหวาน (Missions 6-10)
// ==========================================

function Mission6({ onSuccess, onError, onWarning }) {
  const [ans1, setAns1] = useState(''); const [ans2, setAns2] = useState('');
  
  const checkAnswer = () => { 
    const v1 = String(ans1).trim();
    const v2 = String(ans2).trim();

    if (!v1 || !v2) {
      onWarning('กรุณาเติมตัวเลขที่หายไปให้ครบทั้ง 2 ช่องก่อนครับ');
      return;
    }

    if (v1 === '20' && v2 === '10') {
      onSuccess(); 
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 6: ตารางจำแนกสองทาง (Two-Way Table)" desc="เติมตัวเลขที่หายไปในตารางจำแนกความชอบของลูกค้า (รวมแนวนอนต้องได้ Total)" />
      <div className="bg-slate-50 rounded-2xl p-3 md:p-4 overflow-x-auto border border-slate-200">
        <table className="w-full text-center bg-white rounded-xl overflow-hidden shadow-sm min-w-[300px]">
          <thead className="bg-indigo-600 text-white font-medium text-sm md:text-base">
            <tr><th className="p-2 md:p-4">ลูกค้า</th><th className="p-2 md:p-4">เค้ก 🍰</th><th className="p-2 md:p-4">ครัวซองต์ 🥐</th><th className="p-2 md:p-4 bg-indigo-700">รวมแถวนอน</th></tr>
          </thead>
          <tbody className="text-slate-700 divide-y divide-slate-100 text-sm md:text-base">
            <tr>
              <td className="p-2 md:p-4 font-bold bg-slate-50">วัยรุ่น</td><td className="p-2 md:p-4">30</td>
              <td className="p-2 md:p-4"><ModernInput value={ans1} onChange={setAns1} /></td>
              <td className="p-2 md:p-4 font-bold bg-indigo-50 text-indigo-900">50</td>
            </tr>
            <tr>
              <td className="p-2 md:p-4 font-bold bg-slate-50">ผู้ใหญ่</td>
              <td className="p-2 md:p-4"><ModernInput value={ans2} onChange={setAns2} /></td>
              <td className="p-2 md:p-4">40</td>
              <td className="p-2 md:p-4 font-bold bg-indigo-50 text-indigo-900">50</td>
            </tr>
          </tbody>
        </table>
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function Mission7({ onSuccess, onError, onWarning }) {
  const [ans1, setAns1] = useState(''); const [ans2, setAns2] = useState(''); const [ans3, setAns3] = useState('');
  
  const checkAnswer = () => { 
    const v1 = String(ans1).trim();
    const v2 = String(ans2).trim();
    const v3 = String(ans3).trim();

    if (!v1 || !v2 || !v3) {
      onWarning('กรุณาหาผลรวมให้ครบทุกช่องก่อนตรวจคำตอบครับ');
      return;
    }

    if (v1 === '40' && v2 === '60' && v3 === '100') {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 7: คำนวณผลรวมข้ามมิติ (Marginal Total)" desc="หาผลรวมในแนวตั้ง เพื่อดูว่าโดยรวมแล้วขนมชนิดไหนขายดีที่สุดโดยไม่แยกอายุ" />
      <div className="bg-slate-50 rounded-2xl p-3 md:p-4 overflow-x-auto border border-slate-200">
        <table className="w-full text-center bg-white rounded-xl overflow-hidden shadow-sm min-w-[350px]">
          <thead className="bg-indigo-600 text-white font-medium text-sm md:text-base">
            <tr><th className="p-2 md:p-4">ลูกค้า</th><th className="p-2 md:p-4">เค้ก 🍰</th><th className="p-2 md:p-4">ครัวซองต์ 🥐</th><th className="p-2 md:p-4 bg-indigo-700">รวมแนวนอน</th></tr>
          </thead>
          <tbody className="text-slate-700 divide-y divide-slate-100 text-sm md:text-base">
            <tr><td className="p-2 md:p-4 bg-slate-50">วัยรุ่น</td><td className="p-2 md:p-4 text-slate-500">30</td><td className="p-2 md:p-4 text-slate-500">20</td><td className="p-2 md:p-4 bg-slate-50 font-medium">50</td></tr>
            <tr><td className="p-2 md:p-4 bg-slate-50">ผู้ใหญ่</td><td className="p-2 md:p-4 text-slate-500">10</td><td className="p-2 md:p-4 text-slate-500">40</td><td className="p-2 md:p-4 bg-slate-50 font-medium">50</td></tr>
            <tr className="bg-indigo-50 font-bold text-indigo-900 border-t-2 border-indigo-200">
              <td className="p-2 md:p-4">รวมแนวตั้ง</td>
              <td className="p-2 md:p-4"><ModernInput placeholder="เค้ก" value={ans1} onChange={setAns1} /></td>
              <td className="p-2 md:p-4"><ModernInput placeholder="ครัวซองต์" value={ans2} onChange={setAns2} /></td>
              <td className="p-2 md:p-4"><ModernInput placeholder="ทั้งหมด" value={ans3} onChange={setAns3} className="bg-indigo-100 border-indigo-300" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function Mission8({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 8: แผนภูมิแท่งจำแนกพหุ" desc="เลือกกราฟที่นำเสนอเปรียบเทียบความชอบระหว่าง 'วัยรุ่น' และ 'ผู้ใหญ่' ได้ชัดเจนที่สุด" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Correct Chart (Multiple) */}
        <div onClick={onSuccess} className="bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg rounded-3xl p-4 md:p-6 cursor-pointer transition-all group">
          <h4 className="text-center font-bold mb-4 md:mb-6 text-indigo-800 bg-indigo-50 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors">ตัวเลือก A</h4>
          <div className="flex justify-around items-end h-32 md:h-40 border-b-2 border-slate-300 pb-2 relative px-2 md:px-4">
            <div className="flex flex-col items-center gap-2 md:gap-3 w-1/2 h-full justify-end">
              <div className="flex gap-1 md:gap-2 items-end w-full justify-center">
                <div className="bg-pink-400 w-8 md:w-10 rounded-t-lg shadow-md hover:opacity-90 transition-opacity h-[70px] md:h-[90px]"></div>
                <div className="bg-amber-500 w-8 md:w-10 rounded-t-lg shadow-md hover:opacity-90 transition-opacity h-[45px] md:h-[60px]"></div>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-600 bg-slate-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full">วัยรุ่น</span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-3 w-1/2 h-full justify-end">
              <div className="flex gap-1 md:gap-2 items-end w-full justify-center">
                <div className="bg-pink-400 w-8 md:w-10 rounded-t-lg shadow-md hover:opacity-90 transition-opacity h-[25px] md:h-[30px]"></div>
                <div className="bg-amber-500 w-8 md:w-10 rounded-t-lg shadow-md hover:opacity-90 transition-opacity h-[90px] md:h-[120px]"></div>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-600 bg-slate-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full">ผู้ใหญ่</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm font-medium text-slate-600">
            <span className="flex items-center gap-1 md:gap-2"><div className="w-3 h-3 md:w-4 md:h-4 rounded-md bg-pink-400 shadow-sm"></div> เค้ก</span>
            <span className="flex items-center gap-1 md:gap-2"><div className="w-3 h-3 md:w-4 md:h-4 rounded-md bg-amber-500 shadow-sm"></div> ครัวซองต์</span>
          </div>
        </div>

        {/* Wrong Chart (Simple total fixed) */}
        <div onClick={onError} className="bg-white border-2 border-slate-200 hover:border-rose-400 hover:shadow-lg rounded-3xl p-4 md:p-6 cursor-pointer transition-all group">
          <h4 className="text-center font-bold mb-4 md:mb-6 text-slate-600 bg-slate-50 py-2 rounded-lg group-hover:bg-rose-50 group-hover:text-rose-800 transition-colors">ตัวเลือก B</h4>
          <div className="flex justify-around items-end h-32 md:h-40 border-b-2 border-slate-300 pb-2 relative px-2 md:px-4">
            <div className="flex gap-4 md:gap-8 items-end w-full justify-center h-full">
              <div className="flex flex-col items-center gap-2 md:gap-3 justify-end h-full">
                <div className="bg-pink-400 w-12 md:w-16 rounded-t-lg shadow-md h-[60px] md:h-[80px]"></div>
                <span className="text-xs md:text-sm font-bold text-slate-600">รวมเค้ก</span>
              </div>
              <div className="flex flex-col items-center gap-2 md:gap-3 justify-end h-full">
                <div className="bg-amber-500 w-12 md:w-16 rounded-t-lg shadow-md h-[90px] md:h-[120px]"></div>
                <span className="text-xs md:text-sm font-bold text-slate-600">รวมครัวซองต์</span>
              </div>
            </div>
          </div>
          <div className="h-10 md:h-14"></div> {/* Spacer to match height */}
        </div>
      </div>
    </div>
  );
}

function Mission9({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 9: อ่านกราฟวงกลม (Pie Chart)" desc="กราฟแสดงสัดส่วนช่วงเวลาที่ลูกค้าเข้าร้านหนาแน่นที่สุด ช่วงเวลาใดควรเตรียมพนักงานไว้มากที่สุด?" />
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white shadow-xl relative flex items-center justify-center hover:scale-105 transition-transform duration-500 shrink-0"
             style={{ background: 'conic-gradient(#f472b6 0% 25%, #fbbf24 25% 40%, #38bdf8 40% 100%)' }}>
          <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
          <span className="absolute top-6 right-4 md:top-10 md:right-8 text-white font-black text-xs md:text-sm drop-shadow-md">เช้า 25%</span>
          <span className="absolute bottom-8 right-2 md:bottom-12 md:right-6 text-white font-black text-xs md:text-sm drop-shadow-md">บ่าย 15%</span>
          <span className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 text-white font-black text-xl md:text-3xl drop-shadow-lg">เย็น 60%</span>
        </div>
        
        <div className="flex-1 space-y-3 md:space-y-4 w-full max-w-sm">
          <ChoiceButton onClick={onError} text="ช่วงเช้า (สีชมพู)" />
          <ChoiceButton onClick={onError} text="ช่วงบ่าย (สีเหลือง)" />
          <ChoiceButton onClick={onSuccess} text="ช่วงเย็น (สีฟ้า)" isCorrect />
        </div>
      </div>
    </div>
  );
}

function Mission10({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 10: วิเคราะห์ข้อจำกัดของสถิติ" desc="ข้อมูลเชิงคุณภาพ (Qualitative Data) มีข้อจำกัดบางอย่าง ข้อใดกล่าวถูกต้องที่สุดเกี่ยวกับการนำ 'หน้าตาของเค้กที่ชอบ' มาคำนวณ?" />
      <div className="space-y-3 md:space-y-4">
        <ChoiceButton onClick={onError} text="ก. สามารถนำมาหาค่าเฉลี่ย (Mean) ได้ ถ้านำไปให้คะแนน 1-10" />
        <ChoiceButton onClick={onSuccess} text="ข. เป็นข้อมูลเชิงคุณภาพ สามารถหาได้แค่ 'ฐานนิยม' แต่หา 'ค่าเฉลี่ยเลขคณิต' ไม่ได้" isCorrect />
        <ChoiceButton onClick={onError} text="ค. ข้อมูลเชิงคุณภาพไม่สามารถนำมาทำตารางความถี่ได้เลย" />
      </div>
    </div>
  );
}

// ==========================================
// PHASE 3: ร้านอาหาร Fine Dining (Missions 11-15)
// ==========================================

function Mission11({ onSuccess, onError, onWarning }) {
  const [selections, setSelections] = useState({ r1: '', r2: '', r3: '', r4: '', r5: '' });
  
  const checkAnswer = () => {
    if (!selections.r1 || !selections.r2 || !selections.r3 || !selections.r4 || !selections.r5) {
      onWarning('กรุณาจัดหมวดหมู่ปัญหาให้ครบทั้ง 5 ข้อความก่อนครับ');
      return;
    }

    if (selections.r1 === 'taste' && selections.r2 === 'service' && selections.r3 === 'service' && selections.r4 === 'price' && selections.r5 === 'price') {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 11: วิเคราะห์ข้อความรีวิว" desc="อ่านรีวิวด้านลบจากลูกค้า แล้วเลือกหมวดหมู่ปัญหาหลักให้ถูกต้องเพื่อนำไปปรับปรุง" />
      
      <div className="space-y-3 md:space-y-4">
        <ReviewRow text="สเต็กเนื้อเหนียวมาก ซอสก็เค็มไปหน่อย เสียใจมากค่ะ" val={selections.r1} onChange={v => setSelections({...selections, r1: v})} />
        <ReviewRow text="พนักงานไม่สนใจเลย เรียกเช็คบิลรอไป 20 นาที" val={selections.r2} onChange={v => setSelections({...selections, r2: v})} />
        <ReviewRow text="จองโต๊ะไว้ล่วงหน้า แต่พอมาถึงกลับบอกว่าโต๊ะเต็ม ระบบแย่มาก" val={selections.r3} onChange={v => setSelections({...selections, r3: v})} />
        <ReviewRow text="อร่อยนะ แต่ให้ปริมาณนิดเดียวเมื่อเทียบกับเงินที่จ่าย แพงเกินไปมาก" val={selections.r4} onChange={v => setSelections({...selections, r4: v})} />
        <ReviewRow text="น้ำเปล่าขวดละ 200 บาท ราคาขูดรีดมากเกินไปครับ" val={selections.r5} onChange={v => setSelections({...selections, r5: v})} />
      </div>
      <SubmitButton onClick={checkAnswer} />
    </div>
  );
}

function ReviewRow({ text, val, onChange }) {
  return (
    <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 hover:border-indigo-300 transition-colors">
      <p className="italic text-slate-700 font-medium text-base md:text-lg leading-relaxed flex-1 w-full text-left">"{text}"</p>
      <select 
        className="border-2 border-slate-300 rounded-xl p-2 md:p-3 bg-white w-full md:w-auto shrink-0 font-bold text-indigo-900 focus:border-indigo-500 focus:ring-0 outline-none cursor-pointer text-sm md:text-base" 
        value={val} 
        onChange={e => onChange(e.target.value)}
      >
        <option value="" className="text-slate-400">-- จัดหมวดหมู่ปัญหา --</option>
        <option value="taste">🍽️ รสชาติอาหาร</option>
        <option value="service">👨‍🍳 การบริการ</option>
        <option value="price">💸 ราคา</option>
      </select>
    </div>
  );
}

function Mission12({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 12: ตัดสินใจจากฐานนิยม" desc="จากข้อที่แล้ว ถ้าผลรีวิว 100 ข้อความพบว่า: บ่นเรื่องรสชาติ 20%, บ่นเรื่องบริการ 70%, บ่นเรื่องราคา 10% CEO ต้องสั่งแก้ปัญหาใดด่วนที่สุด?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <ChoiceButton onClick={onError} text="รสชาติอาหาร (20%)" icon="🍽️" />
        <ChoiceButton onClick={onSuccess} text="การบริการพนักงาน (70%)" icon="👨‍🍳" isCorrect />
        <ChoiceButton onClick={onError} text="ราคาแพง (10%)" icon="💸" />
      </div>
    </div>
  );
}

function Mission13({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 13: วางแผนยุทธศาสตร์" desc="จะเปิดสาขาใหม่ แดชบอร์ดรายงานว่า 'คนทำงานย่านสีลมชอบทานเนื้อวัวพรีเมียม (85%)' ควรเลือกทำเลและวัตถุดิบอย่างไร?" />
      <div className="space-y-3 md:space-y-4">
        <ChoiceButton onClick={onError} text="เปิดย่านสยามสแควร์ (วัยรุ่น) และเน้นเมนูหมูกระทะ" />
        <ChoiceButton onClick={onSuccess} text="เปิดสาขาที่สีลม และสั่งนำเข้าเนื้อวัวเกรด A+ ล็อตใหญ่" isCorrect />
        <ChoiceButton onClick={onError} text="เปิดสาขาสีลม แต่เน้นเมนูผักสลัดเพื่อสุขภาพ (15%)" />
      </div>
    </div>
  );
}

function Mission14({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 14: ตรวจสอบรายงาน (Data Validation)" desc="พนักงานรายงานว่า 'ความพึงพอใจลูกค้า (ดีมาก=3, ปานกลาง=2, แย่=1) เฉลี่ยได้ 2.45' คุณควรสอนพนักงานว่าอย่างไร?" />
      <div className="space-y-3 md:space-y-4">
        <ChoiceButton onClick={onError} text="'เยี่ยมมาก ตัวเลขชัดเจนดี ทำรายงานแบบนี้ต่อไป'" />
        <ChoiceButton onClick={onError} text="'ไปคำนวณใหม่ น่าจะบวกเลขผิดแน่ๆ'" />
        <ChoiceButton onClick={onSuccess} text="'ความพึงพอใจเป็นข้อมูลเชิงคุณภาพแบบจัดอันดับ ไม่ควรหาค่าเฉลี่ย ควรรายงานเป็นร้อยละของแต่ละระดับแทน'" isCorrect />
      </div>
    </div>
  );
}

function Mission15({ onSuccess, onError }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <MissionHeader title="ภารกิจที่ 15: สรุปสารสนเทศเพื่อโฆษณา" desc="ภารกิจสุดท้าย! ลูกค้า 80% โหวตให้ 'ซุปทรัฟเฟิล' เป็นเมนูโปรดอันดับ 1 เลือกสโลแกนโฆษณาใดที่ดึงดูดและซื่อสัตย์ต่อข้อมูลที่สุด?" />
      <div className="space-y-3 md:space-y-4">
        <ChoiceButton onClick={onSuccess} text="🎉 'ซุปทรัฟเฟิล เมนูยอดฮิตที่ลูกค้ากว่า 80% หลงรัก!'" isCorrect />
        <ChoiceButton onClick={onError} text="❌ 'ซุปทรัฟเฟิลที่อร่อยที่สุดในโลก ทุกคนที่ชิมต้องร้องว้าว!'" />
        <ChoiceButton onClick={onError} text="🤔 'คนไทย 100% เลิกกินเมนูอื่นเพื่อมากินซุปทรัฟเฟิลของเรา!'" />
      </div>
    </div>
  );
}

// ==========================================
// SHARED UI COMPONENTS
// ==========================================

function MissionHeader({ title, desc }) {
  return (
    <div className="mb-6 md:mb-8 relative">
      <h3 className="text-xl md:text-2xl font-black text-indigo-900 mb-3 md:mb-4 tracking-tight">{title}</h3>
      <div className="bg-indigo-50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-indigo-100 shadow-inner">
        <p className="text-indigo-800 text-base md:text-lg leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function ChoiceButton({ onClick, text, icon }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 p-4 md:p-5 rounded-2xl transition-all duration-300 flex items-center gap-3 md:gap-4 group shadow-sm hover:shadow-md"
    >
      {icon && <span className="text-2xl md:text-3xl drop-shadow-sm shrink-0">{icon}</span>}
      <span className="flex-1 font-semibold text-slate-700 group-hover:text-indigo-800 text-sm md:text-lg leading-snug">{text}</span>
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shrink-0">
        <ArrowRight className="text-slate-400 group-hover:text-indigo-600 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function SubmitButton({ onClick }) {
  return (
    <div className="mt-8 md:mt-10 flex justify-end">
      <button 
        onClick={onClick}
        className={`${THEME.primary} px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center gap-2 md:gap-3 transition-transform hover:-translate-y-1 w-full md:w-auto justify-center`}
      >
        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> ยืนยันคำตอบ
      </button>
    </div>
  );
}

// Table Helpers
function DataTable({ headers, children }) {
  return (
    <table className="w-full text-left bg-white rounded-xl overflow-hidden shadow-sm min-w-[320px]">
      <thead className="bg-indigo-600 text-white font-medium text-sm md:text-base">
        <tr>{headers.map((h, i) => <th key={i} className="p-3 md:p-4">{h}</th>)}</tr>
      </thead>
      <tbody className="text-slate-700 divide-y divide-slate-100 text-sm md:text-base">
        {children}
      </tbody>
    </table>
  );
}

function DataRow({ icon, label, inputVal, onChange }) {
  return (
    <tr>
      <td className="p-3 md:p-4 font-medium flex items-center gap-2"><span className="text-lg md:text-xl">{icon}</span> {label}</td>
      <td className="p-3 md:p-4 text-center md:text-left"><ModernInput value={inputVal} onChange={onChange} /></td>
    </tr>
  );
}

function DataRow3({ icon, label, f, inputVal, onChange, suffix }) {
  return (
    <tr>
      <td className="p-3 md:p-4 font-medium flex items-center gap-2"><span className="text-lg md:text-xl">{icon}</span> {label}</td>
      <td className="p-3 md:p-4 text-slate-500 font-medium text-center md:text-left">{f}</td>
      <td className="p-3 md:p-4">
        <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2">
          <ModernInput value={inputVal} onChange={onChange} placeholder={suffix ? "" : "0.xx"} />
          {suffix && <span className="font-bold text-slate-500 text-xs md:text-base">{suffix}</span>}
        </div>
      </td>
    </tr>
  );
}

function ModernInput({ value, onChange, placeholder, className = "" }) {
  return (
    <input 
      type="text" inputMode="decimal" placeholder={placeholder}
      className={`border-2 border-slate-300 rounded-lg px-2 md:px-4 py-1.5 md:py-2 w-16 md:w-32 font-bold text-indigo-900 focus:border-indigo-500 focus:ring-0 outline-none text-center transition-colors text-sm md:text-base ${className}`}
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  );
}


```
