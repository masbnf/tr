"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const token = document.cookie.includes("admin_token=");
    setIsAdmin(token);
  }, []);

  return { isAdmin };
}
