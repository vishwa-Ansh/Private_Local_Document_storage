import { Stack, router } from "expo-router";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

export default function About() {
    const { theme, colors } = useTheme();

    const openLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch { }
    };

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
                    headerTransparent:true
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
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
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
                        About TL-On
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <Image
                        source={require("../../assets/images/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text
                        style={[
                            styles.appName,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        TL-On
                    </Text>

                    <Text
                        style={[
                            styles.tagline,
                            {
                                color: colors.textSecondary,
                            },
                        ]}
                    >
                        Your intelligent AI companion
                    </Text>

                    <View
                        style={[
                            styles.versionBox,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.versionLabel,
                                {
                                    color: colors.textSecondary,
                                },
                            ]}
                        >
                            Version
                        </Text>

                        <Text
                            style={[
                                styles.version,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            1.0.0
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
                            About
                        </Text>

                        <Text
                            style={[
                                styles.description,
                                {
                                    color: colors.textSecondary,
                                },
                            ]}
                        >
                            TL-On is an AI-powered assistant designed to
                            help you ask questions, explore ideas, solve
                            problems, learn new concepts, and get useful
                            answers in one place.
                        </Text>

                        <Text
                            style={[
                                styles.description,
                                {
                                    color: colors.textSecondary,
                                    marginTop: 14,
                                },
                            ]}
                        >
                            Built with a focus on simplicity, speed, and
                            a clean conversational experience.
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
                            Features
                        </Text>

                        <FeatureRow
                            icon="chatbubble-ellipses-outline"
                            title="AI Conversations"
                            description="Ask questions and have natural conversations."
                            colors={colors}
                        />

                        <FeatureRow
                            icon="time-outline"
                            title="Chat History"
                            description="Keep track of your previous conversations."
                            colors={colors}
                        />

                        <FeatureRow
                            icon="layers-outline"
                            title="Model Selection"
                            description="Choose the AI model that fits your task."
                            colors={colors}
                        />

                        <FeatureRow
                            icon="folder-open-outline"
                            title="Projects"
                            description="Organize your AI work and conversations."
                            colors={colors}
                        />

                        <FeatureRow
                            icon="finger-print-outline"
                            title="App Lock"
                            description="Protect your app with device authentication."
                            colors={colors}
                        />
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
                            Connect
                        </Text>

                        <LinkRow
                            icon="logo-github"
                            title="GitHub"
                            onPress={() =>
                                openLink(
                                    "https://github.com/"
                                )
                            }
                            colors={colors}
                        />

                        <LinkRow
                            icon="globe-outline"
                            title="Website"
                            onPress={() =>
                                openLink(
                                    "https://tl-on.vercel.app"
                                )
                            }
                            colors={colors}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text
                            style={[
                                styles.footerText,
                                {
                                    color: colors.textSecondary,
                                },
                            ]}
                        >
                            Made with intelligence and curiosity.
                        </Text>

                        <Text
                            style={[
                                styles.copyright,
                                {
                                    color: colors.textSecondary,
                                },
                            ]}
                        >
                            © 2026 TL-On
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

function FeatureRow({
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
        <View style={styles.featureRow}>
            <View
                style={[
                    styles.featureIcon,
                    {
                        backgroundColor: colors.surface,
                    },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={21}
                    color={colors.text}
                />
            </View>

            <View style={styles.featureContent}>
                <Text
                    style={[
                        styles.featureTitle,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    {title}
                </Text>

                <Text
                    style={[
                        styles.featureDescription,
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

function LinkRow({
    icon,
    title,
    onPress,
    colors,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    colors: any;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.linkRow,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
            ]}
        >
            <View style={styles.linkLeft}>
                <Ionicons
                    name={icon}
                    size={21}
                    color={colors.text}
                />

                <Text
                    style={[
                        styles.linkTitle,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    {title}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSecondary}
            />
        </TouchableOpacity>
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

    headerSpace: {
        width: 42,
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: -0.2,
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 34,
        paddingBottom: 50,
    },

    logo: {
        width: 82,
        height: 82,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },

    logoText: {
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: -1.2,
    },

    appName: {
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 18,
        letterSpacing: -1,
    },

    tagline: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 7,
    },

    versionBox: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
    },

    versionLabel: {
        fontSize: 12,
    },

    version: {
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 6,
    },

    section: {
        marginTop: 38,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
        letterSpacing: -0.3,
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    featureContent: {
        flex: 1,
        marginLeft: 14,
    },

    featureTitle: {
        fontSize: 14,
        fontWeight: "700",
    },

    featureDescription: {
        fontSize: 12.5,
        lineHeight: 18,
        marginTop: 3,
    },

    linkRow: {
        minHeight: 52,
        borderRadius: 15,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 10,
    },

    linkLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    linkTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 13,
    },

    footer: {
        alignItems: "center",
        marginTop: 40,
    },

    footerText: {
        fontSize: 12,
    },

    copyright: {
        fontSize: 11,
        marginTop: 7,
    },
});