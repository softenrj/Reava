import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { setMusicById } from '@/redux/slice/playlist';
import { IMusic } from '@/types/music';
import React from 'react';
import { Image, Text, View } from 'tamagui';

const SliderCard: React.FC<{music: IMusic, handleList: () => void}> = ({music, handleList}) => {
  const currentplaylist = useAppSelector(state => state.playList)
  const dispatch = useAppDispatch();

  const handlePlay = () => {
    if (currentplaylist.name === "myMusic") {
      dispatch(setMusicById(music._id));
    } else {
      handleList();
    }
  }
  
  return (
    <View alignItems='center' onPress={handlePlay} pressStyle={{ scale: 0.98 }}>
        <Image src={music?.imagePath || require('@/assets/images/default-m.jpeg')} height={250} width={250} borderRadius={20} />
        <Text fontSize={'$7'} marginTop={10} fontWeight={'800'} numberOfLines={2} maxWidth={'60%'} textAlign='center' textOverflow='inherit'>{music.title}</Text>
    </View>
  )
}

export default SliderCard 