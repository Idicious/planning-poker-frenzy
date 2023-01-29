-- rooms table
CREATE TABLE rooms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    created_at timestamp with time zone DEFAULT now(),
    name character varying NOT NULL UNIQUE,
    host_id uuid REFERENCES profiles (id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT room_name_unique UNIQUE (name),
    CONSTRAINT room_name_length CHECK (length(name) > 3)
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow rooms read for authenticated users" ON rooms AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY "Allow rooms delete for host" ON rooms AS permissive
    FOR DELETE TO authenticated
        USING (auth.uid () = host_id);

CREATE POLICY "Allow rooms insert for authenticated users" ON rooms AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (TRUE);

CREATE POLICY "Allow rooms update for host" ON rooms AS permissive
    FOR UPDATE TO authenticated
        WITH CHECK (auth.uid () = host_id);

-- Return the host_id of a room
CREATE FUNCTION get_host_id (room_id uuid)
    RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    host_id uuid;
BEGIN
    SELECT
        host_id INTO host_id
    FROM
        rooms
    WHERE
        id = room_id;
    RETURN host_id;
END;
$$;

-- polls table
CREATE TABLE polls (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
    room_id uuid REFERENCES rooms (id) ON DELETE CASCADE NOT NULL,
    description text DEFAULT ''::text,
    votes_visible boolean NOT NULL DEFAULT TRUE
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow polls read for authenticated users" ON polls AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY "Allow polls insert for authenticated users" ON polls AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (TRUE);

CREATE POLICY "Allow polls delete for user that created it" ON polls AS permissive
    FOR DELETE TO authenticated
        USING (auth.uid () = created_by);

CREATE POLICY "Allow polls delete for room host" ON polls AS permissive
    FOR DELETE TO authenticated
        USING (auth.uid () = get_host_id (room_id));

CREATE POLICY "Allow polls update for user that created it" ON polls AS permissive
    FOR UPDATE TO authenticated
        WITH CHECK (auth.uid () = created_by);

CREATE POLICY "Allow polls update for room host" ON polls AS permissive
    FOR UPDATE TO authenticated
        WITH CHECK (auth.uid () = get_host_id (room_id));

-- votes table
CREATE TABLE votes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    created_at timestamp with time zone DEFAULT now(),
    poll_id uuid REFERENCES polls (id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles (id) ON DELETE CASCADE NOT NULL,
    vote character varying
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow votes read for authenticated users" ON votes AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY "Allow votes delete for user" ON votes AS permissive
    FOR DELETE TO authenticated
        USING (auth.uid () = user_id);

CREATE POLICY "Allow votes insert for authenticated users" ON votes AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (TRUE);

CREATE POLICY "Allow votes update for user" ON votes AS permissive
    FOR UPDATE TO authenticated
        WITH CHECK (auth.uid () = user_id);

