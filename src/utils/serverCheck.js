import axios from 'axios';

// عنوان الخادم
export const SERVER_URL = 'http://192.168.1.57:7777';

// التحقق من حالة الخادم
export const checkServerStatus = async () => {
  try {
    console.log('Checking server status at:', SERVER_URL);
    const response = await axios.get(SERVER_URL, {
      timeout: 5000 // 5 seconds timeout
    });
    console.log('Server is online. Status:', response.status);
    return {
      online: true,
      status: response.status,
      message: 'Server is online'
    };
  } catch (error) {
    console.error('Server check failed:', error.message);
    return {
      online: false,
      status: error.response?.status || 0,
      message: error.message
    };
  }
};

// الحصول على معلومات الخادم
export const getServerInfo = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/info`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get server info:', error.message);
    return null;
  }
};

// التحقق من صحة الاتصال بقاعدة البيانات
export const checkDatabaseConnection = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    return {
      database: false,
      message: error.message
    };
  }
};

export default {
  checkServerStatus,
  getServerInfo,
  checkDatabaseConnection,
  SERVER_URL
}; 