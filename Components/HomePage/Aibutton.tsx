import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Sparkles } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Text, View } from 'tamagui'

export default function AIButton({ loading }: { loading: boolean }) {
  const fullText = 'Generate Playlist'
  const [text, setText] = useState('')

  useEffect(() => {
    if (loading) {
      setText('Loading...')
      return
    }

    let idx = 0
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setText(fullText.slice(0, idx))
        idx++
      } else {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [loading])

  // Rotation logic
  const rotation = useSharedValue(0)

  const animateRotation = () => {
    rotation.value = withTiming(
      360,
      {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (finished) {
          rotation.value = 0 // reset to 0 after 1 full rotation
        }
      }
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      runOnJS(animateRotation)()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const rotatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  return (
    <View
      marginTop="$3"
      marginBottom={-10}
      marginLeft="$1"
      flexDirection="row"
      gap={4}
      alignItems="flex-start"
    >
      <Animated.View style={rotatingStyle}>
        <Sparkles size={24} />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400)}>
        <MaskedView
          maskElement={
            <Text
              fontSize="$6"
              whiteSpace="nowrap"
              fontWeight="600"
              paddingHorizontal="$2"
              style={{ backgroundColor: 'transparent' }}
              marginTop={-10}
              fontFamily={'Pacifico_400Regular'}
            >
              {text}
            </Text>
          }
        >
          <LinearGradient
            colors={['#00f0ff', '#ff00cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text
              fontSize="$6"
              fontFamily={'Pacifico_400Regular'}
              fontWeight="600"
              paddingHorizontal="$2"
              opacity={0}
            >
              {text}
            </Text>
          </LinearGradient>
        </MaskedView>
      </Animated.View>
    </View>
  )
}
