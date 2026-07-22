import { IsString, IsNumber, IsDateString, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(100, { message: 'El comercio no puede exceder 100 caracteres' })
  comercio!: string;

  @IsDateString({}, { message: 'La fecha debe ser válida (formato: YYYY-MM-DD)' })
  fecha!: string;

  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto!: number;

  @IsString()
  @MaxLength(50, { message: 'La categoría no puede exceder 50 caracteres' })
  categoria!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' }) // Si tiene mas de 500 caracteres, se corta y se guarda solo los primeros 500
  descripcion?: string;

  @IsNumber()
  userId!: number;
}

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  comercio?: string;

  @IsOptional()
  @IsDateString({})
  fecha?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  monto?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
