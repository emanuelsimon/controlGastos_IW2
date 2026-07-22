import { IsString, IsOptional, MaxLength } from 'class-validator';

// Aqui se define la estructura de datos que se espera recibir al procesar un ticket, incluyendo la imagen en base64 y el tipo MIME opcional.
export class ProcessTicketDto {
  @IsString()
  @MaxLength(5000000, { message: 'La imagen en base64 es demasiado grande' })
  image!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  mimeType?: string;
}
