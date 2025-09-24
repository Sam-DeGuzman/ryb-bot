CREATE SEQUENCE "public"."telegram_channels_id_seq";

CREATE TABLE "public"."telegram_channels" (
    "id" INTEGER NOT NULL DEFAULT NEXTVAL('telegram_channels_id_seq'::regclass),
    "channel_id" TEXT NOT NULL,
    "channel_name" CHARACTER VARYING(255),
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER SEQUENCE "public"."telegram_channels_id_seq" OWNED BY "public"."telegram_channels"."id";

ALTER TABLE "public"."message_logs" ADD COLUMN "telegram_channel_id" INTEGER;

CREATE UNIQUE INDEX telegram_channels_pkey ON public.telegram_channels USING btree (id);

CREATE UNIQUE INDEX telegram_channels_channel_id_key ON public.telegram_channels USING btree (channel_id);

CREATE INDEX idx_telegram_channels_active ON public.telegram_channels USING btree (is_active);

CREATE INDEX idx_message_logs_telegram_channel_id ON public.message_logs USING btree (telegram_channel_id);

ALTER TABLE "public"."telegram_channels" ADD CONSTRAINT "telegram_channels_pkey" PRIMARY KEY USING INDEX "telegram_channels_pkey";

ALTER TABLE "public"."telegram_channels" ADD CONSTRAINT "telegram_channels_channel_id_key" UNIQUE USING INDEX "telegram_channels_channel_id_key";

ALTER TABLE "public"."message_logs" ADD CONSTRAINT "message_logs_telegram_channel_id_fkey" FOREIGN KEY (telegram_channel_id) REFERENCES telegram_channels(id) NOT VALID;

ALTER TABLE "public"."message_logs" VALIDATE CONSTRAINT "message_logs_telegram_channel_id_fkey";