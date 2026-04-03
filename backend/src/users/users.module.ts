//La convencion en NestJS es un módulo por cada entidad,
//en este caso un módulo de usuarios para manejar todo lo relacionado con los usuarios
//Importamos la entidad, el servicio y el controlador de usuarios para poder usarlos en el módulo
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

//@Module es un decorador que define un módulo en NestJS, en este caso el módulo de usuarios
@Module({
  imports: [TypeOrmModule.forFeature([User])],//Importamos el módulo de TypeORM y le decimos que vamos a usar la entidad User
  providers: [UsersService],//Registramos el servicio de usuarios para poder usarlo en el controlador
  controllers: [UsersController],//Registramos el controlador de usuarios para poder manejar las rutas relacionadas con los usuarios
  exports: [UsersService], //Exportamos el servicio de usuarios para poder usarlo en otros módulos, como el de autenticación
})
//Esta clase esta vacia porque es solo el contenedor del módulo, toda la lógica esta en el servicio y el controlador.
//Lo que se exporta es el contenido de @Module, no la clase en si, por eso no es necesario agregar nada a la clase.
export class UsersModule {}
