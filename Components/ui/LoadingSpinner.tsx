import { Spinner, View } from 'tamagui'

export default function LoadingScreen() {
  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
    >
      <Spinner size="large" color="#8E2DE2" />
    </View>
  )
}
