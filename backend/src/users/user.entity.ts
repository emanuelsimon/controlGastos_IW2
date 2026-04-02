import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  //Con el signo "!" le decimos a TypeScript que estas propiedades van a ser inicializadas, aunque no lo parezca,
  // esto es porque TypeORM se encarga de inicializarlas cuando se crean las tablas en la base de datos

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  dni!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'usuario' })
  rol!: string;
}