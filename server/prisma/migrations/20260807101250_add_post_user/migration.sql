-- Add the column as nullable first so existing rows can be backfilled.
ALTER TABLE "Post" ADD COLUMN "userId" TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Post" WHERE "userId" IS NULL)
    AND NOT EXISTS (SELECT 1 FROM "user")
  THEN
    RAISE EXCEPTION 'Cannot add required Post.userId: existing posts need an existing user to assign ownership.';
  END IF;
END $$;

UPDATE "Post"
SET "userId" = (SELECT "id" FROM "user" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

ALTER TABLE "Post" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
