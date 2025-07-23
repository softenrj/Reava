import { useAppSelector } from '@/Features/hooks/redux'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation, useRouter } from 'expo-router'
import { Cog, Command, Search, User2 } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Popover, Text, View, YStack } from 'tamagui'

export default function NavBar({ searchOpen }: { searchOpen: () => void }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const navigation = useNavigation()
  const user = useAppSelector(state => state.profileSlice)

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setOpen(false)
    })

    return unsubscribe
  }, [navigation])


  return (
    <View display='flex' justifyContent='space-between' flexDirection='row' paddingHorizontal={2}>
      <Text fontFamily={'Pacifico_400Regular'} fontSize={'$9'}>Music</Text>
      <View flexDirection='row' alignItems='center' gap={'$3'}>
        <Search size={25} strokeWidth={3} color={'#676767'} onPress={searchOpen} />
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger pressStyle={{ scale: 0.95 }}>
            <LinearGradient
              colors={['#FF6FB5', '#FFD3A5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 2,
                borderRadius: 50,
                shadowColor: '#FF6FB5',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Avatar
                circular
                size="$5"
                cursor="pointer"
                backgroundColor="$background"
              >
                <Avatar.Image
                  src={user.profile || require('@/assets/images/default-pic.jpg')}
                />
                <Avatar.Fallback backgroundColor="#FFD6E8" /> 
              </Avatar>
            </LinearGradient>


          </Popover.Trigger>

          <Popover.Content
            borderWidth={1}
            borderColor="#ccc"
            backgroundColor="$background"
            marginRight={'$2'}
            padding="$3"
            marginTop={'$2'}
            elevate
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            animation={['300ms', { opacity: { overshootClamping: true } }]}
          >
            <YStack space="$2" minWidth={120}>
              <Button
                icon={User2}
                justifyContent="flex-start"
                size="$3"
                chromeless
                onPress={() => {
                  setOpen(false)
                  router.push('/profile/page')
                }}
              >
                Profile
              </Button>
              <Button
                icon={Command}
                justifyContent="flex-start"
                size="$3"
                chromeless
                onPress={() => {
                  setOpen(false)
                  router.push('/music-manager/page')
                }}
              >
                Manager
              </Button>
              <Button
                icon={Cog}
                justifyContent="flex-start"
                size="$3"
                chromeless
                onPress={() => {
                  setOpen(false)
                  router.push('/setting/page')
                }}
              >
                Setting
              </Button>
            </YStack>
          </Popover.Content>
        </Popover>
      </View>
    </View>
  )
}
