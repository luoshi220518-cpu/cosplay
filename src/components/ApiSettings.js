import React, { useState } from 'react';
import { Settings, Key, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import './ApiSettings.css';

const ApiSettings = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    provider: 'qwen', // 默认选择千问
    // Qwen API配置
    qwen: {
      apiKey: 'sk-343f061be4279a7841c0f039f876092478972a73ab56a5758d171de2f5758c70',
      baseURL: 'https://openai.qiniu.com/v1',
      model: 'qwen-turbo'
    },
    // Deepseek API配置
    deepseek: {
      apiKey: 'sk-506172768043496013ecea795c077e637146ea032e12e32938175ef6fdd14a92',
      baseURL: 'https://openai.qiniu.com/v1',
      model: 'deepseek-r1'
    },
    // Doubao API配置
    doubao: {
      apiKey: 'sk-1e786ad149f436ddd7b1f65698eee4e375642616344ca17be19838b6bbfca3be',
      baseURL: 'https://openai.qiniu.com/v1',
      model: 'doubao-1.5-thinking-pro'
    }
  });

  const [showKeys, setShowKeys] = useState({
    qwen: false,
    deepseek: false,
    doubao: false
  });

  const providers = [
    {
      id: 'qwen',
      name: '通义千问',
      description: 'Qwen3系列Turbo模型，实现思考模式和非思考模式的有效融合，可在对话中切换模式',
      defaultModel: 'qwen-turbo',
      models: [
        { id: 'qwen-turbo', name: 'Qwen-Turbo (快速)' },
        { id: 'qwen-plus', name: 'Qwen-Plus (增强)' },
        { id: 'qwen-max', name: 'Qwen-Max (高级)' },
        { id: 'qwen-long', name: 'Qwen-Long (长文本)' }
      ]
    },
    {
      id: 'deepseek',
      name: 'Deepseek',
      description: 'DeepSeek 团队发布的最新开源模型，具备非常强悍的推理性能，尤其在数学、编程和推理任务上达到了与OpenAI的o1模型相当的水平',
      defaultModel: 'deepseek-r1',
      models: [
        { id: 'deepseek-r1', name: 'DeepSeek-R1 (标准)' },
        { id: 'deepseek-coder', name: 'DeepSeek-Coder (编程)' },
        { id: 'deepseek-math', name: 'DeepSeek-Math (数学)' }
      ]
    },
    {
      id: 'doubao',
      name: 'Doubao',
      description: '仅支持文本输入。在数学、编程、科学推理等专业领域及创意写作等通用任务中表现突出，在AIME 2024、Codeforces、GPQA等多项权威基准上达到或接近业界第一梯队水平',
      defaultModel: 'doubao-1.5-thinking-pro',
      models: [
        { id: 'doubao-1.5-thinking-pro', name: 'Doubao-1.5-Thinking-Pro (思考)' },
        { id: 'doubao-1.5-chat', name: 'Doubao-1.5-Chat (对话)' },
        { id: 'doubao-1.5-lite', name: 'Doubao-1.5-Lite (轻量)' }
      ]
    }
  ];

  const handleProviderChange = (provider) => {
    setSettings(prev => ({
      ...prev,
      provider
    }));
  };

  const handleApiKeyChange = (provider, value) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        apiKey: value
      }
    }));
  };

  const handleModelChange = (provider, value) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        model: value
      }
    }));
  };

  const toggleShowKey = (provider) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    onClose();
  };

  const handleReset = () => {
    setSettings({
      provider: 'qwen',
      qwen: { 
        apiKey: '', 
        baseURL: 'https://openai.qiniu.com/v1',
        model: 'qwen-turbo' 
      },
      deepseek: { 
        apiKey: '', 
        baseURL: 'https://openai.qiniu.com/v1',
        model: 'deepseek-r1' 
      },
      doubao: { 
        apiKey: '', 
        baseURL: 'https://openai.qiniu.com/v1',
        model: 'doubao-1.5-thinking-pro' 
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="api-settings-overlay" onClick={onClose}>
      <div className="api-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="api-settings-header">
          <div className="header-title">
            <Settings size={24} />
            <h2>API设置</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="api-settings-body">
          <div className="provider-selection">
            <h3>选择API提供商</h3>
            <div className="provider-grid">
              {providers.map(provider => (
                <div
                  key={provider.id}
                  className={`provider-card ${settings.provider === provider.id ? 'selected' : ''}`}
                  onClick={() => handleProviderChange(provider.id)}
                >
                  <h4>{provider.name}</h4>
                  <p>{provider.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="api-config">
            <h3>API配置</h3>
            {providers.map(provider => (
              <div
                key={provider.id}
                className={`config-section ${settings.provider === provider.id ? 'active' : ''}`}
              >
                <div className="config-item">
                  <label>API密钥</label>
                  <div className="input-with-icon">
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={settings[provider.id].apiKey}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      placeholder={`请输入${provider.name}的API密钥`}
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => toggleShowKey(provider.id)}
                    >
                      {showKeys[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="config-item">
                  <label>模型</label>
                  <select
                    value={settings[provider.id].model}
                    onChange={(e) => handleModelChange(provider.id, e.target.value)}
                  >
                    {provider.models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="api-info">
            <h3>使用说明</h3>
            <div className="info-content">
              <p>1. 选择你喜欢的API提供商</p>
              <p>2. 填入对应的API密钥</p>
              <p>3. 选择要使用的模型</p>
              <p>4. 点击保存即可开始使用</p>
              <div className="warning">
                <strong>注意：</strong>API密钥将保存在本地，请确保你的设备安全。
              </div>
            </div>
          </div>
        </div>

        <div className="api-settings-footer">
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            重置
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={16} />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
