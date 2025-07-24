import { useAppSelector } from '@/Features/hooks/redux'
import React from 'react'
import { Image, Text, View } from 'tamagui'
import HeroSlider from '../common/HeroSlider'
import Tabs from '../common/MainTabBar/Tabs'
import TopPlayedBoard from '../common/TopPlayedSection/TopPlayedBoard'

export default function Main() {
  const user = useAppSelector(state => state.profileSlice)
  return (
    <View minHeight={200}>
      <View marginTop="$4" paddingHorizontal={'$2'} overflow='hidden' width="100%" height="$16" shadowColor="#aaa" shadowOffset={{ width: 4, height: 8 }} shadowOpacity={0.2} elevationAndroid={16}>
        <Image
          objectFit="cover"
          borderRadius={10}
          width="100%"
          height="100%"
          alt="Hero Image"
          src={user.cover || require('@/assets/images/homepage/hero.jpg')}
        />
      </View>
      <Text
        fontSize="$9"
        fontWeight="900"
        textAlign="center"
        color="rgba(9, 0, 88, 1)"
        letterSpacing={0.5}
        marginVertical="$4"
      >
        Welcome back{user?.fullName ? `, ${user.fullName}!` : '!'}
      </Text>
      <HeroSlider />
      <TopPlayedBoard />
      <Tabs />
    </View>
  )
}
