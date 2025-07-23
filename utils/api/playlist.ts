import { IMusic } from "@/types/music";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../endPoints/common";
import {
  API_GET_MUSIC_LIST,
  API_GET_RECENTLY_PLAYED,
  API_GET_SUGGESTION,
  API_GET_TOP_PLAYED,
} from "./APIConstant";


// 🎧 Get Recently Played
export const getRecentlyPlayed = async (): Promise<IMusic[]> => {
  const response = await getApi<IMusic[]>({
    url: API_GET_RECENTLY_PLAYED,
  });
  return response || [];
};

// 📀 Get My Music List
export const getMyMusic = async (): Promise<IMusic[]> => {
  const response = await getApi<IMusic[]>({
    url: API_GET_MUSIC_LIST,
  });
  return response || [];
};

// 🔥 Get Top Played
export const getTopPlayed = async (): Promise<IMusic[]> => {
  const response = await getApi<IMusic[]>({
    url: API_GET_TOP_PLAYED,
  });
  return response || [];
};

// Ai Suggestion 
export const getAiSuggestion = async (): Promise<IMusic[]> => {
  const AIResult = await getApi<{ message: string, data: IMusic[] }>({
    url: API_GET_SUGGESTION
  })
  if (AIResult?.data) {
    return AIResult.data
  }
  return [];
}


export const useMyMusic = () => {
  return useQuery({
    queryKey: ["myMusic"],
    queryFn: getMyMusic,
  });
};

export const useRecentlyPlayed = () => {
  return useQuery({
    queryKey: ["recentlyPlayed"],
    queryFn: getRecentlyPlayed,
  });
};

export const useTopPlayed = () => {
  return useQuery({
    queryKey: ["topPlayed"],
    queryFn: getTopPlayed,
  });
};

export const useAiSuggestion = () => {
  return useQuery({
    queryKey: ["aiSuggestion"],
    queryFn: getAiSuggestion,
  })
}
