import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Settings, Image, X } from 'lucide-react';
import './ChatInterface.css';
import aiService from '../services/aiService';
import ApiSettings from './ApiSettings';
import ImageUpload from './ImageUpload';
import ImageCropper from './ImageCropper';
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
  const [showBackgroundCropper, setShowBackgroundCropper] = useState(false);
  const [backgroundImageToCrop, setBackgroundImageToCrop] = useState(null);
  const [chatBackground, setChatBackground] = useState(null);
  const [characterAvatar, setCharacterAvatar] = useState(null);
  const [containerAspectRatio, setContainerAspectRatio] = useState(1.25);
  const messagesEndRef = useRef(null);
  const chatInterfaceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 计算容器实际比例
  useEffect(() => {
    const calculateAspectRatio = () => {
      if (chatInterfaceRef.current) {
        const rect = chatInterfaceRef.current.getBoundingClientRect();
        const aspectRatio = rect.width / rect.height;
        setContainerAspectRatio(aspectRatio);
      }
    };

    calculateAspectRatio();
    window.addEventListener('resize', calculateAspectRatio);
    
    return () => window.removeEventListener('resize', calculateAspectRatio);
  }, []);

  useEffect(() => {
    // 加载聊天背景
    const background = imageService.getChatBackground(character.id);
    setChatBackground(background);
    
    // 加载角色头像
    const avatar = imageService.getCharacterAvatar(character.id);
    if (avatar) {
      setCharacterAvatar(avatar);
    }
    
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

  const handleBackgroundCropComplete = (croppedImageData) => {
    handleBackgroundChange(croppedImageData);
    setShowBackgroundCropper(false);
    setBackgroundImageToCrop(null);
  };

  const handleBackgroundCropCancel = () => {
    setShowBackgroundCropper(false);
    setBackgroundImageToCrop(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      imageService.validateFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setBackgroundImageToCrop(imageData);
        setShowBackgroundCropper(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="chat-interface" ref={chatInterfaceRef}>
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          返回角色选择
        </button>
        
        <div className="character-info">
          <div className="character-avatar">
            {characterAvatar ? (
              <img
                src={characterAvatar}
                alt={character.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className="character-emoji-large" 
              style={{ display: characterAvatar ? 'none' : 'flex' }}
            >
              {character.avatar}
            </span>
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
                  {characterAvatar ? (
                    <img
                      src={characterAvatar}
                      alt={character.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'inline';
                      }}
                    />
                  ) : null}
                  <span 
                    className="character-emoji" 
                    style={{ display: characterAvatar ? 'none' : 'inline' }}
                  >
                    {character.avatar}
                  </span>
                </div>
              )}
              {message.type === 'user' && (
                <div className="message-avatar">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                  ) : null}
                  <span style={{display: userAvatar ? 'none' : 'inline'}}>👤</span>
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
          // 传递提供商和对应的配置
          const providerConfig = settings[settings.provider];
          aiService.setProvider(settings.provider, providerConfig);
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
              <div className="background-preview-upload">
                <h4>聊天背景设置</h4>
                <div className="preview-upload-container">
                  <div 
                    className="background-preview-area"
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
                    
                    {/* 悬停操作按钮 */}
                    <div className="preview-actions">
                      <button 
                        className="preview-action-btn change-btn"
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = 'image/*';
                          fileInput.onchange = handleFileSelect;
                          fileInput.click();
                        }}
                      >
                        <Image size={16} />
                        更换
                      </button>
                      
                      {chatBackground && chatBackground !== imageService.getDefaultImage('chatBackground') && (
                        <button 
                          className="preview-action-btn delete-btn"
                          onClick={() => handleBackgroundChange(null)}
                        >
                          <X size={16} />
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="upload-hint">
                    <p>💡 点击"更换"按钮上传新背景，支持 JPG、PNG、GIF、WebP 格式</p>
                    <p>📐 图片将自动裁剪为聊天界面的最佳比例</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 背景裁剪弹窗 */}
      {showBackgroundCropper && backgroundImageToCrop && (
        <div className="cropper-modal-overlay" onClick={handleBackgroundCropCancel}>
          <div className="cropper-modal" onClick={(e) => e.stopPropagation()}>
            <ImageCropper
              imageSrc={backgroundImageToCrop}
              onCrop={handleBackgroundCropComplete}
              onCancel={handleBackgroundCropCancel}
              aspectRatio={containerAspectRatio}
              cropShape="rect"
              outputWidth={800}
              outputHeight={Math.round(800 / containerAspectRatio)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
