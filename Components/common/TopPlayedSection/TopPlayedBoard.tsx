import { useAppDispatch } from '@/Features/hooks/redux';
import { setPlaylistAndPlay } from '@/redux/slice/playlist';
import { IMusic } from '@/types/music';
import { useTopPlayed } from '@/utils/api/playlist';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Text, View } from 'tamagui';
import TopPlayedCard from './TopPlayedCard';

const cardGradients = [
  ['#00022cd8', '#12052ce6', '#22092cff'],
  ['#2c0038ee', '#470064ff', '#340052cc'],
  ['#0a0a3de0', '#1f0a5ce0', '#390e7dcc'],
];


const TopPlayedBoard = () => {
  const [topMusic, setTopMusic] = React.useState<IMusic[]>([]);
  const { data, isLoading } = useTopPlayed();
  const { width, height } = useWindowDimensions()
  const dispatch = useAppDispatch();

  const handleList = (id: string) => {
    dispatch(setPlaylistAndPlay({list: topMusic, id: id, name: 'top'}))
  }

  React.useEffect(() => {
    if (data && Array.isArray(data)) {
      setTopMusic(data.slice(0, 3));
    } else {
      setTopMusic([]);
    }
  }, [data])

  if (topMusic && Array.isArray(topMusic) && topMusic.length === 0) {
    return null
  }

  return (
    <View marginVertical="$4">
      <View justifyContent="center" alignItems="center">
        <Text fontSize="$9" fontWeight="900" color={'rgba(10, 0, 58, 1)'}>
          Loop Legends
        </Text>
        <Text fontSize="$3">
          Your Top 3 Most Played Tracks
        </Text>
      </View>

      <View flexDirection="row" justifyContent="center" alignItems="flex-end" gap="$3" marginTop="$4">
        <Carousel
          data={topMusic}
          width={width}
          height={200}
          autoPlay
          autoPlayInterval={4000}
          scrollAnimationDuration={1200}
          loop
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 20,
          }}
          renderItem={({ item, index }) => (
            <TopPlayedCard data={item} gradientColors={cardGradients[index % cardGradients.length]} handleList={() => handleList(item._id)} />
          )}

        />
      </View>
    </View>
  )
}

export default TopPlayedBoard