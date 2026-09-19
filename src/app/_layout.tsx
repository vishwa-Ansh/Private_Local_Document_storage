import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

import { auth, db } from "../lib/firebase";
import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

const APP_LOCK_KEY = "@trilok_on_app_lock";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppLayout() {
  const segments = useSegments();
  const { theme, colors } = useTheme();

  const [user, setUser] = useState<User | null>(
    auth.currentUser
  );

  const [loading, setLoading] = useState(true);

  const [profileCompleted, setProfileCompleted] =
    useState<boolean | null>(null);

  const [lockChecking, setLockChecking] =
    useState(false);

  const [appUnlocked, setAppUnlocked] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!mounted) {
          return;
        }

        console.log(
          "AUTH STATE:",
          currentUser?.uid || "NO USER"
        );

        setUser(currentUser);

        if (!currentUser) {
          setProfileCompleted(null);
          setAppUnlocked(false);
          setLoading(false);
          return;
        }

        setLoading(true);
        setProfileCompleted(null);
        setAppUnlocked(false);

        try {
          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const snapshotPromise = getDoc(userRef);

          const timeoutPromise = new Promise<null>(
            (resolve) => {
              setTimeout(
                () => resolve(null),
                8000
              );
            }
          );

          const snapshot = await Promise.race([
            snapshotPromise,
            timeoutPromise,
          ]);

          if (!mounted) {
            return;
          }

          if (!snapshot) {
            console.log(
              "PROFILE CHECK TIMEOUT"
            );

            setProfileCompleted(false);
            return;
          }

          console.log(
            "PROFILE EXISTS:",
            snapshot.exists()
          );

          if (!snapshot.exists()) {
            setProfileCompleted(false);
            return;
          }

          const data = snapshot.data();

          console.log(
            "PROFILE COMPLETED:",
            data.profileCompleted
          );

          setProfileCompleted(
            data.profileCompleted === true
          );
        } catch (error) {
          console.error(
            "PROFILE CHECK ERROR:",
            error
          );

          if (mounted) {
            setProfileCompleted(false);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const unlockApp = async () => {
    try {
      setLockChecking(true);

      const storedLock =
        await AsyncStorage.getItem(APP_LOCK_KEY);

      const lockEnabled =
        storedLock === "true";

      if (!lockEnabled) {
        setAppUnlocked(true);
        return;
      }

      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Unlock TL-On",
          fallbackLabel: "Use device passcode",
          disableDeviceFallback: false,
        });

      if (result.success) {
        setAppUnlocked(true);
      } else {
        setAppUnlocked(false);
      }
    } catch (error) {
      console.error(
        "APP LOCK ERROR:",
        error
      );

      setAppUnlocked(false);
    } finally {
      setLockChecking(false);
    }
  };

  useEffect(() => {
    if (
      loading ||
      !user ||
      profileCompleted !== true
    ) {
      return;
    }

    unlockApp();
  }, [
    loading,
    user,
    profileCompleted,
  ]);

  useEffect(() => {
    if (
      loading ||
      (user !== null &&
        profileCompleted === null)
    ) {
      return;
    }

    const firstSegment = segments[0];

    const inAuthScreen =
      firstSegment === "login" ||
      firstSegment === "signup";

    const inProfileScreen =
      firstSegment === "complete-profile";

    console.log("ROUTING:", {
      user: !!user,
      profileCompleted,
      firstSegment,
    });

    if (!user) {
      if (!inAuthScreen) {
        router.replace("/login");
      }

      return;
    }

    if (!profileCompleted) {
      if (!inProfileScreen) {
        router.replace("/complete-profile");
      }

      return;
    }

    if (
      inAuthScreen ||
      inProfileScreen
    ) {
      router.replace("/");
    }
  }, [
    user,
    loading,
    profileCompleted,
    segments,
  ]);

  if (
    loading ||
    (user !== null &&
      profileCompleted === null)
  ) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.logo,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.logoText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            TL
          </Text>
        </View>

        <ActivityIndicator
          size="small"
          color={colors.textSecondary}
          style={styles.loader}
        />
      </View>
    );
  }

  if (
    user &&
    profileCompleted === true &&
    (lockChecking || !appUnlocked)
  ) {
    return (
      <View
        style={[
          styles.lockContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.lockIcon,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.lockIconText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            🔒
          </Text>
        </View>

        <Text
          style={[
            styles.lockTitle,
            {
              color: colors.text,
            },
          ]}
        >
          TL-On is locked
        </Text>

        <Text
          style={[
            styles.lockSubtitle,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Use your fingerprint or device
          passcode to continue
        </Text>

        {lockChecking ? (
          <ActivityIndicator
            size="small"
            color={colors.textSecondary}
            style={styles.lockLoader}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={unlockApp}
            style={[
              styles.unlockButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.unlockButtonText,
                {
                  color:
                    colors.primaryText,
                },
              ]}
            >
              Unlock TL-On
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={
          theme === "dark"
            ? "light"
            : "dark"
        }
      />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  loader: {
    marginTop: 18,
  },

  lockContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  lockIconText: {
    fontSize: 28,
  },

  lockTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  lockSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 300,
  },

  lockLoader: {
    marginTop: 28,
  },

  unlockButton: {
    marginTop: 28,
    minWidth: 170,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  unlockButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});