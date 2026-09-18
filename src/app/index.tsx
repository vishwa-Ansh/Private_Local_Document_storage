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

    if (q.includes("what is ai") || q.includes("artificial intelligence")) {
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

    if (!question) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    const answer: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: generateAnswer(question),
    };

    setMessages((prev) => [...prev, userMessage, answer]);
    setMessage("");
  };

  const newChat = () => {
    setMessages([]);
    setMessage("");
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
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{
        headerTransparent: true,
        headerShown: false

      }} />
      <KeyboardAvoidingView
  style={styles.keyboard}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerButton}
              onPress={openMenu}
            >
              <Ionicons
                name="menu-outline"
                size={25}
                color="#171717"
              />
            </Pressable>

            <Pressable
              style={styles.modelButton}
              onPress={openModelSelection}
            >
              <Text style={styles.modelName}>
                Trilok-On
              </Text>

              <Ionicons
                name="chevron-down"
                size={15}
                color="#777"
              />
            </Pressable>

            <Pressable
              style={styles.headerButton}
              onPress={newChat}
            >
              <Ionicons
                name="create-outline"
                size={22}
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
            >
              <View style={styles.hero}>
                {/* <View style={styles.logo}>
                  <Ionicons
                    name="sparkles"
                    size={26}
                    color="#FFFFFF"
                  />
                </View> */}

                <Text style={styles.title}>
                  How can I help?
                </Text>

                <Text style={styles.subtitle}>
                  Ask anything, explore ideas, write code, or create
                  something new.
                </Text>
              </View>

              <View style={styles.suggestions}>
                {/* <SuggestionCard
                  icon="bulb-outline"
                  title="Explain something"
                  subtitle="Learn a concept clearly"
                  onPress={() =>
                    sendMessage("Explain something to me")
                  }
                />

                <SuggestionCard
                  icon="code-slash-outline"
                  title="Write code"
                  subtitle="Build or debug your project"
                  onPress={() =>
                    sendMessage("Help me write some code")
                  }
                /> */}

                {/* <SuggestionCard
                  icon="create-outline"
                  title="Help me write"
                  subtitle="Draft, rewrite or improve text"
                  onPress={() =>
                    sendMessage("Help me write something")
                  }
                /> */}

                {/* <SuggestionCard
                  icon="compass-outline"
                  title="Explore ideas"
                  subtitle="Brainstorm something new"
                  onPress={() =>
                    sendMessage("Help me explore some ideas")
                  }
                /> */}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={styles.chatContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {messages.map((item) =>
                item.role === "user" ? (
                  <View key={item.id} style={styles.userRow}>
                    <View style={styles.userBubble}>
                      <Text style={styles.userText}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View key={item.id} style={styles.aiResponse}>
                    <View style={styles.aiHeader}>
                      {/* <View style={styles.aiAvatar}>
                        <Ionicons
                          name="sparkles"
                          size={14}
                          color="#FFFFFF"
                        />
                      </View> */}

                      {/* <Text style={styles.aiName}>
                        Trilok-On
                      </Text> */}
                    </View>

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
                placeholder="Message Trilok-On..."
                placeholderTextColor="#999"
                multiline
                maxLength={4000}
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={() => sendMessage()}
              />

              <Pressable
                style={[
                  styles.voiceButton,
                  !!message.trim() && styles.sendButton,
                ]}
                onPress={() => sendMessage()}
              >
                <Ionicons
                  name={
                    message.trim()
                      ? "arrow-up"
                      : "mic-outline"
                  }
                  size={19}
                  color={
                    message.trim()
                      ? "#FFFFFF"
                      : "#555"
                  }
                />
              </Pressable>
            </View>

            <Text style={styles.disclaimer}>
              TL-On can make mistakes. Check important information.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
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
              {/* <View style={styles.drawerLogo}>
                <Ionicons
                  name="sparkles"
                  size={11}
                  color="#FFFFFF"
                />
              </View> */}

              <Text style={styles.drawerTitle}>
                Trilok-On 
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={closeMenu}
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

function SuggestionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.suggestion,
        pressed && styles.suggestionPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons
          name={icon}
          size={19}
          color="#444"
        />
      </View>

      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>
          {title}
        </Text>

        <Text style={styles.suggestionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="arrow-up-outline"
        size={17}
        color="#999"
        style={styles.arrow}
      />
    </Pressable>
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
  },

  header: {
    height: 60,
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
  },

  modelButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  modelName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  scroll: {
    flex: 1,
  },

  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 20,
    justifyContent: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 29,
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

  suggestions: {
    gap: 10,
  },

  suggestion: {
    minHeight: 67,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E1E1DC",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  suggestionPressed: {
    backgroundColor: "#F0F0EC",
    transform: [{ scale: 0.99 }],
  },

  suggestionIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  suggestionContent: {
    flex: 1,
    marginLeft: 11,
  },

  suggestionTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#292929",
  },

  suggestionSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#969690",
  },

  arrow: {
    transform: [{ rotate: "45deg" }],
  },

  chatScroll: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
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

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  aiAvatar: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  aiName: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#292929",
  },

  aiText: {
    fontSize: 14,
    lineHeight: 23,
    color: "#292929",
  },







  composerWrapper: {
  paddingHorizontal: 13,
  paddingTop: 8,
  paddingBottom: 4,
  backgroundColor: "#F7F7F5",
},

  composer: {
    minHeight: 55,
    maxHeight: 145,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#DCDCD7",
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-end",
  },

  attachButton: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    minHeight: 39,
    maxHeight: 125,
    paddingHorizontal: 5,
    paddingTop: 9,
    paddingBottom: 7,
    fontSize: 14,
    color: "#222",
  },

  voiceButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#F0F0EC",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButton: {
    backgroundColor: "#171717",
  },

  disclaimer: {
    marginTop: 6,
    marginBottom: 7,
    textAlign: "center",
    fontSize: 9.5,
    color: "#A0A09A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
  },

  drawer: {
    width: "82%",
    maxWidth: 360,
    height: "100%",
    paddingTop: 58,
    paddingHorizontal: 14,
    backgroundColor: "#F7F7F5",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },

  drawerHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  drawerLogo: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  drawerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#3a3a3a",
  },

  closeButton: {
    width: 37,
    height: 37,
    marginLeft: "auto",
    borderRadius: 12,
    backgroundColor: "#EAEAE5",
    alignItems: "center",
    justifyContent: "center",
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
    bottom: 30,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E1DC",
    flexDirection: "row",
    alignItems: "center",
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
  alignItems: "center",
  justifyContent: "center",
},


});