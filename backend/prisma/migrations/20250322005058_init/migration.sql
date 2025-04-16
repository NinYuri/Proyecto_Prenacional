-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "cancha" (
    "id_cancha" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("id_cancha")
);

-- CreateTable
CREATE TABLE "equipo" (
    "id_equipo" SERIAL NOT NULL,
    "name" TEXT,
    "ciudad" TEXT NOT NULL,
    "diciplina" TEXT NOT NULL,
    "img" TEXT,

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("id_equipo")
);

-- CreateTable
CREATE TABLE "fase_torneo" (
    "id_fase_torneo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "fase_torneo_pkey" PRIMARY KEY ("id_fase_torneo")
);

-- CreateTable
CREATE TABLE "clasificacion" (
    "id_clasificacion" SERIAL NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "puntos_totales" INTEGER NOT NULL,
    "partidos_jugados" INTEGER NOT NULL,
    "partidos_ganados" INTEGER NOT NULL,
    "partidos_perdidos" INTEGER NOT NULL,
    "diferencia_puntos" INTEGER NOT NULL,

    CONSTRAINT "clasificacion_pkey" PRIMARY KEY ("id_clasificacion")
);

-- CreateTable
CREATE TABLE "jugador" (
    "id_jugador" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "posicion" TEXT NOT NULL,
    "id_equipo" INTEGER NOT NULL,

    CONSTRAINT "jugador_pkey" PRIMARY KEY ("id_jugador")
);

-- CreateTable
CREATE TABLE "partido" (
    "id_partido" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "equipo_local_id" INTEGER NOT NULL,
    "equipo_visitante_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,
    "fase_torneo_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "puntos_local" INTEGER NOT NULL,
    "puntos_visitante" INTEGER NOT NULL,

    CONSTRAINT "partido_pkey" PRIMARY KEY ("id_partido")
);

-- CreateTable
CREATE TABLE "estadistica_basquet" (
    "id_estadistica_basquet" SERIAL NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "id_jugador" INTEGER NOT NULL,
    "puntos" INTEGER NOT NULL,
    "asistencias" INTEGER NOT NULL,
    "rebotes" INTEGER NOT NULL,
    "robos" INTEGER NOT NULL,
    "tapones" INTEGER NOT NULL,
    "perdidas" INTEGER NOT NULL,
    "faltas" INTEGER,
    "minutos_jugados" INTEGER,

    CONSTRAINT "estadistica_basquet_pkey" PRIMARY KEY ("id_estadistica_basquet")
);

-- CreateTable
CREATE TABLE "estadistica_futbol" (
    "id_estadistica_futbol" SERIAL NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "id_jugador" INTEGER NOT NULL,
    "goles" INTEGER NOT NULL,
    "asistencias" INTEGER NOT NULL,
    "tarjetas_amarillas" INTEGER NOT NULL,
    "tarjetas_rojas" INTEGER NOT NULL,
    "faltas" INTEGER,
    "atajadas" INTEGER,
    "pases_completos" INTEGER,
    "recuperaciones" INTEGER,
    "minutos_jugados" INTEGER,

    CONSTRAINT "estadistica_futbol_pkey" PRIMARY KEY ("id_estadistica_futbol")
);

-- CreateTable
CREATE TABLE "estadistica_voley" (
    "id_estadistica_voley" SERIAL NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "id_jugador" INTEGER NOT NULL,
    "saques" INTEGER NOT NULL,
    "bloqueos" INTEGER NOT NULL,
    "puntos" INTEGER NOT NULL,
    "recepciones" INTEGER NOT NULL,
    "defensas" INTEGER NOT NULL,
    "faltas" INTEGER,
    "errores" INTEGER,

    CONSTRAINT "estadistica_voley_pkey" PRIMARY KEY ("id_estadistica_voley")
);

-- AddForeignKey
ALTER TABLE "clasificacion" ADD CONSTRAINT "clasificacion_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jugador" ADD CONSTRAINT "jugador_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("id_cancha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_equipo_local_id_fkey" FOREIGN KEY ("equipo_local_id") REFERENCES "equipo"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_equipo_visitante_id_fkey" FOREIGN KEY ("equipo_visitante_id") REFERENCES "equipo"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_fase_torneo_id_fkey" FOREIGN KEY ("fase_torneo_id") REFERENCES "fase_torneo"("id_fase_torneo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_basquet" ADD CONSTRAINT "estadistica_basquet_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "partido"("id_partido") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_basquet" ADD CONSTRAINT "estadistica_basquet_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "jugador"("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_futbol" ADD CONSTRAINT "estadistica_futbol_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "partido"("id_partido") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_futbol" ADD CONSTRAINT "estadistica_futbol_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "jugador"("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_voley" ADD CONSTRAINT "estadistica_voley_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "partido"("id_partido") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadistica_voley" ADD CONSTRAINT "estadistica_voley_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "jugador"("id_jugador") ON DELETE CASCADE ON UPDATE CASCADE;
