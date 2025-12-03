ALTER TABLE "public"."telegram_channels"
ADD COLUMN "message_thread_id" integer;

COMMENT ON COLUMN "public"."telegram_channels"."message_thread_id"
IS 'Telegram topic/forum thread ID. NULL sends to main chat or General topic.';
