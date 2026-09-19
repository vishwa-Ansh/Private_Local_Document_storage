import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { useTheme } from "../context/ThemeContext";

const categories = [
    {
        id: "general",
        label: "General",
        icon: "chatbubble-outline" as const,
    },
    {
        id: "bug",
        label: "Bug",
        icon: "bug-outline" as const,
    },
    {
        id: "feature",
        label: "Feature",
        icon: "bulb-outline" as const,
    },
    {
        id: "experience",
        label: "Experience",
        icon: "heart-outline" as const,
    },
];

export default function Feedback() {
    const { colors } = useTheme();

    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState("general");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const submitFeedback = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            Alert.alert(
                "Feedback required",
                "Please enter your feedback before submitting."
            );
            return;
        }

        if (sending) {
            return;
        }

        try {
            setSending(true);

            const currentUser = auth.currentUser;

            await addDoc(collection(db, "feedback"), {
                userId: currentUser?.uid || null,
                email: currentUser?.email || null,
                rating,
                category,
                message: trimmedMessage,
                createdAt: serverTimestamp(),
            });

            setMessage("");
            setRating(0);
            setCategory("general");

            Alert.alert(
                "Thank you!",
                "Your feedback has been submitted successfully.",
                [
                    {
                        text: "Done",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error("FEEDBACK ERROR:", error);

            Alert.alert(
                "Couldn't submit",
                "Something went wrong while submitting your feedback. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <KeyboardAvoidingView
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
                keyboardVerticalOffset={
                    Platform.OS === "ios" ? 10 : 0
                }
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
                        Send Feedback
                    </Text>

                    <View style={styles.headerRight} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
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
                            name="chatbubble-ellipses"
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
                        Tell us what you think
                    </Text>

                    <Text
                        style={[
                            styles.subtitle,
                            {
                                color: colors.textSecondary,
                            },
                        ]}
                    >
                        Your feedback helps us improve TL-On.
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
                            How was your experience?
                        </Text>

                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    activeOpacity={0.7}
                                    onPress={() => setRating(item)}
                                    style={styles.starButton}
                                >
                                    <Ionicons
                                        name={
                                            item <= rating
                                                ? "star"
                                                : "star-outline"
                                        }
                                        size={31}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            ))}
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
                            Feedback type
                        </Text>

                        <View style={styles.categoryGrid}>
                            {categories.map((item) => {
                                const selected =
                                    category === item.id;

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.7}
                                        onPress={() =>
                                            setCategory(item.id)
                                        }
                                        style={[
                                            styles.category,
                                            {
                                                backgroundColor:
                                                    selected
                                                        ? colors.primary
                                                        : colors.surface,
                                                borderColor:
                                                    selected
                                                        ? colors.primary
                                                        : colors.border,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={19}
                                            color={
                                                selected
                                                    ? colors.primaryText
                                                    : colors.text
                                            }
                                        />

                                        <Text
                                            style={[
                                                styles.categoryText,
                                                {
                                                    color: selected
                                                        ? colors.primaryText
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
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
                            Your feedback
                        </Text>

                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            textAlignVertical="top"
                            placeholder="Tell us what you like, what could be better, or what you'd like to see..."
                            placeholderTextColor={
                                colors.textSecondary
                            }
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        />

                        <Text
                            style={[
                                styles.characterCount,
                                {
                                    color: colors.textSecondary,
                                },
                            ]}
                        >
                            {message.length}/1000
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={
                            sending || !message.trim()
                        }
                        onPress={submitFeedback}
                        style={[
                            styles.submitButton,
                            {
                                backgroundColor:
                                    sending || !message.trim()
                                        ? colors.surface
                                        : colors.primary,
                                borderColor:
                                    colors.border,
                            },
                        ]}
                    >
                        {sending ? (
                            <Text
                                style={[
                                    styles.submitText,
                                    {
                                        color:
                                            colors.textSecondary,
                                    },
                                ]}
                            >
                                Sending...
                            </Text>
                        ) : (
                            <>
                                <Ionicons
                                    name="paper-plane-outline"
                                    size={18}
                                    color={
                                        message.trim()
                                            ? colors.primaryText
                                            : colors.textSecondary
                                    }
                                />

                                <Text
                                    style={[
                                        styles.submitText,
                                        {
                                            color: message.trim()
                                                ? colors.primaryText
                                                : colors.textSecondary,
                                        },
                                    ]}
                                >
                                    Send Feedback
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.note,
                            {
                                color: colors.textSecondary,
                            },
                        ]}
                    >
                        Please don't include passwords, payment
                        information, or other sensitive information.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
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
        textAlign: "center",
        marginTop: 9,
    },

    section: {
        marginTop: 32,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 14,
    },

    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },

    starButton: {
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },

    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 9,
    },

    category: {
        height: 44,
        borderRadius: 13,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 13,
    },

    categoryText: {
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 7,
    },

    input: {
        minHeight: 150,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 14,
        lineHeight: 21,
    },

    characterCount: {
        fontSize: 11,
        textAlign: "right",
        marginTop: 7,
    },

    submitButton: {
        height: 52,
        borderRadius: 15,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        gap: 9,
    },

    submitText: {
        fontSize: 14,
        fontWeight: "700",
    },

    note: {
        fontSize: 11,
        lineHeight: 17,
        textAlign: "center",
        marginTop: 14,
        paddingHorizontal: 15,
    },
});