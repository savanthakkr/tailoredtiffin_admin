export async function getBreadById(bread_id, token) {
  const res = await fetch("https://api.tailoredtiffin.com/admin/get_bread", {
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (data.status === "success") {
    return data.data.find(b => b.bread_id == bread_id);
  }

  return null;
}
