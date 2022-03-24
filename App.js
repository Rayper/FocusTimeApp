import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/focusHistory';

import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

import { Timer } from './src/features/timer/Timer';

const STATUSES = {
  COMPLETED: 1,
  CANCELLED: 2,
};
export default function App() {
  // create state untuk subject
  const [focusSubject, setfocusSubject] = useState(null);
  // create state untuk history
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithState = (subject, status) => {
    // jadiin jadi tiap object punya status masing2 apakah fail atau sukses
    // create juga unique key nya 
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1), subject, status }]);
  };

  const onClear = () => {
    // kosongkan array focusHistory
    setFocusHistory([]);
  };

  // function untuk simpen focusHistory
  const saveFocusHistory = async () => {
    try {
      // focusHistory key-nya
      AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  // function untuk load focusHistory
  const loadFocusHistory = async () => {
    try {
      // create variable history
      const history = await AsyncStorage.getItem("focusHistory");
      // apa yang kita store ada length-nya
      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect ini tidak bergantung dari perubahan pad props maupun state
  useEffect(() => {
    loadFocusHistory();
  }, [])

  // untuk ada perubahan pada focusHistory
  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        //kalau focusSubject gak ada redirect ke halaman input focu, kalau ada tampilin focusSubject-nya
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUSES.COMPLETED);
            // ketika selesai interval dgn 1 focus object, maka balik lagi ke screen utama
            setfocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUSES.CANCELLED);
            setfocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Focus addSubject={setfocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS !== 'ios' ? spacing.md : spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.deepSkyBlue,
  },
});
