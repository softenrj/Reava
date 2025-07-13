import '@/Features/musicService';
import { store } from '@/redux/store';
import { config } from '@/tamagui.config';
import { Pacifico_400Regular, useFonts } from '@expo-google-fonts/pacifico';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'expo-dev-client';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from 'react-redux';
import { TamaguiProvider, View } from "tamagui";


export default function Layout() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });
  const queryClient = new QueryClient();

  if (!fontsLoaded) return null;


  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Provider store={store}>
          <TamaguiProvider config={config}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <View flex={1} padding="$2">
                  <Stack
                    screenOptions={{
                      animation: 'simple_push',
                      gestureEnabled: true,
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: '#fff',
                      }
                    }}
                  />
                </View>
              </GestureHandlerRootView>
            </SafeAreaView>
          </TamaguiProvider>
        </Provider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
