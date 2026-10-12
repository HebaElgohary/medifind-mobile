import axios from 'axios';
import { SERVER_URL } from './serverCheck';

// Function to test a direct API request to the server
export const testApiRequest = async (endpoint, data) => {
  console.log(`Testing direct API request to ${SERVER_URL}/${endpoint}`);
  console.log('Request data:', JSON.stringify(data, null, 2));
  
  try {
    const response = await axios.post(`${SERVER_URL}/${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    console.log('Direct API request successful');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Direct API request failed');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
        message: error.message
      };
    }
    
    return {
      success: false,
      message: error.message
    };
  }
};

// Function to validate request data against expected schema
export const validateRequestData = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
};

export default {
  testApiRequest,
  validateRequestData
}; 