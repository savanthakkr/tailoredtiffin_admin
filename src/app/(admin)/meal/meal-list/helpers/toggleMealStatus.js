export async function toggleMealStatus({ meals_id, is_active, token }) {
    
  const res = await fetch("http://localhost:3002/admin/toggle_meal_status", {
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
