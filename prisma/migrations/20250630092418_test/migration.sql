/*
  Warnings:

  - Made the column `TermsAgrement` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "TermsAgrement" SET NOT NULL,
ALTER COLUMN "TermsAgrement" SET DATA TYPE INTEGER;
