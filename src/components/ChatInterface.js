import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ character, userName, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'character',
      content: `你好，${userName}！我是${character.name}。很高兴认识你！有什么想和我聊的吗？`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, character);
      const responseMessage = {
        id: messages.length + 2,
        type: 'character',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const generateAIResponse = (userMessage, character) => {
    const responses = {
      '哈利·波特': [
        "这让我想起了在霍格沃茨的时光...",
        "你知道吗，我在一年级时就学会了魁地奇！",
        "友谊和勇气是最重要的魔法。",
        "有时候，我们需要相信自己的直觉。"
      ],
      '苏格拉底': [
        "让我问你一个问题：什么是真正的智慧？",
        "无知之知，这是智慧的开始。",
        "通过对话，我们可以发现真理。",
        "你认为什么是正义？"
      ],
      '夏洛克·福尔摩斯': [
        "从你的话语中，我观察到了一些有趣的细节...",
        "让我运用演绎法来分析这个问题。",
        "数据！数据！数据！没有数据就无法推理。",
        "排除所有不可能的情况，剩下的就是真相。"
      ],
      '达芬奇': [
        "这让我想到了一个新的发明想法...",
        "艺术和科学是相通的，都需要观察和创造。",
        "好奇心是知识的源泉。",
        "让我画个图来解释这个概念。"
      ]
    };

    const characterResponses = responses[character.name] || ["这是一个很有趣的话题。"];
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // 这里可以集成语音识别功能
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    // 这里可以集成TTS功能
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          返回角色选择
        </button>
        
        <div className="character-info">
          <span className="character-avatar">{character.avatar}</span>
          <div>
            <h3>{character.name}</h3>
            <p>正在与 {userName} 对话</p>
          </div>
        </div>

        <div className="voice-controls">
          <button 
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceToggle}
            title={isRecording ? '停止录音' : '开始录音'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button 
            className={`voice-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleSpeakToggle}
            title={isSpeaking ? '停止语音' : '开启语音'}
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === 'character' && (
                <span className="message-avatar">{character.avatar}</span>
              )}
              <div className="message-bubble">
                <p>{message.content}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`与${character.name}对话...`}
            className="message-input"
          />
          <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="character-skills">
        <h4>{character.name} 的技能：</h4>
        <div className="skills-display">
          {character.skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
