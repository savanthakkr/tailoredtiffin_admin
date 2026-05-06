export async function toggleSideItemStatus({ side_item_id, is_active, token }) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/toggle_side_item_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        side_item_id,
        is_active,
      },
    }),
  });

  return res.json();
}
