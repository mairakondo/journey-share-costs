CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text,
  start_date date,
  end_date date,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.trip_members (
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (trip_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_members TO authenticated;
GRANT ALL ON public.trip_members TO service_role;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day integer NOT NULL,
  time text NOT NULL,
  title text NOT NULL,
  place text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stops TO authenticated;
GRANT ALL ON public.stops TO service_role;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES public.stops(id) ON DELETE SET NULL,
  day integer NOT NULL,
  time text NOT NULL,
  place text NOT NULL DEFAULT '',
  label text NOT NULL,
  amount numeric NOT NULL,
  payer text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  split jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES public.stops(id) ON DELETE SET NULL,
  day integer NOT NULL,
  time text NOT NULL,
  place text NOT NULL DEFAULT '',
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.trip_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_invites TO authenticated;
GRANT ALL ON public.trip_invites TO service_role;
ALTER TABLE public.trip_invites ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_trip_member(_trip_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_id = _trip_id AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.ensure_profile(_display_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  INSERT INTO public.profiles (id, display_name)
  VALUES (auth.uid(), COALESCE(NULLIF(_display_name, ''), 'Traveler'))
  ON CONFLICT (id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.on_trip_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_trip_created AFTER INSERT ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.on_trip_created();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER stops_touch BEFORE UPDATE ON public.stops
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER expenses_touch BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.get_invite_preview(invite_code text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('tripId', t.id, 'name', t.name, 'destination', t.destination)
  FROM public.trip_invites i
  JOIN public.trips t ON t.id = i.trip_id
  WHERE upper(i.code) = upper(invite_code) AND i.expires_at > now()
  LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.get_invite_preview(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.accept_trip_invite(invite_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _trip_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT trip_id INTO _trip_id FROM public.trip_invites
  WHERE upper(code) = upper(invite_code) AND expires_at > now() LIMIT 1;
  IF _trip_id IS NULL THEN RAISE EXCEPTION 'Invite is invalid or expired'; END IF;
  INSERT INTO public.profiles (id, display_name)
  VALUES (auth.uid(), 'Traveler') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (_trip_id, auth.uid(), 'member') ON CONFLICT DO NOTHING;
  RETURN _trip_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.accept_trip_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_profile(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_trip_member(uuid) TO authenticated;

CREATE POLICY "profiles_select_self_or_shared_trip" ON public.profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.trip_members m
    WHERE m.user_id = profiles.id AND public.is_trip_member(m.trip_id)
  )
);
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "trips_select_members" ON public.trips FOR SELECT TO authenticated
USING (public.is_trip_member(id));
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());
CREATE POLICY "trips_update_members" ON public.trips FOR UPDATE TO authenticated
USING (public.is_trip_member(id)) WITH CHECK (public.is_trip_member(id));
CREATE POLICY "trips_delete_creator" ON public.trips FOR DELETE TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "trip_members_select" ON public.trip_members FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_trip_member(trip_id));
CREATE POLICY "trip_members_insert" ON public.trip_members FOR INSERT TO authenticated
WITH CHECK (public.is_trip_member(trip_id) OR user_id = auth.uid());
CREATE POLICY "trip_members_delete_self" ON public.trip_members FOR DELETE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "stops_all_members" ON public.stops FOR ALL TO authenticated
USING (public.is_trip_member(trip_id)) WITH CHECK (public.is_trip_member(trip_id));
CREATE POLICY "expenses_all_members" ON public.expenses FOR ALL TO authenticated
USING (public.is_trip_member(trip_id)) WITH CHECK (public.is_trip_member(trip_id));
CREATE POLICY "photos_all_members" ON public.photos FOR ALL TO authenticated
USING (public.is_trip_member(trip_id)) WITH CHECK (public.is_trip_member(trip_id));
CREATE POLICY "invites_all_members" ON public.trip_invites FOR ALL TO authenticated
USING (public.is_trip_member(trip_id)) WITH CHECK (public.is_trip_member(trip_id) AND created_by = auth.uid());

CREATE POLICY "trip_photos_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'trip-photos' AND public.is_trip_member(((storage.foldername(name))[1])::uuid));
CREATE POLICY "trip_photos_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'trip-photos' AND public.is_trip_member(((storage.foldername(name))[1])::uuid));
CREATE POLICY "trip_photos_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'trip-photos' AND public.is_trip_member(((storage.foldername(name))[1])::uuid));