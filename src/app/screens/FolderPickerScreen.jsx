import { useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { listFiles, openDocumentTree } from 'react-native-saf-x';


const COLORS = {
  navy: '#12172B',
  gold: '#C9A24B',
  bg: '#F6F7FB',
  card: '#FFFFFF',
  textPrimary: '#12172B',
  textMuted: '#9AA1AC',
  border: '#EEF0F4',
};

const STEPS = [
  {
    icon: '📁',
    title: 'Create a folder',
    desc: 'On your phone, make one main folder — e.g. "MyDocuments".',
  },
  {
    icon: '🗂️',
    title: 'Add sub-folders',
    desc: 'Inside it, make folders like Identity, Banking, Education — whatever names you like.',
  },
  {
    icon: '📥',
    title: 'Drop in your files',
    desc: 'Put your Aadhaar, PAN, marksheets, and other documents into the matching sub-folders.',
  },
  {
    icon: '✅',
    title: 'Select it below',
    desc: 'Tap the button and choose that same folder — the app will read it from then on.',
  },
];


export default function FolderPickerScreen() {
  const [status, setStatus] = useState('idle');
  

  // idle | picking | scanning | error
//   const [errorMsg, setErrorMsg] = useState('');

//   const handlePickFolder = async () => {
//     setErrorMsg('');
//     setStatus('picking');
//     try {
//       const uri = await pickExistingVaultFolder();
//       if (!uri) {
//         setStatus('idle'); // user cancelled the picker
//         return;
//       }
//       setStatus('scanning');
//       const categories = await scanVaultFolder();
//       onDone && onDone(categories);
//     } catch (err) {
//       setStatus('error');
//       setErrorMsg(err.message || 'Could not read that folder. Please try again.');
//     }
//   };


    const handlePickFolder =  async() =>{
    //   console.log('hello_vishwa')
      try{
        const docTree = await openDocumentTree(true)
        console.log(docTree)
        setStatus('scanning')
        scanDocumentFolder(docTree)

      }catch(e){
        console.log('App Error:',e)
      }
     

    }
    const scanDocumentFolder = async (rootUrl) => {
        try { 
            const readRootItems = ( await listFiles(rootUrl.uri) ) || [];
            const subFolder = readRootItems.filter((item)=> item.isDirectory);
            console.log(subFolder)

        }catch(error) {
            console.warn(`Folder Scaned Error : ${error}`)
        }
    }
    const isBusy = status === 'picking' || status === 'scanning';



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconBadgeText}>🔗</Text>
          </View>
          <Text style={styles.eyebrow}>CONNECT YOUR FOLDER</Text>
          <Text style={styles.title}>Use Your Own{'\n'}Folder Structure</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            No need to let the app create anything — organize your documents
            the way you like on your phone, and just point the app at it.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.body}>
          {STEPS.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumberWrap}>
                <Text style={styles.stepNumber}>{idx + 1}</Text>
              </View>
              <View style={styles.stepIconWrap}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}

          <View style={styles.noteCard}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Works on every Android version</Text>, including
              Android 12 and newer — the app only reads the folder you approve, nothing else.
            </Text>
          </View>

          {/* {errorMsg ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null} */}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.ctaButton,isBusy && styles.ctaButtonDisabled]}
        
          activeOpacity={0.9}
          onPress={handlePickFolder}
        //   handlePickFolder
        //   disabled={isBusy}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaButtonText}>Choose My Folder</Text>
          )}
          {/* <Text style={{color:'white'}}>choose my foder</Text> */}
        </TouchableOpacity>
        <Text style={styles.ctaFooter}>
          {status === 'scanning' ? 'Reading your documents…' : 'Opens your phone\'s folder picker'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#12172B',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(201,162,75,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,75,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconBadgeText: { fontSize: 22 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: COLORS.gold, letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', lineHeight: 33 },
  divider: { width: 46, height: 4, borderRadius: 2, backgroundColor: COLORS.gold, marginTop: 16, marginBottom: 16 },
  subtitle: { fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 20 },
  body: { paddingHorizontal: 20, marginTop: 20 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    ...shadow,
  },
  stepNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: { color: COLORS.gold, fontSize: 12, fontWeight: '800' },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepIcon: { fontSize: 20 },
  stepTitle: { fontSize: 14.5, fontWeight: '700', color: COLORS.textPrimary },
  stepDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 3, lineHeight: 17 },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FBF4E4',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,162,75,0.3)',
  },
  noteIcon: { fontSize: 16, marginRight: 10 },
  noteText: { flex: 1, fontSize: 12.5, color: '#7A6329', lineHeight: 18 },
  noteBold: { fontWeight: '800' },
  errorCard: {
    backgroundColor: '#FDEDEC',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F5C6C3',
  },
  errorText: { fontSize: 12.5, color: '#C0392B', lineHeight: 18 },
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
  },
  ctaButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaButtonDisabled: { opacity: 0.7 },
  ctaButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ctaFooter: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, marginTop: 10 },
});
