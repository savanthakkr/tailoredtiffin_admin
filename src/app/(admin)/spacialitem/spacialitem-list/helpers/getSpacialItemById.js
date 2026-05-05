export async function getSpacialItemById(special_item_id, token) {
  const res = await fetch("http://localhost:3002/admin/get_spacialitem", {
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (data.status === "success") {
    return data.data.find(b => b.special_item_id == special_item_id);
  }

  return null;
}
