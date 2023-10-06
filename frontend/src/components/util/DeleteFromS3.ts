import axios from "axios";

interface DeleteImageOptions {
  endpoint: string;
  object: Record<string, any>;
  imageProp: string;
  baseUrl?: string;
  successCallback?: () => void;
  failCallback?: () => void;
}

export const deleteImgFromS3 = async ({
  endpoint,
  object,
  imageProp,
  baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api`,
  successCallback,
  failCallback,
}: DeleteImageOptions) => {
  try {
    if (object && object[imageProp]) {
      const deleteResponse = await axios.delete(
        `${baseUrl}/${endpoint}/images`,
        {
          data: { imageUrl: object[imageProp] },
          withCredentials: true,
        }
      );

      if (
        successCallback &&
        deleteResponse.status >= 200 &&
        deleteResponse.status < 300
      ) {
        successCallback();
      }
    }
  } catch (err) {
    console.log(err);
    if (failCallback) {
      failCallback();
    }
  }
};
