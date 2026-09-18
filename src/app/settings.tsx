import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
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

type IconName = keyof typeof Ionicons.glyphMap;

export default function SettingsPage() {
  const [theme, setTheme] = useState<"System" | "Light" | "Dark">(
    "System"
  );

  const [enterToSend, setEnterToSend] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [timestamps, setTimestamps] = useState(false);
  const [streaming, setStreaming] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [responseCompleted, setResponseCompleted] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{
      headerTransparent:true,
      headerShown:false
    }}/>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Customize your Nova experience
            </Text>
          </View>

          <View style={styles.settingsIcon}>
            <Ionicons
              name="settings-outline"
              size={22}
              color="#333"
            />
          </View>
        </View>

        <Section title="Account">
          <SettingRow
            icon="person-outline"
            title="Profile"
            subtitle="Manage your profile"
            onPress={() => {}}
          />

          <SettingRow
            icon="mail-outline"
            title="Email"
            subtitle="night@example.com"
            onPress={() => {}}
          />

          <SettingRow
            icon="card-outline"
            title="Subscription"
            subtitle="Free plan"
            badge="Free"
            onPress={() => {}}
          />

          <SettingRow
            icon="bar-chart-outline"
            title="Usage"
            subtitle="View your usage and limits"
            onPress={() => {}}
          />
        </Section>

        <Section title="Appearance">
          <View style={styles.appearanceCard}>
            <View style={styles.rowTop}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="color-palette-outline"
                  size={19}
                  color="#333"
                />
              </View>

              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Theme</Text>
                <Text style={styles.rowSubtitle}>
                  Choose how TL-On looks
                </Text>
              </View>
            </View>

            <View style={styles.themeSelector}>
              {(["System", "Light", "Dark"] as const).map(
                (item) => (
                  <Pressable
                    key={item}
                    onPress={() => setTheme(item)}
                    style={[
                      styles.themeOption,
                      theme === item && styles.themeOptionActive,
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
                      color={theme === item ? "#FFFFFF" : "#666"}
                    />

                    <Text
                      style={[
                        styles.themeText,
                        theme === item &&
                          styles.themeTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <Pressable style={styles.accentRow}>
              <View style={styles.accentColor} />

              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>
                  Accent color
                </Text>
                <Text style={styles.rowSubtitle}>
                  Customize the interface accent
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#999"
              />
            </Pressable>
          </View>
        </Section>

        <Section title="Chat">
          <ToggleRow
            icon="return-down-forward-outline"
            title="Enter to send"
            subtitle="Press Enter to send messages"
            value={enterToSend}
            onChange={setEnterToSend}
          />

          <ToggleRow
            icon="arrow-down-outline"
            title="Auto-scroll"
            subtitle="Keep the latest response visible"
            value={autoScroll}
            onChange={setAutoScroll}
          />

          <ToggleRow
            icon="time-outline"
            title="Show timestamps"
            subtitle="Display message timestamps"
            value={timestamps}
            onChange={setTimestamps}
          />

          <ToggleRow
            icon="pulse-outline"
            title="Response streaming"
            subtitle="Show AI responses as they arrive"
            value={streaming}
            onChange={setStreaming}
          />

          <SettingRow
            icon="code-slash-outline"
            title="Code blocks"
            subtitle="Customize code rendering"
            onPress={() => {}}
          />
        </Section>

        <Section title="Notifications">
          <ToggleRow
            icon="notifications-outline"
            title="Push notifications"
            subtitle="Allow Nova notifications"
            value={pushNotifications}
            onChange={setPushNotifications}
          />

          <ToggleRow
            icon="checkmark-circle-outline"
            title="Response completed"
            subtitle="Notify when a response finishes"
            value={responseCompleted}
            onChange={setResponseCompleted}
          />

          <ToggleRow
            icon="megaphone-outline"
            title="Product updates"
            subtitle="News about Nova and new features"
            value={productUpdates}
            onChange={setProductUpdates}
          />
        </Section>

        <Section title="Data & Privacy">
          <SettingRow
            icon="archive-outline"
            title="Archived chats"
            subtitle="View your archived conversations"
            onPress={() => {}}
          />

          <SettingRow
            icon="bookmark-outline"
            title="Saved chats"
            subtitle="View saved conversations"
            onPress={() => {}}
          />

          <SettingRow
            icon="sparkles-outline"
            title="Memory"
            subtitle="Manage what Nova remembers"
            onPress={() => {}}
          />

          <SettingRow
            icon="download-outline"
            title="Export chats"
            subtitle="Download your conversation data"
            onPress={() => {
              Alert.alert(
                "Export chats",
                "Your chat export will be prepared here."
              );
            }}
          />

          <SettingRow
            icon="trash-outline"
            title="Clear local data"
            subtitle="Remove locally stored application data"
            danger
            onPress={() => {
              Alert.alert(
                "Clear local data",
                "This will remove locally stored data from this device.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Clear",
                    style: "destructive",
                  },
                ]
              );
            }}
          />
        </Section>

        <Section title="About">
          <SettingRow
            icon="information-circle-outline"
            title="About Nova"
            subtitle="Learn more about the application"
            onPress={() => {}}
          />

          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy"
            subtitle="Privacy policy"
            onPress={() => {}}
          />

          <SettingRow
            icon="document-text-outline"
            title="Terms"
            subtitle="Terms of service"
            onPress={() => {}}
          />

          <SettingRow
            icon="help-circle-outline"
            title="Help & support"
            subtitle="Get help with Nova"
            onPress={() => {}}
          />

          <SettingRow
            icon="chatbubble-ellipses-outline"
            title="Send feedback"
            subtitle="Tell us what you think"
            onPress={() => {}}
          />
        </Section>

        <View style={styles.version}>
          <View style={styles.versionLogo}>
            <Ionicons name="sparkles" size={15} color="#FFF" />
          </View>

          <Text style={styles.versionName}>Nova</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.sectionCard}>{children}</View>
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
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  badge?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.settingIcon,
          danger && styles.dangerIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={danger ? "#C0392B" : "#333"}
        />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.titleLine}>
          <Text
            style={[
              styles.rowTitle,
              danger && styles.dangerText,
            ]}
          >
            {title}
          </Text>

          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>

        {subtitle && (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color="#A0A09A"
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
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={19} color="#333" />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: "#D9D9D4",
          true: "#303030",
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingBottom: 40,
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
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: "#151515",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    color: "#898984",
  },

  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#EAEAE6",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: 21,
  },

  sectionTitle: {
    marginLeft: 5,
    marginBottom: 8,
    fontSize: 11.5,
    fontWeight: "700",
    color: "#858580",
    textTransform: "uppercase",
    letterSpacing: 0.55,
  },

  sectionCard: {
    overflow: "hidden",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E0E0DB",
    backgroundColor: "#FFFFFF",
  },

  settingRow: {
    minHeight: 67,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  rowPressed: {
    backgroundColor: "#F2F2EE",
  },

  settingIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F0EC",
    alignItems: "center",
    justifyContent: "center",
  },

  dangerIcon: {
    backgroundColor: "#FCEDEA",
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
    color: "#242424",
  },

  rowSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
    color: "#92928D",
  },

  dangerText: {
    color: "#C0392B",
  },

  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: "#EEEEEA",
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#666",
  },

  appearanceCard: {
    overflow: "hidden",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E0E0DB",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#F0F0EC",
    flexDirection: "row",
  },

  themeOption: {
    flex: 1,
    height: 37,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  themeOptionActive: {
    backgroundColor: "#171717",
  },

  themeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#70706B",
  },

  themeTextActive: {
    color: "#FFFFFF",
  },

  accentRow: {
    minHeight: 65,
    marginTop: 7,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6E6E1",
    flexDirection: "row",
    alignItems: "center",
  },

  accentColor: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#171717",
  },

  version: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },

  versionLogo: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  versionName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },

  versionText: {
    marginTop: 3,
    fontSize: 10,
    color: "#A0A09A",
  },
});