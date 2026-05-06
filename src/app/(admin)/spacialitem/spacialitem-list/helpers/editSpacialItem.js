export async function editSpacialItem({ special_item_id, name, price, token }) {
  const res = await fetch("http://localhost:3002/admin/edit_Special_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        special_item_id,
        name,
        price,
      },
    }),
  });

  return res.json();
}
