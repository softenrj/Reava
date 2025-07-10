export interface Stats {
    fireBaseUserId: string;
    watchTime: number;
    totalMusic: number;
    totalLiked: number;
    Rank: {
        title: string;
        description: string;
    }
    nextRank: string;
    nextRankProgress: number;
    streak: number;
    lastVisited: Date;
}