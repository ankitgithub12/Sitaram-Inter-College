import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Mic, MicOff, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

// ── Quick reply chips ──────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  { label: '💰 Class 10 की फीस', text: 'Class 10 ki fees kitni hai?' },
  { label: '🔬 Class 12 Science फीस', text: 'Class 12 Science stream ki fees kitni hai?' },
  { label: '🎨 Class 11 Arts फीस', text: 'Class 11 Arts stream ki fees kitni hai?' },
  { label: '🏫 SRIC का इतिहास', text: 'SRIC school ka itihas batao' },
  { label: '🎓 प्रमुख पूर्व छात्र', text: 'SRIC ke notable alumni kaun hain?' },
  { label: '📝 Admission प्रक्रिया', text: 'SRIC mein admission kaise lein?' },
  { label: '⏰ School Timing', text: 'School ka time kya hai?' },
  { label: '📞 संपर्क जानकारी', text: 'SRIC ka contact number kya hai?' },
  { label: '🏆 संस्थापक', text: 'SRIC ke sansthapak kaun hain?' },
  { label: '📚 Available Streams', text: 'Class 11 aur 12 mein kaunse streams available hain?' },
];

// ── Speech Recognition setup ──────────────────────────────────────────────────
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

// ── Typewriter hook ───────────────────────────────────────────────────────────
// Animates text word-by-word for a natural streaming feel
function useTypewriter(fullText, isActive, onDone) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isActive || !fullText) return;
    setDisplayed('');
    indexRef.current = 0;

    const words = fullText.split(' ');

    const tick = () => {
      if (indexRef.current < words.length) {
        indexRef.current += 1;
        setDisplayed(words.slice(0, indexRef.current).join(' '));
        // Slightly vary delay for natural feel: 30–65ms per word
        const delay = 30 + Math.random() * 35;
        timerRef.current = setTimeout(tick, delay);
      } else {
        onDone?.();
      }
    };

    timerRef.current = setTimeout(tick, 30);
    return () => clearTimeout(timerRef.current);
  }, [fullText, isActive]);

  return displayed;
}

