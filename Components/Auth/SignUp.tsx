import { auth } from '@/Configs/firebaseConfig';
import { API_ADD_NEW_USER } from '@/utils/api/APIConstant';
import { postApi } from '@/utils/endPoints/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import { Button, Form, Input, Text, View, YStack } from 'tamagui';

const { width } = Dimensions.get('window');

export default function SignUp() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const SignUpUser = async () => {
        if (!email || !password || !fullName) {
            ToastAndroid.show('Please enter all fields 💌', ToastAndroid.SHORT);
            return;
        }
        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            if (res.user) {
                const token = await res.user.getIdToken();
                await AsyncStorage.setItem('authToken', token);
                const user = await postApi({
                    url: API_ADD_NEW_USER,
                    values: { fullName }
                });
                setLoading(false);
                ToastAndroid.show('Your account has been created successfully 🌈', ToastAndroid.SHORT);
                router.push('/');
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            ToastAndroid.show('Something went wrong while signing up. Try again?', ToastAndroid.LONG);
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
                        colors={['#FECDD3', '#E0C3FC']}
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

                    {/* Glass Card */}
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
                                🚀 Create Account
                            </Text>

                            <Text fontSize={16} color="#444" textAlign="center">
                                Join us and explore your journey
                            </Text>

                            <Form gap={16}>
                                <YStack gap={10}>
                                    <Text fontSize={16} fontWeight="600">Full Name</Text>
                                    <Input
                                        onChangeText={setFullName}
                                        placeholder="John Doe"
                                        borderRadius={14}
                                        paddingVertical={12}
                                        paddingHorizontal={14}
                                        value={fullName}
                                    />
                                </YStack>

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
                                        placeholder="Create a strong password"
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
                                    themeInverse
                                    backgroundColor="#D946EF"
                                    color="white"
                                    fontWeight="700"
                                    marginTop={10}
                                    onPress={SignUpUser}
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </Button>
                            </Form>

                            <Text fontSize={14} color="#555" textAlign="center" marginTop={12}>
                                Already have an account?{' '}
                                <Text fontWeight="700" color="#D946EF" onPress={() => router.push('/(auth)/signin')}>
                                    Sign In
                                </Text>
                            </Text>
                        </YStack>
                    </BlurView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
