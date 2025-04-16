-- CreateTable
CREATE TABLE "PuntosdeInteres" (
    "id_PuntosdeInteres" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Ubicacion" TEXT NOT NULL,
    "Telefono" TEXT NOT NULL,
    "Imagen" TEXT NOT NULL,
    "HorarioAtencion" TEXT NOT NULL,
    "Calificacion" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PuntosdeInteres_pkey" PRIMARY KEY ("id_PuntosdeInteres")
);
