import React, { useState } from 'react';
import './App.css';
import CharacterSelector from './components/CharacterSelector';
import ChatInterface from './components/ChatInterface';
import UserProfile from './components/UserProfile';
import CharacterEditModal from './components/CharacterEditModal';
import { characters } from './data/characters';

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [userName, setUserName] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [charactersList, setCharactersList] = useState(characters);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleUserNameSubmit = (name) => {
    setUserName(name);
    setIsProfileComplete(true);
  };

  const handleBackToSelection = () => {
    setSelectedCharacter(null);
    // 保持用户已登录状态，不重置 isProfileComplete
    console.log('返回角色选择，用户保持登录状态:', userName);
  };

  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    setIsEditModalOpen(true);
  };

  const handleSaveCharacter = (updatedCharacter) => {
    setCharactersList(prev => 
      prev.map(char => 
        char.id === updatedCharacter.id ? updatedCharacter : char
      )
    );
    setIsEditModalOpen(false);
    setEditingCharacter(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCharacter(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎭 AI角色扮演聊天</h1>
        <p>与历史人物和虚构角色进行深度对话</p>
      </header>

      <main className="app-main">
        {!isProfileComplete ? (
          <UserProfile onSubmit={handleUserNameSubmit} />
        ) : !selectedCharacter ? (
          <CharacterSelector 
            characters={charactersList} 
            onSelect={handleCharacterSelect}
            userName={userName}
            onEditCharacter={handleEditCharacter}
          />
        ) : (
          <ChatInterface 
            character={selectedCharacter}
            userName={userName}
            onBack={handleBackToSelection}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 AI角色扮演聊天 - 探索无限可能</p>
      </footer>

      <CharacterEditModal
        character={editingCharacter}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveCharacter}
      />
    </div>
  );
}

export default App;
