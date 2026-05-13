import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

//La diferencia entre los archivos users.service.spec.ts y users.service.ts 
// es que el primero es un archivo de pruebas unitarias para el servicio de usuarios, 
// mientras que el segundo es el archivo que contiene la implementación real del servicio de usuarios. 
// El archivo users.service.spec.ts se utiliza para escribir pruebas que verifiquen el correcto funcionamiento 
// del servicio de usuarios, mientras que el archivo users.service.ts contiene la lógica de negocio relacionada 
// con los usuarios, como la creación, actualización, eliminación y consulta de usuarios en la base de datos.