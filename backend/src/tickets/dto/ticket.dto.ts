import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ProcessTicketDto {
  @IsString()
  @MaxLength(5000000, { message: 'La imagen en base64 es demasiado grande' })
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  mimeType?: string;
}
