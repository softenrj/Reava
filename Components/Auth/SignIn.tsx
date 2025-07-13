import { auth } from '@/Configs/firebaseConfig'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ToastAndroid
} from 'react-native'
import { Button, Form, Input, Text, View, YStack } from 'tamagui'

const { width } = Dimensions.get('window')

export default function SignIn() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const SignInUser = async () => {
        if (!email || !password) {
            ToastAndroid.show('Please enter both email and password 💌', 50)
            return;
        }
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            ToastAndroid.show('You’re signed in and ready to roll 🚀', 50)   
            router.push('/');
        } catch (err: any) {
            console.error(err);
            ToastAndroid.show('😢 Login Failed', 50)
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View
                    height="100%"
                    backgroundColor="#F9FAFB"
                    justifyContent="center"
                    alignItems="center"
                    paddingVertical="$6"
                >
                    {/* Background Gradients */}
                    <LinearGradient
                        colors={['#FEE2F8', '#E0C3FC']}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: -150,
                            left: -120,
                            width: 320,
                            height: 320,
                            borderRadius: 160,
                            opacity: 0.5,
                        }}
                    />
                    <LinearGradient
                        colors={['#C2FFD8', '#465EFB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: -130,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: 150,
                            opacity: 0.4,
                        }}
                    />

                    {/* Glass Sign In Card */}
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={{
                            width: width * 0.9,
                            padding: 26,
                            borderRadius: 30,
                            backgroundColor: 'rgba(255,255,255,0.35)',
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowRadius: 24,
                        }}
                    >
                        <YStack gap={20}>
                            <Text fontSize={30} fontWeight="900" textAlign="center" color="#111">
                                🔐 Welcome Back
                            </Text>

                            <Text fontSize={16} color="#444" textAlign="center">
                                Login to continue
                            </Text>

                            <Form gap={16}>
                                <YStack gap={10}>
                                    <Text fontSize={16} fontWeight="600">Email</Text>
                                    <Input
                                        placeholder="you@example.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        borderRadius={14}
                                        paddingVertical={12}
                                        paddingHorizontal={14}
                                        onChangeText={setEmail}
                                    />
                                </YStack>

                                <YStack gap={10}>
                                    <Text fontSize={16} fontWeight="600">Password</Text>
                                    <Input
                                        placeholder="Your password"
                                        secureTextEntry
                                        borderRadius={14}
                                        paddingVertical={12}
                                        paddingHorizontal={14}
                                        onChangeText={setPassword}
                                    />
                                </YStack>

                                <Button
                                    width="100%"
                                    borderRadius={20}
                                    paddingVertical={10}
                                    backgroundColor="#8E2DE2"
                                    color="white"
                                    fontWeight="700"
                                    marginTop={10}
                                    onPress={SignInUser}
                                    disabled={loading}
                                    opacity={loading ? 0.6 : 1}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Form>

                            <Text fontSize={14} color="#555" textAlign="center" marginTop={12}>
                                Don’t have an account?{' '}
                                <Text fontWeight="700" color="#8E2DE2" onPress={() => router.push('/(auth)/signup')}>
                                    Sign Up
                                </Text>
                            </Text>
                        </YStack>
                    </BlurView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
