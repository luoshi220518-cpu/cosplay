import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import './CharacterEditModal.css';

const CharacterEditModal = ({ character, isOpen, onClose, onSave }) => {
  const [editedCharacter, setEditedCharacter] = useState({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (character) {
      setEditedCharacter({ ...character });
    }
  }, [character]);

  const handleInputChange = (field, value) => {
    setEditedCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editedCharacter.skills.includes(newSkill.trim())) {
      setEditedCharacter(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedCharacter(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedCharacter);
    }
    onClose();
  };

  const handleReset = () => {
    setEditedCharacter({ ...character });
  };

  if (!isOpen || !character) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>编辑角色设定</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <label>角色名称</label>
            <input
              type="text"
              value={editedCharacter.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="输入角色名称"
            />
          </div>

          <div className="form-section">
            <label>角色描述</label>
            <textarea
              value={editedCharacter.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="输入角色描述"
              rows={3}
            />
          </div>

          <div className="form-section">
            <label>性格特点</label>
            <input
              type="text"
              value={editedCharacter.personality || ''}
              onChange={(e) => handleInputChange('personality', e.target.value)}
              placeholder="输入性格特点"
            />
          </div>

          <div className="form-section">
            <label>背景介绍</label>
            <textarea
              value={editedCharacter.background || ''}
              onChange={(e) => handleInputChange('background', e.target.value)}
              placeholder="输入背景介绍"
              rows={4}
            />
          </div>

          <div className="form-section">
            <label>技能特长</label>
            <div className="skills-container">
              <div className="skills-list">
                {editedCharacter.skills?.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <span>{skill}</span>
                    <button 
                      className="remove-skill-btn"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-skill">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="添加新技能"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button className="add-skill-btn" onClick={handleAddSkill}>
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            重置
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={16} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditModal;
