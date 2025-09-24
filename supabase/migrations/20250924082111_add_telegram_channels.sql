create sequence "public"."telegram_channels_id_seq";


  create table "public"."telegram_channels" (
    "id" integer not null default nextval('telegram_channels_id_seq'::regclass),
    "channel_id" text not null,
    "channel_name" character varying(255),
    "is_active" boolean default true,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
      );


alter table "public"."message_logs" add column "telegram_channel_id" integer;

alter sequence "public"."telegram_channels_id_seq" owned by "public"."telegram_channels"."id";

CREATE INDEX idx_message_logs_telegram_channel_id ON public.message_logs USING btree (telegram_channel_id);

CREATE INDEX idx_telegram_channels_active ON public.telegram_channels USING btree (is_active);

CREATE UNIQUE INDEX telegram_channels_channel_id_key ON public.telegram_channels USING btree (channel_id);

CREATE UNIQUE INDEX telegram_channels_pkey ON public.telegram_channels USING btree (id);

alter table "public"."telegram_channels" add constraint "telegram_channels_pkey" PRIMARY KEY using index "telegram_channels_pkey";

alter table "public"."message_logs" add constraint "message_logs_telegram_channel_id_fkey" FOREIGN KEY (telegram_channel_id) REFERENCES telegram_channels(id) not valid;

alter table "public"."message_logs" validate constraint "message_logs_telegram_channel_id_fkey";

alter table "public"."telegram_channels" add constraint "telegram_channels_channel_id_key" UNIQUE using index "telegram_channels_channel_id_key";

grant delete on table "public"."telegram_channels" to "anon";

grant insert on table "public"."telegram_channels" to "anon";

grant references on table "public"."telegram_channels" to "anon";

grant select on table "public"."telegram_channels" to "anon";

grant trigger on table "public"."telegram_channels" to "anon";

grant truncate on table "public"."telegram_channels" to "anon";

grant update on table "public"."telegram_channels" to "anon";

grant delete on table "public"."telegram_channels" to "authenticated";

grant insert on table "public"."telegram_channels" to "authenticated";

grant references on table "public"."telegram_channels" to "authenticated";

grant select on table "public"."telegram_channels" to "authenticated";

grant trigger on table "public"."telegram_channels" to "authenticated";

grant truncate on table "public"."telegram_channels" to "authenticated";

grant update on table "public"."telegram_channels" to "authenticated";

grant delete on table "public"."telegram_channels" to "service_role";

grant insert on table "public"."telegram_channels" to "service_role";

grant references on table "public"."telegram_channels" to "service_role";

grant select on table "public"."telegram_channels" to "service_role";

grant trigger on table "public"."telegram_channels" to "service_role";

grant truncate on table "public"."telegram_channels" to "service_role";

grant update on table "public"."telegram_channels" to "service_role";


