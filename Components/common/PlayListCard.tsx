import React from 'react'
import { Pressable } from 'react-native'
import { Image, Text, View } from 'tamagui'

export default function PlayListCard({ title, duration, imageUrl, changeRequest }: { title: string, duration: number, imageUrl: string, changeRequest: () => void }) {
  return (
    <View marginHorizontal={'$1'}>
      <Pressable onPress={changeRequest}>
        <View
          height={'$12'}
          width={'$12'}
          overflow="hidden"
          borderRadius={'$6'}
          backgroundColor="#fff"
          elevationAndroid={2}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 3 }}
          shadowOpacity={0.1}
          shadowRadius={6}
        >
          <Image
            source={{ uri: imageUrl || require('@/assets/images/default.jpeg') }}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </View>
      </Pressable>

      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={6}
        marginTop={4}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          fontSize="$5"
          fontWeight="500"
          maxWidth={130}
        >
          {title}
        </Text>
      </View>
    </View>
  )
}
