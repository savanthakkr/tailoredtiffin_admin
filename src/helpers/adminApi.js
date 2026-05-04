export async function getAdminUsers() {
  const res = await fetch(
    `https://api.tailoredtiffin.com//admin/get_users`,
    {
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
      cache: 'no-store'
    }
  );

  const json = await res.json();
  return json.data || [];
}
