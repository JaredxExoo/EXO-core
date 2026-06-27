const axios = require('axios');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { text } = JSON.parse(event.body);
    const apiKey = 'sk_511693921c754f073d6477f77d5d90095e455bc8806861b5';
    const voiceId = 'EXAVITQu4vr4xnSDxMaL';

    if (!text) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Text required' }) };
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': apiKey
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ audio: audioBase64, success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
