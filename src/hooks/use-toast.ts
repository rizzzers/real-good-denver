"use client";

import { useState, useEffect } from "react";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

let toastCount = 0;
const listeners: ((toasts: ToastItem[]) => void)[] = [];
let memoryToasts: ToastItem[] = [];

function dispatch(toasts: ToastItem[]) {
  memoryToasts = toasts;
  listeners.forEach((l) => l(toasts));
}

export function toast({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  const id = String(toastCount++);
  const newToast: ToastItem = { id, title, description, variant };
  dispatch([...memoryToasts, newToast]);
  setTimeout(() => {
    dispatch(memoryToasts.filter((t) => t.id !== id));
  }, 3000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toast, toasts };
}
