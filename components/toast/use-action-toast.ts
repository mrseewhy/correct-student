"use client";

import { useEffect } from "react";
import { showToast } from "@/components/toast/toast-region";

export function useActionToast(state: { message: string; error: boolean }) {
  useEffect(() => {
    if (state.message) showToast(state.error ? "error" : "success", state.message);
  }, [state]);
}
