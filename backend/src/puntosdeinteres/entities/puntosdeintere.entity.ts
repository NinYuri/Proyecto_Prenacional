import { Decimal } from "@prisma/client/runtime/library";

export class Puntosdeintere {
    
    id_PuntosdeInteres: number;
    nombre: string;
    tipo: string;
    ubicacion: string;
    telefono: string;
    imagen: string;
    horarioAtencion: string;
    calificacion: number; // Cambiado a number para la calificación
}
