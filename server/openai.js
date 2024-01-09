const axios = require('axios');

const openaiApiKey = process.env.OPENAI_KEY
const apiUrl = 'https://api.openai.com/v1/chat/completions';

async function generateChatResponse(prompt) {
  try {
    const response = await axios.post(apiUrl, {
      prompt: prompt,
      max_tokens: 150,  // Adjust based on your requirements
      n: 1             // Number of completions
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      }
    });

    // Extract the generated text from the response
    const generatedText = response.data.choices[0].json;
    return generatedText;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
}

const sendRequestToOpenAI = async (inputData) => {  
    content = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": inputData}],
        "temperature": 0.7
    }
    try {
/*       const response = await axios.post(apiUrl, {
        prompt: inputData,
        max_tokens: 100,
      }, { */
      const response = await axios.post(apiUrl, content, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error sending request to OpenAI:', error.message);
      throw error;
    }
  };

  module.exports = { sendRequestToOpenAI };
