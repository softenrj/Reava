import { Audio } from 'expo-av';

export const getAudioDuration = async (uri: string): Promise<number> => {
  try {
    const { sound, status } = await Audio.Sound.createAsync({ uri });
    const duration = status.isLoaded ? status.durationMillis ?? 0 : 0;
    await sound.unloadAsync(); // cleanup
    return duration;
  } catch (error) {
    console.error("Failed to get audio duration", error);
    return 0;
  }
};

export const FormattedAudio = (duration: number) => {
    if (isNaN(duration)) return 0;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
