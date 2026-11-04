"use client";

import { redirect } from "next/navigation";

import { useEffect } from "react";

export default function RedirectError() {
  // If the session resolution fails for any reason, fail closed: send the user
  // to sign-in rather than leaving them stuck on an error page.
  useEffect(() => {
    redirect("/sign-in");
  }, []);

  return null;
}
