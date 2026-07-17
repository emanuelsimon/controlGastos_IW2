import { Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';
export declare class RecommendationsService {
    private repo;
    constructor(repo: Repository<Recommendation>);
    create(mensaje: string, asesorId: number, usuarioId: number): Promise<Recommendation>;
    findByUsuario(usuarioId: number): Promise<Recommendation[]>;
}
