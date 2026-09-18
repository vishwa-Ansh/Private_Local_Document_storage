import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

export default function ProfilePage() {
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
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color="#161616" />
          </Pressable>

          <Text style={styles.headerTitle}>Profile</Text>

          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={20} color="#333" />
          </Pressable>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>N</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editAvatar,
                pressed && styles.editAvatarPressed,
              ]}
              accessibilityLabel="Change profile picture"
            >
              <Ionicons
                name="camera-outline"
                size={13}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <Text style={styles.name}>Night.vanta</Text>
          <Text style={styles.email}>night@example.com</Text>

          <View style={styles.planBadge}>
            <Ionicons name="sparkles" size={11} color="#3D3D39" />
            <Text style={styles.planBadgeText}>Free plan</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.upgradeCard,
            pressed && styles.upgradePressed,
          ]}
          onPress={() =>
            Alert.alert(
              "Upgrade",
              "Subscription options will be available here."
            )
          }
        >
          <View style={styles.upgradeTop}>
            <View style={styles.upgradeIcon}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </View>

            <View style={styles.upgradeArrow}>
              <Ionicons
                name="arrow-up-right"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.upgradeEyebrow}>TL-ON PREMIUM</Text>

          <Text style={styles.upgradeTitle}>
            Unlock more intelligence.
          </Text>

          <Text style={styles.upgradeDescription}>
            Higher limits, advanced models, larger context and
            priority access.
          </Text>

          <View style={styles.upgradeBottom}>
            <Text style={styles.upgradeButtonText}>
              Explore plans
            </Text>

            <Ionicons
              name="arrow-forward"
              size={15}
              color="#FFFFFF"
            />
          </View>
        </Pressable>

        <Section title="Account">
          <ProfileRow
            icon="person-outline"
            title="Personal information"
            subtitle="Name and profile details"
            onPress={() => {}}
          />

          <ProfileRow
            icon="mail-outline"
            title="Email address"
            subtitle="night@example.com"
            onPress={() => {}}
          />

          <ProfileRow
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password and account security"
            onPress={() => {}}
            last
          />
        </Section>

        <Section title="Activity">
          <View style={styles.usageCard}>
            <View style={styles.usageHeader}>
              <View>
                <View style={styles.usageTitleRow}>
                  <Text style={styles.usageTitle}>
                    Current usage
                  </Text>

                  <View style={styles.liveDot} />
                </View>

                <Text style={styles.usageSubtitle}>
                  Resets in 18 days
                </Text>
              </View>

              <Text style={styles.usagePercent}>32%</Text>
            </View>

            <View style={styles.progressBackground}>
              <View style={styles.progress} />
            </View>

            <View style={styles.usageStats}>
              <UsageItem
                icon="chatbubble-outline"
                label="Messages"
                value="320 / 1,000"
              />

              <View style={styles.statDivider} />

              <UsageItem
                icon="document-outline"
                label="Files"
                value="8 / 20"
              />
            </View>
          </View>

          <ProfileRow
            icon="bar-chart-outline"
            title="Usage details"
            subtitle="Models, features and limits"
            onPress={() => router.push("/usage")}
            last
          />
        </Section>

        <Section title="Preferences">
          <ProfileRow
            icon="settings-outline"
            title="Settings"
            subtitle="Customize your TL-On experience"
            onPress={() => router.push("/settings")}
          />

          <ProfileRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => {}}
          />

          <ProfileRow
            icon="sparkles-outline"
            title="Memory"
            subtitle="Manage saved memories"
            onPress={() => {}}
            last
          />
        </Section>

        <Section title="Account actions">
          <ProfileRow
            icon="log-out-outline"
            title="Sign out"
            subtitle="Sign out from this device"
            onPress={() =>
              Alert.alert(
                "Sign out",
                "Are you sure you want to sign out?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Sign out",
                    style: "destructive",
                  },
                ]
              )
            }
          />

          <ProfileRow
            icon="trash-outline"
            title="Delete account"
            subtitle="Permanently delete your account"
            onPress={() =>
              Alert.alert(
                "Delete account",
                "This action cannot be undone.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                  },
                ]
              )
            }
            danger
            last
          />
        </Section>

        <View style={styles.footer}>
          <View style={styles.footerMark}>
            <Text style={styles.footerMarkText}>TL</Text>
          </View>

          <Text style={styles.footerBrand}>TL-On</Text>

          <Text style={styles.footerVersion}>
            Intelligence beyond limits · 1.0.0
          </Text>
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

