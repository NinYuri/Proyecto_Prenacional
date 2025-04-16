/*
  Warnings:

  - You are about to drop the column `diferencia_puntos` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the column `id_equipo` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the column `partidos_ganados` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the column `partidos_jugados` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the column `partidos_perdidos` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the column `puntos_totales` on the `clasificacion` table. All the data in the column will be lost.
  - You are about to drop the `PuntosdeInteres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estadistica_basquet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estadistica_futbol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estadistica_voley` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fase_torneo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jugador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `diferenciaPuntos` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipoid` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partidosGanados` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partidosJugados` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partidosPerdidos` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntosAFavor` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntosEnContra` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntosPorPartido` to the `clasificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntosTotales` to the `clasificacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clasificacion" DROP CONSTRAINT "clasificacion_id_equipo_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_basquet" DROP CONSTRAINT "estadistica_basquet_id_jugador_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_basquet" DROP CONSTRAINT "estadistica_basquet_id_partido_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_futbol" DROP CONSTRAINT "estadistica_futbol_id_jugador_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_futbol" DROP CONSTRAINT "estadistica_futbol_id_partido_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_voley" DROP CONSTRAINT "estadistica_voley_id_jugador_fkey";

-- DropForeignKey
ALTER TABLE "estadistica_voley" DROP CONSTRAINT "estadistica_voley_id_partido_fkey";

-- DropForeignKey
ALTER TABLE "jugador" DROP CONSTRAINT "jugador_id_equipo_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_cancha_id_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_equipo_local_id_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_equipo_visitante_id_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_fase_torneo_id_fkey";

-- AlterTable
ALTER TABLE "clasificacion" DROP COLUMN "diferencia_puntos",
DROP COLUMN "id_equipo",
DROP COLUMN "partidos_ganados",
DROP COLUMN "partidos_jugados",
DROP COLUMN "partidos_perdidos",
DROP COLUMN "puntos_totales",
ADD COLUMN     "diferenciaPuntos" INTEGER NOT NULL,
ADD COLUMN     "equipoid" INTEGER NOT NULL,
ADD COLUMN     "partidosGanados" INTEGER NOT NULL,
ADD COLUMN     "partidosJugados" INTEGER NOT NULL,
ADD COLUMN     "partidosPerdidos" INTEGER NOT NULL,
ADD COLUMN     "puntosAFavor" INTEGER NOT NULL,
ADD COLUMN     "puntosEnContra" INTEGER NOT NULL,
ADD COLUMN     "puntosPorPartido" INTEGER NOT NULL,
ADD COLUMN     "puntosTotales" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PuntosdeInteres";

-- DropTable
DROP TABLE "cancha";

-- DropTable
DROP TABLE "equipo";

-- DropTable
DROP TABLE "estadistica_basquet";

-- DropTable
DROP TABLE "estadistica_futbol";

-- DropTable
DROP TABLE "estadistica_voley";

-- DropTable
DROP TABLE "fase_torneo";

-- DropTable
DROP TABLE "jugador";

-- DropTable
DROP TABLE "partido";

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "usuarios" (
    "id_user" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rollid" INTEGER NOT NULL,
    "disciplinaid" INTEGER NOT NULL,
    "grupoid" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "canchas" (
    "id_cancha" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "imagen" TEXT,

    CONSTRAINT "canchas_pkey" PRIMARY KEY ("id_cancha")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id_equipo" SERIAL NOT NULL,
    "nombre" TEXT,
    "ciudad" TEXT NOT NULL,
    "diciplinaid" INTEGER NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id_equipo")
);

-- CreateTable
CREATE TABLE "rolDeJuegos" (
    "id_RolDeJuegos" SERIAL NOT NULL,
    "disciplinaid" INTEGER NOT NULL,
    "equipo1id" INTEGER NOT NULL,
    "equipo2id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "puntuacionEquipo1" INTEGER NOT NULL,
    "puntuacionEquipo2" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "clasificadoid" INTEGER NOT NULL,
    "faseTorneoid" INTEGER NOT NULL,

    CONSTRAINT "rolDeJuegos_pkey" PRIMARY KEY ("id_RolDeJuegos")
);

-- CreateTable
CREATE TABLE "fasesTorneo" (
    "id_fase_torneo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fasesTorneo_pkey" PRIMARY KEY ("id_fase_torneo")
);

-- CreateTable
CREATE TABLE "jugadores" (
    "id_jugador" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "posicion" TEXT NOT NULL,
    "equipoid" INTEGER NOT NULL,

    CONSTRAINT "jugadores_pkey" PRIMARY KEY ("id_jugador")
);

-- CreateTable
CREATE TABLE "partidos" (
    "id_partido" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "equipoLocalid" INTEGER NOT NULL,
    "equipoVisitanteid" INTEGER NOT NULL,
    "canchaid" INTEGER NOT NULL,
    "faseTorneoid" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "puntosLocal" INTEGER NOT NULL,
    "puntosVisitante" INTEGER NOT NULL,

    CONSTRAINT "partidos_pkey" PRIMARY KEY ("id_partido")
);

-- CreateTable
CREATE TABLE "puntosdeInteres" (
    "id_PuntosdeInteres" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "horarioAtencion" TEXT NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "puntosdeInteres_pkey" PRIMARY KEY ("id_PuntosdeInteres")
);

-- CreateTable
CREATE TABLE "diciplinas" (
    "id_diciplinas" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "diciplinas_pkey" PRIMARY KEY ("id_diciplinas")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id_grupo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "disciplinaid" INTEGER NOT NULL,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_disciplinaid_fkey" FOREIGN KEY ("disciplinaid") REFERENCES "diciplinas"("id_diciplinas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_grupoid_fkey" FOREIGN KEY ("grupoid") REFERENCES "grupos"("id_grupo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rollid_fkey" FOREIGN KEY ("rollid") REFERENCES "roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_diciplinaid_fkey" FOREIGN KEY ("diciplinaid") REFERENCES "diciplinas"("id_diciplinas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_equipo1id_fkey" FOREIGN KEY ("equipo1id") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_equipo2id_fkey" FOREIGN KEY ("equipo2id") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_faseTorneoid_fkey" FOREIGN KEY ("faseTorneoid") REFERENCES "fasesTorneo"("id_fase_torneo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_clasificadoid_fkey" FOREIGN KEY ("clasificadoid") REFERENCES "clasificacion"("id_clasificacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_disciplinaid_fkey" FOREIGN KEY ("disciplinaid") REFERENCES "diciplinas"("id_diciplinas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clasificacion" ADD CONSTRAINT "clasificacion_equipoid_fkey" FOREIGN KEY ("equipoid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jugadores" ADD CONSTRAINT "jugadores_equipoid_fkey" FOREIGN KEY ("equipoid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_canchaid_fkey" FOREIGN KEY ("canchaid") REFERENCES "canchas"("id_cancha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_equipoLocalid_fkey" FOREIGN KEY ("equipoLocalid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_equipoVisitanteid_fkey" FOREIGN KEY ("equipoVisitanteid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_faseTorneoid_fkey" FOREIGN KEY ("faseTorneoid") REFERENCES "fasesTorneo"("id_fase_torneo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_disciplinaid_fkey" FOREIGN KEY ("disciplinaid") REFERENCES "diciplinas"("id_diciplinas") ON DELETE CASCADE ON UPDATE CASCADE;
