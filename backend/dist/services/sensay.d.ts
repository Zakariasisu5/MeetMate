import { SensayChatRequest, SensayRecommendationRequest, SensayResponse } from '../types/index';
declare class SensayService {
    private makeRequest;
    chat(request: SensayChatRequest): Promise<SensayResponse>;
    getRecommendations(request: SensayRecommendationRequest): Promise<SensayResponse>;
}
export declare const sensayService: SensayService;
export {};
//# sourceMappingURL=sensay.d.ts.map