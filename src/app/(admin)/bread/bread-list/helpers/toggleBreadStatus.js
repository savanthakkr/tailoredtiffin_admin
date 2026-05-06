export async function toggleBreadStatus({ bread_id, is_active, token }) {
    
  const res = await fetch("https://api.tailoredtiffin.com/admin/toggle_bread_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        bread_id,
        is_active,
      },
    }),
  });

  return res.json();
}
