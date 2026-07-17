import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private service;
    constructor(service: RecommendationsService);
    create(body: {
        mensaje: string;
        asesorId: number;
        usuarioId: number;
    }): Promise<import("./recommendation.entity").Recommendation>;
    getByUsuario(user: any, userId: number): Promise<import("./recommendation.entity").Recommendation[]>;
}
