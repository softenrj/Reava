import { IMusic } from "@/types/music";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaylistState {
  name: string
  list: IMusic[];
  current: IMusic | null;
  currentMusicIdx: number;
  shuffle: boolean;
}

const initialState: PlaylistState = {
  name: '',
  list: [],
  current: null,
  currentMusicIdx: 0,
  shuffle: false,
};

const playListSlice = createSlice({
  name: "playList",
  initialState,
  reducers: {
    setPlaylist(state, action: PayloadAction<{ list: IMusic[], name: string }>) {
      state.list = action.payload.list;
      state.name = action.payload.name;
      if (!state.current) {
        state.current = action.payload.list[0] || null;
        state.currentMusicIdx = 0;
      }
    },
    setMusicIndex(state, action: PayloadAction<number>) {
      state.currentMusicIdx = action.payload;
      state.current = state.list[action.payload];
    },
    setMusicById(state, action: PayloadAction<string>) {
      const musicidx = state.list.findIndex(item => item._id === action.payload)
      if (musicidx && musicidx >= 0 && musicidx < state.list.length) {
        state.current = state.list[musicidx]
        state.currentMusicIdx = musicidx
      }
    },
    playSong(state, action: PayloadAction<IMusic>) {
      state.current = action.payload;
    },
    nextSong(state) {
      if (state.shuffle) {
        const nextIndex = getRandomIndex(state.list.length, state.currentMusicIdx);
        state.currentMusicIdx = nextIndex;
        state.current = state.list[nextIndex];
      } else {
        const nextIndex = (state.currentMusicIdx + 1) % state.list.length;
        state.currentMusicIdx = nextIndex;
        state.current = state.list[nextIndex];
      }
    },
    prevSong(state) {
      if (state.shuffle) {
        const prevIndex = getRandomIndex(state.list.length, state.currentMusicIdx);
        state.currentMusicIdx = prevIndex;
        state.current = state.list[prevIndex];
      } else {
        const prevIndex = (state.currentMusicIdx - 1 + state.list.length) % state.list.length;
        state.currentMusicIdx = prevIndex;
        state.current = state.list[prevIndex];
      }
    },
    playIndexSong(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (state.currentMusicIdx === index) return;

      if (state.shuffle) {
        const randomIndex = getRandomIndex(state.list.length, index);
        state.current = state.list[randomIndex];
        state.currentMusicIdx = randomIndex;
      } else if (index >= 0 && index < state.list.length) {
        state.current = state.list[index];
        state.currentMusicIdx = index;
      }
    },
    setShuffleMusic(state, action: PayloadAction<boolean>) {
      state.shuffle = action.payload;
    },
    updateMusic(state, action: PayloadAction<IMusic>) {
      const updated = action.payload;
      const index = state.list.findIndex((music) => music._id === updated._id);
      if (index !== -1) {
        state.list[index] = updated;
      }

      if (state.current?._id === updated._id) {
        state.current = updated;
      }
    },
    setPlaylistAndPlay(state, action: PayloadAction<{ list: IMusic[]; id: string; name: string }>) {
      const { list, id, name } = action.payload;
      const musicidx = list.findIndex(item => item._id === id);
      if (musicidx < 0) return;
      if (state.name === name && state.current?._id === id) return;

      if (state.name === name) {
        state.current = list[musicidx];
        state.currentMusicIdx = musicidx;
      } else {
        // New playlist
        state.name = name;
        state.list = list;
        state.current = list[musicidx];
        state.currentMusicIdx = musicidx;
      }
    }


  },

});

function getRandomIndex(length: number, exclude: number): number {
  let idx = Math.floor(Math.random() * length);
  if (length > 1 && idx === exclude) {
    idx = (idx + 1) % length; // Ensure different from current
  }
  return idx;
}

export const {
  setPlaylist,
  setMusicIndex,
  playSong,
  nextSong,
  prevSong,
  playIndexSong,
  setShuffleMusic,
  updateMusic,
  setMusicById,
  setPlaylistAndPlay
} = playListSlice.actions;

export default playListSlice.reducer;
