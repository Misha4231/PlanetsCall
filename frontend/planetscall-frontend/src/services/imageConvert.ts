export const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  export const convertBase64ToImageUrl = (base64String: string): string => {
    if (!base64String) return '';
    return base64String.startsWith('data:image') 
      ? base64String 
      : `data:image/jpeg;base64,${base64String}`;
  };