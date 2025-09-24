import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Settings, Image } from 'lucide-react';
import './ChatInterface.css';
import aiService from '../services/aiService';
import ApiSettings from './ApiSettings';
import ImageUpload from './ImageUpload';
import imageService from '../services/imageService';

const ChatInterface = ({ character, userName, userAvatar, onBack }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);
  const [chatBackground, setChatBackground] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 加载聊天背景
    const background = imageService.getChatBackground(character.id);
    setChatBackground(background);
    
    // 应用背景图到聊天界面
    if (background && background !== imageService.getDefaultImage('chatBackground')) {
      const chatInterface = document.querySelector('.chat-interface');
      if (chatInterface) {
        chatInterface.style.setProperty('--chat-background', `url(${background})`);
      }
    } else {
      const chatInterface = document.querySelector('.chat-interface');
      if (chatInterface) {
        chatInterface.style.setProperty('--chat-background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      }
    }
  }, [character.id, chatBackground]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 构建对话历史
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // 调用AI服务
      const aiResponse = await aiService.generateResponse(
        character, 
        userMessage, 
        conversationHistory
      );

      const responseMessage = {
        id: messages.length + 2,
        type: 'character',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('AI回复错误:', error);
      
      // 显示错误消息
      const errorMessage = {
        id: messages.length + 2,
        type: 'character',
        content: '抱歉，我现在无法回复你的消息。请稍后再试。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // 这里可以集成语音识别功能
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    // 这里可以集成TTS功能
  };

  const handleBackgroundChange = (imageData) => {
    setChatBackground(imageData);
    if (imageData) {
      imageService.saveChatBackground(character.id, imageData);
      // 立即应用背景图
      const chatInterface = document.querySelector('.chat-interface');
      if (chatInterface) {
        chatInterface.style.setProperty('--chat-background', `url(${imageData})`);
      }
    } else {
      // 清除背景图，使用默认背景
      imageService.deleteImage(`background_${character.id}`);
      const chatInterface = document.querySelector('.chat-interface');
      if (chatInterface) {
        chatInterface.style.setProperty('--chat-background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      }
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          返回角色选择
        </button>
        
        <div className="character-info">
          <div className="character-avatar">
            <span className="character-emoji-large">{character.avatar}</span>
          </div>
          <div className="character-details">
            <h3>{character.name}</h3>
            <p>正在与 {userName} 对话</p>
          </div>
        </div>

        <div className="voice-controls">
          <button 
            className="voice-btn"
            onClick={() => setShowApiSettings(true)}
            title="API设置"
          >
            <Settings size={20} />
          </button>
          
          <button 
            className="voice-btn"
            onClick={() => setShowBackgroundSettings(true)}
            title="背景设置"
          >
            <Image size={20} />
          </button>
          
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
                <div className="message-avatar">
                  <span className="character-emoji">{character.avatar}</span>
                </div>
              )}
              {message.type === 'user' && userAvatar && (
                <div className="message-avatar">
                  <img 
                    src={userAvatar} 
                    alt={userName}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span style={{display: 'none'}}>👤</span>
                </div>
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
          <button type="submit" className="send-btn" disabled={!inputMessage.trim() || isLoading}>
            {isLoading ? <Loader2 size={20} className="spinning" /> : <Send size={20} />}
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

      <ApiSettings
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
        onSave={(settings) => {
          // 这里可以保存API设置到本地存储
          localStorage.setItem('aiApiSettings', JSON.stringify(settings));
          aiService.setProvider(settings.provider);
        }}
      />

      {/* 背景设置弹窗 */}
      {showBackgroundSettings && (
        <div className="background-settings-overlay" onClick={() => setShowBackgroundSettings(false)}>
          <div className="background-settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="background-settings-header">
              <h3>聊天背景设置</h3>
              <button className="close-btn" onClick={() => setShowBackgroundSettings(false)}>
                ×
              </button>
            </div>
            <div className="background-settings-body">
              <div className="background-preview">
                <h4>当前背景预览</h4>
                <div 
                  className="preview-container"
                  style={{
                    background: chatBackground && chatBackground !== imageService.getDefaultImage('chatBackground') 
                      ? `url(${chatBackground})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="preview-overlay">
                    <p>聊天界面背景预览</p>
                  </div>
                </div>
              </div>
              
              <div className="background-upload">
                <h4>上传新背景</h4>
                <ImageUpload
                  currentImage={chatBackground}
                  onImageChange={handleBackgroundChange}
                  type="background"
                  size="large"
                  showPreview={true}
                />
                
                {chatBackground && chatBackground !== imageService.getDefaultImage('chatBackground') && (
                  <button 
                    className="clear-background-btn"
                    onClick={() => handleBackgroundChange(null)}
                  >
                    清除背景图
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
