import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

export default function Privacy() {
  const { colors } = useTheme();

  return (
    <SafeAreaView  style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View
       
      >
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Privacy
          </Text>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={32}
              color={colors.primaryText}
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Your privacy matters
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            This page explains how TL-On handles
            information while you use the app.
          </Text>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Information we collect
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              TL-On may store information required to
              provide authentication and your account
              experience, such as your name, email address,
              profile information, and authentication
              identifiers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Account information
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Account authentication is handled using
              Firebase Authentication. Profile information
              associated with your TL-On account may be
              stored in Firebase Firestore.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Conversations
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Your chat history is stored locally on your
              device so that your conversations can be
              displayed again inside TL-On.
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                  marginTop: 12,
                },
              ]}
            >
              When you send a message, the message and
              relevant conversation context may be sent to
              TL-On's backend to generate an AI response.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              AI processing
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Messages submitted for AI responses are
              processed through the services used by
              TL-On's backend. Do not submit passwords,
              payment information, private keys, or other
              highly sensitive information in your
              conversations.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Profile photos
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Your selected profile photo is stored locally
              on your device for use within the app. It is
              not required to use TL-On.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              App Lock
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              If App Lock is enabled, TL-On uses your
              device's biometric or device authentication
              system. TL-On does not receive or store your
              fingerprint or biometric data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Data retention
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Locally stored chat data may be removed by
              deleting the app or clearing its local data.
              TL-On may also remove older local chat
              records according to the app's local storage
              behavior.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Your control
            </Text>

            <Text
              style={[
                styles.body,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              You can control features such as App Lock,
              your profile information, and locally stored
              conversations through the app and your device
              settings.
            </Text>
          </View>

          <View
            style={[
              styles.notice,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.text}
            />

            <Text
              style={[
                styles.noticeText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Privacy practices may change as TL-On adds
              new features and services. Please review this
              page when important changes are made.
            </Text>
          </View>

          <Text
            style={[
              styles.updated,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Last updated: September 2026
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerRight: {
    width: 42,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 50,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
    paddingHorizontal: 12,
  },

  section: {
    marginTop: 32,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 10,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 16,
    marginTop: 34,
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 11,
  },

  updated: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 24,
  },
});