export const deleteOtherItem = async ({ other_item_id, token }) => {
  try {
    const res = await fetch('https://api.tailoredtiffin.com/admin/delete_other_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        inputdata: {
          other_item_id,
        },
      }),
    });

    return await res.json();
  } catch (error) {
    console.error('Delete otheritem error:', error);
    return { status: 'error', msg: 'Delete failed' };
  }
};
