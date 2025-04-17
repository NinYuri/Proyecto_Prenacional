/*
  Warnings:

  - Added the required column `grupoid` to the `equipos` table without a default value. This is not possible if the table is not empty.

*/
-- 1. Añadir columna como NULLABLE temporalmente
ALTER TABLE "equipos" ADD COLUMN "grupoid" INTEGER;

-- 2. Actualizar registros existentes (elige un grupo válido)
UPDATE "equipos" SET "grupoid" = (SELECT "id_grupo" FROM "grupos" LIMIT 1);

-- 3. Hacer la columna NOT NULL
ALTER TABLE "equipos" ALTER COLUMN "grupoid" SET NOT NULL;

-- 4. Añadir la foreign key
ALTER TABLE "equipos" 
ADD CONSTRAINT "equipos_grupoid_fkey" 
FOREIGN KEY ("grupoid") 
REFERENCES "grupos"("id_grupo");