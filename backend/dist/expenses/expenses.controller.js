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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const expense_dto_1 = require("./dto/expense.dto");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    async update(user, id, updateExpenseDto) {
        const expense = await this.expensesService.findById(id);
        if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para actualizar este gasto');
        }
        const updateData = {};
        if (updateExpenseDto.fecha)
            updateData.fecha = new Date(updateExpenseDto.fecha);
        if (updateExpenseDto.comercio)
            updateData.comercio = updateExpenseDto.comercio;
        if (updateExpenseDto.monto)
            updateData.monto = updateExpenseDto.monto;
        if (updateExpenseDto.categoria)
            updateData.categoria = updateExpenseDto.categoria;
        if (updateExpenseDto.descripcion)
            updateData.descripcion = updateExpenseDto.descripcion;
        if (updateExpenseDto.imagen)
            updateData.imagen = updateExpenseDto.imagen;
        return this.expensesService.update(id, updateData);
    }
    async remove(user, id) {
        const expense = await this.expensesService.findById(id);
        if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar este gasto');
        }
        await this.expensesService.remove(id);
        return { message: 'Gasto eliminado correctamente' };
    }
    async getAllExpenses(page = 1) {
        return this.expensesService.findAll(page);
    }
    async getMyExpenses(user, page = 1, userId) {
        if (user.rol !== 'asesor' && user.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a estos gastos');
        }
        return this.expensesService.findByUser(userId, page);
    }
    async create(user, createExpenseDto) {
        if (user.rol !== 'asesor' && user.userId !== createExpenseDto.userId) {
            throw new common_1.ForbiddenException('No tienes permiso para crear gastos para otro usuario');
        }
        return this.expensesService.create({
            comercio: createExpenseDto.comercio,
            fecha: new Date(createExpenseDto.fecha),
            monto: createExpenseDto.monto,
            categoria: createExpenseDto.categoria,
            descripcion: createExpenseDto.descripcion,
            user: { id: createExpenseDto.userId }
        });
    }
    async getReportes(user, userId) {
        if (user.rol !== 'asesor' && user.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a estos reportes');
        }
        const [categorias, meses, comercios] = await Promise.all([
            this.expensesService.getReportesCategorias(userId),
            this.expensesService.getReportesMeses(userId),
            this.expensesService.getReportesComercios(userId),
        ]);
        return { categorias, meses, comercios };
    }
    async getReportesCategorias(user, userId) {
        if (user.rol !== 'asesor' && user.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a estos reportes');
        }
        return this.expensesService.getReportesCategorias(userId);
    }
    async getReportesMeses(user, userId) {
        if (user.rol !== 'asesor' && user.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a estos reportes');
        }
        return this.expensesService.getReportesMeses(userId);
    }
    async getReportesComercios(user, userId) {
        if (user.rol !== 'asesor' && user.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a estos reportes');
        }
        return this.expensesService.getReportesComercios(userId);
    }
    async getById(id) {
        return this.expensesService.findById(id);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('asesor'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getAllExpenses", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getMyExpenses", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('reportes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getReportes", null);
__decorate([
    (0, common_1.Get)('reportes/categorias'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getReportesCategorias", null);
__decorate([
    (0, common_1.Get)('reportes/meses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getReportesMeses", null);
__decorate([
    (0, common_1.Get)('reportes/comercios'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getReportesComercios", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getById", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.Controller)('expenses'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map