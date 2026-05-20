import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('recommendations')
export class Recommendation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    mensaje!: string;

    @ManyToOne(() => User)
    asesor!: User;

    @ManyToOne(() => User)
    usuario!: User;

    @CreateDateColumn()
    fecha!: Date;
}