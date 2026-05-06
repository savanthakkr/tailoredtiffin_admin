export async function toggleMealStatus({ meals_id, is_active, token }) {
    
  const res = await fetch("https://api.tailoredtiffin.com/admin/toggle_meal_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        meals_id,
        is_active,
      },
    }),
  });

  return res.json();
}
