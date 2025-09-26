import React, { useState, useEffect, useRef } from 'react';
import { X, Save, RotateCcw, Camera } from 'lucide-react';
import './CharacterEditModal.css';
import ImageUpload from './ImageUpload';
import imageService from '../services/imageService';

const CharacterEditModal = ({ character, isOpen, onClose, onSave }) => {
  // 不使用状态保存角色信息，直接从props获取
  const [newSkill, setNewSkill] = useState('');
  
  // 每次渲染时重新计算editedCharacter，而不是保存在状态中
  const [editedCharacter, setEditedCharacter] = useState({});
  
  // 每次打开模态框时重置编辑状态
  useEffect(() => {
    if (isOpen && character) {
      console.log('CharacterEditModal: 弹窗打开，重置编辑状态', character.id, character.name);
      setEditedCharacter({ ...character });
    }
  }, [isOpen, character]);
  
  // 设置角色头像状态变量
  const [characterAvatarState, setCharacterAvatar] = useState(null);
  
  // 文件输入引用
  const fileInputRef = useRef(null);
  
  // 每次打开模态框时加载头像
  useEffect(() => {
    if (isOpen && character) {
      const savedAvatar = imageService.getCharacterAvatar(character.id);
      setCharacterAvatar(savedAvatar);
    }
  }, [isOpen, character]);

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
    // 保存角色头像
    if (characterAvatarState) {
      imageService.saveCharacterAvatar(editedCharacter.id, characterAvatarState);
      console.log('角色头像已保存');
    }
    onClose();
  };

  const handleReset = () => {
    setEditedCharacter({ ...character });
    const avatar = imageService.getCharacterAvatar(character.id);
    setCharacterAvatar(avatar);
  };
  
  const handleRemoveAvatar = () => {
    if (character) {
      // 删除头像并保存
      imageService.saveCharacterAvatar(character.id, null);
      // 清空头像状态，显示原始表情符号
      setCharacterAvatar(null);
      // 强制组件重新渲染以显示原始表情符号
      setEditedCharacter({...editedCharacter});
    }
  };

  const handleAvatarChange = (imageData) => {
    // 直接保存头像到存储，并更新状态
    if (character && imageData) {
      imageService.saveCharacterAvatar(character.id, imageData);
      console.log('角色头像已更新并保存');
      // 更新头像状态，确保UI立即更新
      setCharacterAvatar(imageData);
      // 强制组件重新渲染以显示新头像
      setEditedCharacter({...editedCharacter});
    }
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // 验证文件
      imageService.validateFile(file);
      
      // 读取文件为base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        handleAvatarChange(imageData);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('文件上传错误:', error.message);
    } finally {
      // 重置文件输入框的值，确保可以再次选择相同文件
      event.target.value = '';
    }
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
            <label>角色头像</label>
            <div className="avatar-upload-section">
              {characterAvatarState ? (
                 <div className="character-image-avatar">
                   <img 
                     src={characterAvatarState} 
                     alt={character.name}
                     className="avatar-image" 
                   />
                   <div className="avatar-hover-controls">
                     <button className="avatar-control-btn" onClick={() => fileInputRef.current.click()}>
                       <Camera size={18} />
                     </button>
                     <button className="avatar-control-btn delete-btn" onClick={handleRemoveAvatar}>
                       <X size={18} />
                     </button>
                   </div>
                   <input
                     type="file"
                     ref={fileInputRef}
                     style={{ display: 'none' }}
                     onChange={handleFileSelect}
                     accept="image/*"
                   />
                 </div>
               ) : (
                <div className="character-emoji-avatar">
                  {character.avatar}
                  <div className="avatar-hover-controls">
                    <button className="avatar-control-btn" onClick={() => fileInputRef.current.click()}>
                      <Camera size={18} />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                </div>
              )}
            </div>
          </div>

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
