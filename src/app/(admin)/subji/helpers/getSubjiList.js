export async function getSubjiList(token) {
  try {
    const res = await fetch('http://localhost:3002/admin/get_subji', {
      headers: {
        Authorization: `${token}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    console.log(data);
    console.log("adasdsadsad");
    
    
    return data?.data || [];
  } catch (err) {
    console.error('Get sabji list error', err);
    return [];
  }
}
