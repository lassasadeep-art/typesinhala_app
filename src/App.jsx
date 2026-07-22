import React, { useState, useEffect, useRef } from 'react';
import { convertToFM } from './converter';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [unicodeText, setUnicodeText] = useState('');
  const [fmText, setFmText] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'si-LK'; // Sinhala

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('Listening... Speak now.');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append final results to the existing text
        if (finalTranscript) {
          setUnicodeText(prev => {
            const newText = prev + (prev ? ' ' : '') + finalTranscript;
            setFmText(convertToFM(newText));
            return newText;
          });
        }
        
        // Just to show interim results, we can temporarily update it but here we'll stick to final for simplicity
        // or we can update it all if we want live typing. 
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setStatus(`Error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatus('Microphone off.');
      };

      recognitionRef.current = recognition;
    } else {
      setStatus('Speech Recognition API not supported in this browser. Please use Chrome or Edge.');
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleUnicodeChange = (e) => {
    const text = e.target.value;
    setUnicodeText(text);
    setFmText(convertToFM(text));
  };

  const handleCopy = () => {
    if (!fmText) return;
    navigator.clipboard.writeText(fmText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <header className="header">
          <h1>FM Abhaya unicod</h1>
          <p>Speak or Type in Sinhala and instantly convert it to FM Abhaya font for MS Word.</p>
        </header>

        <div className="mic-container">
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListen}
            title={isListening ? 'Stop Listening' : 'Start Listening'}
          >
            {isListening ? '🎙️' : '🎤'}
          </button>
        </div>
        
        <div className="status-text">
          {status}
        </div>

        <div className="grid-container">
          <div className="text-area-wrapper">
            <label>Unicode (Sinhala)</label>
            <textarea 
              value={unicodeText}
              onChange={handleUnicodeChange}
              placeholder="ඔබට අවශ්‍ය දේ මෙහි සිංහලෙන් ටයිප් කරන්න හෝ මයික් එකෙන් කතා කරන්න..."
            />
          </div>

          <div className="text-area-wrapper">
            <label>FM Abhaya (Converted)</label>
            <textarea 
              className="fm-font"
              value={fmText}
              readOnly
              placeholder="Converted FM Abhaya text will appear here..."
            />
            <div className="button-group">
              <button 
                className="btn btn-primary"
                onClick={() => { setUnicodeText(''); setFmText(''); }}
                style={{ background: '#ef4444' }}
              >
                🗑️ Clear Text
              </button>
              <button 
                className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
                onClick={handleCopy}
              >
                {copied ? '✅ Copied!' : '📋 Copy to MS Word'}
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Developed by Lasitha Mullegama
        </div>
      </div>
    </div>
  );
}

export default App;
