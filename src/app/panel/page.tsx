import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRolePanelPath, getTokenRole } from "@/lib/auth";

export default async function PersonalPanelPage() {
  const token = cookies().get("admin_token")?.value ?? "";
  const role = await getTokenRole(token);

  if (!role) {
    redirect("/admin/login?next=/panel");
  }

  redirect(getRolePanelPath(role));
}
