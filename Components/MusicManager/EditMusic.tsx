import { getAudioDuration } from '@/Features/hooks/getAudioDurationFormatted'
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage'
import { useAppDispatch } from '@/Features/hooks/redux'
import { removeMusic, updateMusic } from '@/redux/slice/music'
import { IMusic } from '@/types/music'
import { API_PATCH_MUSIC, API_REMOVE_MUSIC } from '@/utils/api/APIConstant'
import { deleteApi, patchApi } from '@/utils/endPoints/common'
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

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  initialData: IMusic
  setMusicNull: Dispatch<SetStateAction<IMusic | null>>
}

interface Doc {
  audio: DocumentPicker.DocumentPickerAsset,
  video: DocumentPicker.DocumentPickerAsset,
  image: DocumentPicker.DocumentPickerAsset,
  lyrics: DocumentPicker.DocumentPickerAsset
}

export default function EditMusic({ open, setOpen, initialData, setMusicNull }: Props) {
  const [audio, setAudio] = useState(initialData.audioPath)
  const [video, setVideo] = useState(initialData.videoPath)
  const [image, setImage] = useState(initialData.imagePath)
  const [title, setTitle] = useState(initialData.title)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<Partial<Doc>>({})
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();


  const pickFile = async (type: 'audio/*' | 'image/*' | 'video/*') => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      type,
    })
    if (!result.canceled && result.assets?.length > 0) {
      const file = result.assets[0]
      if (type === 'audio/*') {
        setAudio(file.uri)
        setFiles({ ...files, audio: file })
      }
      else if (type === 'video/*') {
        setVideo(file.uri)
        setFiles({ ...files, video: file })
      }
      else if (type === 'image/*') {
        setImage(file.uri)
        setFiles({ ...files, image: file })
      }
    }
  }


  const handleEdit = async () => {
    try {
      setLoading(true);
      if (!title || !audio) {
        alert("Title and Audio are required.");
        setLoading(false);
        return;
      }

      const [audioPath, videoPath, imagePath, duration] = await Promise.all([
        moveToPermanentStorage(files?.audio ? files.audio : null),
        moveToPermanentStorage(files?.video ? files.video : null),
        moveToPermanentStorage(files?.image ? files.image : null),
        getAudioDuration(files?.audio?.uri ?? audio),
      ]);

      const values: Record<string, string | number> = {
        title: title || (files?.audio?.name ?? '') || "Untitled",
        audioPath,
        duration: duration
      };

      if (videoPath) values.videoPath = videoPath;
      if (imagePath) values.imagePath = imagePath;

      const addedMusic = await patchApi({
        url: API_PATCH_MUSIC + `/${initialData._id}`,
        values
      });

      if (addedMusic) {
        dispatch(updateMusic(addedMusic as IMusic))
        queryClient.setQueryData(['recentlyPlayed'], (old: IMusic[] = []) =>
          old.map(item => item._id === initialData._id ? addedMusic : item)
        );

        queryClient.setQueryData(['topPlayed'], (old: IMusic[] = []) =>
          old.map(item => item._id === initialData._id ? addedMusic : item)
        );
      }
      ToastAndroid.show('Doen 👌❄️ ( My Music )', 50)
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.error("Failed to upload music", err);
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await deleteApi({
        url: API_REMOVE_MUSIC + `/${initialData._id}`,
      })
      dispatch(removeMusic(initialData._id))
      queryClient.setQueryData(['recentlyPlayed'], (old: IMusic[] = []) =>
        old.filter(item => item._id !== initialData._id)
      );

      queryClient.setQueryData(['topPlayed'], (old: IMusic[] = []) =>
        old.filter(item => item._id !== initialData._id)
      );
      setOpen(false);
    } catch (err) {
      console.error("Failed to remove music", err);
    }
  }

  const handleChange = (e: any) => {
    setMusicNull(null)
    setOpen(e)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleChange}
      modal
      dismissOnSnapToBottom
      snapPoints={[70]}
      position={0}
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.3)" fullscreen />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="#fff">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$4" padding="$2" backgroundColor="#fff" borderRadius="$4" shadowColor="#000" shadowOpacity={0.08} shadowRadius={10}>
            <Text fontSize={24} fontWeight="800" textAlign="center" color="#111">
              ✏️ Edit Music
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

            {/* Audio */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🎧 Audio File</Text>
              <XStack gap="$2" alignItems="center" flexWrap="wrap">
                <Button theme="blue" borderRadius="$3" onPress={() => pickFile('audio/*')}>Change</Button>
                {audio && (
                  <>
                    <Text fontSize={14} color="#888">{audio}</Text>
                    <Button size="$2" theme="red" borderRadius="$3" onPress={() => setAudio('')}>🗑️</Button>
                  </>
                )}
              </XStack>
            </YStack>

            {/* Video */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🎬 Background Video</Text>
              <XStack gap="$2" alignItems="center">
                <Button theme="blue" borderRadius="$3" onPress={() => pickFile('video/*')}>Change</Button>
                {video && (
                  <Button size="$2" theme="red" borderRadius="$3" onPress={() => setVideo('')}>🗑️</Button>
                )}
              </XStack>
              {video && (
                <Video
                  source={{ uri: video }}
                  useNativeControls
                  style={{
                    width: '100%',
                    height: 160,
                    marginTop: 10,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                />
              )}
            </YStack>

            {/* Cover Image */}
            <YStack gap="$2">
              <Text fontSize={16} fontWeight="700" color="#222">🖼️ Cover Image</Text>
              <XStack gap="$2" alignItems="center">
                <Button theme="blue" borderRadius="$3" onPress={() => pickFile('image/*')}>Change</Button>
                {image && (
                  <Button size="$2" theme="red" borderRadius="$3" onPress={() => setImage('')}>🗑️</Button>
                )}
              </XStack>
              {image && (
                <Image
                  source={{ uri: image }}
                  width="100%"
                  height={120}
                  borderRadius={10}
                  resizeMode="cover"
                  marginTop={10}
                />
              )}
            </YStack>

            {/* Actions */}
            <XStack justifyContent="space-between" marginTop="$4">
              <Button theme="gray" borderRadius="$3" onPress={() => setOpen(false)}>Cancel</Button>
              <Button theme="red" borderRadius="$3" onPress={handleRemove}>delete</Button>
              <Button theme="green" borderRadius="$3" disabled={isLoading} onPress={handleEdit}>{
                isLoading ? "Saving.." : "Save Changes"}</Button>
            </XStack>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
