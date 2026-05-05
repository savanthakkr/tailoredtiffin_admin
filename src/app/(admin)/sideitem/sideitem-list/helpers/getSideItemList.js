export async function getSideItemList(token) {
  if (!token) return [];

  const res = await fetch("http://localhost:3002/admin/get_side_items", {
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
