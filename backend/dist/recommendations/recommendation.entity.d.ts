import { User } from '../users/user.entity';
export declare class Recommendation {
    id: number;
    mensaje: string;
    asesor: User;
    usuario: User;
    fecha: Date;
}
