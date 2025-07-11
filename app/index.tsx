import HomePage from '@/Components/HomePage/page';
import LoadingScreen from '@/Components/ui/LoadingSpinner';
import { useAppDispatch } from '@/Features/hooks/redux';
import { useAuth } from '@/Features/useAuth';
import { setMusic } from '@/redux/slice/music';
import { setPlaylist } from '@/redux/slice/playlist';
import { setUser } from '@/redux/slice/profile';
import { User } from '@/types/profile';
import { API_GET_USER_DETAIL } from '@/utils/api/APIConstant';
import { useMyMusic } from '@/utils/api/playlist';
import { getApi } from '@/utils/endPoints/common';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'tamagui';


export default function Index() {
  const { user, checking } = useAuth();
  const fetchRef = React.useRef<boolean>(false);
  const dispatch = useAppDispatch()
  const [fetched, setFetched] = useState<boolean>(false)
  const { data: myMusicList, isLoading, error } = useMyMusic();

  const fetchUser = async () => {
    if (fetchRef.current) return;

    try {
      const res = await getApi<User>({ url: API_GET_USER_DETAIL });
      if (res) {
        dispatch(setUser(res));
        setFetched(true);
      } else {
        setTimeout(() => fetchUser(), 3000);
        return;
      }
    } catch (err) {
      console.error("User fetch failed, retrying...", err);
      setTimeout(() => fetchUser(), 3000);
      return;
    }

    fetchRef.current = true;
  };


  React.useEffect(() => {
    if (myMusicList && Array.isArray(myMusicList) && !isLoading) {
      console.log(myMusicList)
      dispatch(setMusic(myMusicList))
      dispatch(setPlaylist({ list: myMusicList, name: "myMusic" }))
    }
  },[myMusicList])

  React.useEffect(() => {
    if (!checking && !fetchRef.current) {
      fetchUser();
    }
  }, [checking])

  React.useEffect(() => {
    if (!checking && !user) {
      router.replace('/(auth)/signup');
    }
  }, [user, checking]);


  if (checking || !user || !fetched) return <LoadingScreen />;

  return (
    <View >
      <HomePage />
    </View>
  );
}
