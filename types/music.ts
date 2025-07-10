import { useAudioPlayerStatus } from 'expo-audio';

export interface IMusic {
    _id: string;
    fireBaseUserId: string;
    title: string;
    videoPath: string;
    audioPath: string;
    imagePath: string;
    duration: number;
    isLiked: boolean;
    played: number;
}

export type AudioStatus = ReturnType<typeof useAudioPlayerStatus>;