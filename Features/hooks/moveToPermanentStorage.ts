import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';


export const moveToPermanentStorage = async (file: DocumentPicker.DocumentPickerAsset | null) => {
  if (!file) return '';
  const filename = file.name;
  const newPath = FileSystem.documentDirectory + filename;

  try {
    await FileSystem.copyAsync({
      from: file.uri,
      to: newPath
    });
    return newPath;
  } catch (error) {
    console.error(`Failed to move ${filename}:`, error);
    return file.uri || ''; // fallback if copy fails
  }
};

export const moveToPermanentStorageImage = async (file: ImagePicker.ImagePickerAsset | null) => {
  if (!file) return '';
  
  let filename = file.file?.name;
  if (!filename) {
    filename = `${Date.now()}`
  }
  const newPath = FileSystem.documentDirectory + filename;

  try {
    await FileSystem.copyAsync({
      from: file.uri,
      to: newPath
    });
    return newPath;
  } catch (error) {
    console.error(`Failed to move ${filename}:`, error);
    return file.uri || ''; // fallback if copy fails
  }
};
