import { IMusic } from "@/types/music";
import { AudioPro, AudioProEventType, AudioProTrack } from "react-native-audio-pro";

// Loop flag
let musicLoop: boolean = false;
let lastPlayedId: string | null = null;

export const setMusicLoop = (e: boolean) => {
    musicLoop = e;
};

// Registerable Callbacks
let onNextTrack: (() => void) | null = null;
let onPrevTrack: (() => void) | null = null;

export const registerAudioCallbacks = ({
    onNext,
    onPrev,
}: {
    onNext: () => void;
    onPrev: () => void;
}) => {
    onNextTrack = onNext;
    onPrevTrack = onPrev;
};

export const setMusic = (music: IMusic, autoPlay: boolean) => {
    if (!music?._id || !music?.audioPath) {
        console.warn("Invalid music object", music);
        return;
    }

    if (lastPlayedId === music._id) {
        return; 
    }

    lastPlayedId = music._id;

    try {
        const musicObj: AudioProTrack = {
            id: music._id,
            url: music.audioPath,
            title: music.title,
            artwork: music.imagePath || require('@/assets/images/default-m.jpeg'),
            artist: 'Artist -😁',
        };
        AudioPro.play(musicObj, { autoPlay });
    } catch (err) {
        console.log(err);
    }
};

AudioPro.addEventListener((event) => {
    switch (event.type) {
        case AudioProEventType.REMOTE_NEXT:
            onNextTrack?.();
            break;

        case AudioProEventType.REMOTE_PREV:
            onPrevTrack?.();
            break;

        case AudioProEventType.TRACK_ENDED:
            if (musicLoop) {
                AudioPro.resume();
            } else { onNextTrack?.(); }
            break;

    }
});
