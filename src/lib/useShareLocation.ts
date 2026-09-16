import { useCallback, useEffect, useRef, useState } from "react";

import { shareLocation, stopSharingLocation } from "@/features/locate/locateServerFns";

const UPDATE_INTERVAL_MS = 20_000;

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Location isn't available on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10_000,
      maximumAge: 15_000,
    });
  });
}

export function useShareLocation(tripId: string) {
  const [sharing, setSharing] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushLocation = useCallback(
    async (durationMinutes: number) => {
      const pos = await getPosition();
      const result = await shareLocation({
        data: {
          tripId,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
          durationMinutes,
        },
      });
      setExpiresAt(result.expiresAt);
    },
    [tripId],
  );

  const stop = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSharing(false);
    setExpiresAt(null);
    await stopSharingLocation({ data: { tripId } }).catch(() => {});
  }, [tripId]);

  const start = useCallback(
    async (durationMinutes: number) => {
      setError(null);
      try {
        await pushLocation(durationMinutes);
        setSharing(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          void pushLocation(durationMinutes).catch((err: unknown) => {
            setError(err instanceof Error ? err.message : "Couldn't update your location.");
          });
        }, UPDATE_INTERVAL_MS);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't access your location.");
      }
    },
    [pushLocation],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!expiresAt) return;
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return;
    const timeout = setTimeout(() => void stop(), ms);
    return () => clearTimeout(timeout);
  }, [expiresAt, stop]);

  return { sharing, expiresAt, error, start, stop };
}
