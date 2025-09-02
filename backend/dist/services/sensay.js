"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensayService = void 0;
const axios_1 = __importDefault(require("axios"));
const SENSAY_API_KEY = process.env.SENSAY_API_KEY;
const SENSAY_API_URL = process.env.SENSAY_API_URL || 'https://api.sensay.ai/v1';
class SensayService {
    async makeRequest(endpoint, data) {
        try {
            const response = await axios_1.default.post(`${SENSAY_API_URL}${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${SENSAY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Sensay API Error:', error);
            throw new Error('Failed to communicate with Sensay AI');
        }
    }
    async chat(request) {
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
    async getRecommendations(request) {
        const prompt = `User context: ${request.context}\nPlease provide personalized event recommendations and suggestions.`;
        const response = await this.makeRequest('/chat', {
            prompt,
        });
        // For now, just return the reply as a string array (split by newlines or periods)
        const recommendations = (response.response || response.message || '').split(/\n|\./).map((s) => s.trim()).filter(Boolean);
        return {
            reply: response.response || response.message || 'Here are some recommendations for you!',
            recommendations,
        };
    }
}
exports.sensayService = new SensayService();
//# sourceMappingURL=sensay.js.map