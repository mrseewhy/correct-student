import { redirect } from "next/navigation";

export default function StudentHome() {
  redirect("/students/dashboard");
}
