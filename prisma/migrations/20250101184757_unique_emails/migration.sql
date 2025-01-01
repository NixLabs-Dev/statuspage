/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Subscribed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscribed_email_key" ON "Subscribed"("email");
