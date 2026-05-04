// utils/dateSlot.js
export const getDefaultDateSlot = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  let slot = 'lunch';

  if (hours >= 18) {
    slot = 'dinner';
  } else if (hours >= 11 && minutes >= 55) {
    slot = 'dinner';
  }

  const date = now.toISOString().split('T')[0];

  return { date, slot };
};
