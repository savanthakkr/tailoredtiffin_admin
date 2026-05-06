export const deleteBread = async ({ bread_id, token }) => {
  try {
    const res = await fetch('http://localhost:3002/admin/delete_bread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        inputdata: {
          bread_id,
        },
      }),
    });

    return await res.json();
  } catch (error) {
    console.error('Delete bread error:', error);
    return { status: 'error', msg: 'Delete failed' };
  }
};
