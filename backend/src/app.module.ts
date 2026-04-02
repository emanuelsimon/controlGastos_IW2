import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  //Dentro del decorador @Module le decimos a NestJS cuales modulos son parte de la aplicación
  //En éste caso @Module(imports[onfigModule.forRoot(..), TypeOrmModule.forRootAsync(..),UsersModule,ExpensesModule,AuthModule]
  imports: [
    //Con esta funcion cargamos el archivo .env y lo hacemos visible para toda la app
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
	//Con entities le decimos a TypeOrm (ORM en NestJS) donde buscar las entidades
	//Entidades: son las clases que representan tablas en la BD
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
	//Le decimos a TypeORM (ORM de NestJS) que actualice/sincronize automaticamente segun las entidades que definimos
	//Poner en FALSE en PRODUCCION
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ExpensesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
