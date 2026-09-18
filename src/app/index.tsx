import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    uri: string;
    type: string;
  } | null>(null);

  const generateAnswer = (question: string) => {
    const q = question.toLowerCase();

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return "Hello! 👋 How can I help you today?";
    }

    if (
      q.includes("what is ai") ||
      q.includes("artificial intelligence")
    ) {
      return "Artificial Intelligence (AI) is a field of computer science that enables machines to perform tasks that normally require human intelligence, such as learning, reasoning, understanding language, and recognizing patterns.";
    }

    if (q.includes("react native")) {
      return "React Native is a framework for building mobile applications using React and JavaScript or TypeScript. It allows you to create Android and iOS apps from a shared codebase.";
    }

    if (q.includes("python")) {
      return "Python is a high-level, general-purpose programming language widely used for web development, automation, data analysis, machine learning, artificial intelligence, and scientific computing.";
    }

    if (q.includes("machine learning")) {
      return "Machine Learning is a subset of AI where algorithms learn patterns from data and use those patterns to make predictions or decisions without being explicitly programmed for every case.";
    }

    if (q.includes("deep learning")) {
      return "Deep Learning is a branch of Machine Learning that uses neural networks with multiple layers to learn complex patterns from large amounts of data. It is widely used in computer vision, NLP, speech recognition, and generative AI.";
    }

    return `I understand your question: "${question}"\n\nThis is where the TL-On AI model will generate the actual response. You can connect your backend/API here to receive real AI answers.`;
  };

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      setSelectedFile({
        name: asset.fileName || "photo.jpg",
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
      });
    }
  };

  const sendMessage = (text?: string) => {
    const question = (text ?? message).trim();

    if (!question && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text:
        question ||
        `Attached file: ${selectedFile?.name || "file"}`,
    };

    const answer: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: generateAnswer(
        question || "Please analyze the attached file."
      ),
    };

    setMessages((prev) => [...prev, userMessage, answer]);
    setMessage("");
    setSelectedFile(null);
  };

  const newChat = () => {
    setMessages([]);
    setMessage("");
    setSelectedFile(null);
    closeMenu();
  };

  const openModelSelection = () => {
    router.push("/model-selection");
  };

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const navigate = (path: string) => {
    closeMenu();
    router.push(path as never);
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F7F5"
        translucent={false}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : 0
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.pressed,
              ]}
              android_ripple={{
                color: "#E5E5E1",
                borderless: true,
              }}
              onPress={openMenu}
            >
              <Ionicons
                name="menu-outline"
                size={30}
                color="#171717"
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modelButton,
                pressed && styles.pressed,
              ]}
              android_ripple={{
                color: "#E5E5E1",
              }}
              onPress={openModelSelection}
            >
              <Text style={styles.modelName}>
                Trilok-On
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color="#777"
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.pressed,
              ]}
              android_ripple={{
                color: "#E5E5E1",
                borderless: true,
              }}
              onPress={newChat}
            >
              <Ionicons
                name="create-outline"
                size={30}
                color="#171717"
              />
            </Pressable>
          </View>

          {messages.length === 0 ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.emptyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={Platform.OS === "ios"}
            >
              <View style={styles.hero}>
                <Text style={styles.title}>
                  How can I help?
                </Text>

                <Text style={styles.subtitle}>
                  Ask anything, explore ideas, write code, or
                  create something new.
                </Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={styles.chatContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={Platform.OS === "ios"}
              automaticallyAdjustKeyboardInsets={
                Platform.OS === "ios"
              }
            >
              {messages.map((item) =>
                item.role === "user" ? (
                  <View
                    key={item.id}
                    style={styles.userRow}
                  >
                    <View style={styles.userBubble}>
                      <Text style={styles.userText}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    key={item.id}
                    style={styles.aiResponse}
                  >
                    <Text style={styles.aiText}>
                      {item.text}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
          )}

          <View style={styles.composerWrapper}>
            {selectedFile && (
              <View style={styles.filePreview}>
                <View style={styles.fileIcon}>
                  <Ionicons
                    name={
                      selectedFile.type.startsWith("image/")
                        ? "image-outline"
                        : "document-outline"
                    }
                    size={18}
                    color="#333"
                  />
                </View>

                <Text
                  style={styles.fileName}
                  numberOfLines={1}
                >
                  {selectedFile.name}
                </Text>

                <Pressable
                  onPress={() => setSelectedFile(null)}
                  style={styles.removeFile}
                  android_ripple={{
                    color: "#E5E5E1",
                    borderless: true,
                  }}
                >
                  <Ionicons
                    name="close"
                    size={17}
                    color="#666"
                  />
                </Pressable>
              </View>
            )}

            <View style={styles.composer}>
              <Pressable
                style={styles.attachButton}
                onPress={pickPhoto}
                android_ripple={{
                  color: "#E5E5E1",
                  borderless: true,
                }}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="#555"
                />
              </Pressable>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Reply to Trilok-On..."
                placeholderTextColor="#999"
                multiline
                maxLength={4000}
                style={styles.input}
                textAlignVertical="center"
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={() => sendMessage()}
              />

              <Pressable
                style={[
                  styles.voiceButton,
                  (!!message.trim() || !!selectedFile) &&
                    styles.sendButton,
                ]}
                onPress={() => sendMessage()}
                android_ripple={{
                  color: "#333333",
                  borderless: true,
                }}
              >
                <Ionicons
                  name={
                    message.trim() || selectedFile
                      ? "arrow-up"
                      : "mic-outline"
                  }
                  size={19}
                  color={
                    message.trim() || selectedFile
                      ? "#FFFFFF"
                      : "#555"
                  }
                />
              </Pressable>
            </View>

            <Text style={styles.disclaimer}>
              TL-On can make mistakes. Check important
              information.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={menuVisible}
        transparent
        animationType={
          Platform.OS === "android" ? "fade" : "slide"
        }
        statusBarTranslucent={false}
        onRequestClose={closeMenu}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={closeMenu}
        >
          <Pressable
            style={styles.drawer}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>
                Trilok-On
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={closeMenu}
                android_ripple={{
                  color: "#DCDCD7",
                  borderless: true,
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#555"
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.newChatButton}
              onPress={newChat}
              android_ripple={{
                color: "#333333",
              }}
            >
              <Ionicons
                name="add"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.newChatText}>
                New chat
              </Text>
            </Pressable>

            <DrawerItem
              icon="chatbubbles-outline"
              title="History"
              onPress={() => navigate("/history")}
            />

            <DrawerItem
              icon="folder-open-outline"
              title="Projects"
              onPress={() => navigate("/projects")}
            />

            <DrawerItem
              icon="hardware-chip-outline"
              title="Models"
              onPress={() => navigate("/model-selection")}
            />

            <View style={styles.drawerDivider} />

            <DrawerItem
              icon="person-circle-outline"
              title="Profile"
              onPress={() => navigate("/profile")}
            />

            <DrawerItem
              icon="bar-chart-outline"
              title="Usage & Plan"
              onPress={() => navigate("/usage")}
            />

            <DrawerItem
              icon="settings-outline"
              title="Settings"
              onPress={() => navigate("/settings")}
            />

            <View style={styles.drawerBottom}>
              <View style={styles.accountAvatar}>
                <Text style={styles.accountAvatarText}>
                  N
                </Text>
              </View>

              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>
                  Night.vanta
                </Text>

                <Text style={styles.accountPlan}>
                  Free plan
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#999"
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function DrawerItem({
  icon,
  title,
  onPress,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.drawerItem,
        pressed && styles.drawerItemPressed,
      ]}
      onPress={onPress}
      android_ripple={{
        color: "#DEDED9",
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color="#444"
      />

      <Text style={styles.drawerItemText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={15}
        color="#AAA"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  header: {
    height: Platform.OS === "android" ? 68 : 60,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  modelButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    overflow: "hidden",
  },

  modelName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  pressed: {
    opacity: 0.7,
  },

  scroll: {
    flex: 1,
  },

  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom:
      Platform.OS === "android" ? 24 : 20,
    justifyContent: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: Platform.OS === "android" ? 28 : 29,
    fontWeight: "700",
    color: "#171717",
    letterSpacing: -0.8,
  },

  subtitle: {
    maxWidth: 320,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#888",
    textAlign: "center",
  },

  chatScroll: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 24,
  },

  userRow: {
    alignItems: "flex-end",
    marginBottom: 22,
  },

  userBubble: {
    maxWidth: "82%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 17,
    borderBottomRightRadius: 5,
    backgroundColor: "#171717",
  },

  userText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#FFFFFF",
  },

  aiResponse: {
    marginBottom: 28,
    paddingHorizontal: 2,
  },

  aiText: {
    fontSize: 14,
    lineHeight: 23,
    color: "#292929",
  },

  composerWrapper: {
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom:
      Platform.OS === "android" ? 7 : 4,
    backgroundColor: "#F7F7F5",
  },

  composer: {
    minHeight: 55,
    maxHeight: 145,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#DCDCD7",
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
  },

  attachButton: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    overflow: "hidden",
  },

  input: {
    flex: 1,
    minHeight: 39,
    maxHeight: 125,
    paddingHorizontal: 5,
    paddingTop:
      Platform.OS === "android" ? 8 : 9,
    paddingBottom:
      Platform.OS === "android" ? 6 : 7,
    fontSize: 14,
    lineHeight: Platform.OS === "android" ? 20 : 19,
    color: "#222",
    includeFontPadding: Platform.OS === "android",
    
  },

  voiceButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#F0F0EC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  sendButton: {
    backgroundColor: "#171717",
  },

  disclaimer: {
    marginTop: 6,
    marginBottom:
      Platform.OS === "android" ? 20 : 7,
    textAlign: "center",
    fontSize: 10,
    color: "#898988",
  },

  filePreview: {
    height: 48,
    marginBottom: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E1DC",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#F0F0EC",
    alignItems: "center",
    justifyContent: "center",
  },

  fileName: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: "#333",
  },

  removeFile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
  },

  drawer: {
    width: Platform.OS === "android" ? "70%" : "82%",
    maxWidth: 360,
    height: "100%",
    paddingTop:
      Platform.OS === "android" ? 60 : 58,
    paddingHorizontal: 14,
    backgroundColor: "#F7F7F5",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 18,
  },

  drawerHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  drawerTitle: {
    marginLeft: 2,
    fontSize: 18,
    fontWeight: "700",
    color: "#3A3A3A",
  },

  closeButton: {
    width: 37,
    height: 37,
    marginLeft: "auto",
    borderRadius: 12,
    backgroundColor: "#EAEAE5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  newChatButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 10,
    overflow: "hidden",
    elevation: 2,
  },

  newChatText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  drawerItem: {
    height: 51,
    paddingHorizontal: 11,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  drawerItemPressed: {
    backgroundColor: "#EAEAE5",
  },

  drawerItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  drawerDivider: {
    height: 1,
    backgroundColor: "#DEDED9",
    marginVertical: 12,
  },

  drawerBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom:
      Platform.OS === "android" ? 22 : 30,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E1DC",
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  accountAvatar: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  accountAvatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  accountInfo: {
    flex: 1,
    marginLeft: 10,
  },

  accountName: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#292929",
  },

  accountPlan: {
    marginTop: 2,
    fontSize: 10,
    color: "#999",
  },
});