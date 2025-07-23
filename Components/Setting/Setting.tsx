import { auth } from '@/Configs/firebaseConfig';
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { updateUser } from '@/redux/slice/profile';
import { User } from '@/types/profile';
import { API_PATCH_PROFILE } from '@/utils/api/APIConstant';
import { patchApi } from '@/utils/endPoints/common';
import * as DocumentPicker from 'expo-document-picker';
import { signOut } from 'firebase/auth';
import { Cog, LogOut, UploadCloud } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
} from 'react-native';
import {
    Avatar,
    Button,
    Heading,
    Input,
    ScrollView,
    Text,
    View,
    XStack,
    YStack,
} from 'tamagui';

export default function SettingsScreen() {
    const user = useAppSelector((state) => state.profileSlice);
    const dispatch = useAppDispatch();

    const [coverImage, setCoverImage] = useState(user.cover);
    const [coverImageFile, setCoverImageFile] =
        useState<DocumentPicker.DocumentPickerAsset | null>(null);

    const [profileImage, setProfileImage] = useState(user.profile);
    const [profileImageFile, setProfileImageFile] =
        useState<DocumentPicker.DocumentPickerAsset | null>(null);

    const [username, setUsername] = useState(user.username);
    const [fullName, setFullName] = useState(user.fullName);

    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async (
        onSelect: (file: DocumentPicker.DocumentPickerAsset) => void,
        updatePreview: (url: string) => void
    ) => {
        const result = await DocumentPicker.getDocumentAsync({
            multiple: false,
            type: 'image/*',
        });

        if (!result.canceled && result.assets?.length > 0) {
            const file = result.assets[0];
            updatePreview(file.uri);
            onSelect(file);
        }
    };

    const handleEdit = async () => {
        try {
            setIsLoading(true);

            const [profile, cover] = await Promise.all([
                moveToPermanentStorage(profileImageFile),
                moveToPermanentStorage(coverImageFile),
            ]);

            const profileUrl = profile || profileImage;
            const coverUrl = cover || coverImage;

            const updatedProfile = await patchApi({
                url: API_PATCH_PROFILE,
                values: {
                    profile: profileUrl,
                    cover: coverUrl,
                    username,
                    fullName,
                },
            });

            if (updatedProfile) {
                dispatch(updateUser(updatedProfile as User));
                ToastAndroid.show('Profile updated 🎉', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Something went wrong 😓', ToastAndroid.SHORT);
            }
        } catch (err) {
            console.error(err);
            ToastAndroid.show('Error updating profile ❌', ToastAndroid.LONG);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            ToastAndroid.show('Logged out successfully 👋', ToastAndroid.SHORT);
        } catch (err) {
            console.error(err);
            ToastAndroid.show('Logout failed ❌', ToastAndroid.SHORT);
        }
    };

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
                <XStack alignItems="center" gap="$2" paddingBottom="$4">
                    <Cog size={26} color="#444" />
                    <Heading fontWeight="700" size="$7" color="rgba(10, 0, 73, 1)">
                        Settings
                    </Heading>
                </XStack>

                {/* Cover Image */}
                <View
                    width="100%"
                    height={160}
                    borderRadius={20}
                    overflow="hidden"
                    marginBottom={16}
                >
                    <Image
                        source={
                            coverImageFile?.uri
                                ? { uri: coverImageFile.uri }
                                : coverImage
                                    ? { uri: coverImage }
                                    : require('@/assets/images/homepage/hero.jpg')
                        }
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
                        onPress={() =>
                            pickImage(setCoverImageFile, (url) => setCoverImage(url))
                        }
                    >
                        Change Cover
                    </Button>
                </View>

                {/* Profile Image */}
                <YStack alignItems="center" marginBottom={32}>
                    <Avatar circular size="$14">
                        <Avatar.Image
                            src={
                                profileImageFile?.uri ||
                                profileImage ||
                                require('@/assets/images/default-pic.jpg')
                            }
                        />
                        <Avatar.Fallback backgroundColor="#ccc" />
                    </Avatar>
                    <Button
                        icon={UploadCloud}
                        size="$2"
                        theme="blue"
                        marginTop={10}
                        onPress={() =>
                            pickImage(setProfileImageFile, (url) => setProfileImage(url))
                        }
                    >
                        Change Profile
                    </Button>
                </YStack>

                {/* Name & Username */}
                <YStack gap={16} marginBottom={32}>
                    <Text fontWeight="700" fontSize={20}>
                        {fullName || 'Star User'}
                    </Text>
                    <Input
                        placeholder="Enter your full name"
                        defaultValue={fullName}
                        onChangeText={setFullName}
                    />

                    <Text fontWeight="700" fontSize={20}>
                        @{username || 'superstar'}
                    </Text>
                    <Input
                        placeholder="Enter username"
                        defaultValue={username}
                        onChangeText={setUsername}
                        value={username}
                    />

                    <Button
                        theme="green"
                        size="$4"
                        marginTop="$3"
                        onPress={handleEdit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </YStack>

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
