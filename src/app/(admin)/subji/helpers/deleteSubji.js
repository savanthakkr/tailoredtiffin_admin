export async function deleteSubji({ subji_id, token }) {
  return fetch('https://api.tailoredtiffin.com//admin/delete_subji', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      inputdata: { subji_id },
    }),
  }).then(res => res.json());
}
