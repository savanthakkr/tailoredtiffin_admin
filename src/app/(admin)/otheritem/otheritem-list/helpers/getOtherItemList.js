import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function getOtherItemList(token) {
  if (!token) return [];

  const res = await fetch("http://localhost:3002/admin/get_other_item", {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (data.status === "success") {
    return data.data;
  }

  return [];
}

