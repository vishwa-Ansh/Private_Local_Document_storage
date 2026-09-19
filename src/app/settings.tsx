import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

type IconName = keyof typeof Ionicons.glyphMap;

const APP_LOCK_KEY = "@trilok_on_app_lock";

export default function SettingsPage() {
  const { mode, setTheme, colors, theme } = useTheme();

  const [enterToSend, setEnterToSend] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [timestamps, setTimestamps] = useState(false);
  const [streaming, setStreaming] = useState(true);
  const [pushNotifications, setPushNotifications] =
    useState(true);
  const [responseCompleted, setResponseCompleted] =
    useState(true);
  const [productUpdates, setProductUpdates] =
    useState(false);

  const [appLock, setAppLock] = useState(false);
  const [biometricAvailable, setBiometricAvailable] =
    useState(false);
  const [appLockLoading, setAppLockLoading] =
    useState(true);

  const selectedTheme =
    mode === "system"
      ? "System"
      : mode === "light"
      ? "Light"
      : "Dark";

  useEffect(() => {
    const loadAppLock = async () => {
      try {
        const savedLock =
          await AsyncStorage.getItem(APP_LOCK_KEY);

        setAppLock(savedLock === "true");

        const hasHardware =
          await LocalAuthentication.hasHardwareAsync();

        const isEnrolled =
          await LocalAuthentication.isEnrolledAsync();

        setBiometricAvailable(
          hasHardware && isEnrolled
        );
      } catch (error) {
        console.error(
          "APP LOCK LOAD ERROR:",
          error
        );
      } finally {
        setAppLockLoading(false);
      }
    };

    loadAppLock();
  }, []);

  const toggleAppLock = async () => {
    if (appLockLoading) {
      return;
    }

    if (!biometricAvailable) {
      Alert.alert(
        "Biometric authentication unavailable",
        "Please set up fingerprint, Face ID, or another supported device biometric first."
      );

      return;
    }

    if (appLock) {
      Alert.alert(
        "Disable App Lock",
        "Are you sure you want to disable app lock?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Disable",
            style: "destructive",
            onPress: async () => {
              try {
                await AsyncStorage.setItem(
                  APP_LOCK_KEY,
                  "false"
                );

                setAppLock(false);
              } catch (error) {
                console.error(
                  "DISABLE APP LOCK ERROR:",
                  error
                );
              }
            },
          },
        ]
      );

      return;
    }

    try {
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Enable TL-On App Lock",
          fallbackLabel: "Use device passcode",
          disableDeviceFallback: false,
        });

      if (!result.success) {
        return;
      }

      await AsyncStorage.setItem(
        APP_LOCK_KEY,
        "true"
      );

      setAppLock(true);
    } catch (error: any) {
      console.error(
        "ENABLE APP LOCK ERROR:",
        error
      );

      Alert.alert(
        "Unable to enable App Lock",
        error?.message ||
          "Biometric authentication failed."
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Settings
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Customize your TL-On experience
            </Text>
          </View>

          <View
            style={[
              styles.settingsIcon,
              {
                backgroundColor:
                  colors.surfaceSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color={colors.text}
            />
          </View>
        </View>

        <Section
          title="Account"
          colors={colors}
        >
          <SettingRow
            colors={colors}
            icon="person-outline"
            title="Profile"
            subtitle="Manage your profile"
            onPress={() =>
              router.push("/profile")
            }
          />

          <SettingRow
            colors={colors}
            icon="mail-outline"
            title="Email"
            subtitle="Manage your account email"
            onPress={() => {}}
          />

          <SettingRow
            colors={colors}
            icon="card-outline"
            title="Subscription"
            subtitle="Manage your current plan"
            badge="Free"
            onPress={() =>
              router.push("/usage")
            }
          />

          <SettingRow
            colors={colors}
            icon="bar-chart-outline"
            title="Usage"
            subtitle="View your usage and limits"
            onPress={() =>
              router.push("/usage")
            }
          />
        </Section>

        <Section
          title="Security"
          colors={colors}
        >
          <View style={styles.settingRow}>
            <View
              style={[
                styles.settingIcon,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="finger-print-outline"
                size={21}
                color={colors.text}
              />
            </View>

            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                App Lock
              </Text>

              <Text
                style={[
                  styles.rowSubtitle,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                Lock TL-On with fingerprint,
                Face ID, or device passcode
              </Text>

              {!biometricAvailable &&
                !appLockLoading && (
                  <Text
                    style={[
                      styles.securityHint,
                      {
                        color: colors.textMuted,
                      },
                    ]}
                  >
                    Set up biometrics on your
                    device first
                  </Text>
                )}
            </View>

            <Switch
              value={appLock}
              onValueChange={toggleAppLock}
              disabled={appLockLoading}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                theme === "dark"
                  ? "#111111"
                  : "#FFFFFF"
              }
              ios_backgroundColor={
                colors.border
              }
            />
          </View>
        </Section>

        <Section
          title="Appearance"
          colors={colors}
        >
          <View
            style={[
              styles.appearanceCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.rowTop}>
              <View
                style={[
                  styles.settingIcon,
                  {
                    backgroundColor:
                      colors.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={19}
                  color={colors.text}
                />
              </View>

              <View
                style={styles.rowContent}
              >
                <Text
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Theme
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    {
                      color:
                        colors.textMuted,
                    },
                  ]}
                >
                  Choose how TL-On looks
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.themeSelector,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
            >
              {(
                [
                  "System",
                  "Light",
                  "Dark",
                ] as const
              ).map((item) => {
                const active =
                  selectedTheme === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setTheme(
                        item === "System"
                          ? "system"
                          : item === "Light"
                          ? "light"
                          : "dark"
                      )
                    }
                    style={[
                      styles.themeOption,
                      active && {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        item === "System"
                          ? "phone-portrait-outline"
                          : item === "Light"
                          ? "sunny-outline"
                          : "moon-outline"
                      }
                      size={16}
                      color={
                        active
                          ? colors.primaryText
                          : colors.textSecondary
                      }
                    />

                    <Text
                      style={[
                        styles.themeText,
                        {
                          color: active
                            ? colors.primaryText
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.accentRow,
                {
                  borderTopColor:
                    colors.border,
                },
              ]}
              onPress={() =>
                Alert.alert(
                  "Accent Color",
                  "Accent color customization will be available soon."
                )
              }
            >
              <View
                style={[
                  styles.accentColor,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />

              <View
                style={styles.rowContent}
              >
                <Text
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Accent color
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    {
                      color:
                        colors.textMuted,
                    },
                  ]}
                >
                  Customize the interface
                  accent
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={colors.textMuted}
              />
            </Pressable>
          </View>
        </Section>

        <Section
          title="Chat"
          colors={colors}
        >
          <ToggleRow
            colors={colors}
            theme={theme}
            icon="return-down-forward-outline"
            title="Enter to send"
            subtitle="Press Enter to send messages"
            value={enterToSend}
            onChange={setEnterToSend}
          />

          <ToggleRow
            colors={colors}
            theme={theme}
            icon="arrow-down-outline"
            title="Auto-scroll"
            subtitle="Keep the latest response visible"
            value={autoScroll}
            onChange={setAutoScroll}
          />

          <ToggleRow
            colors={colors}
            theme={theme}
            icon="time-outline"
            title="Show timestamps"
            subtitle="Display message timestamps"
            value={timestamps}
            onChange={setTimestamps}
          />

          <ToggleRow
            colors={colors}
            theme={theme}
            icon="pulse-outline"
            title="Response streaming"
            subtitle="Show AI responses as they arrive"
            value={streaming}
            onChange={setStreaming}
          />

          <SettingRow
            colors={colors}
            icon="code-slash-outline"
            title="Code blocks"
            subtitle="Customize code rendering"
            onPress={() => {}}
          />
        </Section>

        <Section
          title="Notifications"
          colors={colors}
        >
          <ToggleRow
            colors={colors}
            theme={theme}
            icon="notifications-outline"
            title="Push notifications"
            subtitle="Allow TL-On notifications"
            value={pushNotifications}
            onChange={setPushNotifications}
          />

          <ToggleRow
            colors={colors}
            theme={theme}
            icon="checkmark-circle-outline"
            title="Response completed"
            subtitle="Notify when a response finishes"
            value={responseCompleted}
            onChange={setResponseCompleted}
          />

          <ToggleRow
            colors={colors}
            theme={theme}
            icon="megaphone-outline"
            title="Product updates"
            subtitle="News about TL-On and new features"
            value={productUpdates}
            onChange={setProductUpdates}
          />
        </Section>

        <Section
          title="Data & Privacy"
          colors={colors}
        >
          <SettingRow
            colors={colors}
            icon="archive-outline"
            title="Archived chats"
            subtitle="View your archived conversations"
            onPress={() => {}}
          />

          <SettingRow
            colors={colors}
            icon="bookmark-outline"
            title="Saved chats"
            subtitle="View saved conversations"
            onPress={() => {}}
          />

          <SettingRow
            colors={colors}
            icon="sparkles-outline"
            title="Memory"
            subtitle="Manage what TL-On remembers"
            onPress={() => {}}
          />

          <SettingRow
            colors={colors}
            icon="download-outline"
            title="Export chats"
            subtitle="Download your conversation data"
            onPress={() =>
              Alert.alert(
                "Export chats",
                "Your chat export will be prepared here."
              )
            }
          />

          <SettingRow
            colors={colors}
            icon="trash-outline"
            title="Clear local data"
            subtitle="Remove locally stored application data"
            danger
            onPress={() =>
              Alert.alert(
                "Clear local data",
                "This will remove locally stored data from this device.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {},
                  },
                ]
              )
            }
          />
        </Section>

        <Section
          title="About"
          colors={colors}
        >
          <SettingRow
            colors={colors}
            icon="information-circle-outline"
            title="About TL-On"
            subtitle="Learn more about the application"
            onPress={() => {router.push("/about");}}
          />

          <SettingRow
            colors={colors}
            icon="shield-checkmark-outline"
            title="Privacy"
            subtitle="Privacy policy"
            onPress={() => router.push("/privacy")}
          />

          <SettingRow
            colors={colors}
            icon="document-text-outline"
            title="Terms"
            subtitle="Terms of service"
            onPress={() => router.push("/terms")}
          />

          <SettingRow
            colors={colors}
            icon="help-circle-outline"
            title="Help & support"
            subtitle="Get help with TL-On"
            onPress={() => router.push("/help")}
          />

          <SettingRow
            colors={colors}
            icon="chatbubble-ellipses-outline"
            title="Send feedback"
            subtitle="Tell us what you think"
            onPress={() => router.push("/feedback")}
          />
        </Section>

        <View style={styles.version}>
          <View
            style={[
              styles.versionLogo,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={15}
              color={colors.primaryText}
            />
          </View>

          <Text
            style={[
              styles.versionName,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            TL-On
          </Text>

          <Text
            style={[
              styles.versionText,
              {
                color: colors.textMuted,
              },
            ]}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {title}
      </Text>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor:
              colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  badge,
  danger,
  onPress,
  colors,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  badge?: string;
  danger?: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && {
          backgroundColor:
            colors.surfaceSecondary,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: danger
              ? themeDangerBackground(colors)
              : colors.surfaceSecondary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={
            danger
              ? colors.danger
              : colors.text
          }
        />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.titleLine}>
          <Text
            style={[
              styles.rowTitle,
              {
                color: danger
                  ? colors.danger
                  : colors.text,
              },
            ]}
          >
            {title}
          </Text>

          {badge && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>

        {subtitle && (
          <Text
            style={[
              styles.rowSubtitle,
              {
                color:
                  colors.textMuted,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
  colors,
  theme,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
  colors: any;
  theme: "light" | "dark";
}) {
  return (
    <View style={styles.settingRow}>
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor:
              colors.surfaceSecondary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={colors.text}
        />
      </View>

      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.rowSubtitle,
            {
              color:
                colors.textMuted,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={
          theme === "dark"
            ? "#111111"
            : "#FFFFFF"
        }
        ios_backgroundColor={
          colors.border
        }
      />
    </View>
  );
}

function themeDangerBackground(
  colors: any
) {
  return colors.theme === "dark"
    ? "#321A1A"
    : "#FCEDEA";
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingBottom: 45,
  },

  header: {
    paddingHorizontal: 3,
    paddingTop: 12,
    paddingBottom: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 29,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
  },

  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: 21,
  },

  sectionTitle: {
    marginLeft: 5,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.65,
  },

  sectionCard: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
  },

  settingRow: {
    minHeight: 67,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  rowSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
  },

  securityHint: {
    marginTop: 4,
    fontSize: 10,
  },

  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "700",
  },

  appearanceCard: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 8,
  },

  rowTop: {
    paddingHorizontal: 12,
    minHeight: 59,
    flexDirection: "row",
    alignItems: "center",
  },

  themeSelector: {
    marginHorizontal: 12,
    marginTop: 4,
    padding: 4,
    borderRadius: 14,
    flexDirection: "row",
  },

  themeOption: {
    flex: 1,
    height: 38,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  themeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  accentRow: {
    minHeight: 65,
    marginTop: 7,
    paddingHorizontal: 12,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
  },

  accentColor: {
    width: 39,
    height: 39,
    borderRadius: 12,
  },

  version: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },

  versionLogo: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  versionName: {
    fontSize: 12,
    fontWeight: "700",
  },

  versionText: {
    marginTop: 3,
    fontSize: 10,
  },
});