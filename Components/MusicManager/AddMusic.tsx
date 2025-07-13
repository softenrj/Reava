import { getAudioDuration, } from '@/Features/hooks/getAudioDurationFormatted'
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage'
import { useAppDispatch } from '@/Features/hooks/redux'
import { addMusic } from '@/redux/slice/music'
import { IMusic } from '@/types/music'
import { API_ADD_NEW_MUSIC } from '@/utils/api/APIConstant'
import { postApi } from '@/utils/endPoints/common'
import { useQueryClient } from '@tanstack/react-query'
import { Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { ToastAndroid } from 'react-native'
import {
  Button,
  Image,
  ScrollView,
  Sheet,
  Text,
  TextArea,
  XStack,
  YStack
} from 'tamagui'

export default function AddMusic({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [audio, setAudio] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [image, setImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [title, setTitle] = useState('');
  const [isLoading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const pickFile = async (type: "audio/*" | "image/*" | "video/*") => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      type
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0] as DocumentPicker.DocumentPickerAsset;
      if (type === "audio/*") {
        setAudio(file);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      else if (type === "image/*") setImage(file);
      else if (type === "video/*") setVideo(file);
    }
  }


  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!audio) return;

      const [audioPath, videoPath, imagePath, duration] = await Promise.all([
        moveToPermanentStorage(audio),
        moveToPermanentStorage(video),
        moveToPermanentStorage(image),
        getAudioDuration(audio.uri)
      ]);

      const values: Record<string, string | number> = {
        title: title || audio.name || "Untitled",
        audioPath,
        duration: duration
      };

      if (videoPath) values.videoPath = videoPath;
      if (imagePath) values.imagePath = imagePath;

      const addedMusic = await postApi({
        url: API_ADD_NEW_MUSIC,
        values
      });

      if (addedMusic) {
        dispatch(addMusic(addedMusic as IMusic))
        queryClient.setQueryData(["topPlayed"], (old: IMusic[] = []) => {
          return [...old, addedMusic as IMusic]
        } )
      }

      ToastAndroid.show('Music is Added 🍁', 50)
      setAudio(null);
      setImage(null);
      setVideo(null);
      setTitle('');
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.error("Failed to upload music", err);
      setLoading(false);
    }
  };


  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      modal
      dismissOnSnapToBottom
      snapPoints={[70]}
      position={0}
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.3)" fullscreen />
      <Sheet.Handle />
      <Sheet.Frame padding="$2" backgroundColor="#fff">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$4" padding="$4" backgroundColor="#fff" borderRadius="$4" shadowColor="#000" shadowOpacity={0.1} shadowRadius={10}>
            <Text fontSize={24} fontWeight="800" textAlign="center" color="#111">
              🎵 Add New Music
            </Text>

            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">📝 Title</Text>
              <TextArea
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
                backgroundColor="#f9f9f9"
                borderColor="#ccc"
                borderWidth={1}
                borderRadius={10}
                padding="$3"
                color="#111"
              />
            </YStack>

            {/* Audio Picker */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🎧 Audio File</Text>
              <Button theme="blue" borderRadius="$3" onPress={() => pickFile('audio/*')}>
                Pick Audio
              </Button>
              {audio && (
                <Text fontSize={14} color="#888" marginLeft="$1">
                  {audio.name}
                </Text>
              )}
            </YStack>

            {/* Background Video Picker */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🎬 Background Video</Text>
              <Button theme="blue" borderRadius="$3" onPress={() => pickFile('video/*')}>
                Pick Video
              </Button>
              {video?.uri && (
                <Video
                  source={{ uri: video.uri }}
                  useNativeControls
                  style={{ width: '100%', height: 180, marginTop: 10, borderRadius: 10 }}
                />
              )}
            </YStack>

            {/* Cover Image Picker */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🖼️ Cover Image</Text>
              <Button theme="blue" borderRadius="$3" onPress={() => pickFile('image/*')}>
                Pick Image
              </Button>
              {image?.uri && (
                <Image
                  source={{ uri: image.uri }}
                  width="100%"
                  height={120}
                  borderRadius={10}
                  resizeMode="cover"
                  marginTop={10}
                />
              )}
            </YStack>

            {/* Action Buttons */}
            <XStack justifyContent="space-between" marginTop="$4" space="$2">
              <Button theme="gray" borderRadius="$3" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button theme="green" borderRadius="$3" disabled={isLoading} onPress={handleUpload}>
                {
                  !isLoading ? "Upload" : "Uploading.."
                }
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
