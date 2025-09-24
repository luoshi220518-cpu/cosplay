// API配置文件
// 请在这里填入你的API密钥

export const API_CONFIG = {
  // OpenAI API配置
  OPENAI: {
    API_KEY: 'YOUR_OPENAI_API_KEY', // 请替换为你的OpenAI API密钥
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo', // 可选: gpt-3.5-turbo, gpt-4, gpt-4-turbo
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8
  },

  // Claude API配置
  CLAUDE: {
    API_KEY: 'YOUR_CLAUDE_API_KEY', // 请替换为你的Claude API密钥
    BASE_URL: 'https://api.anthropic.com/v1',
    MODEL: 'claude-3-sonnet-20240229', // 可选: claude-3-haiku-20240307, claude-3-sonnet-20240229, claude-3-opus-20240229
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8
  },

  // 智谱AI API配置
  ZHIPU: {
    API_KEY: 'YOUR_ZHIPU_API_KEY', // 请替换为你的智谱AI API密钥
    BASE_URL: 'https://open.bigmodel.cn/api/paas/v4',
    MODEL: 'glm-4', // 可选: glm-4, glm-3-turbo
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8
  },

  // 通义千问API配置
  QWEN: {
    API_KEY: 'YOUR_QWEN_API_KEY', // 请替换为你的通义千问API密钥
    BASE_URL: 'https://dashscope.aliyuncs.com/api/v1',
    MODEL: 'qwen-turbo', // 可选: qwen-turbo, qwen-plus, qwen-max
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8
  },

  // 默认使用的API提供商
  DEFAULT_PROVIDER: 'openai', // 可选: 'openai', 'claude', 'zhipu', 'qwen'
};

// API使用说明
export const API_USAGE_GUIDE = {
  openai: {
    name: 'OpenAI',
    website: 'https://platform.openai.com/',
    description: 'ChatGPT API，需要科学上网',
    pricing: '按token计费，相对较贵但质量高'
  },
  claude: {
    name: 'Claude',
    website: 'https://console.anthropic.com/',
    description: 'Anthropic的Claude API',
    pricing: '按token计费，质量很高'
  },
  zhipu: {
    name: '智谱AI',
    website: 'https://open.bigmodel.cn/',
    description: '国内大模型，无需科学上网',
    pricing: '按token计费，价格相对便宜'
  },
  qwen: {
    name: '通义千问',
    website: 'https://dashscope.aliyun.com/',
    description: '阿里云大模型，国内可用',
    pricing: '按token计费，价格适中'
  }
};
