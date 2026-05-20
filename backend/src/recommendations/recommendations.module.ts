import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from './recommendation.entity';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Recommendation])],
    providers: [RecommendationsService],
    controllers: [RecommendationsController]
})
export class RecommendationsModule {}