import { GET_UPLOAD_SIGNATURE } from "@/graphql/mutations/getSignature";
import ME_QUERY from "@/graphql/query/meGql";
import { useMutation } from "@apollo/client";

// A reusable function for uploading images to Cloudinary
export const useUploadImage = () => {
  const [getUploadSignature, { error, loading }] = useMutation(GET_UPLOAD_SIGNATURE,{
    refetchQueries: {query: ME_QUERY},
    awaitRefetchQueries: true
  });

  const uploadImage = async (cloudName, file, upload_preset, uploadFolder) => {
    try {
      // Request the signature from the backend
      const res = await getUploadSignature({
        variables: {
          upload_preset,
          uploadFolder,
        },
      });

      // Extract timestamp and signature
      const { timestamp, signature } = res.data?.getUploadSignature;

      // Create a FormData object to send the image file and related data to Cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", import.meta.env.VITE_CLOUD_API_KEY);
      data.append("upload_preset", upload_preset);
      data.append("folder", uploadFolder);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      // Upload the image to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );

      if (!response.ok) throw new Error("Image upload failed");

      // Return the uploaded image's data from Cloudinary
      return await response.json();
    } catch (err) {
      console.error(`Image upload failed: ${err.message}`);
      return null;
    }
  };

  return { uploadImage, error, loading };
};
