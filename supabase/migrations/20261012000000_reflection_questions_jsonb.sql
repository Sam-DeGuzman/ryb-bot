ALTER TABLE "public"."reading_plans"
  ALTER COLUMN "reflection_questions" DROP DEFAULT,
  ALTER COLUMN "reflection_questions" TYPE jsonb USING to_jsonb("reflection_questions"),
  ALTER COLUMN "reflection_questions" SET DEFAULT '[]'::jsonb;
