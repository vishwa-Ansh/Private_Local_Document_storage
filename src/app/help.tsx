import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

export default function Help() {
  const { colors } = useTheme();

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I start a conversation?",
      answer:
        "Open the home screen, type your question in the message box, and tap the send button. TL-On will generate an AI response.",
    },
    {
      question: "Where can I find my previous chats?",
      answer:
        "Your previous conversations are available in the History section. Chat history is stored locally on your device.",
    },
    {
      question: "Can I change the AI model?",
      answer:
        "Yes. Open Model Selection from the app and choose an available model for your conversation.",
    },
    {
      question: "How does App Lock work?",
      answer:
        "When App Lock is enabled, TL-On uses your device's biometric authentication or device passcode to unlock the app.",
    },
    {
      question: "What should I do if AI is not responding?",
      answer:
        "Check your internet connection and try sending the message again. If the problem continues, use the support option below.",
    },
    {
      question: "Why can't I sign in?",
      answer:
        "Check your internet connection and make sure your login details are correct. If the issue continues, contact support.",
    },
    {
      question: "How can I report a problem?",
      answer:
        "Use the Contact Support option below and describe the problem, including what you were doing when it happened.",
    },
  ];

  const contactSupport = async () => {
    try {
      await Linking.openURL(
        "mailto:support@tl-on.app?subject=TL-On Support"
      );
    } catch {}
  };

  const sendFeedback = async () => {
    try {
      await Linking.openURL(
        "mailto:support@tl-on.app?subject=TL-On Feedback"
      );
    } catch {}
  };

  return (
    <SafeAreaView style={[
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
            Help & Support
          </Text>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="help"
              size={31}
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
            How can we help?
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Find answers to common questions or get in
            touch with TL-On support.
          </Text>

          <View style={styles.actionSection}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={contactSupport}
              style={[
                styles.actionCard,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor:
                      colors.primaryText,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color={colors.primary}
                />
              </View>

              <View style={styles.actionContent}>
                <Text
                  style={[
                    styles.actionTitle,
                    {
                      color: colors.primaryText,
                    },
                  ]}
                >
                  Contact Support
                </Text>

                <Text
                  style={[
                    styles.actionDescription,
                    {
                      color: colors.primaryText,
                    },
                  ]}
                >
                  Get help with an issue
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={colors.primaryText}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={sendFeedback}
              style={[
                styles.actionCard,
                styles.secondaryAction,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={21}
                  color={colors.text}
                />
              </View>

              <View style={styles.actionContent}>
                <Text
                  style={[
                    styles.actionTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Send Feedback
                </Text>

                <Text
                  style={[
                    styles.actionDescription,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Tell us what you think
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
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
              Frequently Asked Questions
            </Text>

            <View
              style={[
                styles.faqContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <View key={index}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setOpenFaq(
                          isOpen ? null : index
                        )
                      }
                      style={[
                        styles.faqRow,
                        index !== faqs.length - 1 && {
                          borderBottomColor:
                            colors.border,
                          borderBottomWidth:
                            StyleSheet.hairlineWidth,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.question,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {faq.question}
                      </Text>

                      <Ionicons
                        name={
                          isOpen
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={18}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>

                    {isOpen && (
                      <View
                        style={[
                          styles.answerContainer,
                          {
                            borderBottomColor:
                              colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.answer,
                            {
                              color:
                                colors.textSecondary,
                            },
                          ]}
                        >
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
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
              Troubleshooting
            </Text>

            <TroubleRow
              icon="wifi-outline"
              title="Check your connection"
              description="Make sure your device has a stable internet connection."
              colors={colors}
            />

            <TroubleRow
              icon="refresh-outline"
              title="Try again"
              description="Close and reopen the app if a feature is not responding."
              colors={colors}
            />

            <TroubleRow
              icon="phone-portrait-outline"
              title="Restart the app"
              description="Restarting TL-On can resolve temporary app issues."
              colors={colors}
            />
          </View>

          <View
            style={[
              styles.footerCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={21}
              color={colors.text}
            />

            <Text
              style={[
                styles.footerText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              We're continuously improving TL-On. Your
              feedback helps make the app better.
            </Text>
          </View>

          <Text
            style={[
              styles.version,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            TL-On · Version 1.0.0
          </Text>
        </ScrollView>
      </View>
    </ SafeAreaView>
  );
}

function TroubleRow({
  icon,
  title,
  description,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  colors: any;
}) {
  return (
    <View style={styles.troubleRow}>
      <View
        style={[
          styles.troubleIcon,
          {
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.text}
        />
      </View>

      <View style={styles.troubleContent}>
        <Text
          style={[
            styles.troubleTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.troubleDescription,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
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
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 50,
  },

  heroIcon: {
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

  actionSection: {
    marginTop: 30,
  },

  actionCard: {
    minHeight: 70,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  secondaryAction: {
    borderWidth: StyleSheet.hairlineWidth,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  actionContent: {
    flex: 1,
    marginLeft: 13,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  actionDescription: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },

  section: {
    marginTop: 34,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  faqContainer: {
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },

  faqRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    paddingRight: 15,
  },

  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  answer: {
    fontSize: 13,
    lineHeight: 20,
  },

  troubleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  troubleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  troubleContent: {
    flex: 1,
    marginLeft: 14,
  },

  troubleTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  troubleDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3,
  },

  footerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 16,
    marginTop: 25,
  },

  footerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 11,
  },

  version: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
  },
});