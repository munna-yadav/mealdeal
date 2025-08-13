-- DropForeignKey
ALTER TABLE "public"."passwordResetToken" DROP CONSTRAINT "passwordResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."verificationToken" DROP CONSTRAINT "verificationToken_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."verificationToken" ADD CONSTRAINT "verificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."passwordResetToken" ADD CONSTRAINT "passwordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
