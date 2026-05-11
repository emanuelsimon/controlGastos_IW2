import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    id!: number;
    //Con el signo "!" le decimos a TypeScript que estas propiedades van a ser inicializadas, aunque no lo parezca,
    // esto es porque TypeORM se encarga de inicializarlas cuando se crean las tablas en la base de datos

    @Column()
    comercio!: string;

    @Column()
    fecha!: Date;

    @Column()
    monto!: number;

    @Column({ default: 'categoria' })
    categoria!: string;

    @Column({ nullable: true })
    descripcion!: string;

    @Column({ nullable: true })
    imagen!: string;

    @Column({ default: 'usuario' })
    user!: string;

    @ManyToOne(() => User, user => user.)
    userEntity!: User;
}