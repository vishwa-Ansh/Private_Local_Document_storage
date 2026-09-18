import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

export default function UsagePage() {
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
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#171717" />
          </Pressable>

          <Text style={styles.headerTitle}>Usage & Plan</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.planCard}>
          <View style={styles.planTop}>
            <View>
              <Text style={styles.planLabel}>CURRENT PLAN</Text>
              <Text style={styles.planName}>Free</Text>
            </View>

            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          </View>

          <View style={styles.planDivider} />

          <View style={styles.resetRow}>
            <View style={styles.resetIcon}>
              <Ionicons
                name="refresh-outline"
                size={17}
                color="#555"
              />
            </View>

            <View>
              <Text style={styles.resetTitle}>Usage resets</Text>
              <Text style={styles.resetSubtitle}>
                October 6, 2026
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage overview</Text>

          <View style={styles.overviewCard}>
            <UsageRow
              icon="chatbubble-ellipses-outline"
              title="Messages"
              used="320"
              limit="1,000"
              percentage={32}
            />

            <UsageRow
              icon="document-text-outline"
              title="File uploads"
              used="8"
              limit="20"
              percentage={40}
            />

            <UsageRow
              icon="image-outline"
              title="Image generation"
              used="12"
              limit="50"
              percentage={24}
            />

            <UsageRow
              icon="search-outline"
              title="Web searches"
              used="41"
              limit="100"
              percentage={41}
              last
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model usage</Text>

          <View style={styles.modelCard}>
            <ModelUsage
              name="Nova"
              subtitle="General intelligence"
              percentage={48}
              icon="sparkles-outline"
            />

            <ModelUsage
              name="Nova 1 Fast"
              subtitle="Fast responses"
              percentage={27}
              icon="flash-outline"
            />

            <ModelUsage
              name="Nova Reasoning"
              subtitle="Advanced reasoning"
              percentage={15}
              icon="bulb-outline"
            />

            <ModelUsage
              name="Nova Code"
              subtitle="Programming"
              percentage={10}
              icon="code-slash-outline"
              last
            />
          </View>
        </View>

        <View style={styles.upgradeCard}>
          <View style={styles.upgradeIcon}>
            <Ionicons
              name="sparkles"
              size={21}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.upgradeTitle}>
            Need more usage?
          </Text>

          <Text style={styles.upgradeDescription}>
            Upgrade your plan for higher limits, advanced models,
            larger context and additional features.
          </Text>

          <View style={styles.features}>
            <Feature text="Higher message limits" />
            <Feature text="Advanced reasoning models" />
            <Feature text="More file & image uploads" />
            <Feature text="Priority access" />
          </View>

          <Pressable style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>
              View plans
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#171717"
            />
          </Pressable>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color="#8B8B85"
          />

          <Text style={styles.infoText}>
            Usage estimates may vary depending on model and feature
            availability.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UsageRow({
  icon,
  title,
  used,
  limit,
  percentage,
  last = false,
}: {
  icon: IconName;
  title: string;
  used: string;
  limit: string;
  percentage: number;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.usageRow,
        !last && styles.rowBorder,
      ]}
    >
      <View style={styles.usageIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#444"
        />
      </View>

      <View style={styles.usageContent}>
        <View style={styles.usageTitleRow}>
          <Text style={styles.usageTitle}>
            {title}
          </Text>

          <Text style={styles.usageValue}>
            {used} / {limit}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function ModelUsage({
  name,
  subtitle,
  percentage,
  icon,
  last = false,
}: {
  name: string;
  subtitle: string;
  percentage: number;
  icon: IconName;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.modelRow,
        !last && styles.rowBorder,
      ]}
    >
      <View style={styles.modelIcon}>
        <Ionicons
          name={icon}
          size={17}
          color="#444"
        />
      </View>

      <View style={styles.modelContent}>
        <View style={styles.modelTop}>
          <View>
            <Text style={styles.modelName}>
              {name}
            </Text>

            <Text style={styles.modelSubtitle}>
              {subtitle}
            </Text>
          </View>

          <Text style={styles.modelPercentage}>
            {percentage}%
          </Text>
        </View>

        <View style={styles.modelTrack}>
          <View
            style={[
              styles.modelFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.check}>
        <Ionicons
          name="checkmark"
          size={12}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.featureText}>
        {text}
      </Text>
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
    height: 59,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },

  headerSpace: {
    width: 42,
  },

  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E1E1DC",
    padding: 16,
  },

  planTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  planLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#999992",
  },

  planName: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: "700",
    color: "#171717",
  },

  freeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: "#EEEEEA",
  },

  freeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#555",
    letterSpacing: 0.5,
  },

  planDivider: {
    height: 1,
    backgroundColor: "#ECECE7",
    marginVertical: 15,
  },

  resetRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  resetIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  resetTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },

  resetSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#999",
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    marginLeft: 4,
    marginBottom: 9,
    fontSize: 11,
    fontWeight: "700",
    color: "#858580",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E1E1DC",
    overflow: "hidden",
  },

  usageRow: {
    minHeight: 77,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E3DE",
  },

  usageIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  usageContent: {
    flex: 1,
  },

  usageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  usageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#292929",
  },

  usageValue: {
    fontSize: 11,
    color: "#888",
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E9E9E4",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#333",
  },

  modelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E1E1DC",
    overflow: "hidden",
  },

  modelRow: {
    minHeight: 78,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  modelIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  modelContent: {
    flex: 1,
  },

  modelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  modelName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#292929",
  },

  modelSubtitle: {
    marginTop: 2,
    fontSize: 10.5,
    color: "#999",
  },

  modelPercentage: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
  },

  modelTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E9E9E4",
    overflow: "hidden",
  },

  modelFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#555",
  },

  upgradeCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 21,
    backgroundColor: "#171717",
  },

  upgradeIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
  },

  upgradeTitle: {
    marginTop: 13,
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  upgradeDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#B7B7B7",
  },

  features: {
    marginTop: 15,
    gap: 10,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
  },

  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  featureText: {
    fontSize: 11.5,
    color: "#D1D1D1",
  },

  upgradeButton: {
    height: 43,
    marginTop: 18,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  upgradeButtonText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#171717",
  },

  infoRow: {
    marginTop: 18,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },

  infoText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 16,
    color: "#999",
  },
});