// ── Individual animated bot message ──────────────────────────────────────────
const BotMessage = ({ msg, onTypingDone, speakText }) => {
  const isNew = msg.typing === true;
  const displayed = useTypewriter(msg.text, isNew, () => {
    onTypingDone?.(msg.id);
    if (isNew) speakText?.(msg.text);
  });

  const textToShow = isNew ? displayed : msg.text;

  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex flex-row max-w-[88%]">
        <div className="flex-shrink-0 mr-2 mt-auto mb-1">
          <div className="bg-sricgold text-sricblue rounded-full p-1.5 shadow-sm">
            <Bot size={14} />
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl rounded-bl-none text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
            msg.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-white text-gray-800 border-gray-100'
          }`}
        >
          {textToShow}
          {/* Blinking cursor while typing */}
          {isNew && textToShow !== msg.text && (
            <span className="inline-block w-0.5 h-4 bg-sricblue ml-0.5 rounded align-middle animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Chatbot Component ────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      typing: false,
      text: 'Welcome! 🙏 I am the SRIC Assistant.\nPlease select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें:\n\n1. English\n2. Hindi (हिंदी)',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickChips, setShowQuickChips] = useState(true);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(!!SpeechRecognitionAPI);
  const recognitionRef = useRef(null);

  // Voice output
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Hindi TTS ──────────────────────────────────────────────────────────────
  const speakText = useCallback((text) => {
    if (!voiceOutputEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean markdown symbols
    const clean = text.replace(/[*_`#•]/g, '').replace(/\n+/g, '। ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Wait for voices to load, then pick best Hindi voice
    const assignVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice =
        voices.find(v => v.lang === 'hi-IN') ||
        voices.find(v => v.lang.startsWith('hi')) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices[0];
      if (hindiVoice) utterance.voice = hindiVoice;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      assignVoice();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', assignVoice, { once: true });
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voiceOutputEnabled]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // ── Hindi Speech Recognition ───────────────────────────────────────────────
  const startListening = () => {
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'hi-IN';        // Primary: Hindi
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onerror = (e) => { console.error('STT error:', e.error); setIsListening(false); };
    recognition.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };
  const toggleListening = () => (isListening ? stopListening() : startListening());

  // ── Mark typing done → remove animation flag ───────────────────────────────
  const handleTypingDone = useCallback((msgId) => {
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, typing: false } : m)
    );
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    if (isListening) stopListening();

    const userMsg = { id: Date.now(), type: 'user', typing: false, text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowQuickChips(false);

    if (!language) {
      setTimeout(() => {
        setIsLoading(false);
        const lowerText = text.toLowerCase();
        if (lowerText.includes('english') || lowerText.includes('1')) {
          setLanguage('English');
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'bot',
            typing: true,
            text: 'Language set to English. How can I help you today?'
          }]);
        } else if (lowerText.includes('hindi') || lowerText.includes('2') || lowerText.includes('हिंदी')) {
          setLanguage('Hindi');
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'bot',
            typing: true,
            text: 'भाषा हिंदी सेट कर दी गई है। मैं आपकी कैसे मदद कर सकता हूं?'
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'bot',
            typing: true,
            text: 'Please reply with 1 for English or 2 for Hindi. / कृपया अंग्रेजी के लिए 1 या हिंदी के लिए 2 टाइप करें।'
          }]);
        }
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const replyText = data.reply || (language === 'Hindi' ? 'क्षमा करें, अभी जवाब नहीं मिल सका। कृपया पुनः प्रयास करें।' : 'Sorry, no response received. Please try again.');

      // Add with typing:true → triggers typewriter animation
      const botMsg = { id: Date.now() + 1, type: 'bot', typing: true, text: replyText };
      setMessages(prev => [...prev, botMsg]);
      // speakText is called inside BotMessage once typing finishes

    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        typing: true,
        isError: true,
        text: language === 'Hindi' ? 'क्षमा करें, कनेक्शन में समस्या है। कृपया स्कूल से संपर्क करें: +91 9756517750।' : 'Connection error. Please contact the school: +91 9756517750.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-sricblue text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3.5 h-3.5 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ height: '580px', maxHeight: '90vh' }}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-sricblue to-blue-900 text-white p-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="bg-white p-1 rounded-full shadow">
                <img src="/assets/SRIC LOGO.PNG" alt="SRIC" className="w-9 h-9 rounded-full object-cover" />
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-sricblue rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">SRIC Assistant</h3>
              <p className="text-[11px] text-blue-200">
                {isListening
                  ? '🎙️ सुन रहा हूं...'
                  : isSpeaking
                  ? '🔊 बोल रहा हूं...'
                  : '• ऑनलाइन'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Voice output toggle */}
            <button
              onClick={() => { if (voiceOutputEnabled) stopSpeaking(); setVoiceOutputEnabled(v => !v); }}
              title={voiceOutputEnabled ? 'आवाज़ बंद करें' : 'आवाज़ चालू करें'}
              className={`p-1.5 rounded-full transition-all ${voiceOutputEnabled ? 'bg-white/25 text-yellow-300' : 'hover:bg-white/15 text-white/60'}`}
            >
              {voiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={() => { setIsOpen(false); stopSpeaking(); stopListening(); }}
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Messages ─────────────────────────────────────────── */}
        <div className="flex-1 px-3 py-3 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          <div className="flex justify-center">
            <span className="text-[10px] text-gray-400 bg-gray-200 px-2.5 py-0.5 rounded-full">आज</span>
          </div>

          {messages.map((msg) =>
            msg.type === 'user' ? (
              <div key={msg.id} className="flex justify-end animate-fade-in-up">
                <div className="flex flex-row-reverse max-w-[88%]">
                  <div className="flex-shrink-0 ml-2 mt-auto mb-1">
                    <div className="bg-blue-100 text-sricblue rounded-full p-1.5">
                      <User size={14} />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl rounded-br-none text-sm leading-relaxed bg-sricblue text-white">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <BotMessage
                key={msg.id}
                msg={msg}
                onTypingDone={handleTypingDone}
                speakText={speakText}
              />
            )
          )}

          {/* Loading dots — only while waiting for API */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex flex-row max-w-[88%]">
                <div className="flex-shrink-0 mr-2 mt-auto mb-1">
                  <div className="bg-sricgold text-sricblue rounded-full p-1.5">
                    <Bot size={14} />
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1.5 items-center">
                  {[0, 0.18, 0.36].map((d, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-sricblue rounded-full animate-bounce"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick chips ───────────────────────────────────────── */}
        {showQuickChips && (
          <div className="bg-white border-t border-gray-100 px-2.5 pt-2 pb-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                जल्दी पूछें
              </span>
              <button onClick={() => setShowQuickChips(false)} className="text-gray-300 hover:text-gray-500">
                <ChevronDown size={13} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  disabled={isLoading}
                  className="text-[11px] bg-blue-50 hover:bg-sricblue hover:text-white text-sricblue border border-blue-100 hover:border-sricblue rounded-full px-3 py-1 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ────────────────────────────────────────────── */}
        <div className="px-3 pt-2 pb-2.5 bg-white border-t border-gray-100 flex-shrink-0">
          {/* Listening banner */}
          {isListening && (
            <div className="mb-2 flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
              <span className="flex gap-0.5">
                {[0, 0.12, 0.24].map((d, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-400 rounded-full animate-bounce"
                    style={{ height: `${8 + i * 4}px`, animationDelay: `${d}s` }}
                  />
                ))}
              </span>
              <span className="text-xs text-red-600 font-medium">हिंदी में बोलें...</span>
              <span className="flex gap-0.5">
                {[0.24, 0.12, 0].map((d, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-400 rounded-full animate-bounce"
                    style={{ height: `${8 + i * 4}px`, animationDelay: `${d}s` }}
                  />
                ))}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Mic button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? 'रोकें' : 'हिंदी में बोलें'}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none shadow-sm ${
                  isListening
                    ? 'bg-red-500 text-white scale-110 shadow-red-200 shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-sricblue hover:text-white'
                } disabled:opacity-40`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* Text field */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isListening ? '🎤 सुन रहा हूं...' : 'पूछें या बोलें...'}
                className={`w-full text-sm py-2.5 pl-4 pr-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-sricblue bg-gray-50 transition-all ${
                  isListening ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-sricblue text-white rounded-full flex items-center justify-center hover:bg-blue-800 disabled:opacity-40 transition-colors"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </div>
          </form>

          {/* Show chips toggle */}
          {!showQuickChips && (
            <button
              onClick={() => setShowQuickChips(true)}
              className="mt-1.5 w-full text-[10px] text-blue-400 hover:text-sricblue flex items-center justify-center gap-1"
            >
              <ChevronUp size={10} /> जल्दी सवाल दिखाएं
            </button>
          )}

          <p className="text-center text-[10px] text-gray-400 mt-1">
            🎤 हिंदी में बोलें · 🔊 आवाज़ चालू/बंद करें
          </p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
