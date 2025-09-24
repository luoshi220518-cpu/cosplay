// 图片上传和管理服务
class ImageService {
  constructor() {
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.defaultImages = {
      userAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTIwIDIxVjE5QzIwIDE3Ljg5NTQgMTkuMTA0NiAxNyAxOCAxN0g2QzQuODk1NDMgMTcgNCAxNy44OTU0IDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=',
      characterAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg==',
      chatBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
  }

  // 验证文件
  validateFile(file) {
    if (!file) {
      throw new Error('请选择文件');
    }

    if (!this.allowedTypes.includes(file.type)) {
      throw new Error('只支持 JPG、PNG、GIF、WebP 格式的图片');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('图片大小不能超过 5MB');
    }

    return true;
  }

  // 压缩图片
  compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算新尺寸
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为blob
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // 从base64压缩图片
  compressImageFromBase64(base64Data, type = 'general') {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 根据类型设置不同的压缩参数
        let maxWidth = 800;
        let quality = 0.8;
        
        switch (type) {
          case 'avatar':
            maxWidth = 200;
            quality = 0.9;
            break;
          case 'background':
            maxWidth = 1200;
            quality = 0.7;
            break;
          default:
            maxWidth = 800;
            quality = 0.8;
        }

        // 计算新尺寸
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = base64Data;
    });
  }

  // 上传图片（转换为base64）
  async uploadImage(file, type = 'general') {
    try {
      this.validateFile(file);
      
      // 根据类型设置不同的压缩参数
      let maxWidth = 800;
      let quality = 0.8;
      
      switch (type) {
        case 'avatar':
          maxWidth = 200;
          quality = 0.9;
          break;
        case 'background':
          maxWidth = 1200;
          quality = 0.7;
          break;
        default:
          maxWidth = 800;
          quality = 0.8;
      }

      const compressedFile = await this.compressImage(file, maxWidth, quality);
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      throw error;
    }
  }

  // 保存图片到本地存储
  saveImage(key, imageData) {
    try {
      localStorage.setItem(`image_${key}`, imageData);
      return true;
    } catch (error) {
      console.error('保存图片失败:', error);
      return false;
    }
  }

  // 从本地存储获取图片
  getImage(key) {
    try {
      return localStorage.getItem(`image_${key}`) || this.getDefaultImage(key);
    } catch (error) {
      console.error('获取图片失败:', error);
      return this.getDefaultImage(key);
    }
  }

  // 获取默认图片
  getDefaultImage(type) {
    return this.defaultImages[type] || this.defaultImages.characterAvatar;
  }

  // 删除图片
  deleteImage(key) {
    try {
      localStorage.removeItem(`image_${key}`);
      return true;
    } catch (error) {
      console.error('删除图片失败:', error);
      return false;
    }
  }

  // 获取用户头像
  getUserAvatar(userId) {
    return this.getImage(`user_${userId}`);
  }

  // 保存用户头像
  saveUserAvatar(userId, imageData) {
    return this.saveImage(`user_${userId}`, imageData);
  }

  // 获取角色头像
  getCharacterAvatar(characterId) {
    return this.getImage(`character_${characterId}`);
  }

  // 保存角色头像
  saveCharacterAvatar(characterId, imageData) {
    return this.saveImage(`character_${characterId}`, imageData);
  }

  // 获取聊天背景
  getChatBackground(characterId) {
    return this.getImage(`background_${characterId}`);
  }

  // 保存聊天背景
  saveChatBackground(characterId, imageData) {
    return this.saveImage(`background_${characterId}`, imageData);
  }

  // 清除所有图片缓存
  clearAllImages() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('image_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('清除图片缓存失败:', error);
      return false;
    }
  }

  // 获取存储使用情况
  getStorageInfo() {
    try {
      const keys = Object.keys(localStorage);
      const imageKeys = keys.filter(key => key.startsWith('image_'));
      let totalSize = 0;
      
      imageKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      });

      return {
        imageCount: imageKeys.length,
        totalSize: totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return { imageCount: 0, totalSize: 0, totalSizeMB: '0.00' };
    }
  }
}

// 创建单例实例
const imageService = new ImageService();

export default imageService;
