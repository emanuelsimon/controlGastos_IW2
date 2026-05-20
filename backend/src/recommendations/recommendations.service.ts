import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';

@Injectable()
export class RecommendationsService {
    constructor(
        @InjectRepository(Recommendation)
        private repo: Repository<Recommendation>,
    ) {}

    async create(mensaje: string, asesorId: number, usuarioId: number) {
        const rec = this.repo.create({
            mensaje,
            asesor: { id: asesorId } as any,
            usuario: { id: usuarioId } as any,
        })
        return this.repo.save(rec)
    }

    async findByUsuario(usuarioId: number) {
        return this.repo.find({
            where: { usuario: { id: usuarioId } as any },
            relations: ['asesor'],
            order: { fecha: 'DESC' }
        })
    }
}