import React from 'react';
import './CharacterCard.css';

const CharacterCard = ({ character, isSelected, onClick, onEditClick, onChatClick }) => {
  return (
    <div className={`character-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="character-header">
        <div className="character-avatar">{character.avatar}</div>
        <div className="character-basic-info">
          <div className="character-name">{character.name}</div>
          <div className="character-description">{character.description}</div>
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
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="action-buttons">
          <button className="btn start-chat-btn" onClick={(e) => {
            e.stopPropagation();
            onChatClick(character);
          }}>
            ⭐ 开始与 {character.name} 对话
          </button>
          <button className="btn edit-character-btn" onClick={(e) => {
            e.stopPropagation();
            onEditClick(character);
          }}>
            ✏️ 编辑角色设定
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;