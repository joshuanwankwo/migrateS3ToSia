import { downloadFromRentred, uploadToRenterd } from "./siaUtils";

export const getFileNameFromUrl = (url: any) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

export const createFileFromFileUrl = async (url: any) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileName = getFileNameFromUrl(url);
  const file = new File([blob], fileName, { type: blob.type });

  return file;
};

export const handleMigration = (file: any) => {
  createFileFromFileUrl(file.url)
    .then(async (file) => {
      await uploadToRenterd(file);
      await downloadFromRentred();
    })
    .catch((error) => {
      console.error(error);
    });
};