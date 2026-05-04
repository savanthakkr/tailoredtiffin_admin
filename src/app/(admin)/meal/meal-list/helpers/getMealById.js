export async function getMealById(meals_id, token) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/get_meal", {
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (data.status === "success") {
    return data.data.find(b => b.meals_id == meals_id);
  }

  return null;
}
