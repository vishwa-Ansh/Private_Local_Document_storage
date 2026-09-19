import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import {
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
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
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { auth, db } from "../lib/firebase";
import { useTheme } from "../context/ThemeContext";

type PhotoActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onRemove: () => void;
  hasPhoto: boolean;
  loading: boolean;
};

const getPhotoKey = (uid: string) =>
  `@trilok_on_profile_photo_${uid}`;

const getLocalPhotoPath = (uid: string) =>
  `${FileSystem.documentDirectory}profile_${uid}.jpg`;

function PhotoActionSheet({
  visible,
  onClose,
  onCamera,
  onGallery,
  onRemove,
  hasPhoto,
  loading,
}: PhotoActionSheetProps) {
  const { colors, theme } = useTheme();

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
            backgroundColor: colors.overlay,
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
              backgroundColor: colors.surface,
            },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderText}>
              <Text
                style={[
                  styles.sheetTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Profile picture
              </Text>

              <Text
                style={[
                  styles.sheetSubtitle,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                Your photo stays on this device
              </Text>
            </View>

            <Pressable
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
              onPress={onClose}
              disabled={loading}
            >
              <Ionicons
                name="close"
                size={20}
                color={colors.text}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.optionsCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <PhotoOption
              icon="camera-outline"
              title="Take a photo"
              subtitle="Use your camera"
              onPress={onCamera}
              loading={loading}
            />

            <PhotoOption
              icon="images-outline"
              title="Choose from gallery"
              subtitle="Select an existing photo"
              onPress={onGallery}
              loading={loading}
            />

            {hasPhoto && (
              <PhotoOption
                icon="trash-outline"
                title="Remove photo"
                subtitle="Use your initials instead"
                onPress={onRemove}
                loading={loading}
                danger
              />
            )}
          </View>

          <Pressable
            style={[
              styles.cancelButton,
              {
                backgroundColor:
                  colors.surfaceSecondary,
              },
            ]}
            onPress={onClose}
            disabled={loading}
          >
            <Text
              style={[
                styles.cancelText,
                {
                  color: colors.text,
                },
              ]}
            >
              Cancel
            </Text>
          </Pressable>

          <View
            style={{
              height:
                Platform.OS === "ios" ? 4 : 0,
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

function PhotoOption({
  icon,
  title,
  subtitle,
  onPress,
  loading,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  loading: boolean;
  danger?: boolean;
}) {
  const { colors, theme } = useTheme();

  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: pressed
            ? colors.surfaceSecondary
            : colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.optionIcon,
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

      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
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
            styles.optionSubtitle,
            {
              color: colors.textMuted,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

export default function CompleteProfile() {
  const { colors, theme } = useTheme();

  const [user, setUser] = useState<User | null>(
    auth.currentUser
  );

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");

  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] =
    useState(false);

  const [photoSheetVisible, setPhotoSheetVisible] =
    useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);
    setName(currentUser.displayName || "");

    loadLocalPhoto(currentUser.uid);
  }, []);

  const loadLocalPhoto = async (
    uid: string
  ) => {
    try {
      const savedPhoto =
        await AsyncStorage.getItem(
          getPhotoKey(uid)
        );

      if (!savedPhoto) {
        return;
      }

      const info =
        await FileSystem.getInfoAsync(
          savedPhoto
        );

      if (info.exists) {
        setPhoto(savedPhoto);
      } else {
        await AsyncStorage.removeItem(
          getPhotoKey(uid)
        );
      }
    } catch (error) {
      console.error(
        "Load Local Photo Error:",
        error
      );
    }
  };

  const normalizeUsername = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
  };

  const saveLocalPhoto = async (
    imageUri: string
  ) => {
    if (!user) {
      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    const localPath =
      getLocalPhotoPath(user.uid);

    const existing =
      await FileSystem.getInfoAsync(
        localPath
      );

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

    setPhoto(localPath);
  };

  const pickFromGallery = async () => {
    if (photoLoading) {
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to select a profile picture."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          }
        );

      if (result.canceled) {
        return;
      }

      const imageUri =
        result.assets?.[0]?.uri;

      if (!imageUri) {
        Alert.alert(
          "Unable to select photo",
          "Please choose another image."
        );
        return;
      }

      setPhotoSheetVisible(false);
      setPhotoLoading(true);

      await saveLocalPhoto(imageUri);
    } catch (error: any) {
      console.error(
        "Gallery Photo Error:",
        error
      );

      Alert.alert(
        "Photo error",
        error?.message ||
          "Unable to save your photo."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const takePhoto = async () => {
    if (photoLoading) {
      return;
    }

    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow camera access to take a profile picture."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const imageUri =
        result.assets?.[0]?.uri;

      if (!imageUri) {
        Alert.alert(
          "Unable to capture photo",
          "Please try again."
        );
        return;
      }

      setPhotoSheetVisible(false);
      setPhotoLoading(true);

      await saveLocalPhoto(imageUri);
    } catch (error: any) {
      console.error(
        "Camera Photo Error:",
        error
      );

      Alert.alert(
        "Photo error",
        error?.message ||
          "Unable to save your photo."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const removePhoto = async () => {
    if (!user || photoLoading) {
      return;
    }

    try {
      setPhotoSheetVisible(false);
      setPhotoLoading(true);

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

      setPhoto("");
    } catch (error: any) {
      console.error(
        "Remove Local Photo Error:",
        error
      );

      Alert.alert(
        "Unable to remove photo",
        error?.message ||
          "Something went wrong."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const confirmRemovePhoto = () => {
    Alert.alert(
      "Remove profile picture",
      "Your profile picture will be removed from this device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: removePhoto,
        },
      ]
    );
  };

  const saveProfile = async () => {
    if (loading) {
      return;
    }

    const currentUser =
      user || auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Session expired",
        "Please login again."
      );

      router.replace("/login");
      return;
    }

    const cleanName = name.trim();

    const cleanUsername =
      normalizeUsername(username);

    if (!cleanName) {
      Alert.alert(
        "Name required",
        "Please enter your full name."
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        "Invalid name",
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (!cleanUsername) {
      Alert.alert(
        "Username required",
        "Please choose a username."
      );
      return;
    }

    if (cleanUsername.length < 3) {
      Alert.alert(
        "Invalid username",
        "Username must contain at least 3 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await updateProfile(currentUser, {
        displayName: cleanName,
        photoURL: null,
      });

      await setDoc(
        doc(
          db,
          "users",
          currentUser.uid
        ),
        {
          uid: currentUser.uid,
          name: cleanName,
          username: cleanUsername,
          email:
            currentUser.email || "",
          photoURL: "",
          provider:
            currentUser.providerData?.[0]
              ?.providerId ||
            "password",
          plan: "free",
          profileCompleted: true,
          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      router.replace("/");
    } catch (error: any) {
      console.error(
        "Profile Setup Error:",
        error
      );

      let message =
        "Unable to save your profile.";

      if (
        error?.code ===
        "permission-denied"
      ) {
        message =
          "Firestore permission denied. Check your Firestore security rules.";
      }

      Alert.alert(
        "Unable to save profile",
        error?.message || message
      );
    } finally {
      setLoading(false);
    }
  };

  const displayInitial =
    name.trim().charAt(0).toUpperCase() ||
    "U";

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
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
        <View style={styles.top}>
          <View style={styles.brand}>
            <View
              style={[
                styles.brandIcon,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.brandIconText,
                  {
                    color:
                      colors.primaryText,
                  },
                ]}
              >
                TL
              </Text>
            </View>

            <Text
              style={[
                styles.brandText,
                {
                  color: colors.text,
                },
              ]}
            >
              TL-On
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Complete your profile
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Set up your profile to personalize
            your TL-On experience.
          </Text>
        </View>

        <View style={styles.photoSection}>
          <Pressable
            style={({ pressed }) => [
              styles.avatarWrapper,
              pressed &&
                styles.avatarPressed,
            ]}
            onPress={() =>
              setPhotoSheetVisible(true)
            }
            disabled={
              loading || photoLoading
            }
          >
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    colors.surfaceSecondary,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {photo ? (
                <Image
                  source={{
                    uri: photo,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text
                  style={[
                    styles.avatarInitial,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {displayInitial}
                </Text>
              )}
            </View>

            <View
              style={[
                styles.camera,
                {
                  backgroundColor:
                    colors.primary,
                  borderColor:
                    colors.background,
                },
              ]}
            >
              {photoLoading ? (
                <ActivityIndicator
                  size="small"
                  color={
                    colors.primaryText
                  }
                />
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={15}
                  color={
                    colors.primaryText
                  }
                />
              )}
            </View>
          </Pressable>

          <Text
            style={[
              styles.photoTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {photo
              ? "Change profile photo"
              : "Add profile photo"}
          </Text>

          <Text
            style={[
              styles.photoSubtitle,
              {
                color: colors.textMuted,
              },
            ]}
          >
            Optional · Stored only on this device
          </Text>
        </View>

        <View style={styles.form}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            FULL NAME
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
              size={18}
              color={colors.textMuted}
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={
                colors.textMuted
              }
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={
                !loading && !photoLoading
              }
            />
          </View>

          <Text
            style={[
              styles.label,
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
              styles.usernameInput,
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
                styles.usernamePrefix,
                {
                  color:
                    colors.textMuted,
                },
              ]}
            >
              @
            </Text>

            <TextInput
              style={[
                styles.usernameField,
                {
                  color: colors.text,
                },
              ]}
              placeholder="username"
              placeholderTextColor={
                colors.textMuted
              }
              value={username}
              onChangeText={(value) =>
                setUsername(
                  normalizeUsername(value)
                )
              }
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              editable={
                !loading && !photoLoading
              }
            />
          </View>

          <Text
            style={[
              styles.hint,
              {
                color: colors.textMuted,
              },
            ]}
          >
            3–20 characters · letters, numbers
            and underscores
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor:
                colors.primary,
              opacity: loading ? 0.6 : 1,
            },
            pressed &&
              !loading &&
              styles.buttonPressed,
          ]}
          onPress={saveProfile}
          disabled={
            loading || photoLoading
          }
        >
          {loading ? (
            <>
              <ActivityIndicator
                size="small"
                color={
                  colors.primaryText
                }
              />

              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      colors.primaryText,
                  },
                ]}
              >
                Saving...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      colors.primaryText,
                  },
                ]}
              >
                Continue
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={
                  colors.primaryText
                }
              />
            </>
          )}
        </Pressable>

        <Text
          style={[
            styles.footerText,
            {
              color: colors.textMuted,
            },
          ]}
        >
          You can update your profile anytime
          from Settings.
        </Text>
      </View>

      <PhotoActionSheet
        visible={photoSheetVisible}
        onClose={() =>
          setPhotoSheetVisible(false)
        }
        onCamera={takePhoto}
        onGallery={pickFromGallery}
        onRemove={confirmRemovePhoto}
        hasPhoto={Boolean(photo)}
        loading={photoLoading}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 24,
  },

  top: {
    alignItems: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 27,
  },

  brandIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  brandIconText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  brandText: {
    fontSize: 14,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    maxWidth: 330,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  photoSection: {
    alignItems: "center",
    marginTop: 27,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarPressed: {
    opacity: 0.75,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitial: {
    fontSize: 34,
    fontWeight: "700",
  },

  camera: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  photoTitle: {
    marginTop: 11,
    fontSize: 12,
    fontWeight: "600",
  },

  photoSubtitle: {
    marginTop: 3,
    fontSize: 10,
  },

  form: {
    marginTop: 25,
  },

  label: {
    marginBottom: 7,
    marginLeft: 3,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  inputWrapper: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 9,
    fontSize: 14,
  },

  usernameInput: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  usernamePrefix: {
    paddingLeft: 14,
    fontSize: 16,
    fontWeight: "600",
  },

  usernameField: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 6,
    fontSize: 14,
  },

  hint: {
    marginTop: 7,
    marginLeft: 3,
    fontSize: 9.5,
  },

  button: {
    height: 52,
    marginTop: 25,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 13,
    fontSize: 9.5,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    paddingHorizontal: 17,
    paddingTop: 9,
    paddingBottom:
      Platform.OS === "ios" ? 28 : 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    marginBottom: 19,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  sheetHeaderText: {
    flex: 1,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  sheetSubtitle: {
    marginTop: 4,
    fontSize: 10.5,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  optionsCard: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
  },

  option: {
    minHeight: 68,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  optionContent: {
    flex: 1,
    marginLeft: 11,
  },

  optionTitle: {
    fontSize: 13,
    fontWeight: "600",
  },

  optionSubtitle: {
    marginTop: 3,
    fontSize: 10.5,
  },

  cancelButton: {
    height: 49,
    marginTop: 11,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "600",
  },
});