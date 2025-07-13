export interface User {
  _id: string;
  fireBaseUserId: string;
  username: string;
  fullName: string;
  email: string;
  profile: string;
  cover: string;
}

export interface MusicStats {
    totalMusic: number;
    totalLiked: number;
}