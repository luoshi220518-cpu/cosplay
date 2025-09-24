# AI角色扮演聊天 - API设置指南

## 概述

本项目支持多个大模型API提供商，让你可以与AI角色进行智能对话。你只需要填入API密钥即可开始使用。

## 支持的API提供商

### 1. OpenAI (推荐)
- **模型**: GPT-3.5-turbo, GPT-4, GPT-4-turbo
- **特点**: 质量高，响应快
- **获取方式**: https://platform.openai.com/
- **注意**: 需要科学上网

### 2. Claude
- **模型**: Claude-3-Haiku, Claude-3-Sonnet, Claude-3-Opus
- **特点**: 安全性高，逻辑性强
- **获取方式**: https://console.anthropic.com/
- **注意**: 需要科学上网

### 3. 智谱AI (国内推荐)
- **模型**: GLM-4, GLM-3-turbo
- **特点**: 国内可用，无需科学上网
- **获取方式**: https://open.bigmodel.cn/
- **价格**: 相对便宜

### 4. 通义千问
- **模型**: Qwen-turbo, Qwen-plus, Qwen-max
- **特点**: 阿里云出品，国内可用
- **获取方式**: https://dashscope.aliyun.com/

## 设置步骤

### 方法一：通过界面设置（推荐）

1. 进入聊天界面
2. 点击右上角的设置按钮（⚙️）
3. 选择你喜欢的API提供商
4. 填入对应的API密钥
5. 选择要使用的模型
6. 点击"保存设置"

### 方法二：直接修改代码

1. 打开 `src/services/aiService.js` 文件
2. 找到 `this.config` 对象
3. 将 `YOUR_API_KEY` 替换为你的真实API密钥
4. 保存文件

## API密钥获取指南

### OpenAI API密钥
1. 访问 https://platform.openai.com/
2. 注册/登录账户
3. 进入 "API Keys" 页面
4. 点击 "Create new secret key"
5. 复制生成的密钥

### Claude API密钥
1. 访问 https://console.anthropic.com/
2. 注册/登录账户
3. 进入 "API Keys" 页面
4. 点击 "Create Key"
5. 复制生成的密钥

### 智谱AI API密钥
1. 访问 https://open.bigmodel.cn/
2. 注册/登录账户
3. 进入控制台
4. 在API密钥页面创建新密钥
5. 复制生成的密钥

### 通义千问API密钥
1. 访问 https://dashscope.aliyun.com/
2. 注册/登录阿里云账户
3. 开通通义千问服务
4. 在API密钥管理页面创建密钥
5. 复制生成的密钥

## 使用建议

### 选择API提供商的建议

- **预算充足 + 需要高质量回复**: 选择 OpenAI GPT-4
- **预算有限 + 需要高质量回复**: 选择 OpenAI GPT-3.5-turbo
- **注重安全性**: 选择 Claude
- **国内用户 + 预算有限**: 选择智谱AI
- **阿里云用户**: 选择通义千问

### 模型选择建议

- **GPT-3.5-turbo**: 性价比高，适合日常对话
- **GPT-4**: 质量最高，适合复杂对话
- **Claude-3-Sonnet**: 平衡质量和速度
- **GLM-4**: 国内最佳选择
- **Qwen-turbo**: 快速响应

## 费用说明

### OpenAI
- GPT-3.5-turbo: $0.002/1K tokens
- GPT-4: $0.03/1K tokens

### Claude
- Claude-3-Haiku: $0.25/1M tokens
- Claude-3-Sonnet: $3/1M tokens

### 智谱AI
- GLM-4: ¥0.1/1K tokens
- GLM-3-turbo: ¥0.005/1K tokens

### 通义千问
- Qwen-turbo: ¥0.003/1K tokens
- Qwen-plus: ¥0.008/1K tokens

## 故障排除

### 常见问题

1. **API调用失败**
   - 检查API密钥是否正确
   - 确认账户余额充足
   - 检查网络连接

2. **回复质量不佳**
   - 尝试更换模型
   - 调整温度参数
   - 优化角色设定

3. **响应速度慢**
   - 选择更快的模型
   - 检查网络延迟
   - 减少对话历史长度

### 错误代码

- **401**: API密钥无效
- **429**: 请求频率过高
- **500**: 服务器错误
- **网络错误**: 检查网络连接

## 安全提醒

1. **保护API密钥**: 不要将API密钥提交到公共代码仓库
2. **设置使用限制**: 在API提供商处设置使用限制
3. **定期更换密钥**: 定期更换API密钥
4. **监控使用情况**: 定期检查API使用情况

## 技术支持

如果遇到问题，可以：

1. 查看浏览器控制台的错误信息
2. 检查网络连接
3. 确认API密钥和配置正确
4. 尝试更换API提供商

## 更新日志

- v1.0.0: 初始版本，支持基础AI对话
- v1.1.0: 添加多API提供商支持
- v1.2.0: 添加API设置界面
- v1.3.0: 优化角色提示词和回复质量
