ALTER TABLE "public"."reading_plans"
  ADD COLUMN "reflection_questions" text[] NOT NULL DEFAULT '{}';
