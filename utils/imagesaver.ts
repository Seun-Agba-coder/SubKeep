import RNFS from 'react-native-fs';

const saveImageToDevice = async (imageUrl: string, fileName: string) => {
  try {
    // Create a unique filename if not provided
    const finalFileName = fileName || `image_${Date.now()}.png`;
    
    // Define the path where image will be saved
    const downloadPath = `${RNFS.DocumentDirectoryPath}/${finalFileName}`;
    
    // Download the image
    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadPath,
      background: true, // Enable downloading in background (iOS only)
      discretionary: true, // Allow system to delay download if needed (iOS only)
    }).promise;
    
    if (downloadResult.statusCode === 200) {
      console.log('Image saved successfully!');
      console.log(`file://${downloadPath}`)
      return `file://${downloadPath}`;
    } else {
      throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
    }
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};


export default saveImageToDevice



export const removeImageFromDevice = async (filePath: string) => {
    try {
      // Check if file exists first
      const fileExists = await RNFS.exists(filePath);
      
      if (!fileExists) {
        console.log('File does not exist:', filePath);
        return false;
      }
      
      // Remove the file
      await RNFS.unlink(filePath);
      
      console.log('Image removed successfully!');
      return true;
    } catch (error) {
      console.error('Error removing image:', error);
      throw error;
    }
  };

  