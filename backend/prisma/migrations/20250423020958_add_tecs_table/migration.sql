/*
  Warnings:

  - You are about to drop the column `ciudad` on the `equipos` table. All the data in the column will be lost.
  - You are about to drop the column `calificacion` on the `puntosdeInteres` table. All the data in the column will be lost.
  - Added the required column `mapa` to the `canchas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `canchas` table without a default value. This is not possible if the table is not empty.
  - Made the column `imagen` on table `canchas` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tecsid` to the `equipos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `jugadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canchaid` to the `puntosdeInteres` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapa` to the `puntosdeInteres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "canchas" ADD COLUMN     "mapa" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "imagen" SET NOT NULL;

-- AlterTable
ALTER TABLE "equipos" DROP COLUMN "ciudad",
ADD COLUMN     "tecsid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "jugadores" ADD COLUMN     "foto" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "puntosdeInteres" DROP COLUMN "calificacion",
ADD COLUMN     "canchaid" INTEGER NOT NULL,
ADD COLUMN     "mapa" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tecs" (
    "id_tecs" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,

    CONSTRAINT "tecs_pkey" PRIMARY KEY ("id_tecs")
);

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_tecsid_fkey" FOREIGN KEY ("tecsid") REFERENCES "tecs"("id_tecs") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntosdeInteres" ADD CONSTRAINT "puntosdeInteres_canchaid_fkey" FOREIGN KEY ("canchaid") REFERENCES "canchas"("id_cancha") ON DELETE CASCADE ON UPDATE CASCADE;
