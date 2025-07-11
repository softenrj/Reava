import { auth } from '@/Configs/firebaseConfig';
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { updateUser } from '@/redux/slice/profile';
import { User } from '@/types/profile';
import { API_PATCH_PROFILE } from '@/utils/api/APIConstant';
import { patchApi } from '@/utils/endPoints/common';
import * as DocumentPicker from 'expo-document-picker';
import { signOut } from 'firebase/auth';
import { LogOut, UploadCloud } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import {
    Avatar,
    Button,
    Heading,
    Input,
    ScrollView,
    Text,
    View,
    YStack,
} from 'tamagui';

export default function SettingsScreen() {
    const user = useAppSelector(state => state.profileSlice)
    const [coverImage, setCoverImage] = useState(user.cover);
    const [coverImagefile, setCoverImagefile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [profileImage, setProfileImage] = useState(user.profile);
    const [profileImagefile, setProfileImagefile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [username, setUsername] = useState(user.username);
    const [fullName, setFullName] = useState(user.fullName);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch()

    const pickImage = async (onSelect: (file: DocumentPicker.DocumentPickerAsset) => void) => {
        const result = await DocumentPicker.getDocumentAsync({
            multiple: false,
            type: 'image/*'
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            onSelect(result.assets[0] as DocumentPicker.DocumentPickerAsset);
        }
    };

    const handleEdit = async () => {
        try {
            setIsLoading(true);

            const [profile, cover] = await Promise.all([
                moveToPermanentStorage(profileImagefile),
                moveToPermanentStorage(coverImagefile),
            ])

            const profileUrl = profile || profileImage;
            const coverUrl = cover || coverImage;
            const updatedProfile = await patchApi({
                url: API_PATCH_PROFILE,
                values: {
                    profile: profileUrl,
                    cover: coverUrl,
                    username,
                    fullName
                }
            })
            setIsLoading(false);
            if (updatedProfile) {
                dispatch(updateUser(updatedProfile as User))
                ToastAndroid.show('Doen 👌❄️', 50)
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            ToastAndroid.show('Logged out successfully!', 50);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}
        >
            <ScrollView
                backgroundColor="white"
                paddingHorizontal={16}
                paddingVertical={20}
                showsVerticalScrollIndicator={false}
            >
                <Heading fontWeight={'800'} paddingBottom={4}>Setting</Heading>
                {/* Cover Image */}
                <View
                    width="100%"
                    height={160}
                    borderRadius={20}
                    overflow="hidden"
                    marginBottom={16}
                >
                    <Image
                        source={{ uri: coverImagefile?.uri || coverImage }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                    <Button
                        position="absolute"
                        bottom={10}
                        right={10}
                        icon={UploadCloud}
                        size="$2"
                        theme="blue"
                        onPress={() => pickImage(setCoverImagefile)}
                    >
                        Change Cover
                    </Button>
                </View>

                {/* Profile Image */}
                <YStack alignItems="center" marginBottom={32}>
                    <Avatar circular size="$14">
                        <Avatar.Image src={profileImagefile?.uri || profileImage} />
                        <Avatar.Fallback backgroundColor="#ccc" />
                    </Avatar>
                    <Button
                        icon={UploadCloud}
                        size="$2"
                        theme="blue"
                        marginTop={10}
                        onPress={() => pickImage(setProfileImagefile)}
                    >
                        Change Profile
                    </Button>
                </YStack>

                {/* Name & Username */}
                <YStack gap={16} marginBottom={32}>
                    <Text fontWeight="700" fontSize={20}>{fullName || "star user"}</Text>
                    <Input placeholder="Enter your name" defaultValue="star user" onChangeText={setFullName} />

                    <Text fontWeight="700" fontSize={20}>@{username || 'super star'}</Text>
                    <Input placeholder="Enter username" defaultValue="super star" onChangeText={setUsername} value={username} />
                    <Button theme="green" size="$4" marginTop={'$3'} onPress={handleEdit} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Save Changes'}
                    </Button>
                </YStack>


                {/* <YStack marginBottom={40} gap={16}>
                <Text fontWeight="700" fontSize={20}>Premium Access</Text>
                <Text fontSize={14} color="#666">
                    Add your Google API Key below to unlock premium features like advanced AI tools.
                </Text>
                <Input placeholder="Paste Google API key" secureTextEntry />
                
            </YStack> */}

                {/* Logout */}
                <View alignItems="center" marginTop={40} marginBottom={30}>
                    <Button
                        icon={LogOut}
                        theme="red"
                        size="$4"
                        width="80%"
                        borderRadius={24}
                        onPress={handleSignOut}
                    >
                        Log Out
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
