import React, { useState } from 'react';
import { View, StyleSheet, Text, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors } from '../../utils/colors';
import { fontSizes, spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';
// import { useKeepAwake } from 'expo-keep-awake';

// set defaulu time ke 1 menit supaya pas interval selesai bisa reset mulai dari 1 menit lagi
const DEFAULT_TIME = 0.1;
// isPaused={!isStarted} -> jika isStartednya false maka isPausednya true
export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  // supaya tidak sleep saat apps idle
  // useKeepAwake();
  // create state untuk rubah menit sesuai yang dipilih
  // 0.1 -> 6 detik
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  // create state untuk button start
  const [isStarted, setIsStarted] = useState(false);
  // create state untuk progress Bar, mulai dari full bar
  const [progress, setProgress] = useState(1);

  const onProgress = (progress) => {
    // setProgress jadi value yang di assign di onProgress pada Countdown
    setProgress(progress);
  };

  const vibrate = () => {
    if (Platform.OS === 'android') {
      // create interval untuk vibrate untuk setiap detik
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      // setelah 10 detik akan selesai vibrate
      Vibration.vibrate(10000);
    }
  };

  const onEnd = () => {
    vibrate();
    // set ke defaut time ketika interval telah selesai
    setMinutes(DEFAULT_TIME);
    // set progress bar nya jadi penuh lagi
    setProgress(1);
    // setelah interval selesai, munculin button start lagi
    setIsStarted(false);
    // balikin ke halaman awal untuk input focus object yang lain
    onTimerEnd();
  };

  const changeTime = (min) => {
    // set ke menit yang baru
    setMinutes(min);
    // set progress bar nya jadi penuh lagi
    setProgress(1);
    // dipause setelah ganti menit
    setIsStarted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={styles.focusTask}>
        <Text style={styles.title}>Focusing on : </Text>
        <Text style={styles.task}>{focusSubject} </Text>
      </View>
      <View style={styles.progressView}>
        <ProgressBar progress={progress} style={styles.progressBar} />
        <View style={styles.buttonWrapper}>
          <Timing onChangeTime={changeTime} />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        {isStarted ? (
          // jika isStarted true maka munculin pause
          <RoundedButton title="Pause" onPress={() => setIsStarted(false)} />
        ) : (
          <RoundedButton title="Start" onPress={() => setIsStarted(true)} />
        )}
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="Clear" size={80} onPress={() => clearSubject()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    fontSize: fontSizes.lg,
  },
  task: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSizes.xl,
    textAlign: 'center',
  },
  focusTask: {
    paddingTop: spacing.xxl,
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressView: {
    paddingTop: spacing.sm,
  },
  progressBar: {
    color: colors.lightBlue,
    height: spacing.sm,
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 45,
  },
});
