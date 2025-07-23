import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { setMusicById } from '@/redux/slice/playlist';
import { IMusic } from '@/types/music';
import { MusicStats, User } from '@/types/profile';
import { Stats } from '@/types/userStats';
import { API_GET_PROFILE_DATA } from '@/utils/api/APIConstant';
import { getApi } from '@/utils/endPoints/common';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck,
  Crown,
  Flame,
  Gem,
  Headphones,
  Medal,
  PauseCircle,
  PlayCircle,
  Trophy,
  User2
} from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import { Heading, View, XStack } from 'tamagui';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = React.useState<User | null>(null);
  const [userStats, setUserStats] = React.useState<Stats | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = React.useState<IMusic[] | null>(null);
  const [musicStats, setMusicStats] = React.useState<MusicStats | null>(null);
  const currentplaylist = useAppSelector(state => state.playList);
  const { state } = useAudioPro();

  const fetchUserProfile = async () => {
    try {
      const Result = await getApi<{ user: User, userStats: any, music: MusicStats, rPlay: IMusic[] }>({
        url: API_GET_PROFILE_DATA
      })
      if (Result) {
        setUserProfile(Result.user)
        setUserStats(Result.userStats)
        setRecentlyPlayed(Result.rPlay)
        setMusicStats(Result.music)
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handlePlay = (id: string) => {
    dispatch(setMusicById(id));
    if (state === "PLAYING") {
      AudioPro.pause();
    } else {
      AudioPro.resume();
    }
  }

  const isplaying = (id: string): boolean => {
    return !(currentplaylist.current?._id === id && state === "PLAYING");
  }

  React.useEffect(() => {
    fetchUserProfile();
  }, [])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <XStack alignItems="center" gap="$2">
          <User2 size={26} color="#444" />
          <Heading fontWeight="700" size="$7" color="rgba(10, 0, 73, 1)">
            Settings
          </Heading>
        </XStack>
      </View>

      {/* User Profile Section */}
      <View marginLeft={20}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                userProfile?.profile
                  ? { uri: userProfile.profile }
                  : require('@/assets/images/default-pic.jpg')
              }
              style={styles.avatar}
            />
            <View style={styles.premiumBadge}>
              <Crown size={16} color="#FFFFFF" fill="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userProfile?.fullName || 'user'}</Text>
            <Text style={styles.userHandle}>@{userProfile?.username || 'super_star'}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{musicStats?.totalMusic}</Text>
                <Text style={styles.statLabel}>Music</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{musicStats?.totalLiked}</Text>
                <Text style={styles.statLabel}>Music Like</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Rank Card */}
      <LinearGradient
        colors={['#8E2DE2', '#4A00E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rankCard}
      >
        <View style={styles.rankContent}>
          <View style={styles.rankHeader}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.rankTitle}>Your Rank</Text>
          </View>
          <View style={styles.rankMain}>
            <Text style={styles.glowRank}>{userStats?.Rank.title}</Text>
            <Text style={styles.glowSubText}>{userStats?.Rank.description}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progress to next rank</Text>
            <View style={styles.progressBackground}>
              <LinearGradient
                colors={['#FF00FF', '#8E2DE2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${userStats?.nextRankProgress || 0}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(userStats?.nextRankProgress || 0)}% Complete</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Listening Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Headphones size={24} color="#8E2DE2" />
          <Text style={styles.statsTitle}>Listening Stats</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{Math.floor((userStats?.watchTime || 0) / 60)}</Text>
            <Text style={styles.statBoxLabel}>Minutes Wathtime</Text>
          </View>
          <View style={styles.streakContent}>
            <Flame size={24} color="#FF6B6B" />
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>{userStats?.streak} days</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
        </View>
        <View style={styles.achievementRow}>
          <View style={styles.achievementItem}>
            <View style={[styles.achievementIcon, { backgroundColor: 'rgba(142, 45, 226, 0.1)' }]}>
              <Gem size={24} color="#8E2DE2" />
            </View>
            <Text style={styles.achievementLabel}>Gem Hunter</Text>
          </View>
          <View style={styles.achievementItem}>
            <View style={[styles.achievementIcon, { backgroundColor: 'rgba(76, 0, 224, 0.1)' }]}>
              <BadgeCheck size={24} color="#4A00E0" />
            </View>
            <Text style={styles.achievementLabel}>Verified</Text>
          </View>
          <View style={styles.achievementItem}>
            <View style={[styles.achievementIcon, { backgroundColor: 'rgba(196, 113, 245, 0.1)' }]}>
              <Medal size={24} color="#C471F5" />
            </View>
            <Text style={styles.achievementLabel}>Champion</Text>
          </View>
        </View>
      </View>

      {/* Recently Played */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
        </View>
        <View style={styles.tracksContainer}>
          {recentlyPlayed && recentlyPlayed.map((item, index) => (
            <View key={index} style={styles.trackItem}>
              <Image src={item.imagePath} height={45} width={45} borderRadius={4} />
              <View style={styles.trackInfo} marginLeft={10}>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackArtist}>Played: {item.played} times</Text>
              </View>
              <Text style={styles.trackTime}>{FormattedAudio(item.duration)}</Text>
              <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(item._id)}>
                {
                  isplaying(item._id) ? <PlayCircle size={24} color="#8E2DE2" /> :
                    <PauseCircle size={24} color="#8E2DE2" />
                }
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Footer Space */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8E2DE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: -10
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  rankCard: {
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#8E2DE2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  rankContent: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    margin: 2,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8E2DE2',
    marginLeft: 10,
  },
  rankMain: {
    alignItems: 'center',
    marginVertical: 10,
  },
  glowRank: {
    fontSize: 64,
    fontWeight: '900',
    color: '#8E2DE2',
  },
  glowSubText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A00E0',
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E2DE2',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginLeft: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#F9F9FB',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statBoxNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 5,
  },
  statBoxLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888888',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: 15,
    padding: 15,
    width: '48%',
  },
  streakLabel: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 2,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginLeft: 10,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E2DE2',
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    width: '30%',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  tracksContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trackArt: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#888888',
  },
  trackTime: {
    fontSize: 14,
    color: '#888888',
    marginRight: 15,
  },
  playButton: {
    padding: 8,
  },
  footer: {
    height: 30,
  },
});