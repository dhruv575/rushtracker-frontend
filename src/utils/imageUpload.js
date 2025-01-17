// src/utils/imageUpload.js

/**
 * Uploads an image to ImgBB and returns the URL
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The URL of the uploaded image
 */
export const uploadImage = async (imageFile) => {
    const API_KEY = '68ce7e23400e99dc6a86ca377c7decab';
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
  
      const data = await response.json();
      
      if (data.success) {
        // Return the direct image URL
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  /**
   * Helper function to handle file selection and upload
   * @param {File} file - The selected file
   * @returns {Promise<string>} The URL of the uploaded image
   * @throws {Error} If file is invalid or upload fails
   */
  export const handleImageUpload = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }
  
    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error('Image size should be less than 5MB');
    }
  
    return await uploadImage(file);
  };