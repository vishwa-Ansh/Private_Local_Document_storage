import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../lib/firebase";
import { createUserDocument } from "../lib/user";
import "../lib/google";

WebBrowser.maybeCompleteAuthSession();

const githubDiscovery = {
    authorizationEndpoint:
        "https://github.com/login/oauth/authorize",
};

const GITHUB_CLIENT_ID = "Ov23liHFNkXBsH0btojN";
const API_URL = "https://tl-on-server.vercel.app";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [googleLoading, setGoogleLoading] =
        useState(false);

    const [githubLoading, setGithubLoading] =
        useState(false);

    const [emailLoading, setEmailLoading] =
        useState(false);

    const githubRedirectUri =
        AuthSession.makeRedirectUri({
            native: "quickaccess://github",
        });

    const [
        githubRequest,
        githubResponse,
        githubPromptAsync,
    ] = AuthSession.useAuthRequest(
        {
            clientId: GITHUB_CLIENT_ID,
            responseType: AuthSession.ResponseType.Code,
            scopes: ["read:user", "user:email"],
            redirectUri: githubRedirectUri,
            usePKCE: true,
        },
        githubDiscovery
    );

    const isLoading =
        emailLoading ||
        googleLoading ||
        githubLoading;

    useEffect(() => {
        if (!githubResponse) {
            return;
        }

        if (githubResponse.type === "success") {
            const code =
                githubResponse.params?.code;

            if (!code) {
                setGithubLoading(false);

                Alert.alert(
                    "GitHub Sign-In Failed",
                    "Authorization code was not received."
                );

                return;
            }

            handleGithubResponse(code);
            return;
        }

        if (
            githubResponse.type === "cancel" ||
            githubResponse.type === "dismiss"
        ) {
            setGithubLoading(false);
            return;
        }

        if (githubResponse.type === "error") {
            setGithubLoading(false);

            Alert.alert(
                "GitHub Sign-In Failed",
                githubResponse.params
                    ?.error_description ||
                    githubResponse.error?.message ||
                    "GitHub authorization failed."
            );
        }
    }, [githubResponse]);

    const getFirebaseErrorMessage = (
        error: any
    ) => {
        switch (error?.code) {
            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/user-not-found":
                return "No account exists with this email.";

            case "auth/wrong-password":
                return "Incorrect password.";

            case "auth/invalid-credential":
                return "Invalid email or password.";

            case "auth/user-disabled":
                return "This account has been disabled.";

            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            case "auth/operation-not-allowed":
                return "This sign-in method is not enabled in Firebase.";

            case "auth/account-exists-with-different-credential":
                return "An account already exists with another sign-in method.";

            default:
                return (
                    error?.message ||
                    "Something went wrong. Please try again."
                );
        }
    };

    const handleGithubResponse = async (
        code: string
    ) => {
        try {
            if (!githubRequest?.codeVerifier) {
                throw new Error(
                    "GitHub security verification could not be completed. Please try again."
                );
            }

            const response = await fetch(
                `${API_URL}/api/auth/github`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        codeVerifier:
                            githubRequest.codeVerifier,
                        redirectUri:
                            githubRedirectUri,
                    }),
                }
            );

            let data: any = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "GitHub authentication failed."
                );
            }

            if (!data?.accessToken) {
                throw new Error(
                    "GitHub access token was not received."
                );
            }

            const credential =
                GithubAuthProvider.credential(
                    data.accessToken
                );

            const result =
                await signInWithCredential(
                    auth,
                    credential
                );

            await createUserDocument(
                result.user
            );

            router.replace("/");
        } catch (error: any) {
            console.error(
                "GitHub Sign-In Error:",
                error?.message
            );

            Alert.alert(
                "GitHub Sign-In Failed",
                error?.message ||
                    "Unable to sign in with GitHub."
            );
        } finally {
            setGithubLoading(false);
        }
    };

    const login = async () => {
        const cleanEmail =
            email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            Alert.alert(
                "Missing Information",
                "Email and password are required."
            );
            return;
        }

        if (emailLoading) {
            return;
        }

        try {
            setEmailLoading(true);

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

            await createUserDocument(
                result.user
            );

            router.replace("/complete-profile");
        } catch (error: any) {
            console.error(
                "Email Login Error:",
                error?.code
            );

            Alert.alert(
                "Login Failed",
                getFirebaseErrorMessage(error)
            );
        } finally {
            setEmailLoading(false);
        }
    };

    const googleLogin = async () => {
        if (googleLoading) {
            return;
        }

        try {
            setGoogleLoading(true);

            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            const response =
                await GoogleSignin.signIn();

            if (response.type !== "success") {
                return;
            }

            const idToken =
                response.data?.idToken;

            if (!idToken) {
                throw new Error(
                    "Google ID token was not received."
                );
            }

            const credential =
                GoogleAuthProvider.credential(
                    idToken
                );

            const result =
                await signInWithCredential(
                    auth,
                    credential
                );

            await createUserDocument(
                result.user
            );

            router.replace("/");
        } catch (error: any) {
            console.error(
                "Google Sign-In Error:",
                error?.code
            );

            if (
                error?.code ===
                statusCodes.SIGN_IN_CANCELLED
            ) {
                return;
            }

            if (
                error?.code ===
                statusCodes.IN_PROGRESS
            ) {
                return;
            }

            if (
                error?.code ===
                statusCodes.PLAY_SERVICES_NOT_AVAILABLE
            ) {
                Alert.alert(
                    "Google Sign-In",
                    "Google Play Services are not available."
                );
                return;
            }

            Alert.alert(
                "Google Sign-In Failed",
                getFirebaseErrorMessage(error)
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    const githubLogin = async () => {
        if (
            githubLoading ||
            !githubRequest
        ) {
            return;
        }

        try {
            setGithubLoading(true);

            await githubPromptAsync();
        } catch (error: any) {
            console.error(
                "GitHub Login Error:",
                error?.message
            );

            setGithubLoading(false);

            Alert.alert(
                "GitHub Sign-In Failed",
                error?.message ||
                    "Unable to start GitHub sign-in."
            );
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <Text style={styles.title}>
                Welcome back
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
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
                editable={!isLoading}
            />

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed &&
                        !isLoading &&
                        styles.pressed,
                    isLoading &&
                        styles.disabledButton,
                ]}
                onPress={login}
                disabled={isLoading}
            >
                {emailLoading ? (
                    <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                    />
                ) : (
                    <Text
                        style={styles.buttonText}
                    >
                        Login
                    </Text>
                )}
            </Pressable>

            <View style={styles.divider}>
                <View style={styles.line} />

                <Text style={styles.orText}>
                    OR
                </Text>

                <View style={styles.line} />
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.socialButton,
                    pressed &&
                        !isLoading &&
                        styles.pressed,
                    isLoading &&
                        styles.disabledSocialButton,
                ]}
                onPress={googleLogin}
                disabled={isLoading}
            >
                {googleLoading ? (
                    <ActivityIndicator
                        size="small"
                        color="#4285F4"
                    />
                ) : (
                    <Ionicons
                        name="logo-google"
                        size={20}
                        color="#4285F4"
                    />
                )}

                <Text
                    style={
                        styles.socialButtonText
                    }
                >
                    {googleLoading
                        ? "Signing in..."
                        : "Continue with Google"}
                </Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.socialButton,
                    styles.githubButton,
                    pressed &&
                        !isLoading &&
                        styles.pressed,
                    isLoading &&
                        styles.disabledSocialButton,
                ]}
                onPress={githubLogin}
                disabled={
                    isLoading ||
                    !githubRequest
                }
            >
                {githubLoading ? (
                    <ActivityIndicator
                        size="small"
                        color="#171717"
                    />
                ) : (
                    <Ionicons
                        name="logo-github"
                        size={20}
                        color="#171717"
                    />
                )}

                <Text
                    style={
                        styles.socialButtonText
                    }
                >
                    {githubLoading
                        ? "Signing in..."
                        : "Continue with GitHub"}
                </Text>
            </Pressable>

            <Pressable
                onPress={() =>
                    router.push("/signup")
                }
                disabled={isLoading}
            >
                <Text style={styles.signup}>
                    Don't have an account?{" "}
                    <Text style={styles.signupLink}>
                        Sign up
                    </Text>
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#F7F7F5",
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 30,
        color: "#171717",
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

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#DEDED9",
    },

    orText: {
        marginHorizontal: 12,
        fontSize: 11,
        fontWeight: "600",
        color: "#999999",
    },

    socialButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDDDD8",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },

    disabledSocialButton: {
        opacity: 0.6,
    },

    githubButton: {
        marginTop: 12,
    },

    socialButtonText: {
        color: "#222222",
        fontSize: 15,
        fontWeight: "600",
    },

    signup: {
        textAlign: "center",
        marginTop: 20,
        color: "#555555",
        fontSize: 14,
    },

    signupLink: {
        color: "#171717",
        fontWeight: "700",
    },

    pressed: {
        opacity: 0.7,
    },
});