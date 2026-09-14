import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! 👋 I am Sai, your logistics virtual assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputValue('');
    
    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { type: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { type: 'bot', text: 'I am currently undergoing maintenance. Please contact support at +91 90599 49365.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Connection error. Please try again later.' }]);
    }
  };

  const predefinedQuestions = [
    "How to track my parcel?",
    "Do you ship pickles to USA?",
    "Get a price quote"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-fab"
        style={{
          position: 'fixed',
          bottom: isOpen ? '2rem' : '1.5rem',
          right: isOpen ? '2rem' : '1.5rem',
          width: isOpen ? '60px' : '150px',
          height: isOpen ? '60px' : '150px',
          borderRadius: '50%',
          background: isOpen ? 'linear-gradient(135deg, #E97856 0%, #D66746 100%)' : 'transparent',
          color: '#FFF',
          border: 'none',
          boxShadow: isOpen ? '0 10px 25px rgba(233,120,86,0.4)' : 'none',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <lottie-player 
            src="/assets/chatbot-lottie.json"
            background="transparent" 
            speed="1" 
            style={{ 
              width: '180px', 
              height: '180px', 
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' 
            }}
            loop 
            autoplay
          ></lottie-player>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '2rem',
          width: '350px',
          height: '500px',
          background: 'var(--bg-card-tint)',
          borderRadius: '12px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(41,70,93,0.1)',
          animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Header */}
          <div style={{
            background: '#0B1622',
            color: '#FFF',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3CC8C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-user-headset" style={{ color: '#0B1622' }}></i>
              </div>
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#2ECC71', border: '2px solid #0B1622', borderRadius: '50%' }}></span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>SAI Support Agent</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#3CC8C8' }}>Usually replies instantly</p>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.type === 'user' ? '#1E3446' : '#FFF',
                color: msg.type === 'user' ? '#FFF' : '#1E3446',
                padding: '0.8rem 1rem',
                borderRadius: msg.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                border: msg.type === 'user' ? 'none' : '1px solid #E2E8F0'
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div style={{ padding: '0.5rem 1rem', background: '#F8FAFC', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexWrap: 'wrap' }}>
              {predefinedQuestions.map(q => (
                <button 
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    background: 'var(--bg-card-tint)', border: '1px solid #3CC8C8', color: '#3CC8C8',
                    padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '1rem',
            background: 'var(--bg-card-tint)',
            borderTop: '1px solid rgba(41,70,93,0.1)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
              style={{
                flex: 1,
                padding: '0.8rem',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button 
              onClick={() => handleSend(inputValue)}
              style={{
                background: '#3CC8C8', color: '#0B1622', border: 'none', width: '45px',
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
