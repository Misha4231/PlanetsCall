import { authHeader } from "./headers";

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};



export const imageUrl = () => {
  const linkToImage = authHeader();
  //const linkToImage = "https://localhost:7000/";
  //const linkToImage = "http://localhost:8080/";
  return linkToImage;
};