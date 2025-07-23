import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setMusic } from '@/redux/slice/music'
import { IMusic } from '@/types/music'
import { API_GET_SUGGESTION } from '@/utils/api/APIConstant'
import { useMyMusic, useRecentlyPlayed } from '@/utils/api/playlist'
import { getApi } from '@/utils/endPoints/common'
import React, { useRef, useState } from 'react'
import { ToastAndroid } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'
import { Text, View, XStack, YStack } from 'tamagui'
import MusicTabs from './MusicTabs'

const tabs = [
    { label: 'My Music', value: 0 },
    { label: 'Recently', value: 1 },
    { label: 'Suggestions', value: 2 },
]

const Tabs = () => {
    const [activeTab, setActiveTab] = useState<number>(tabs[0].value)
    const tabRefs = useRef<Record<string, any>>({})
    const underlineX = useSharedValue(0)
    const underlineWidth = useSharedValue(0)
    const [aiSuggestion, setAiSuggestion] = React.useState<IMusic[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const myMusic = useAppSelector(state => state.muiscSlice)
    const dispatch = useAppDispatch();

    //Musics
    const { data: MyMusic, refetch: refetchMyMusic } = useMyMusic();
    const { data: Recently, refetch: refetchRecentMusic } = useRecentlyPlayed();

    const updateUnderline = (key: string) => {
        const ref = tabRefs.current[key]
        if (ref) {
            ref.measure((_fx: any, _fy: any, width: number, _h: number, px: number) => {
                underlineX.value = withSpring(px, { damping: 10 })
                underlineWidth.value = withSpring(width, { damping: 10 })
            })
        }
    }

    const underlineStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: underlineX.value }],
            width: underlineWidth.value,
        }
    })

    const fetchSuggestedPlayListMusic = async () => {
        try {
            setIsLoading(true)
            const AIResult = await getApi<{ message: string, data: IMusic[] }>({
                url: API_GET_SUGGESTION
            })
            if (AIResult?.data) {
                setAiSuggestion(AIResult?.data)
            }
            setIsLoading(false)
        } catch (err) {
            console.log(err);
            ToastAndroid.show('Please Try Again..', 50)
        }
    }

    React.useEffect(() => {
        if (!MyMusic?.length) refetchMyMusic()
        if (!Recently?.length) refetchRecentMusic()
    }, [])

    React.useEffect(() => {
        setTimeout(() => updateUnderline(activeTab.toString()), 0)
    }, [activeTab])

    React.useEffect(() => {
        if (MyMusic && Array.isArray(MyMusic)) {
            dispatch(setMusic(MyMusic));
        }
    },[MyMusic])

    React.useEffect(() => {
        fetchSuggestedPlayListMusic();
    }, [])

    if (myMusic && myMusic.length === 0) {
        return null;
    }

    return (
        <YStack>
            <View height={50} position="relative" justifyContent="center">
                <XStack justifyContent="center" gap="$4">
                    {tabs.map((tab) => {
                        const isActive = tab.value === activeTab
                        return (
                            <YStack
                                key={tab.value}
                                ref={(el: any) => (tabRefs.current[tab.value] = el)}
                                onPress={() => setActiveTab(tab.value)}
                                pressStyle={{ scale: 0.95 }}
                                paddingVertical="$2"
                                paddingHorizontal="$4"
                            >
                                <Text
                                    fontSize="$5"
                                    fontWeight="600"
                                    color={isActive ? '#310062ff' : '#aaa'}
                                >
                                    {tab.label}
                                </Text>
                            </YStack>
                        )
                    })}
                </XStack>

                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            bottom: 0,
                            height: 3,
                            backgroundColor: '#6007b9ff',
                            borderRadius: 99,
                        },
                        underlineStyle,
                    ]}
                />
            </View>

            <View alignItems="center" padding="$4">
                <MusicTabs
                    name={tabs[activeTab]?.label}
                    music={
                        activeTab === 0
                            ? myMusic || []
                            : activeTab === 1
                                ? Recently || []
                                : aiSuggestion || []
                    }
                    handleRefresh={fetchSuggestedPlayListMusic}
                    isLoading={isLoading}
                />
            </View>
        </YStack>
    )
}

export default Tabs
