import React, { useState } from 'react';
import { Settings, Key, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import './ApiSettings.css';

const ApiSettings = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    provider: 'openai',
    openai: {
      apiKey: '',
      model: 'gpt-3.5-turbo'
    },
    claude: {
      apiKey: '',
      model: 'claude-3-sonnet-20240229'
    },
    zhipu: {
      apiKey: '',
      model: 'glm-4'
    },
    qwen: {
      apiKey: '',
      model: 'qwen-turbo'
    }
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    claude: false,
    zhipu: false,
    qwen: false
  });

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'ChatGPT API，需要科学上网',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Anthropic的Claude API',
      models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229']
    },
    {
      id: 'zhipu',
      name: '智谱AI',
      description: '国内大模型，无需科学上网',
      models: ['glm-4', 'glm-3-turbo']
    },
    {
      id: 'qwen',
      name: '通义千问',
      description: '阿里云大模型，国内可用',
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max']
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
      provider: 'openai',
      openai: { apiKey: '', model: 'gpt-3.5-turbo' },
      claude: { apiKey: '', model: 'claude-3-sonnet-20240229' },
      zhipu: { apiKey: '', model: 'glm-4' },
      qwen: { apiKey: '', model: 'qwen-turbo' }
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
                      <option key={model} value={model}>{model}</option>
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
