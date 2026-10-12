/**
 * مكتبة للتعامل مع الأخطاء الشائعة في التطبيق
 */

import { Alert } from 'react-native';
import { SERVER_URL } from './serverCheck';

/**
 * التحقق من حالة الاتصال بالخادم
 * @returns {Promise<boolean>} حالة الاتصال بالخادم
 */
export const checkConnection = async () => {
  try {
    const response = await fetch(SERVER_URL, { 
      method: 'GET',
      timeout: 5000 
    });
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
};

/**
 * معالجة أخطاء API
 * @param {Error} error كائن الخطأ
 * @param {string} fallbackMessage رسالة احتياطية في حالة عدم وجود رسالة خطأ
 * @returns {string} رسالة الخطأ المعالجة
 */
export const handleApiError = (error, fallbackMessage = 'حدث خطأ غير متوقع') => {
  console.error('API Error:', error);
  
  // محاولة استخراج رسالة الخطأ من الاستجابة
  if (error.data) {
    try {
      // إذا كانت البيانات نصية، حاول تحليلها كـ JSON
      if (typeof error.data === 'string') {
        const parsedData = JSON.parse(error.data);
        return parsedData.data || parsedData.message || fallbackMessage;
      }
      
      // إذا كانت البيانات كائن JSON بالفعل
      return error.data.data || error.data.message || fallbackMessage;
    } catch (parseError) {
      console.error('Error parsing error data:', parseError);
    }
  }
  
  // إذا كان هناك رسالة خطأ مباشرة
  if (error.message) {
    return error.message;
  }
  
  // استخدام الرسالة الاحتياطية
  return fallbackMessage;
};

/**
 * عرض تنبيه خطأ
 * @param {string} title عنوان التنبيه
 * @param {string} message رسالة الخطأ
 * @param {Function} onOk دالة يتم تنفيذها عند النقر على زر موافق
 */
export const showErrorAlert = (title, message, onOk = null) => {
  Alert.alert(
    title,
    message,
    [{ text: 'موافق', onPress: onOk }],
    { cancelable: false }
  );
};

/**
 * التحقق من صحة البيانات المرسلة
 * @param {Object} data البيانات المراد التحقق منها
 * @param {Array<string>} requiredFields الحقول المطلوبة
 * @returns {Object} نتيجة التحقق
 */
export const validateData = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * تسجيل الخطأ في وحدة التحكم
 * @param {string} context سياق الخطأ
 * @param {Error} error كائن الخطأ
 */
export const logError = (context, error) => {
  console.error(`[${context}] Error:`, error);
  
  if (error.response) {
    console.error(`[${context}] Status:`, error.response.status);
    console.error(`[${context}] Data:`, error.response.data);
  }
};

export default {
  checkConnection,
  handleApiError,
  showErrorAlert,
  validateData,
  logError
}; 