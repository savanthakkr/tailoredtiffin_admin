export async function getOtherItemById(other_item_id, token) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/get_other_item", {
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (data.status === "success") {
    return data.data.find(b => b.other_item_id == other_item_id);
  }

  return null;
}
