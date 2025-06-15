import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("my_file", file);

  try {
    const res = await axios.post( 
      `${import.meta.env.VITE_API_URL}/profile/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      return res.data.result.secure_url;
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};
