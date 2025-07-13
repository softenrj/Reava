import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'tamagui';
import MusicContent from './MusicContent';
import PlayListMenu from './PlayListMenu';

export default function MusicOverLay() {
  const [screenOverlay, setIsScreenOverLay] = React.useState(true);
  const [openMenu, setOpenMenu] = React.useState<boolean>(false)

  const opacity = useSharedValue(1);

  const handleOpenPlayList = () => {
    setOpenMenu(!openMenu);
  }

  useEffect(() => {
    opacity.value = withTiming(screenOverlay ? 1 : 0, { duration: 300 });
  }, [screenOverlay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 15,
            zIndex: 55,
          },
          animatedStyle,
        ]}
      >
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          onTouchStart={() => setIsScreenOverLay(false)}
          zIndex={56}
        />

        <MusicContent listTrigger={handleOpenPlayList} />
        {openMenu && <PlayListMenu trigger={() => setOpenMenu(false)} />}

      </Animated.View>

      {!screenOverlay && (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={58}
          onTouchStart={() => setIsScreenOverLay(true)}
        />
      )}
    </Animated.View>
  );
}
