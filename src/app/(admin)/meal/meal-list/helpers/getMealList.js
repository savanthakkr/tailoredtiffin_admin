import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function getMealList(token) {
  if (!token) return [];

  const res = await fetch("http://localhost:3002/admin/get_meals", {
    method: "GET",
    headers: {
      Authorization: token,
    },
    cache: "no-store",
  });

  const data = await res.json();

  console.log("=== getMealList API Response ===");
  console.log("Status:", data.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (data.status === "success") {
    console.log("Meals count:", data.data?.length);
    return data.data;
  }

  return [];
}


