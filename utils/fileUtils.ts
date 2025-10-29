export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
          return reject(new Error('Could not read file content.'));
      }
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};
