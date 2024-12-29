import axios from "axios";
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  console.log({file});
  
  // const promise = fetch("/api/upload", {
  //   method: "POST",
  //   headers: {
  //     "content-type": file?.type || "application/octet-stream",
  //     "x-vercel-filename": file?.name || "image.png",
  //   },
  //   body: file,
  // });

  // return new Promise((resolve, reject) => {
  //   toast.promise(
  //     promise.then(async (res) => {
  //       // Successfully uploaded image
  //       if (res.status === 200) {
  //         const { url } = (await res.json()) as { url: string };
  //         // preload the image
  //         const image = new Image();
  //         image.src = url;
  //         image.onload = () => {
  //           resolve(url);
  //         };
  //         // No blob store configured
  //       } else if (res.status === 401) {
  //         resolve(file);
  //         throw new Error("`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.");
  //         // Unknown error
  //       } else {
  //         throw new Error("Error uploading image. Please try again.");
  //       }
  //     }),
  //     {
  //       loading: "Uploading image...",
  //       success: "Image uploaded successfully.",
  //       error: (e) => {
  //         reject(e);
  //         return e.message;
  //       },
  //     },
  //   );
  // });
  try {    
    const preset_key: string = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY ?? "" as string
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const formData = new FormData();
    formData.append("file", file)
    formData.append("upload_preset", preset_key)
    
    let res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
        formData, 
        {                    
          // onUploadProgress,
        }
    );
    
    if (!res?.data?.secure_url) {
      throw new Error("Error uploading image. Please try again.");      
    }

    return res?.data?.secure_url
  } catch (error) {
    console.error(error);    
    throw new Error("Error uploading image. Please try again.");
  }

};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
