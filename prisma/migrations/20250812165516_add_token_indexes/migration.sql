-- CreateIndex
CREATE INDEX "passwordResetToken_userId_idx" ON "public"."passwordResetToken"("userId");

-- CreateIndex
CREATE INDEX "passwordResetToken_expiresAt_idx" ON "public"."passwordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "verificationToken_userId_idx" ON "public"."verificationToken"("userId");

-- CreateIndex
CREATE INDEX "verificationToken_expiresAt_idx" ON "public"."verificationToken"("expiresAt");
