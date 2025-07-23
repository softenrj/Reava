import HomePage from '@/Components/HomePage/page';
import { useAppDispatch } from '@/Features/hooks/redux';
import { useAuth } from '@/Features/useAuth';
import { setUser } from '@/redux/slice/profile';
import { User } from '@/types/profile';
import { API_GET_USER_DETAIL } from '@/utils/api/APIConstant';
import { getApi } from '@/utils/endPoints/common';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { View } from 'tamagui';

export default function Index() {
  const { user, checking } = useAuth();
  const fetchRef = React.useRef<boolean>(false);
  const dispatch = useAppDispatch()
  const [fetched, setFetched] = useState<boolean>(false)

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
    if (!checking && !fetchRef.current) {
      fetchUser();
    }
  }, [checking])

  React.useEffect(() => {
    if (!checking && !user) {
      router.replace('/(auth)/signup');
    }
  }, [user, checking]);

  if (checking || !user || !fetched) return <View flex={1} justifyContent='center' alignItems='center'>
    <LottieView source={require('@/assets/lottie/Loading.json')} autoPlay loop style={{ width: 180, height: 180 }} />
  </View>;

  return (
    <View >
      <HomePage />
    </View>
  );
}
