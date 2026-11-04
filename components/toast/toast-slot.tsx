import { ToastRegion } from "@/components/toast/toast-region";
import { readToast } from "@/lib/toast";

export async function ToastSlot() {
  return <ToastRegion flash={await readToast()} />;
}
