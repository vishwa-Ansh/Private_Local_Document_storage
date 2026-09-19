import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../lib/firebase";
import { useTheme } from "../context/ThemeContext";

type UserProfile = {
  uid: string;
  name: string;
  username: string;
  email: string;
  photoURL: string;
  provider: string;
  plan: string;
};

const getPhotoKey = (uid: string) =>
  `@trilok_on_profile_photo_${uid}`;

const getLocalPhotoPath = (uid: string) =>
  `${FileSystem.documentDirectory}profile_${uid}.jpg`;

function ProfilePage() {
  const { colors, theme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          router.replace("/login");
          return;
        }

        setUser(currentUser);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snapshot = await getDoc(userRef);

          let firestoreData: any = {};

          if (snapshot.exists()) {
            firestoreData = snapshot.data();
          }

          const localPhoto = await loadLocalPhoto(
            currentUser.uid
          );

          const userProfile: UserProfile = {
            uid: currentUser.uid,
            name:
              firestoreData.name ||
              currentUser.displayName ||
              "",
            username: firestoreData.username || "",
            email:
              firestoreData.email ||
              currentUser.email ||
              "",
            photoURL: localPhoto,
            provider:
              firestoreData.provider ||
              currentUser.providerData?.[0]?.providerId ||
              "password",
            plan: firestoreData.plan || "free",
          };

          setProfile(userProfile);
          setName(userProfile.name);
          setUsername(userProfile.username);
        } catch (error) {
          console.error("Profile Load Error:", error);

          Alert.alert(
            "Unable to load profile",
            "Please check your internet connection and try again."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const loadLocalPhoto = async (uid: string) => {
    try {
      const savedPhoto = await AsyncStorage.getItem(
        getPhotoKey(uid)
      );

      if (!savedPhoto) {
        return "";
      }

      const info =
        await FileSystem.getInfoAsync(savedPhoto);

      if (info.exists) {
        return savedPhoto;
      }

      await AsyncStorage.removeItem(getPhotoKey(uid));

      return "";
    } catch (error) {
      console.error("Local Photo Load Error:", error);
      return "";
    }
  };

  const getInitials = () => {
    const source =
      profile?.name ||
      user?.displayName ||
      "U";

    const parts = source
      .trim()
      .split(" ")
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source
      .slice(0, 2)
      .toUpperCase();
  };

  const pickFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to select a profile photo."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.9,
        });

      if (
        !result.canceled &&
        result.assets?.[0]?.uri
      ) {
        await saveLocalPhoto(
          result.assets[0].uri
        );
      }
    } catch (error) {
      console.error("Gallery Error:", error);

      Alert.alert(
        "Error",
        "Unable to select image."
      );
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow camera access to take a profile photo."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.9,
        });

      if (
        !result.canceled &&
        result.assets?.[0]?.uri
      ) {
        await saveLocalPhoto(
          result.assets[0].uri
        );
      }
    } catch (error) {
      console.error("Camera Error:", error);

      Alert.alert(
        "Error",
        "Unable to open camera."
      );
    }
  };

  const saveLocalPhoto = async (
    imageUri: string
  ) => {
    if (!user) return;

    setPhotoLoading(true);
    setShowPhotoSheet(false);

    try {
      const localPath =
        getLocalPhotoPath(user.uid);

      const existing =
        await FileSystem.getInfoAsync(localPath);

      if (existing.exists) {
        await FileSystem.deleteAsync(
          localPath,
          {
            idempotent: true,
          }
        );
      }

      await FileSystem.copyAsync({
        from: imageUri,
        to: localPath,
      });

      await AsyncStorage.setItem(
        getPhotoKey(user.uid),
        localPath
      );

      setProfile((previous) =>
        previous
          ? {
              ...previous,
              photoURL: localPath,
            }
          : previous
      );
    } catch (error) {
      console.error(
        "Save Local Photo Error:",
        error
      );

      Alert.alert(
        "Photo error",
        "Unable to save your profile photo on this device."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const removePhoto = async () => {
    if (!user) return;

    setShowPhotoSheet(false);

    Alert.alert(
      "Remove profile photo?",
      "Your profile photo will be removed from this device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setPhotoLoading(true);

            try {
              const localPath =
                getLocalPhotoPath(user.uid);

              await FileSystem.deleteAsync(
                localPath,
                {
                  idempotent: true,
                }
              );

              await AsyncStorage.removeItem(
                getPhotoKey(user.uid)
              );

              setProfile((previous) =>
                previous
                  ? {
                      ...previous,
                      photoURL: "",
                    }
                  : previous
              );
            } catch (error) {
              console.error(
                "Remove Photo Error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to remove your profile photo."
              );
            } finally {
              setPhotoLoading(false);
            }
          },
        },
      ]
    );
  };

  const saveProfileChanges = async () => {
    if (!user) return;

    const cleanName = name.trim();

    const cleanUsername = username
      .trim()
      .replace(/\s+/g, "")
      .replace(/^@/, "");

    if (!cleanName) {
      Alert.alert(
        "Name required",
        "Please enter your name."
      );
      return;
    }

    if (
      cleanUsername &&
      cleanUsername.length < 3
    ) {
      Alert.alert(
        "Invalid username",
        "Username must contain at least 3 characters."
      );
      return;
    }

    setSaving(true);

    try {
      await updateProfile(user, {
        displayName: cleanName,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: cleanName,
          username: cleanUsername,
          email: user.email || "",
          provider:
            profile?.provider ||
            user.providerData?.[0]?.providerId ||
            "password",
          plan: profile?.plan || "free",
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setProfile((previous) =>
        previous
          ? {
              ...previous,
              name: cleanName,
              username: cleanUsername,
            }
          : previous
      );

      setName(cleanName);
      setUsername(cleanUsername);
      setShowEditSheet(false);
    } catch (error) {
      console.error(
        "Save Profile Error:",
        error
      );

      Alert.alert(
        "Update failed",
        "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
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
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error) {
              console.error(
                "Sign Out Error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to sign out. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <StatusBar
          style={
            theme === "dark"
              ? "light"
              : "dark"
          }
        />

        <ActivityIndicator
          size="small"
          color={colors.text}
        />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <StatusBar
          style={
            theme === "dark"
              ? "light"
              : "dark"
          }
        />

        <Text
          style={[
            styles.errorText,
            {
              color: colors.text,
            },
          ]}
        >
          Profile unavailable
        </Text>

        <Pressable
          onPress={() =>
            router.replace("/")
          }
          style={[
            styles.backButton,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            Go Home
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isPremium =
    profile.plan === "premium";

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <StatusBar
        style={
          theme === "dark"
            ? "light"
            : "dark"
        }
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={[
              styles.headerButton,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
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
            Profile
          </Text>

          <Pressable
            onPress={() =>
              setShowEditSheet(true)
            }
            style={[
              styles.headerButton,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View
          style={styles.profileSection}
        >
          <Pressable
            onPress={() =>
              setShowPhotoSheet(true)
            }
            style={styles.avatarWrapper}
          >
            {profile.photoURL ? (
              <Image
                source={{
                  uri: profile.photoURL,
                }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.initialAvatar,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.initialText,
                    {
                      color:
                        colors.primaryText,
                    },
                  ]}
                >
                  {getInitials()}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.cameraButton,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {photoLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.text}
                />
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={15}
                  color={colors.text}
                />
              )}
            </View>
          </Pressable>

          <Text
            style={[
              styles.profileName,
              {
                color: colors.text,
              },
            ]}
          >
            {profile.name || "User"}
          </Text>

          {profile.username ? (
            <Text
              style={[
                styles.username,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              @{profile.username}
            </Text>
          ) : null}

          <Text
            style={[
              styles.email,
              {
                color: colors.textMuted,
              },
            ]}
          >
            {profile.email}
          </Text>

          <View
            style={[
              styles.providerBadge,
              {
                backgroundColor:
                  colors.surfaceSecondary,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name={
                profile.provider ===
                "google.com"
                  ? "logo-google"
                  : profile.provider ===
                    "github.com"
                  ? "logo-github"
                  : "mail-outline"
              }
              size={14}
              color={
                colors.textSecondary
              }
            />

            <Text
              style={[
                styles.providerText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {profile.provider ===
              "google.com"
                ? "Google"
                : profile.provider ===
                  "github.com"
                ? "GitHub"
                : "Email"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.premiumCard,
            {
              backgroundColor:
                theme === "dark"
                  ? "#1B1B1E"
                  : "#171717",
              borderColor:
                theme === "dark"
                  ? "#303035"
                  : "#292929",
            },
          ]}
        >
          <View style={styles.premiumTop}>
            <View
              style={[
                styles.premiumIcon,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "#29292D"
                      : "#292929",
                },
              ]}
            >
              <Ionicons
                name="sparkles"
                size={19}
                color="#FFFFFF"
              />
            </View>

            <View
              style={styles.premiumInfo}
            >
              <Text
                style={
                  styles.premiumTitle
                }
              >
                {isPremium
                  ? "Trilok-On Premium"
                  : "Upgrade to Premium"}
              </Text>

              <Text
                style={
                  styles.premiumSubtitle
                }
              >
                {isPremium
                  ? "Your premium plan is active."
                  : "Unlock more power for your AI workspace."}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#FFFFFF"
            />
          </View>

          {!isPremium && (
            <Pressable
              onPress={() => {}}
              style={
                styles.upgradeButton
              }
            >
              <Text
                style={
                  styles.upgradeButtonText
                }
              >
                Explore Premium
              </Text>
            </Pressable>
          )}
        </View>

        <Section title="Account">
          <ProfileRow
            icon="person-outline"
            title="Personal information"
            subtitle="Name and username"
            onPress={() =>
              setShowEditSheet(true)
            }
          />

          <ProfileRow
            icon="mail-outline"
            title="Email address"
            subtitle={profile.email}
            onPress={() =>
              Alert.alert(
                "Email address",
                "Your email address is managed by your authentication provider."
              )
            }
          />

          <ProfileRow
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Authentication and account security"
            onPress={() =>
              Alert.alert(
                "Security",
                "Your authentication is securely managed by Firebase."
              )
            }
          />
        </Section>

        <Section title="Activity">
          <ProfileRow
            icon="chatbubble-ellipses-outline"
            title="Chat history"
            subtitle="View your previous conversations"
            onPress={() =>
              router.push("/history")
            }
          />

          <ProfileRow
            icon="folder-open-outline"
            title="Projects"
            subtitle="Manage your AI projects"
            onPress={() =>
              router.push("/projects")
            }
          />

          <ProfileRow
            icon="analytics-outline"
            title="Usage"
            subtitle="View your AI usage"
            onPress={() =>
              Alert.alert(
                "Usage",
                "Detailed usage analytics will be available here."
              )
            }
          />
        </Section>

        <Section title="Preferences">
          <ProfileRow
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={() =>
              router.push("/settings")
            }
          />

          <ProfileRow
            icon="color-palette-outline"
            title="Appearance"
            subtitle={
              theme === "dark"
                ? "Dark mode"
                : "Light mode"
            }
            onPress={() =>
              router.push("/settings")
            }
          />

          <ProfileRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() =>
              Alert.alert(
                "Notifications",
                "Notification preferences can be configured in Settings."
              )
            }
          />
        </Section>

        <Section title="Account actions">
          <ProfileRow
            icon="help-circle-outline"
            title="Help & support"
            subtitle="Get help with Trilok-On"
            onPress={() =>
              Alert.alert(
                "Help & Support",
                "Support options will be available here."
              )
            }
          />

          <ProfileRow
            icon="document-text-outline"
            title="Terms & privacy"
            subtitle="Legal information"
            onPress={() =>
              Alert.alert(
                "Terms & Privacy",
                "Legal information will be available here."
              )
            }
          />

          <ProfileRow
            icon="log-out-outline"
            title="Sign out"
            subtitle="Sign out from this device"
            danger
            onPress={handleSignOut}
          />
        </Section>

        <View
          style={[
            styles.usageCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={styles.usageHeader}
          >
            <View>
              <Text
                style={[
                  styles.usageTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Free plan usage
              </Text>

              <Text
                style={[
                  styles.usageSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Your current usage overview
              </Text>
            </View>

            <Ionicons
              name="speedometer-outline"
              size={21}
              color={
                colors.textSecondary
              }
            />
          </View>

          <UsageItem
            title="Messages"
            value="12 / 50"
            progress={0.24}
          />

          <UsageItem
            title="Projects"
            value="2 / 5"
            progress={0.4}
          />

          <UsageItem
            title="Storage"
            value="18 MB / 100 MB"
            progress={0.18}
          />
        </View>

        <Text
          style={[
            styles.version,
            {
              color: colors.textMuted,
            },
          ]}
        >
          Trilok-On • Version 1.0.0
        </Text>
      </ScrollView>

      <PhotoSheet
        visible={showPhotoSheet}
        onClose={() =>
          setShowPhotoSheet(false)
        }
        onCamera={takePhoto}
        onGallery={pickFromGallery}
        onRemove={removePhoto}
        hasPhoto={!!profile.photoURL}
      />

      <EditProfileSheet
        visible={showEditSheet}
        onClose={() =>
          setShowEditSheet(false)
        }
        name={name}
        username={username}
        setName={setName}
        setUsername={setUsername}
        onSave={saveProfileChanges}
        saving={saving}
      />
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
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {title.toUpperCase()}
      </Text>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor:
              colors.surface,
            borderColor:
              colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function ProfileRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { colors, theme } =
    useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileRow,
        {
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          {
            backgroundColor: danger
              ? theme === "dark"
                ? "#321A1A"
                : "#FCEDEA"
              : colors.surfaceSecondary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={
            danger
              ? colors.danger
              : colors.text
          }
        />
      </View>

      <View
        style={styles.rowContent}
      >
        <Text
          style={[
            styles.rowTitle,
            {
              color: danger
                ? colors.danger
                : colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.rowSubtitle,
            {
              color:
                colors.textMuted,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function UsageItem({
  title,
  value,
  progress,
}: {
  title: string;
  value: string;
  progress: number;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={styles.usageItem}
    >
      <View
        style={styles.usageItemTop}
      >
        <Text
          style={[
            styles.usageItemTitle,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.usageItemValue,
            {
              color: colors.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor:
              colors.surfaceSecondary,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                Math.min(
                  progress,
                  1
                ) * 100
              }%`,
              backgroundColor:
                colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

function PhotoSheet({
  visible,
  onClose,
  onCamera,
  onGallery,
  onRemove,
  hasPhoto,
}: {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onRemove: () => void;
  hasPhoto: boolean;
}) {
  const { colors } =
    useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor:
              colors.overlay,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <View
            style={styles.sheetHeader}
          >
            <View>
              <Text
                style={[
                  styles.sheetTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Profile photo
              </Text>

              <Text
                style={[
                  styles.sheetSubtitle,
                  {
                    color:
                      colors.textMuted,
                  },
                ]}
              >
                Your photo stays on this device
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="close"
                size={19}
                color={colors.text}
              />
            </Pressable>
          </View>

          <SheetAction
            icon="camera-outline"
            title="Take a photo"
            subtitle="Use your camera"
            onPress={onCamera}
          />

          <SheetAction
            icon="images-outline"
            title="Choose from gallery"
            subtitle="Select an existing photo"
            onPress={onGallery}
          />

          {hasPhoto && (
            <SheetAction
              icon="trash-outline"
              title="Remove photo"
              subtitle="Delete the local profile photo"
              danger
              onPress={onRemove}
            />
          )}

          <View
            style={
              styles.sheetBottomSpace
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function SheetAction({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { colors, theme } =
    useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.sheetAction,
        {
          backgroundColor:
            pressed
              ? colors.surfaceSecondary
              : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.sheetActionIcon,
          {
            backgroundColor: danger
              ? theme === "dark"
                ? "#321A1A"
                : "#FCEDEA"
              : colors.surfaceSecondary,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={
            danger
              ? colors.danger
              : colors.text
          }
        />
      </View>

      <View
        style={
          styles.sheetActionContent
        }
      >
        <Text
          style={[
            styles.sheetActionTitle,
            {
              color: danger
                ? colors.danger
                : colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sheetActionSubtitle,
            {
              color:
                colors.textMuted,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function EditProfileSheet({
  visible,
  onClose,
  name,
  username,
  setName,
  setUsername,
  onSave,
  saving,
}: {
  visible: boolean;
  onClose: () => void;
  name: string;
  username: string;
  setName: (value: string) => void;
  setUsername: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { colors } =
    useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor:
              colors.overlay,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <View
            style={styles.sheetHeader}
          >
            <View>
              <Text
                style={[
                  styles.sheetTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Edit profile
              </Text>

              <Text
                style={[
                  styles.sheetSubtitle,
                  {
                    color:
                      colors.textMuted,
                  },
                ]}
              >
                Update your profile information
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="close"
                size={19}
                color={colors.text}
              />
            </Pressable>
          </View>

          <View
            style={styles.inputGroup}
          >
            <Text
              style={[
                styles.inputLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              NAME
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor:
                    colors.input,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={19}
                color={colors.textMuted}
              />

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={
                  colors.textMuted
                }
                style={[
                  styles.input,
                  {
                    color:
                      colors.text,
                  },
                ]}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View
            style={styles.inputGroup}
          >
            <Text
              style={[
                styles.inputLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              USERNAME
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor:
                    colors.input,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.atSymbol,
                  {
                    color:
                      colors.textMuted,
                  },
                ]}
              >
                @
              </Text>

              <TextInput
                value={username}
                onChangeText={
                  setUsername
                }
                placeholder="username"
                placeholderTextColor={
                  colors.textMuted
                }
                style={[
                  styles.input,
                  {
                    color:
                      colors.text,
                  },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <Pressable
            disabled={saving}
            onPress={onSave}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor:
                  colors.primary,
                opacity: saving
                  ? 0.6
                  : pressed
                  ? 0.8
                  : 1,
              },
            ]}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color={
                  colors.primaryText
                }
              />
            ) : (
              <>
                <Ionicons
                  name="checkmark"
                  size={19}
                  color={
                    colors.primaryText
                  }
                />

                <Text
                  style={[
                    styles.saveButtonText,
                    {
                      color:
                        colors.primaryText,
                    },
                  ]}
                >
                  Save changes
                </Text>
              </>
            )}
          </Pressable>

          <View
            style={
              styles.sheetBottomSpace
            }
          />
        </View>
      </View>
    </Modal>
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

  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
  },

  header: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 26,
  },

  avatarWrapper: {
    width: 104,
    height: 104,
    position: "relative",
    marginBottom: 15,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },

  initialAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },

  initialText: {
    fontSize: 31,
    fontWeight: "700",
    letterSpacing: -1,
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  profileName: {
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.6,
  },

  username: {
    fontSize: 14,
    marginTop: 3,
  },

  email: {
    fontSize: 13,
    marginTop: 5,
  },

  providerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
  },

  providerText: {
    fontSize: 12,
    fontWeight: "600",
  },

  premiumCard: {
    borderRadius: 22,
    padding: 17,
    borderWidth: 1,
    marginBottom: 28,
  },

  premiumTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  premiumIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  premiumInfo: {
    flex: 1,
    marginLeft: 12,
  },

  premiumTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  premiumSubtitle: {
    color: "#AFAFAF",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },

  upgradeButton: {
    height: 43,
    marginTop: 16,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  upgradeButtonText: {
    color: "#171717",
    fontSize: 13,
    fontWeight: "700",
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginBottom: 9,
    paddingLeft: 4,
  },

  sectionCard: {
    borderRadius: 19,
    borderWidth: 1,
    overflow: "hidden",
  },

  profileRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  rowSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  usageCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
    marginTop: 1,
  },

  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19,
  },

  usageTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  usageSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  usageItem: {
    marginBottom: 15,
  },

  usageItemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  usageItemTitle: {
    fontSize: 12,
  },

  usageItemValue: {
    fontSize: 12,
    fontWeight: "600",
  },

  progressTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  version: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 25,
  },

  errorText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 18,
  },

  backButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 13,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 20,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },

  sheetSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetAction: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 8,
  },

  sheetActionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetActionContent: {
    flex: 1,
    marginLeft: 12,
  },

  sheetActionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  sheetActionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  sheetBottomSpace: {
    height: 15,
  },

  inputGroup: {
    marginBottom: 17,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 2,
  },

  inputWrapper: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    height: "100%",
  },

  atSymbol: {
    fontSize: 18,
    fontWeight: "600",
  },

  saveButton: {
    height: 52,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 5,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ProfilePage;