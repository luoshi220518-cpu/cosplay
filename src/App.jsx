import React, { useState, useEffect } from 'react';
import './App.css';
import CharacterCard from './components/CharacterCard';
import CharacterEditModal from './components/CharacterEditModal';
import ChatInterface from './components/ChatInterface';
import charactersData from './data/characters';

function App() {
  const [step, setStep] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // 加载角色数据
    setCharacters(charactersData);
  }, []);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleEditClick = (character) => {
    setSelectedCharacter(character);
    setIsEditModalOpen(true);
  };

  const handleChatClick = (character) => {
    setSelectedCharacter(character);
    setIsChatOpen(true);
    setStep(3);
  };

  const handleCharacterUpdate = (updatedCharacter) => {
    setCharacters(characters.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    ));
    setSelectedCharacter(updatedCharacter);
    setIsEditModalOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI角色扮演聊天</h1>
        <p>选择一个角色开始对话，或者创建你自己的角色</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          {step === 1 && (
            <div className="step active">
              <h2>选择一个角色</h2>
              
              <div className="characters-container">
                <div className="characters-grid">
                  {characters.map(character => (
                    <CharacterCard 
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacter?.id === character.id}
                      onClick={() => handleCharacterSelect(character)}
                      onEditClick={handleEditClick}
                      onChatClick={handleChatClick}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                className="btn"
                disabled={!selectedCharacter}
                onClick={() => setStep(2)}
              >
                下一步
              </button>
            </div>
          )}
          
          {step === 2 && (
            <div className="step active">
              <h2>确认角色设定</h2>
              
              {selectedCharacter && (
                <div className="character-details-full">
                  <div className="character-header">
                    <div className="character-avatar">{selectedCharacter.avatar}</div>
                    <div className="character-basic-info">
                      <h3>{selectedCharacter.name}</h3>
                      <p>{selectedCharacter.description}</p>
                    </div>
                  </div>
                  
                  <div className="character-background">
                    <h4>背景故事</h4>
                    <p>{selectedCharacter.background}</p>
                  </div>
                  
                  <div className="character-personality">
                    <h4>性格特点</h4>
                    <p>{selectedCharacter.personality}</p>
                  </div>
                  
                  <div className="character-skills">
                    <h4>技能特长</h4>
                    <div className="skills-list">
                      {selectedCharacter.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="button-group">
                <button className="btn secondary" onClick={() => setStep(1)}>
                  返回
                </button>
                <button 
                  className="btn"
                  onClick={() => {
                    setStep(3);
                    setIsChatOpen(true);
                  }}
                >
                  开始对话
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="step active">
              <ChatInterface 
                character={selectedCharacter}
                onBack={() => {
                  setStep(2);
                  setIsChatOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </main>
      
      {isEditModalOpen && selectedCharacter && (
        <CharacterEditModal
          isOpen={isEditModalOpen}
          character={selectedCharacter}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleCharacterUpdate}
        />
      )}
    </div>
  );
}

export default App;