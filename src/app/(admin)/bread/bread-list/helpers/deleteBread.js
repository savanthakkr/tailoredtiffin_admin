export const deleteBread = async ({ bread_id, token }) => {
  try {
    const res = await fetch('https://api.tailoredtiffin.com/admin/delete_bread', {
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
