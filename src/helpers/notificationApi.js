import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export const sendMenuUpdateNotification = async (accessToken) => {
  if (!accessToken) {
    throw new Error('Missing access token');
  }

  const res = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.MENU_NOTIFICATION}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res?.data ?? null;
};
