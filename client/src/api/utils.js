import axios from "axios";

// upload image and return image url
export const imageUpload = async (image) => {
  const imageFormData = new FormData();
  imageFormData.append("image", image);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    imageFormData
  );

  return data?.data?.display_url;
};
