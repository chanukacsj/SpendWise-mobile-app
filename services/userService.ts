import { db } from "@/firebase";
import { ResponseType, UserDataType } from "@/type";
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { uploadFileToCloudinary } from "./imageServices";
import axios from "axios";

export const updateUser = async (
    uid:string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try{
            
        if(updatedData.image && updatedData.image.uri){
            const imageUploadRes = await uploadFileToCloudinary(
                updatedData.image,
                "users"
            );
            if(!imageUploadRes.success){
                return {
                    success: false,
                    message: imageUploadRes.message || "Failed to upload image."
                }
            }
            updatedData.image = imageUploadRes.data
        }
        const userRef = doc (db, "users", uid);
        await updateDoc(userRef, updatedData);

        return {
            success: true,
            message: "User updated successfully!"
    }
}catch(error:any){
    console.log("error updateing user data", error);
    return {
        success: false,
        message: error.message || "Failed to update user."
    }
}
};
