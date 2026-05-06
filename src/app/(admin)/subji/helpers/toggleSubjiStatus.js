export async function toggleSubjiStatus({ subji_id, is_active, token }) {
  return fetch('https://api.tailoredtiffin.com/admin/toggle_subji_status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: {
        subji_id,
        is_active,
      },
    }),
  }).then(res => res.json());
}
