// API配置文件
// 请在这里填入你的API密钥

export const API_CONFIG = {
  // Qwen API配置
  QWEN: {
    API_KEY: 'sk-343f061be4279a7841c0f039f876092478972a73ab56a5758d171de2f5758c70',
    BASE_URL: 'https://openai.qiniu.com/v1',
    MODEL: 'qwen-turbo',
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8,
    TOP_P: 0.9,
    FREQUENCY_PENALTY: 0.5,
    PRESENCE_PENALTY: 0.3
  },

  // Deepseek API配置
  DEEPSEEK: {
    API_KEY: 'sk-506172768043496013ecea795c077e637146ea032e12e32938175ef6fdd14a92',
    BASE_URL: 'https://openai.qiniu.com/v1',
    MODEL: 'deepseek-r1',
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8,
    ANTHROPIC_VERSION: '2023-06-01'
  },

  // 豆包 API配置
  DOUBAO: {
    API_KEY: 'sk-1e786ad149f436ddd7b1f65698eee4e375642616344ca17be19838b6bbfca3be',
    BASE_URL: 'https://openai.qiniu.com/v1',
    MODEL: 'doubao-1.5-thinking-pro',
    MAX_TOKENS: 300,
    TEMPERATURE: 0.8,
    TOP_P: 0.9
  },

  // 默认使用的API提供商
  DEFAULT_PROVIDER: 'qwen', // 可选: 'qwen', 'deepseek', 'doubao'
};

// API使用说明
export const API_USAGE_GUIDE = {
  qwen: {
    name: '通义千问',
    website: 'https://dashscope.aliyun.com/',
    description: '阿里云通义千问大模型，国内可用',
    pricing: '按token计费，价格适中，质量较高'
  },
  deepseek: {
    name: 'DeepSeek',
    website: 'https://platform.deepseek.com/',
    description: 'DeepSeek大模型，推理能力强',
    pricing: '按token计费，价格相对便宜'
  },
  doubao: {
    name: '豆包',
    website: 'https://www.volcengine.com/',
    description: '字节跳动豆包大模型，思维链推理',
    pricing: '按token计费，价格适中'
  }
};
