create table "public"."polls" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "room_id" uuid,
    "description" text default ''::text,
    "votes_visible" boolean not null default true
);


alter table "public"."polls" enable row level security;

create table "public"."rooms" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" character varying not null,
    "host_id" uuid not null
);


alter table "public"."rooms" enable row level security;

create table "public"."votes" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "poll_id" uuid not null,
    "user_id" uuid not null,
    "vote" character varying
);


alter table "public"."votes" enable row level security;

alter table "public"."profiles" alter column "id" set default uuid_generate_v4();

CREATE UNIQUE INDEX polls_pkey ON public.polls USING btree (id);

CREATE UNIQUE INDEX rooms_name_key ON public.rooms USING btree (name);

CREATE UNIQUE INDEX rooms_pkey ON public.rooms USING btree (id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."polls" add constraint "polls_pkey" PRIMARY KEY using index "polls_pkey";

alter table "public"."rooms" add constraint "rooms_pkey" PRIMARY KEY using index "rooms_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."polls" add constraint "polls_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) not valid;

alter table "public"."polls" validate constraint "polls_room_id_fkey";

alter table "public"."rooms" add constraint "rooms_host_id_fkey" FOREIGN KEY (host_id) REFERENCES profiles(id) not valid;

alter table "public"."rooms" validate constraint "rooms_host_id_fkey";

alter table "public"."rooms" add constraint "rooms_name_key" UNIQUE using index "rooms_name_key";

alter table "public"."votes" add constraint "votes_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES polls(id) not valid;

alter table "public"."votes" validate constraint "votes_poll_id_fkey";

alter table "public"."votes" add constraint "votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."votes" validate constraint "votes_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."rooms"
as permissive
for delete
to public
using ((auth.uid() = host_id));


create policy "Enable insert for authenticated users only"
on "public"."rooms"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."rooms"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on user_id"
on "public"."rooms"
as permissive
for update
to authenticated
using ((auth.uid() = host_id));



