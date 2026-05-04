export async function toggleSpacialItemStatus({ special_item_id, is_active, token }) {

  console.log(special_item_id);
  console.log("adnasdjhasgdhjasd");
    
  const res = await fetch("https://api.tailoredtiffin.com//admin/toggle_special_item_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        special_item_id,
        is_active,
      },
    }),
  });

  return res.json();
}
