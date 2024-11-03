export const checkImageModeration = async (imageUrl) => {
  try {
    // Fetch moderation data from the Sightengine API
    const response = await fetch(
        `https://api.sightengine.com/1.0/check.json?url=${encodeURIComponent(
          imageUrl
        )}&models=nudity-2.1&api_user=${import.meta.env.VITE_IMG_PURIFY_API_USER}&api_secret=${import.meta.env.VITE_IMG_PURIFY_API_SECRET}`
      );
      
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData); // Log the server error
      return false;
    }

    // Parse the response data
    const data = await response.json();

    // Determine if nudity is detected based on moderation data
    return isNudityDetected(data.nudity);
  } catch (error) {
    console.error("Network Error:", error.message); // Log network error
    return false;
  }
};

// Helper function to evaluate nudity or suggestive content
const isNudityDetected = (nudityData, threshold = 0.5) => {
  const {
    sexual_activity,
    sexual_display,
    erotica,
    very_suggestive,
    suggestive,
    mildly_suggestive,
  } = nudityData;

  // Check for explicit nudity with a threshold
  if (
    sexual_activity > threshold ||
    sexual_display > threshold ||
    erotica > threshold
  ) {
    return true; // Explicit nudity detected
  }

  // Check for suggestive content if explicit nudity is not detected
  if (
    very_suggestive > threshold ||
    suggestive > threshold ||
    mildly_suggestive > threshold
  ) {
    return true; // Suggestive content detected
  }

  // No nudity or suggestive content detected
  return false;
};

