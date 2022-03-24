import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { fontSizes, spacing } from '../utils/sizes';

// convert menit ke milisecond
// 1 menit = 6000 ms
const minutesToMillis = (min) => min * 1000 * 60;
// buat format waktunya supaya 2 digit
// jika kurang dari 10, tambahin 0 di depanya
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 0.1, isPaused, onProgress, onEnd }) => {
  // mirip seperti state
  const interval = React.useRef(null);

  const [milis, setMilis] = useState(null);

  const countDown = () => {
    // current time
    setMilis((time) => {
      // kalau waktunya habis
      if (time === 0) {
        // clear intervalnya kalau sudah selesai
        clearInterval(interval.current);
        return time;
      }
      // dikurangin per 1 detik / 1000 milisecond
      const timeLeft = time - 1000;
      // kasih tau sisa waktu
      // kasih tau untuk progressBar
      // pindahin function dibawah ini ke useEffect
      // onProgress(timeLeft / minutesToMillis(minutes));
      return timeLeft;
    });
  };

  // dijalankan ketika minutes berubah
  useEffect(() => {
    setMilis(minutesToMillis(minutes));
  }, [minutes]);

  // create useEffect untuk perubahan pada milis supaya pada saat jalanin setMilis di const countDown tidak merubah valu dari external component yang dapat menyebabkan bug
  useEffect(() => {
    // panggil progress-nya dulu
    onProgress(milis / minutesToMillis(minutes));
    // ketika milis 0, panggil function onEnd()
    if (milis === 0) {
      onEnd();
    }
  }, [milis]);

  useEffect(() => {
    // jika tidak sedang pause, tidak lakukan apa2 dan jalankan code dibawah2nya
    if (isPaused) {
      // clean intervalnya ketika pause
      if (interval.current) clearInterval(interval.current);
      return;
    }
    // interval akan dijalankan per 1 detik
    // setInterval(handler-nya, timeout-nya mau per milisecond)
    interval.current = setInterval(countDown, 1000);

    // jika udah selesai akan clear untuk interval
    return () => clearInterval(interval.current);
    // [isPaused] => useEffect akan dijalankan ketika kita tidak sedang melakukan pause
  }, [isPaused]);

  // untuk nyari sisa berapa menit dimodulo 60
  const minute = Math.floor(milis / 1000 / 60) % 60;
  // gadibagi 60 lagi karena dia detik
  const seconds = Math.floor(milis / 1000) % 60;

  return (
    <Text style={styles.text}>
      {formatTime(minute)} minutes and {formatTime(seconds)} seconds remaining
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
