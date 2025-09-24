create sequence "public"."encouragements_id_seq";

create sequence "public"."message_logs_id_seq";

create sequence "public"."reading_plans_id_seq";

create table "public"."encouragements" (
    "id" integer not null default nextval('encouragements_id_seq'::regclass),
    "message" text not null,
    "category" character varying(50),
    "is_active" boolean default true,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


create table "public"."message_logs" (
    "id" integer not null default nextval('message_logs_id_seq'::regclass),
    "sent_at" timestamp with time zone default timezone('utc'::text, now()),
    "reading_plan_id" integer,
    "encouragement_id" integer,
    "message_content" text,
    "status" character varying(20) default 'sent'::character varying,
    "error_message" text
);


create table "public"."reading_plans" (
    "id" integer not null default nextval('reading_plans_id_seq'::regclass),
    "date" date not null,
    "book" character varying(50) not null,
    "chapter" character varying(20) not null,
    "passages" text[] not null default '{}'::text[],
    "esv_link" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


alter sequence "public"."encouragements_id_seq" owned by "public"."encouragements"."id";

alter sequence "public"."message_logs_id_seq" owned by "public"."message_logs"."id";

alter sequence "public"."reading_plans_id_seq" owned by "public"."reading_plans"."id";

CREATE UNIQUE INDEX encouragements_pkey ON public.encouragements USING btree (id);

CREATE INDEX idx_encouragements_active ON public.encouragements USING btree (is_active);

CREATE INDEX idx_message_logs_sent_at ON public.message_logs USING btree (sent_at);

CREATE INDEX idx_reading_plans_date ON public.reading_plans USING btree (date);

CREATE UNIQUE INDEX message_logs_pkey ON public.message_logs USING btree (id);

CREATE UNIQUE INDEX reading_plans_date_key ON public.reading_plans USING btree (date);

CREATE UNIQUE INDEX reading_plans_pkey ON public.reading_plans USING btree (id);

alter table "public"."encouragements" add constraint "encouragements_pkey" PRIMARY KEY using index "encouragements_pkey";

alter table "public"."message_logs" add constraint "message_logs_pkey" PRIMARY KEY using index "message_logs_pkey";

alter table "public"."reading_plans" add constraint "reading_plans_pkey" PRIMARY KEY using index "reading_plans_pkey";

alter table "public"."message_logs" add constraint "message_logs_encouragement_id_fkey" FOREIGN KEY (encouragement_id) REFERENCES encouragements(id) not valid;

alter table "public"."message_logs" validate constraint "message_logs_encouragement_id_fkey";

alter table "public"."message_logs" add constraint "message_logs_reading_plan_id_fkey" FOREIGN KEY (reading_plan_id) REFERENCES reading_plans(id) not valid;

alter table "public"."message_logs" validate constraint "message_logs_reading_plan_id_fkey";

alter table "public"."reading_plans" add constraint "reading_plans_date_key" UNIQUE using index "reading_plans_date_key";

grant delete on table "public"."encouragements" to "anon";

grant insert on table "public"."encouragements" to "anon";

grant references on table "public"."encouragements" to "anon";

grant select on table "public"."encouragements" to "anon";

grant trigger on table "public"."encouragements" to "anon";

grant truncate on table "public"."encouragements" to "anon";

grant update on table "public"."encouragements" to "anon";

grant delete on table "public"."encouragements" to "authenticated";

grant insert on table "public"."encouragements" to "authenticated";

grant references on table "public"."encouragements" to "authenticated";

grant select on table "public"."encouragements" to "authenticated";

grant trigger on table "public"."encouragements" to "authenticated";

grant truncate on table "public"."encouragements" to "authenticated";

grant update on table "public"."encouragements" to "authenticated";

grant delete on table "public"."encouragements" to "service_role";

grant insert on table "public"."encouragements" to "service_role";

grant references on table "public"."encouragements" to "service_role";

grant select on table "public"."encouragements" to "service_role";

grant trigger on table "public"."encouragements" to "service_role";

grant truncate on table "public"."encouragements" to "service_role";

grant update on table "public"."encouragements" to "service_role";

grant delete on table "public"."message_logs" to "anon";

grant insert on table "public"."message_logs" to "anon";

grant references on table "public"."message_logs" to "anon";

grant select on table "public"."message_logs" to "anon";

grant trigger on table "public"."message_logs" to "anon";

grant truncate on table "public"."message_logs" to "anon";

grant update on table "public"."message_logs" to "anon";

grant delete on table "public"."message_logs" to "authenticated";

grant insert on table "public"."message_logs" to "authenticated";

grant references on table "public"."message_logs" to "authenticated";

grant select on table "public"."message_logs" to "authenticated";

grant trigger on table "public"."message_logs" to "authenticated";

grant truncate on table "public"."message_logs" to "authenticated";

grant update on table "public"."message_logs" to "authenticated";

grant delete on table "public"."message_logs" to "service_role";

grant insert on table "public"."message_logs" to "service_role";

grant references on table "public"."message_logs" to "service_role";

grant select on table "public"."message_logs" to "service_role";

grant trigger on table "public"."message_logs" to "service_role";

grant truncate on table "public"."message_logs" to "service_role";

grant update on table "public"."message_logs" to "service_role";

grant delete on table "public"."reading_plans" to "anon";

grant insert on table "public"."reading_plans" to "anon";

grant references on table "public"."reading_plans" to "anon";

grant select on table "public"."reading_plans" to "anon";

grant trigger on table "public"."reading_plans" to "anon";

grant truncate on table "public"."reading_plans" to "anon";

grant update on table "public"."reading_plans" to "anon";

grant delete on table "public"."reading_plans" to "authenticated";

grant insert on table "public"."reading_plans" to "authenticated";

grant references on table "public"."reading_plans" to "authenticated";

grant select on table "public"."reading_plans" to "authenticated";

grant trigger on table "public"."reading_plans" to "authenticated";

grant truncate on table "public"."reading_plans" to "authenticated";

grant update on table "public"."reading_plans" to "authenticated";

grant delete on table "public"."reading_plans" to "service_role";

grant insert on table "public"."reading_plans" to "service_role";

grant references on table "public"."reading_plans" to "service_role";

grant select on table "public"."reading_plans" to "service_role";

grant trigger on table "public"."reading_plans" to "service_role";

grant truncate on table "public"."reading_plans" to "service_role";

grant update on table "public"."reading_plans" to "service_role";


