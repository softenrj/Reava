import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { registerAudioCallbacks, setMusic } from '@/Features/musicService'
import { nextSong, prevSong } from '@/redux/slice/playlist'
import { API_DAILY_VISIT, API_SAVE_MUSIC_PLAY, API_UPDATE_WATCHTIME } from '@/utils/api/APIConstant'
import { postApi } from '@/utils/endPoints/common'
import React from 'react'
import { ScrollView, View } from 'tamagui'
import Footer from '../common/Footer'
import MusicBar from '../common/MusicBar'
import NavBar from '../common/NavBar'
import SearchPanel from '../common/SearchPanel'
import TopNotch from '../common/TopNotch'
import MusicPlayer from '../MusicPlayer/MusicPlayer'
import Main from './Main'
export default function page() {
  const [isMusicBarOpen, setIsMusicBarOpen] = React.useState(true)
  const [musicPlayerOpen, setMusicPlayerOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const autoPlay = React.useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const dailyVisitRef = React.useRef<boolean>(false);
  const lastMusicId = React.useRef<string | null>(null);
  const audioStarted = React.useRef<boolean>(false);


  const handleToggle = (type: string) => {
    if (type === 'topNotch') {
      setIsMusicBarOpen(!isMusicBarOpen);
    } else {
      setMusicPlayerOpen(!musicPlayerOpen);
    }
  }
  const handleOpenMusicPlayer = () => {
    setMusicPlayerOpen(!musicPlayerOpen);
  }
  const handleDailyVisit = async () => {
    await postApi({
      url: API_DAILY_VISIT
    })
    dailyVisitRef.current = true;
  }

  const handleSaveLog = async (musicId: string) => {
    try {
      await postApi({
        url: API_UPDATE_WATCHTIME + `/${musicId}`
      })
      await postApi({
        url: API_SAVE_MUSIC_PLAY + `/${musicId}`
      })
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearchOpen = () => {
    setSearchOpen(!searchOpen);
  }

  //music
  const currentMusic = useAppSelector(state => state.playList).current;

  React.useEffect(() => {
    registerAudioCallbacks({
      onNext: () => dispatch(nextSong()),
      onPrev: () => dispatch(prevSong()),
    });
  }, []);


  React.useEffect(() => {
    if (!currentMusic?.audioPath) return;

    if (lastMusicId.current === currentMusic._id && audioStarted.current) return;

    lastMusicId.current = currentMusic._id;
    setMusic(currentMusic, autoPlay.current);
    autoPlay.current = true;
    audioStarted.current = true;
    handleSaveLog(currentMusic._id);
  }, [currentMusic?._id]);


  React.useEffect(() => {
    if (dailyVisitRef.current) return;
    handleDailyVisit();
  }, [])

  return (
    <View background={'$backgroundStrong'}>
      {!isMusicBarOpen && <TopNotch toggle={handleToggle} />}
      {musicPlayerOpen && <MusicPlayer toggle={handleOpenMusicPlayer} />}
      {searchOpen && <SearchPanel onClose={handleSearchOpen} />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavBar searchOpen={handleSearchOpen} />
        <Main />
        <Footer />
      </ScrollView>
      {isMusicBarOpen && currentMusic && <MusicBar toggle={handleToggle} />}
    </View>
  )
}
