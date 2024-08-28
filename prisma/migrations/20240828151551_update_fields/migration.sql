/*
  Warnings:

  - You are about to drop the column `fieldId` on the `FieldResponse` table. All the data in the column will be lost.
  - Added the required column `formFieldId` to the `FieldResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FieldResponse" DROP CONSTRAINT "FieldResponse_fieldId_fkey";

-- AlterTable
ALTER TABLE "FieldResponse" DROP COLUMN "fieldId",
ADD COLUMN     "formFieldId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FieldResponse" ADD CONSTRAINT "FieldResponse_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
