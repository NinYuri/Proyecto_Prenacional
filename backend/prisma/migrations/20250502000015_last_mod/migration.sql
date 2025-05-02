/*
  Warnings:

  - You are about to drop the column `equipoLocalid` on the `partidos` table. All the data in the column will be lost.
  - You are about to drop the column `equipoVisitanteid` on the `partidos` table. All the data in the column will be lost.
  - You are about to drop the column `faseTorneoid` on the `partidos` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `partidos` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `partidos` table. All the data in the column will be lost.
  - You are about to drop the column `clasificadoid` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `equipo1id` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `equipo2id` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `faseTorneoid` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacionEquipo1` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacionEquipo2` on the `rolDeJuegos` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinaid` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `grupoid` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `rollid` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `fasesTorneo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fase` to the `partidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `papeleta` to the `partidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolid` to the `partidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipoLocalid` to the `rolDeJuegos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipoVisitid` to the `rolDeJuegos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora` to the `rolDeJuegos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasena` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "partidos" DROP CONSTRAINT "partidos_equipoLocalid_fkey";

-- DropForeignKey
ALTER TABLE "partidos" DROP CONSTRAINT "partidos_equipoVisitanteid_fkey";

-- DropForeignKey
ALTER TABLE "partidos" DROP CONSTRAINT "partidos_faseTorneoid_fkey";

-- DropForeignKey
ALTER TABLE "rolDeJuegos" DROP CONSTRAINT "rolDeJuegos_clasificadoid_fkey";

-- DropForeignKey
ALTER TABLE "rolDeJuegos" DROP CONSTRAINT "rolDeJuegos_equipo1id_fkey";

-- DropForeignKey
ALTER TABLE "rolDeJuegos" DROP CONSTRAINT "rolDeJuegos_equipo2id_fkey";

-- DropForeignKey
ALTER TABLE "rolDeJuegos" DROP CONSTRAINT "rolDeJuegos_faseTorneoid_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_disciplinaid_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_grupoid_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_rollid_fkey";

-- AlterTable
ALTER TABLE "partidos" DROP COLUMN "equipoLocalid",
DROP COLUMN "equipoVisitanteid",
DROP COLUMN "faseTorneoid",
DROP COLUMN "fecha",
DROP COLUMN "hora",
ADD COLUMN     "fase" TEXT NOT NULL,
ADD COLUMN     "papeleta" TEXT NOT NULL,
ADD COLUMN     "rolid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rolDeJuegos" DROP COLUMN "clasificadoid",
DROP COLUMN "equipo1id",
DROP COLUMN "equipo2id",
DROP COLUMN "estado",
DROP COLUMN "faseTorneoid",
DROP COLUMN "puntuacionEquipo1",
DROP COLUMN "puntuacionEquipo2",
ADD COLUMN     "equipoLocalid" INTEGER NOT NULL,
ADD COLUMN     "equipoVisitid" INTEGER NOT NULL,
ADD COLUMN     "hora" TEXT NOT NULL,
ALTER COLUMN "fecha" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "disciplinaid",
DROP COLUMN "grupoid",
DROP COLUMN "rollid",
ADD COLUMN     "contrasena" TEXT NOT NULL;

-- DropTable
DROP TABLE "fasesTorneo";

-- DropTable
DROP TABLE "roles";

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_equipoLocalid_fkey" FOREIGN KEY ("equipoLocalid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolDeJuegos" ADD CONSTRAINT "rolDeJuegos_equipoVisitid_fkey" FOREIGN KEY ("equipoVisitid") REFERENCES "equipos"("id_equipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_rolid_fkey" FOREIGN KEY ("rolid") REFERENCES "rolDeJuegos"("id_RolDeJuegos") ON DELETE CASCADE ON UPDATE CASCADE;
