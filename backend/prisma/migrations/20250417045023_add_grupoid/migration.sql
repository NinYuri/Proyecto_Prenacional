-- DropForeignKey
ALTER TABLE "equipos" DROP CONSTRAINT "equipos_grupoid_fkey";

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_grupoid_fkey" FOREIGN KEY ("grupoid") REFERENCES "grupos"("id_grupo") ON DELETE CASCADE ON UPDATE CASCADE;
