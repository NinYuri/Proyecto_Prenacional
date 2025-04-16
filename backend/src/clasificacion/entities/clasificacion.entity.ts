export class Clasificacion {
  public id_clasificacion: number;   // Opcional, autoincremental
  public equipoid: number;           // Llave foránea para equipo
  public puntosTotales: number;
  public partidosJugados: number;
  public partidosGanados: number;
  public partidosPerdidos: number;
  public puntosAFavor: number;
  public puntosEnContra: number;
  public puntosPorPartido: number;
  public diferenciaPuntos: number;
}
