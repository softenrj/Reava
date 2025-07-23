import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Text, View } from 'tamagui';

import { useAppDispatch } from '@/Features/hooks/redux';
import { setPlaylistAndPlay } from '@/redux/slice/playlist';
import { IMusic } from '@/types/music';
import { useTopPlayed } from '@/utils/api/playlist';
import LottieView from 'lottie-react-native';
import SliderCard from './SliderCard';

const HeroSlider = () => {
  const { width } = useWindowDimensions();
  const { data, isLoading, isError } = useTopPlayed();
  const [topPlayed, setTopPlayed] = useState<IMusic[]>([]);
  const dispatch = useAppDispatch();

  const handleList = (id: string) => {
    dispatch(setPlaylistAndPlay({list: topPlayed, id: id, name: "myMusic"}))
  }

  useEffect(() => {
    if (Array.isArray(data)) {
      setTopPlayed(data);
    } else {
      setTopPlayed([]);
    }
  }, [data]);

  if (isLoading) {
    return <View />;
  }

  if (!data || data.length === 0 || topPlayed.length === 0) {
    return <View justifyContent='center' alignItems='center' paddingVertical={20}>
      <LottieView source={require('@/assets/lottie/Loading2.json')} autoPlay loop style={{width: 240, height: 240}} />
      <Text fontSize={18} fontWeight={'800'} color={'#000000ac'}>No music found</Text>
      <Text fontSize={12} fontWeight={'800'} color={'#00000061'}>Add music from music Manager</Text>
    </View>
  }

  return (
    <View width={width} alignItems="center">
      <Carousel
        loop
        autoPlay={false}
        width={width * 0.9} // Each card is 70% of screen width
        height={300}
        data={topPlayed}
        scrollAnimationDuration={1200}
        pagingEnabled={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 140,
          parallaxAdjacentItemScale: 0.6,
        }}
        renderItem={(data) => (
          <SliderCard music={data.item} handleList={() => handleList(data.item._id)} />
        )}
        style={{
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default HeroSlider;
