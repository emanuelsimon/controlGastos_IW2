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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./expense.entity");
let ExpensesService = class ExpensesService {
    expensesRepository;
    constructor(expensesRepository) {
        this.expensesRepository = expensesRepository;
    }
    async create(expenseData) {
        const expense = this.expensesRepository.create(expenseData);
        return this.expensesRepository.save(expense);
    }
    async findByUser(userId, page = 1, limit = 15) {
        const [data, total] = await this.expensesRepository.findAndCount({
            where: { user: { id: userId } },
            order: { fecha: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
    async findAll(page = 1, limit = 15) {
        const [data, total] = await this.expensesRepository.findAndCount({
            order: { fecha: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['user']
        });
        return { data, total };
    }
    async getReportesCategorias(userId) {
        const expenses = await this.expensesRepository.find({
            where: { user: { id: userId } }
        });
        const agrupado = {};
        expenses.forEach(e => {
            agrupado[e.categoria] = (agrupado[e.categoria] || 0) + Number(e.monto);
        });
        return {
            labels: Object.keys(agrupado),
            datos: Object.values(agrupado)
        };
    }
    async getReportesMeses(userId) {
        const expenses = await this.expensesRepository.find({
            where: { user: { id: userId } },
            order: { fecha: 'ASC' }
        });
        const agrupado = {};
        expenses.forEach(e => {
            const fecha = new Date(e.fecha);
            const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            agrupado[clave] = (agrupado[clave] || 0) + Number(e.monto);
        });
        return {
            labels: Object.keys(agrupado),
            datos: Object.values(agrupado)
        };
    }
    async getReportesComercios(userId) {
        const expenses = await this.expensesRepository.find({
            where: { user: { id: userId } }
        });
        const agrupado = {};
        expenses.forEach(e => {
            agrupado[e.comercio] = (agrupado[e.comercio] || 0) + Number(e.monto);
        });
        const sorted = Object.entries(agrupado)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        return {
            labels: sorted.map(([k]) => k),
            datos: sorted.map(([, v]) => v)
        };
    }
    async update(id, expenseData) {
        await this.expensesRepository.update(id, expenseData);
        return this.expensesRepository.findOne({ where: { id }, relations: ['user'] });
    }
    async findById(id) {
        return this.expensesRepository.findOne({ where: { id }, relations: ['user'] });
    }
    async remove(id) {
        await this.expensesRepository.delete(id);
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map