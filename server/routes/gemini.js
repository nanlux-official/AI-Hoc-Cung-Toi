const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = 'AIzaSyAPfGgFaHYKqag_UzDJzROgDXRLtiIIhfI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Proxy endpoint for Gemini API
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');

    const response = await axios.post(
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
        timeout: 30000
      }
    );

    console.log('Gemini API Response:', JSON.stringify(response.data).substring(0, 300));

    // Kiểm tra response structure
    const candidate = response.data?.candidates?.[0];
    if (!candidate) {
      console.error('No candidates in response:', response.data);
      throw new Error('No candidates in Gemini API response');
    }

    // Kiểm tra finishReason
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn('Response was truncated due to MAX_TOKENS');
    }

    // Lấy text từ content.parts
    const text = candidate.content?.parts?.[0]?.text;
    
    if (text) {
      res.json({
        success: true,
        text: text
      });
    } else {
      console.error('No text in response. Full candidate:', JSON.stringify(candidate, null, 2));
      throw new Error('No text content in Gemini API response');
    }
  } catch (error) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });
  }
});

module.exports = router;
