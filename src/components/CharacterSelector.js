import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Edit3 } from 'lucide-react';
import './CharacterSelector.css';
import imageService from '../services/imageService';

const CharacterSelector = ({ characters, onSelect, userName, onEditCharacter }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [characterAvatars, setCharacterAvatars] = useState({});

  // 加载每个角色已保存的头像（如有）
  useEffect(() => {
    if (!characters || characters.length === 0) return;
    const avatarMap = {};
    characters.forEach((c) => {
      const saved = imageService.getCharacterAvatar(c.id);
      if (saved) avatarMap[c.id] = saved;
    });
    setCharacterAvatars(avatarMap);
  }, [characters]);

  const handleCharacterClick = (character) => {
    setSelectedId(character.id);
  };

  const handleStartChat = () => {
    const character = characters.find(c => c.id === selectedId);
    if (character) {
      onSelect(character);
    }
  };

  const handleEditCharacter = (character = null) => {
    const targetCharacter = character || characters.find(c => c.id === selectedId);
    if (targetCharacter && onEditCharacter) {
      onEditCharacter(targetCharacter);
    }
  };

  const handleDirectChat = (character) => {
    onSelect(character);
  };

  return (
    <div className="character-selector">
      <div className="selector-header">
        <h2>你好，{userName}！</h2>
        <p>选择一个角色开始你的对话之旅</p>
      </div>

      <div className="characters-container">
        <div className="characters-grid">
          {characters.map((character) => (
          <div
            key={character.id}
            className={`character-card ${selectedId === character.id ? 'selected' : ''}`}
            onClick={() => handleCharacterClick(character)}
          >
            <div className="character-header">
              <div className="character-avatar">
                {characterAvatars[character.id] ? (
                  <img
                    src={characterAvatars[character.id]}
                    alt={character.name}
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="avatar-emoji">{character.avatar}</span>
                )}
              </div>
              
              <div className="character-basic-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-description">{character.description}</p>
              </div>
            </div>
            
            <div className="character-details">
              <div className="character-personality">
                <strong>性格特点：</strong>
                <span>{character.personality}</span>
              </div>

              <div className="character-skills">
                <strong>技能特长：</strong>
                <div className="skills-list">
                  {character.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="character-actions">
              <button 
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectChat(character);
                }}
              >
                <MessageCircle size={16} />
                对话
              </button>
              <button 
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCharacter(character);
                }}
              >
                <Edit3 size={16} />
                编辑
              </button>
            </div>
          </div>
          ))}
        </div>
      </div>

      {selectedId && (
        <div className="selection-actions">
          <div className="action-buttons">
            <button 
              className="start-chat-btn"
              onClick={handleStartChat}
            >
              <MessageCircle size={20} />
              开始与 {characters.find(c => c.id === selectedId)?.name} 对话
            </button>
            
            <button 
              className="edit-character-btn"
              onClick={handleEditCharacter}
            >
              <Edit3 size={20} />
              编辑角色设定
            </button>
          </div>
        </div>
      )}

      <div className="selector-footer">
        <p>💡 提示：每个角色都有独特的性格和知识背景，选择你感兴趣的角色开始对话吧！</p>
      </div>
    </div>
  );
};

export default CharacterSelector;
