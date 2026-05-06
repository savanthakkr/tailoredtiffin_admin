export const deleteSpacialItem = async ({ special_item_id, token }) => {
  try {
    const res = await fetch('https://api.tailoredtiffin.com/admin/delete_special_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        inputdata: {
          special_item_id,
        },
      }),
    });

    return await res.json();
  } catch (error) {
    console.error('Delete spacialitem error:', error);
    return { status: 'error', msg: 'Delete failed' };
  }
};
