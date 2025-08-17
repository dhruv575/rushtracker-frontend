import api from './api';

/**
 * Uploads an image to Cloudinary via our backend and returns the URL
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The URL of the uploaded image
 */
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error(response.data.error || 'Image upload failed');
    }
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
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
  // Validate file type - accept standard images and HEIC
  const isValidImageType = file.type.startsWith('image/') ||
                          file.type === 'image/heic' ||
                          file.type === 'image/heif' ||
                          file.name.toLowerCase().endsWith('.heic') ||
                          file.name.toLowerCase().endsWith('.heif');
  
  if (!isValidImageType) {
    throw new Error('Please select an image file (JPEG, PNG, HEIC, etc.)');
  }

  // Validate file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error('Image size should be less than 5MB');
  }

  return await uploadImage(file);
};