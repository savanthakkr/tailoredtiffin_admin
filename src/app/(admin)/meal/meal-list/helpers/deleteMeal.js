export async function deleteMeal({ meals_id, token }) {
  const res = await fetch("http://localhost:3002/admin/delete_meal", {
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
