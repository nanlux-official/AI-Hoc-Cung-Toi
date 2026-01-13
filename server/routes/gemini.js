const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Sử dụng model gemini-2.0-flash (ổn định hơn)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

if (!GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY is not set in environment variables!');
}

// Hàm retry với exponential backoff
const callWithRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable = error.response?.status === 429 || 
                          error.response?.status === 503 ||
                          error.code === 'ECONNABORTED';
      
      if (i === maxRetries - 1 || !isRetryable) {
        throw error;
      }
      
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Proxy endpoint for Gemini API
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');

    const response = await callWithRetry(async () => {
      return await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 25000
        }
      );
    });

    console.log('Gemini API Response received');

    // Kiểm tra response structure
    const candidate = response.data?.candidates?.[0];
    if (!candidate) {
      console.error('No candidates in response:', response.data);
      throw new Error('No candidates in Gemini API response');
    }

    // Lấy text từ content.parts
    const text = candidate.content?.parts?.[0]?.text;
    
    if (text) {
      res.json({
        success: true,
        text: text
      });
    } else {
      console.error('No text in response');
      throw new Error('No text content in Gemini API response');
    }
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Trả về lỗi cụ thể hơn
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.status === 429 
      ? 'API đang quá tải, vui lòng thử lại sau vài giây'
      : error.response?.data?.error?.message || error.message;
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;
