"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpenseDto = exports.CreateExpenseDto = void 0;
const class_validator_1 = require("class-validator");
class CreateExpenseDto {
    comercio;
    fecha;
    monto;
    categoria;
    descripcion;
    userId;
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'El comercio no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "comercio", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe ser válida (formato: YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'La categoría no puede exceder 50 caracteres' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'La descripción no puede exceder 500 caracteres' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "userId", void 0);
class UpdateExpenseDto {
    comercio;
    fecha;
    monto;
    categoria;
    descripcion;
}
exports.UpdateExpenseDto = UpdateExpenseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "comercio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], UpdateExpenseDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "descripcion", void 0);
//# sourceMappingURL=expense.dto.js.map