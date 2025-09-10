import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constant";
import { ResponseType } from "@/type";
import axios from "axios";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export const uploadFileToCloudinary = async (
  file: { uri: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return {success:true, data:null};
    if (typeof file === "string") {
      return { success: true, data: file, message: "File is already a URL" };
    }

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.uri.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const res = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("uploaded file result", res.data);

      // Type assertion to satisfy TS
      const secureUrl = (res.data as { secure_url?: string }).secure_url;

      return {
        success: true,
        data: secureUrl || "",
        message: "File uploaded successfully",
      };
    }

    return { success: false, message: "No file provided", data: null };
  } catch (error: any) {
    console.log("got error uploading file", error);
    return { success: false, message: error.message || "Failed to upload file", data: null };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return { uri: file };
  if (file && typeof file === "object" && file.uri) return { uri: file.uri };

  return require("../assets/images/profile.png"); 
};

export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return { uri: file };
  if (file && typeof file === "object" && file.uri) return { uri: file.uri };

  return require("../assets/images/profile.png"); 
};
