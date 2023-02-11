import Resizer from "react-image-file-resizer";

export const formatImage = (image, callbackFunc) => {
    let fileInput = false;
    if (image) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          image,
          600,
          400,
          "JPEG",
          100,
          0,
          (uri) => {
            
            callbackFunc(uri);
         
          },
          "base64",
          600,
          400
        );
      } catch (err) {
        console.log(err);
      }
    }
  }