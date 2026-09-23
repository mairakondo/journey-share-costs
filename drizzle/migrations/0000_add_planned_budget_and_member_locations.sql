ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS planned_budget NUMERIC;

CREATE TABLE IF NOT EXISTS public.member_locations (
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  accuracy_m DOUBLE PRECISION,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (trip_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_locations TO authenticated;
GRANT ALL ON public.member_locations TO service_role;

ALTER TABLE public.member_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS member_locations_select_members ON public.member_locations;
CREATE POLICY member_locations_select_members ON public.member_locations
  FOR SELECT TO authenticated
  USING (public.is_trip_member(trip_id));

DROP POLICY IF EXISTS member_locations_write_self ON public.member_locations;
CREATE POLICY member_locations_write_self ON public.member_locations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_trip_member(trip_id));

DROP POLICY IF EXISTS member_locations_update_self ON public.member_locations;
CREATE POLICY member_locations_update_self ON public.member_locations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND public.is_trip_member(trip_id));

DROP POLICY IF EXISTS member_locations_delete_self ON public.member_locations;
CREATE POLICY member_locations_delete_self ON public.member_locations
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE public.stops ADD COLUMN IF NOT EXISTS tag_color TEXT NOT NULL DEFAULT '';