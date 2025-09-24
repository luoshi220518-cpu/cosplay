import React, { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';
import './UserProfile.css';
import ImageUpload from './ImageUpload';
import imageService from '../services/imageService';

const UserProfile = ({ onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  const handleInputChange = (e) => {
    const name = e.target.value.trim();
    setUserName(name);
    setIsValid(name.length >= 2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(userName, userAvatar);
    }
  };

  const handleAvatarChange = (imageData) => {
    setUserAvatar(imageData);
    if (imageData) {
      // 保存到本地存储
      imageService.saveUserAvatar('current_user', imageData);
      console.log('用户头像已更新');
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <ImageUpload
            currentImage={userAvatar}
            onImageChange={handleAvatarChange}
            type="avatar"
            size="large"
            className="avatar"
          />
        </div>
        
        <h2>欢迎来到AI角色扮演世界</h2>
        <p className="profile-description">
          在这里，你可以与历史人物和虚构角色进行深度对话。
          首先，请告诉我们你的名字，这样角色们就能更好地认识你。
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label htmlFor="userName">你的名字</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={handleInputChange}
              placeholder="请输入你的名字"
              maxLength={20}
              required
            />
            <span className="input-hint">至少2个字符</span>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isValid ? 'valid' : 'invalid'}`}
            disabled={!isValid}
          >
            <span>开始探索</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="features-preview">
          <h3>你将体验到：</h3>
          <ul>
            <li>🎭 与多个AI角色进行对话</li>
            <li>🎤 语音聊天功能</li>
            <li>🧠 智能角色扮演</li>
            <li>📚 学习历史和文化知识</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
