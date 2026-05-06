export const deleteSideItem = async ({ side_item_id, token }) => {
  try {
    const res = await fetch('https://api.tailoredtiffin.com/admin/delete_side_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        inputdata: {
          side_item_id,
        },
      }),
    });

    return await res.json();
  } catch (error) {
    console.error('Delete side item error:', error);
    return { status: 'error', msg: 'Delete failed' };
  }
};