function ProfileRow({
  icon,
  title,
  subtitle,
  danger = false,
  onPress,
  last = false,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  danger?: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          danger && styles.dangerIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#B83A30" : "#383834"}
        />
      </View>

      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            danger && styles.dangerText,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color="#A3A39D"
      />
    </Pressable>
  );
}

function UsageItem({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.usageItem}>
      <View style={styles.usageItemIcon}>
        <Ionicons name={icon} size={14} color="#666" />
      </View>

      <View>
        <Text style={styles.usageLabel}>{label}</Text>
        <Text style={styles.usageValue}>{value}</Text>
      </View>
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
    paddingHorizontal: 16,
    paddingBottom: 42,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: "#171717",
  },

  pressed: {
    backgroundColor: "#ECECE8",
  },

  profileHeader: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 25,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 31,
    padding: 1,
    backgroundColor: "#D8D8D2",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  editAvatar: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#292929",
    borderWidth: 3,
    borderColor: "#F7F7F5",
    alignItems: "center",
    justifyContent: "center",
  },

  editAvatarPressed: {
    backgroundColor: "#444",
  },

  name: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#171717",
  },

  email: {
    marginTop: 4,
    fontSize: 12.5,
    color: "#8A8A84",
  },

  planBadge: {
    marginTop: 11,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#EBEBE6",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  planBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4D4D48",
  },

  upgradeCard: {
    padding: 17,
    borderRadius: 23,
    backgroundColor: "#171717",
    marginBottom: 27,
  },

  upgradePressed: {
    backgroundColor: "#222222",
  },

  upgradeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  upgradeIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#30302F",
    alignItems: "center",
    justifyContent: "center",
  },

  upgradeArrow: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#2C2C2C",
    alignItems: "center",
    justifyContent: "center",
  },

  upgradeEyebrow: {
    marginTop: 17,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: "#999994",
  },

  upgradeTitle: {
    marginTop: 6,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },

  upgradeDescription: {
    marginTop: 6,
    maxWidth: 310,
    fontSize: 11.5,
    lineHeight: 17,
    color: "#B9B9B5",
  },

  upgradeBottom: {
    alignSelf: "flex-start",
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  upgradeButtonText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  section: {
    marginBottom: 23,
  },

  sectionTitle: {
    marginLeft: 5,
    marginBottom: 9,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: "#858580",
  },

  sectionCard: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DFDFDA",
    backgroundColor: "#FFFFFF",
  },

  row: {
    minHeight: 70,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E0",
  },

  rowPressed: {
    backgroundColor: "#F5F5F1",
  },

  rowIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  rowTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#252525",
  },

  rowSubtitle: {
    marginTop: 3,
    fontSize: 10.5,
    color: "#969690",
  },

  dangerIcon: {
    backgroundColor: "#FCEDEA",
  },

  dangerText: {
    color: "#B83A30",
  },

  usageCard: {
    padding: 15,
  },

  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  usageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  usageTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#252525",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
  },

  usageSubtitle: {
    marginTop: 3,
    fontSize: 10.5,
    color: "#999",
  },

  usagePercent: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  progressBackground: {
    height: 7,
    marginTop: 14,
    borderRadius: 4,
    backgroundColor: "#E7E7E2",
    overflow: "hidden",
  },

  progress: {
    width: "32%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#292929",
  },

  usageStats: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  statDivider: {
    width: 1,
    height: 27,
    marginHorizontal: 18,
    backgroundColor: "#E4E4DF",
  },

  usageItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  usageItemIcon: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  usageLabel: {
    fontSize: 9,
    color: "#999",
  },

  usageValue: {
    marginTop: 2,
    fontSize: 10.5,
    fontWeight: "600",
    color: "#555",
  },

  footer: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 16,
  },

  footerMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  footerMarkText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },

  footerBrand: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },

  footerVersion: {
    marginTop: 3,
    fontSize: 9.5,
    color: "#A0A09A",
  },
});