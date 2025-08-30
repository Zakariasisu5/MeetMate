import axios from 'axios';
import { SensayChatRequest, SensayRecommendationRequest, SensayResponse } from '../types/index';

const SENSAY_API_KEY = process.env.SENSAY_API_KEY;
const SENSAY_API_URL = process.env.SENSAY_API_URL || 'https://api.sensay.ai/v1';

class SensayService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${SENSAY_API_URL}${endpoint}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${SENSAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Sensay API Error:', error);
      throw new Error('Failed to communicate with Sensay AI');
    }
  }

  async chat(request: SensayChatRequest): Promise<SensayResponse> {
    const prompt = `You are MeetMate AI, a helpful assistant for event planning and social networking. 
    User: ${request.message}
    
    Please provide helpful, friendly advice about event planning, social networking, or general assistance.`;

    const response = await this.makeRequest('/chat', {
      prompt,
    });

    return {
      reply: response.response || response.message || 'I apologize, but I couldn\'t process your request.',
    };
  }

  async getRecommendations(request: SensayRecommendationRequest): Promise<SensayResponse> {
    const prompt = `User context: ${request.context}\nPlease provide personalized event recommendations and suggestions.`;

    const response = await this.makeRequest('/chat', {
      prompt,
    });

    // For now, just return the reply as a string array (split by newlines or periods)
  const recommendations = (response.response || response.message || '').split(/\n|\./).map((s: string) => s.trim()).filter(Boolean);

    return {
      reply: response.response || response.message || 'Here are some recommendations for you!',
      recommendations,
    };
  }

  // parseRecommendationsFromResponse removed (not needed for string[])
}

export const sensayService = new SensayService();
