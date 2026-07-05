"use client";
import { useState } from "react";

interface LocationState {
  lat:     number | null;
  lng:     number | null;
  error:   string | null;
  loading: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null, lng: null, error: null, loading: false,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "مرورگر شما از GPS پشتیبانی نمی‌کند" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => setState({
        lat:     pos.coords.latitude,
        lng:     pos.coords.longitude,
        error:   null,
        loading: false,
      }),
      () => setState((s) => ({
        ...s,
        error:   "دسترسی به موقعیت مکانی رد شد",
        loading: false,
      }))
    );
  };

  return { ...state, getLocation };
}
