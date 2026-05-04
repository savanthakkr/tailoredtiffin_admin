export async function deleteMeal({ meals_id, token }) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/delete_meal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      inputdata: {
        meals_id,
      },
    }),
  });

  return res.json();
}
