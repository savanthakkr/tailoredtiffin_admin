export async function editOtherItem({ other_item_id, name, price, token }) {
  const res = await fetch("https://api.tailoredtiffin.com//admin/edit_other_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        other_item_id,
        name,
        price,
      },
    }),
  });

  return res.json();
}
