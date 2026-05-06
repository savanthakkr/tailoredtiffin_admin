export async function editMeal(payload) {
  const { token, ...inputdata } = payload;

  const res = await fetch("http://localhost:3002/admin/edit_meal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      inputdata,
    }),
  });

  return res.json();
}
