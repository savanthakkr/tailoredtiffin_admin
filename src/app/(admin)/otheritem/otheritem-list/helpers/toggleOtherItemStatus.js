export async function toggleOtherItemStatus({ other_item_id, is_active, token }) {

  console.log(other_item_id);
  console.log("adnasdjhasgdhjasd");
    
  const res = await fetch("https://api.tailoredtiffin.com//admin/toggle_other_item_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        other_item_id,
        is_active,
      },
    }),
  });

  return res.json();
}
