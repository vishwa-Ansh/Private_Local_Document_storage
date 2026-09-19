import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

import { auth, db } from "../lib/firebase";
import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

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

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!mounted) return;

        setUser(currentUser);

        if (!currentUser) {
          setProfileCompleted(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setProfileCompleted(null);

        try {
          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const snapshot = await getDoc(userRef);

          if (!mounted) return;

          if (!snapshot.exists()) {
            setProfileCompleted(false);
            return;
          }

          const data = snapshot.data();

          setProfileCompleted(
            data.profileCompleted === true
          );
        } catch (error) {
          console.error(
            "Profile Check Error:",
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

  useEffect(() => {
    if (loading || profileCompleted === null) {
      return;
    }

    const firstSegment = segments[0];

    const inAuthScreen =
      firstSegment === "login" ||
      firstSegment === "signup";

    const inProfileScreen =
      firstSegment === "complete-profile";

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

    if (inAuthScreen || inProfileScreen) {
      router.replace("/");
    }
  }, [
    user,
    loading,
    profileCompleted,
    segments,
  ]);

  if (loading || profileCompleted === null) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.logo,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.logoText,
              {
                color: colors.primaryText,
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

  return (
    <>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
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
});