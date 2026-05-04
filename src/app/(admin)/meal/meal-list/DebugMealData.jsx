'use client';

// Simple component to display debug info in browser console and UI
export const DebugMealData = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn("❌ No meal data to debug");
    return null;
  }

  const debugInfo = {
    totalMeals: data.length,
    mealWithImages: data.filter(m => m.image).length,
    mealsWithoutImages: data.filter(m => !m.image).length,
    meals: data.map(m => ({
      id: m.meals_id,
      name: m.meals_name,
      hasImage: !!m.image,
      imageValue: m.image || "null/undefined",
      imageType: typeof m.image,
      allProperties: Object.keys(m),
    })),
  };

  console.group("🍽️ MEAL DATA DEBUG INFO");
  console.log("Summary:", {
    total: debugInfo.totalMeals,
    withImages: debugInfo.mealWithImages,
    withoutImages: debugInfo.mealsWithoutImages,
  });
  console.table(debugInfo.meals);
  console.groupEnd();

  return null; // This is just for debugging, don't render anything
};
