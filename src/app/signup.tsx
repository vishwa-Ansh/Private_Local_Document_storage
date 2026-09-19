import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { auth } from "../lib/firebase";
import { createUserDocument } from "../lib/user";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        if (loading) return;

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            Alert.alert(
                "Invalid Email",
                "Please enter your email address."
            );
            return;
        }

        if (!password) {
            Alert.alert(
                "Invalid Password",
                "Please enter your password."
            );
            return;
        }

        if (password.length < 6) {
            Alert.alert(
                "Weak Password",
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

            const user = credential.user;

            console.log(
                "Firebase User Created:",
                user.uid
            );

            try {
                await createUserDocument(user);
            } catch (firestoreError: any) {
                console.error(
                    "Firestore User Document Error:",
                    firestoreError
                );

                await user.delete().catch(() => {});

                throw new Error(
                    firestoreError?.message ||
                        "Unable to create user profile."
                );
            }

            console.log(
                "Signup successful:",
                user.uid
            );

            router.replace("/complete-profile");
        } catch (error: any) {
            console.error(
                "Firebase Signup Error:",
                error
            );

            let message =
                "Unable to create account.";

            switch (error?.code) {
                case "auth/email-already-in-use":
                    message =
                        "This email is already registered.";
                    break;

                case "auth/invalid-email":
                    message =
                        "Please enter a valid email address.";
                    break;

                case "auth/weak-password":
                    message =
                        "Password is too weak. Use at least 6 characters.";
                    break;

                case "auth/network-request-failed":
                    message =
                        "Network error. Please check your internet connection.";
                    break;

                case "auth/operation-not-allowed":
                    message =
                        "Email/Password authentication is not enabled in Firebase.";
                    break;

                case "auth/too-many-requests":
                    message =
                        "Too many attempts. Please try again later.";
                    break;

                case "auth/invalid-credential":
                    message =
                        "The provided credentials are invalid.";
                    break;

                default:
                    message =
                        error?.message ||
                        "Unable to create account.";
            }

            Alert.alert(
                "Signup Failed",
                message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={styles.content}>
                <Text style={styles.title}>
                    Create account
                </Text>

                <Text style={styles.subtitle}>
                    Create your Trilok-On account
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        editable={!loading}
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={signup}
                    />

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed &&
                                !loading &&
                                styles.pressed,
                            loading &&
                                styles.disabledButton,
                        ]}
                        onPress={signup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Create account
                            </Text>
                        )}
                    </Pressable>
                </View>

                <Pressable
                    onPress={() =>
                        router.replace("/login")
                    }
                    disabled={loading}
                >
                    <Text style={styles.login}>
                        Already have an account?{" "}
                        <Text
                            style={
                                styles.loginLink
                            }
                        >
                            Login
                        </Text>
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F5",
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#171717",
    },

    subtitle: {
        marginTop: 8,
        marginBottom: 30,
        fontSize: 14,
        color: "#777777",
    },

    form: {
        width: "100%",
    },

    input: {
        height: 52,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDDDD8",
        borderRadius: 14,
        paddingHorizontal: 15,
        marginBottom: 12,
        fontSize: 15,
        color: "#171717",
    },

    button: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#171717",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    disabledButton: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    login: {
        textAlign: "center",
        marginTop: 22,
        color: "#555555",
        fontSize: 14,
    },

    loginLink: {
        color: "#171717",
        fontWeight: "700",
    },

    pressed: {
        opacity: 0.7,
    },
});