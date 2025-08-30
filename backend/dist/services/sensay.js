import axios from 'axios';
const SENSAY_API_KEY = process.env.SENSAY_API_KEY;
const SENSAY_API_URL = process.env.SENSAY_API_URL || 'https://api.sensay.ai/v1';
class SensayService {
    async makeRequest(endpoint, data) {
        try {
            const response = await axios.post(`${SENSAY_API_URL}${endpoint}`, data, {
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
    User: ${request.prompt}
    Context: ${request.context || 'General event planning assistance'}
    
    Please provide helpful, friendly advice about event planning, social networking, or general assistance.`;
        const response = await this.makeRequest('/chat', {
            prompt,
            user_id: request.userId,
        });
        return {
            response: response.response || response.message || 'I apologize, but I couldn\'t process your request.',
        };
    }
    async getRecommendations(request) {
        const prompt = `Based on the following user preferences, suggest relevant events or activities:
    User ID: ${request.userId}
    Interests: ${request.preferences.interests.join(', ')}
    Location: ${request.preferences.location || 'Any location'}
    Date Range: ${request.preferences.dateRange ?
            `${request.preferences.dateRange.start.toISOString()} to ${request.preferences.dateRange.end.toISOString()}` :
            'Any time'}
    
    Please provide personalized event recommendations and suggestions.`;
        const response = await this.makeRequest('/chat', {
            prompt,
            user_id: request.userId,
        });
        // Parse recommendations from AI response
        const recommendations = this.parseRecommendationsFromResponse(response.response || response.message);
        return {
            response: response.response || response.message || 'Here are some recommendations for you!',
            recommendations,
        };
    }
    parseRecommendationsFromResponse(aiResponse) {
        // This is a simplified parser - in a real implementation, you might want to use
        // structured output from the AI or implement more sophisticated parsing
        const recommendations = [];
        // Extract event-like suggestions from AI response
        const eventPatterns = [
            /(?:suggest|recommend|try|check out)\s+(.+?)(?:\.|$)/gi,
            /(?:event|activity|meetup)\s+(?:like\s+)?(.+?)(?:\.|$)/gi,
        ];
        eventPatterns.forEach(pattern => {
            const matches = aiResponse.match(pattern);
            if (matches) {
                matches.forEach((match, index) => {
                    if (index < 3) { // Limit to 3 recommendations
                        recommendations.push({
                            id: `ai-recommendation-${Date.now()}-${index}`,
                            title: match.replace(/^(?:suggest|recommend|try|check out)\s+/i, '').trim(),
                            description: `AI recommended: ${match}`,
                            date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000), // Future dates
                            location: 'TBD',
                            createdBy: 'ai-assistant',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }
                });
            }
        });
        return recommendations;
    }
}
export const sensayService = new SensayService();
//# sourceMappingURL=sensay.js.map