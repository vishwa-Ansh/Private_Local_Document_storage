import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

type IconName = keyof typeof Ionicons.glyphMap;

type Model = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  badge?: string;
  speed: number;
  intelligence: number;
  context: string;
};

const models: Model[] = [
  {
    id: "TL-1",
    name: "TL-On 3.5 Lite 1",
    description: "Balanced intelligence for everyday tasks.",
    icon: "sparkles-outline",
    badge: "Recommended",
    speed: 4,
    intelligence: 4,
    context: "128K",
  },
  {
    id: "TL-On 3.5 Prime",
    name: "TL-On 3.5 Prime",
    description: "Fast responses for simple everyday questions.",
    icon: "flash-outline",
    badge: "Fast",
    speed: 5,
    intelligence: 3,
    context: "64K",
  },
  {
    id: "TL-On 3.5 Codex",
    name: "TL-On 3.5 Codex",
    description: "Designed for complex reasoning and analysis.",
    icon: "bulb-outline",
    badge: "Reasoning",
    speed: 2,
    intelligence: 5,
    context: "256K",
  },
  {
    id: "TL_On 5.1 Maxima",
    name: "TL_On 5.1 Maxima",
    description: "Understands images, documents and visual data.",
    icon: "eye-outline",
    badge: "Vision",
    speed: 3,
    intelligence: 4,
    context: "128K",
  },
  {
    id: "TL-On 5.1 Nexus",
    name: "TL-On 5.1 Nexus",
    description: "Optimized for programming and technical work.",
    icon: "code-slash-outline",
    badge: "Code",
    speed: 4,
    intelligence: 5,
    context: "256K",
  },
  {
    id: "TL-On 5.1 Imperium",
    name: "TL-On 5.1 Imperium",
    description: "Optimized for programming and technical work.",
    icon: "code-slash-outline",
    badge: "Code",
    speed: 4,
    intelligence: 5,
    context: "256K",
  },
];

export default function ModelSelectionPage() {
  const { colors } = useTheme();

  const [selectedModel, setSelectedModel] =
    useState("TL-1");

  const selectModel = (model: Model) => {
    setSelectedModel(model.id);

    router.replace({
      pathname: "/",
      params: {
        model: model.name,
      },
    });
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
          headerTransparent: true,
          headerShown: false,
        }}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Choose model
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text
              style={[
                styles.introTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Select your AI
            </Text>

            <Text
              style={[
                styles.introText,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Different models are optimized for different
              types of work.
            </Text>
          </View>

          <View style={styles.modelList}>
            {models.map((model) => {
              const selected =
                selectedModel === model.id;

              return (
                <Pressable
                  key={model.id}
                  style={({ pressed }) => [
                    styles.modelCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    selected && {
                      borderColor: colors.primary,
                      backgroundColor:
                        colors.surfaceSecondary,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => selectModel(model)}
                >
                  <View style={styles.modelHeader}>
                    <View
                      style={[
                        styles.modelIcon,
                        {
                          backgroundColor:
                            colors.surfaceSecondary,
                        },
                        selected && {
                          backgroundColor:
                            colors.primary,
                        },
                      ]}
                    >
                      <Ionicons
                        name={model.icon}
                        size={20}
                        color={
                          selected
                            ? colors.primaryText
                            : colors.textSecondary
                        }
                      />
                    </View>

                    <View style={styles.modelInfo}>
                      <View style={styles.nameRow}>
                        <Text
                          style={[
                            styles.modelName,
                            {
                              color: colors.text,
                            },
                          ]}
                        >
                          {model.name}
                        </Text>

                        {model.badge && (
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor:
                                  colors.surfaceSecondary,
                              },
                              selected && {
                                backgroundColor:
                                  colors.border,
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
                              {model.badge}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.description,
                          {
                            color: colors.textMuted,
                          },
                        ]}
                      >
                        {model.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: colors.border,
                        },
                        selected && {
                          borderColor:
                            colors.primary,
                        },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            styles.radioDot,
                            {
                              backgroundColor:
                                colors.primary,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.metrics,
                      {
                        borderTopColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Metric
                      label="Speed"
                      value={model.speed}
                      colors={colors}
                    />

                    <Metric
                      label="Intelligence"
                      value={model.intelligence}
                      colors={colors}
                    />

                    <View style={styles.context}>
                      <Text
                        style={[
                          styles.metricLabel,
                          {
                            color:
                              colors.textMuted,
                          },
                        ]}
                      >
                        Context
                      </Text>

                      <Text
                        style={[
                          styles.contextValue,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {model.context}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.info}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={colors.textMuted}
            />

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Model availability and limits may vary by
              plan.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Metric({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryText: string;
    input: string;
    card: string;
    danger: string;
    overlay: string;
  };
}) {
  return (
    <View style={styles.metric}>
      <Text
        style={[
          styles.metricLabel,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {label}
      </Text>

      <View style={styles.bars}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View
            key={item}
            style={[
              styles.bar,
              {
                backgroundColor: colors.border,
              },
              item <= value && {
                backgroundColor:
                  colors.textSecondary,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    height: 59,
    paddingHorizontal: 12,
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
  },

  headerSpace: {
    width: 42,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingBottom: 35,
  },

  intro: {
    paddingHorizontal: 4,
    paddingTop: 14,
    paddingBottom: 20,
  },

  introTitle: {
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.4,
  },

  introText: {
    marginTop: 6,
    maxWidth: 330,
    fontSize: 12,
    lineHeight: 18,
  },

  modelList: {
    gap: 11,
  },

  modelCard: {
    padding: 14,
    borderRadius: 19,
    borderWidth: 1,
  },

  pressed: {
    transform: [{ scale: 0.99 }],
  },

  modelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  modelIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  modelInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  modelName: {
    fontSize: 14,
    fontWeight: "700",
  },

  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
  },

  badgeText: {
    fontSize: 8.5,
    fontWeight: "700",
  },

  description: {
    marginTop: 5,
    fontSize: 10.5,
    lineHeight: 15,
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  metrics: {
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
  },

  metric: {
    flex: 1,
  },

  metricLabel: {
    fontSize: 9.5,
  },

  bars: {
    marginTop: 6,
    flexDirection: "row",
    gap: 3,
  },

  bar: {
    width: 15,
    height: 4,
    borderRadius: 2,
  },

  context: {
    width: 65,
    alignItems: "flex-end",
  },

  contextValue: {
    marginTop: 5,
    fontSize: 10.5,
    fontWeight: "700",
  },

  info: {
    marginTop: 18,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  infoText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 15,
  },
});