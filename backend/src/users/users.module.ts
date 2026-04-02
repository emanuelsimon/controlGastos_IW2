//La convencion en NestJS es un módulo por cada entidad, 
//en este caso un módulo de usuarios para manejar todo lo relacionado con los usuarios
//Importamos la entidad, el servicio y el controlador de usuarios para poder usarlos en el módulo
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    //Le decimos a Nest que el módulo de usuarios va a usar el repositorio de User, 
    // para poder hacer consultas a la base de datos
  imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
