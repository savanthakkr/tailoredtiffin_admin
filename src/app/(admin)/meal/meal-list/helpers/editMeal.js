export async function editMeal(payload) {
  const { token, ...inputdata } = payload;

  const res = await fetch("https://api.tailoredtiffin.com/admin/edit_meal", {
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
