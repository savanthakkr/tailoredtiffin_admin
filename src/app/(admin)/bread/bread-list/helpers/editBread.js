export async function editBread({ bread_id, name, price, token }) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/edit_bread", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        bread_id,
        name,
        price,
      },
    }),
  });

  return res.json();
}
