import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  navy: '#12172B',
  gold: '#C9A24B',
  bg: '#F6F7FB',
  card: '#FFFFFF',
  textPrimary: '#12172B',
  textMuted: '#9AA1AC',
  border: '#EEF0F4',
};

// onChoose('auto' | 'own') tells App.js which flow to run
export default function ChooseSetupScreen({ handleChooseSystem }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>GET STARTED</Text>
        <Text style={styles.title}>How do you want to{'\n'}organize your documents?</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={() => handleChooseSystem('auto')}
        >
          <View style={styles.optionIconWrap}>
            <Text style={styles.optionIcon}>✨</Text>
          </View>
          <Text style={styles.optionTitle}>Let the app create it</Text>
          <Text style={styles.optionDesc}>
            App banayega DocumentsVault/ folder with ready-made sub-folders
            (Identity, Banking, Education...). Aap sirf files daalna.
          </Text>
          <Text style={styles.optionArrow}>Choose this →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={() => handleChooseSystem('own')}
        >
          <View style={styles.optionIconWrap}>
            <Text style={styles.optionIcon}>🗂️</Text>
          </View>
          <Text style={styles.optionTitle}>Use my own folder</Text>
          <Text style={styles.optionDesc}>
            Aapne already koi folder + sub-folders bana rakhe hain apne phone
            me — app usi ko select karke padh lega, kaise bhi naam ho.
          </Text>
          <Text style={styles.optionArrow}>Choose this →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#12172B',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 3,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  eyebrow: { fontSize: 11, fontWeight: '700', color: COLORS.gold, letterSpacing: 1.5, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 31 },
  body: { padding: 20, gap: 16 },
  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    ...shadow,
  },
  optionIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionIcon: { fontSize: 22 },
  optionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  optionDesc: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, lineHeight: 19 },
  optionArrow: { fontSize: 13, fontWeight: '700', color: COLORS.gold, marginTop: 14 },
});
