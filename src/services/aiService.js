// AI服务 - 调用大模型API
class AIService {
  constructor() {
    // API配置
    this.config = {
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
    };
    
    // 当前使用的API提供商
    this.currentProvider = 'qwen'; // 可选: 'qwen', 'deepseek', 'doubao'
  }

  // 构建角色提示词
  buildCharacterPrompt(character, userMessage, conversationHistory = []) {
    const systemPrompt = `你是${character.name}，${character.description}。

性格特点：${character.personality}
技能特长：${character.skills.join('、')}
背景介绍：${character.background}

请严格按照以下要求进行角色扮演：
1. 完全沉浸在角色中，以第一人称"我"来回答
2. 保持角色的性格特点和说话风格
3. 运用角色的技能和知识背景
4. 回答要生动有趣，符合角色设定
5. 适当使用角色的专业术语和表达方式
6. 保持对话的自然流畅，不要过于生硬

请用中文回答，回答长度控制在100-200字之间。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // 保留最近6轮对话作为上下文
      { role: 'user', content: userMessage }
    ];

    return messages;
  }

  // 调用Qwen API
  async callQwen(messages) {
    const config = this.config.qwen;
    
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        max_tokens: 300,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // 调用Deepseek API
  async callDeepseek(messages) {
    const config = this.config.deepseek;
    
    // 将消息格式转换为Deepseek格式
    const systemMessage = messages.find(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    
    const response = await fetch(`${config.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 300,
        system: systemMessage?.content || '',
        messages: conversationMessages
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // 调用豆包 API
  async callDoubao(messages) {
    const config = this.config.doubao;
    
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        max_tokens: 300,
        temperature: 0.8,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`智谱AI API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // 主要调用方法
  async generateResponse(character, userMessage, conversationHistory = []) {
    try {
      const messages = this.buildCharacterPrompt(character, userMessage, conversationHistory);
      
      let response;
      switch (this.currentProvider) {
        case 'qwen':
          response = await this.callQwen(messages);
          break;
        case 'deepseek':
          response = await this.callDeepseek(messages);
          break;
        case 'doubao':
          response = await this.callDoubao(messages);
          break;
        default:
          throw new Error(`不支持的API提供商: ${this.currentProvider}`);
      }

      return response.trim();
    } catch (error) {
      console.error('AI服务错误:', error);
      
      // 返回备用回复
      return this.getFallbackResponse(character, userMessage);
    }
  }

  // 备用回复（当API调用失败时）
  getFallbackResponse(character, userMessage) {
    return `抱歉，${character.name}暂时无法回应，请稍后再试。`;
  }

  // 设置API提供商和配置
  setProvider(provider, config) {
    if (['qwen', 'deepseek', 'doubao'].includes(provider)) {
      this.currentProvider = provider;
      
      // 如果提供了配置，更新配置
      if (config) {
        // 更新当前提供商的配置
        this.config[provider] = {
          ...this.config[provider],
          ...config
        };
      }
    } else {
      throw new Error('不支持的API提供商');
    }
  }

  // 获取当前配置
  getConfig() {
    return {
      currentProvider: this.currentProvider,
      availableProviders: ['qwen', 'deepseek', 'doubao']
    };
  }
}

// 创建单例实例
const aiService = new AIService();

export default aiService;
