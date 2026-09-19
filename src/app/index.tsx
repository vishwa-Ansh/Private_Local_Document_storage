import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { MarkdownStream } from "@ronradtke/react-native-markdown-display";
import {
  ActivityIndicator,
  Animated,
  Easing,
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
import { useTheme } from "../context/ThemeContext";
import {
  addMessage,
  cleanupOldChats,
  createChat,
  getChats,
  getMessages,
} from "../lib/chatDatabase";

type IconName = keyof typeof Ionicons.glyphMap;

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
};

const API_URL = "https://tl-on-server.vercel.app/api/chat";

export default function HomePage() {
  const { colors, theme } = useTheme();

  const { chatId } = useLocalSearchParams<{
    chatId?: string;
  }>();

  const [activeChatId, setActiveChatId] = useState<string | null>(
    chatId || null
  );

  const [message, setMessage] = useState("");
  const [recentChats, setRecentChats] = useState<
  {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
  }[]
>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    uri: string;
    type: string;
  } | null>(null);


  const thinkingOpacity = useRef(
  new Animated.Value(0.35)
).current;

useEffect(() => {
  if (!loading) {
    thinkingOpacity.setValue(0.35);
    return;
  }

  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(thinkingOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(thinkingOpacity, {
        toValue: 0.35,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );

  animation.start();

  return () => {
    animation.stop();
  };
}, [loading]);

  useEffect(() => {
    const loadChat = async () => {
      try {
        await cleanupOldChats();

        if (!chatId) {
          setActiveChatId(null);
          setMessages([]);
          return;
        }

        const storedMessages = await getMessages(chatId);

        setActiveChatId(chatId);

        setMessages(
          storedMessages.map((item) => ({
            id: item.id,
            role: item.role,
            text: item.content,
            streaming: false,
          }))
        );
      } catch (error) {
        console.error("LOAD CHAT ERROR:", error);
      }
    };

    loadChat();
  }, [chatId]);


  const loadRecentChats = async () => {
  try {
    await cleanupOldChats();

    const chats = await getChats();

    setRecentChats(chats.slice(0, 10));
  } catch (error) {
    console.error("LOAD RECENT CHATS ERROR:", error);
  }
};

  const markdownStyles = {
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 26,
    },

    paragraph: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 26,
      marginTop: 0,
      marginBottom: 13,
    },

    heading1: {
      color: colors.text,
      fontSize: 28,
      lineHeight: 35,
      fontWeight: "700" as const,
      marginTop: 18,
      marginBottom: 11,
    },

    heading2: {
      color: colors.text,
      fontSize: 23,
      lineHeight: 30,
      fontWeight: "700" as const,
      marginTop: 17,
      marginBottom: 9,
    },

    heading3: {
      color: colors.text,
      fontSize: 20,
      lineHeight: 27,
      fontWeight: "700" as const,
      marginTop: 15,
      marginBottom: 8,
    },

    strong: {
      color: colors.text,
      fontWeight: "700" as const,
    },

    em: {
      color: colors.textSecondary,
      fontStyle: "italic" as const,
    },

    s: {
      color: colors.textMuted,
      textDecorationLine: "line-through" as const,
    },

    code_inline: {
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 14,
      lineHeight: 21,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },

    pre: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      marginTop: 10,
      marginBottom: 16,
      padding: 0,
      overflow: "hidden" as const,
    },

    fence: {
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 16,
      padding: 2,
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      lineHeight: 21,
    },

    code_block: {
      backgroundColor: colors.surfaceSecondary,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      marginTop: 10,
      marginBottom: 16,
      padding: 15,
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      lineHeight: 21,
    },

    fence_header: {
      backgroundColor: colors.surfaceSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: 36,
      paddingHorizontal: 13,
      justifyContent: "center" as const,
    },

    fence_language_label: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: "600" as const,
      letterSpacing: 0.2,
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
    },

    fence_copy_button: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 50,
      paddingHorizontal: 5,
      paddingVertical: 5,
      marginHorizontal: 5,
    },

    fence_copy_text: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: "600" as const,
    },

    fence_code: {
      backgroundColor: colors.surface,
      color: colors.text,
      padding: 15,
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      lineHeight: 21,
    },

    fence_token: {
      fontFamily:
        Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      lineHeight: 21,
    },

    bullet_list: {
      marginTop: 3,
      marginBottom: 9,
    },

    ordered_list: {
      marginTop: 3,
      marginBottom: 9,
    },

    list_item: {
      marginBottom: 6,
      paddingLeft: 2,
    },

    bullet_list_icon: {
      color: colors.textSecondary,
      fontSize: 15,
    },

    ordered_list_icon: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "600" as const,
    },

    blockquote: {
      backgroundColor: colors.surfaceSecondary,
      borderLeftWidth: 3,
      borderLeftColor: colors.border,
      paddingLeft: 13,
      paddingRight: 10,
      paddingVertical: 7,
      marginTop: 8,
      marginBottom: 12,
    },

    table: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 9,
      marginTop: 8,
      marginBottom: 14,
      overflow: "hidden" as const,
    },

    thead: {
      backgroundColor: colors.surfaceSecondary,
    },

    th: {
      color: colors.text,
      paddingHorizontal: 9,
      paddingVertical: 8,
      fontWeight: "700" as const,
      borderWidth: 1,
      borderColor: colors.border,
    },

    td: {
      color: colors.textSecondary,
      paddingHorizontal: 9,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    link: {
      color: theme === "dark" ? "#60A5FA" : "#2563EB",
      textDecorationLine: "none" as const,
    },

    hr: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 10,
      marginBottom: 16,
    },

    image: {
      borderRadius: 12,
      marginVertical: 8,
    },
  };

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
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
    const result =
      await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

    if (!result.canceled) {
      const file = result.assets[0];

      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type:
          file.mimeType ||
          "application/octet-stream",
      });
    }
  };


  const sendMessage = async (text?: string) => {
    const question = (text ?? message).trim();

    if ((!question && !selectedFile) || loading) {
      return;
    }

    const currentFile = selectedFile;

    const userText =
      question ||
      `Attached file: ${currentFile?.name || "file"
      }`;

    let currentChatId = activeChatId;

    try {
      if (!currentChatId) {
        currentChatId = await createChat(
          userText.slice(0, 60)
        );

        setActiveChatId(currentChatId);
      }
     

await loadRecentChats();

      

      const previousHistory = messages
        .slice(-10)
        .map((item) => ({
          role: item.role,
          content: item.text,
        }));

      const userMessageId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        text: userText,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      await addMessage(
        currentChatId,
        "user",
        userText
      );

      setMessage("");
      setSelectedFile(null);
      setLoading(true);

      const assistantId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          "Accept-Encoding": "identity",
        },
        body: JSON.stringify({
          message:
            question ||
            "Please analyze the attached file.",
          history: previousHistory,
        }),
      });

      if (!response.ok) {
        const errorText =
          await response.text();

        console.log(
          "API RESPONSE:",
          errorText
        );

        throw new Error(
          `AI request failed: ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error(
          "Streaming response is not available"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          text: "",
          streaming: true,
        },
      ]);

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder("utf-8");

      let accumulatedText = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          break;
        }

        if (!value) {
          continue;
        }

        const chunk =
          decoder.decode(value, {
            stream: true,
          });

        if (!chunk) {
          continue;
        }

        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? {
                ...item,
                text: accumulatedText,
                streaming: true,
              }
              : item
          )
        );
      }

      const remaining =
        decoder.decode();

      if (remaining) {
        accumulatedText += remaining;
      }

      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? {
              ...item,
              text: accumulatedText,
              streaming: false,
            }
            : item
        )
      );

      await addMessage(
        currentChatId,
        "assistant",
        accumulatedText
      );
    } catch (error) {
      console.error(
        "API ERROR:",
        error
      );

      const errorMessage =
        "Sorry, I couldn't connect to Trilok-On right now. Please check your internet connection and try again.";

      setMessages((prev) => [
        ...prev,
        {
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
          role: "assistant",
          text: errorMessage,
          streaming: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };




  const newChat = () => {
  setMessages([]);
  setMessage("");
  setSelectedFile(null);
  setLoading(false);
  setActiveChatId(null);
  closeMenu();

  router.replace("/");
};

  const openModelSelection = () => {
    router.push("/model-selection");
  };

  const openMenu = async () => {
  await loadRecentChats();
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
      style={[
        styles.safe,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={
          theme === "dark"
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={colors.background}
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
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
              onPress={openMenu}
            >
              <Ionicons
                name="menu-outline"
                size={30}
                color={colors.text}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modelButton,
                pressed && {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
              onPress={openModelSelection}
            >
              <Text
                style={[
                  styles.modelName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Trilok-On
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && {
                  backgroundColor:
                    colors.surfaceSecondary,
                },
              ]}
              onPress={newChat}
            >
              <Ionicons
                name="create-outline"
                size={30}
                color={colors.text}
              />
            </Pressable>
          </View>

          {messages.length === 0 ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={
                styles.emptyContent
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={
                false
              }
            >
              <View style={styles.hero}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  How can I help?
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                >
                  Ask anything, explore ideas,
                  write code, or create
                  something new.
                </Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={
                styles.chatContent
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={
                false
              }
            >
              {messages.map((item) =>
                item.role === "user" ? (
                  <View
                    key={item.id}
                    style={styles.userRow}
                  >
                    <View
                      style={[
                        styles.userBubble,
                        {
                          backgroundColor:
                            colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.userText,
                          {
                            color:
                              colors.primaryText,
                          },
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    key={item.id}
                    style={styles.aiResponse}
                  >
                    <MarkdownStream
                      style={
                        markdownStyles
                      }
                      onCopyCode={async (
                        code
                      ) => {
                        await Clipboard.setStringAsync(
                          code
                        );
                      }}
                    >
                      {item.text}
                    </MarkdownStream>
                  </View>
                )
              )}

              {loading && (
                <View
                  style={
                    styles.loadingResponse
                  }
                >
                  <View
                    style={
                      styles.loadingDots
                    }
                  >
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            colors.textMuted,
                        },
                      ]}
                    />

                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            colors.textMuted,
                        },
                      ]}
                    />

                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            colors.textMuted,
                        },
                      ]}
                    />
                  </View>

                  <Animated.Text
  style={[
    styles.loadingText,
    {
      color: colors.textMuted,
      opacity: thinkingOpacity,
    },
  ]}
>
  Trilok-On is thinking...
</Animated.Text>
                </View>
              )}
            </ScrollView>
          )}

          <View
            style={[
              styles.composerWrapper,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            {selectedFile && (
              <View
                style={[
                  styles.filePreview,
                  {
                    backgroundColor:
                      colors.surface,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.fileIcon,
                    {
                      backgroundColor:
                        colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      selectedFile.type.startsWith(
                        "image/"
                      )
                        ? "image-outline"
                        : "document-outline"
                    }
                    size={18}
                    color={colors.text}
                  />
                </View>

                <Text
                  style={[
                    styles.fileName,
                    {
                      color: colors.text,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {selectedFile.name}
                </Text>

                <Pressable
                  onPress={() =>
                    setSelectedFile(null)
                  }
                  style={styles.removeFile}
                >
                  <Ionicons
                    name="close"
                    size={17}
                    color={
                      colors.textSecondary
                    }
                  />
                </Pressable>
              </View>
            )}

            <View
              style={[
                styles.composer,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Pressable
                style={styles.attachButton}
                onPress={pickPhoto}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={
                    colors.textSecondary
                  }
                />
              </Pressable>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Reply to Trilok-On..."
                placeholderTextColor={
                  colors.textMuted
                }
                multiline
                maxLength={4000}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                  },
                ]}
                textAlignVertical="center"
                returnKeyType="send"
                blurOnSubmit={false}
                editable={!loading}
                onSubmitEditing={() =>
                  sendMessage()
                }
              />

              <Pressable
                disabled={loading}
                style={[
                  styles.voiceButton,
                  {
                    backgroundColor:
                      colors.surfaceSecondary,
                  },
                  (!!message.trim() ||
                    !!selectedFile) &&
                  {
                    backgroundColor:
                      colors.primary,
                  },
                  loading &&
                  styles.disabledButton,
                ]}
                onPress={() =>
                  sendMessage()
                }
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      colors.textSecondary
                    }
                  />
                ) : (
                  <Ionicons
                    name={
                      message.trim() ||
                        selectedFile
                        ? "arrow-up"
                        : "mic-outline"
                    }
                    size={19}
                    color={
                      message.trim() ||
                        selectedFile
                        ? colors.primaryText
                        : colors.textSecondary
                    }
                  />
                )}
              </Pressable>
            </View>

            <Text
              style={[
                styles.disclaimer,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              TL-On can make mistakes.
              Check important information.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={menuVisible}
        transparent
        animationType={
          Platform.OS === "android"
            ? "fade"
            : "slide"
        }
        onRequestClose={closeMenu}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            {
              backgroundColor:
                colors.overlay,
            },
          ]}
          onPress={closeMenu}
        >
          <Pressable
            style={[
              styles.drawer,
              {
                backgroundColor:
                  colors.background,
              },
            ]}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View
              style={styles.drawerHeader}
            >
              <Text
                style={[
                  styles.drawerTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Trilok-On
              </Text>

              <Pressable
                style={[
                  styles.closeButton,
                  {
                    backgroundColor:
                      colors.surfaceSecondary,
                  },
                ]}
                onPress={closeMenu}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={
                    colors.textSecondary
                  }
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.newChatButton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
              onPress={newChat}
            >
              <Ionicons
                name="add"
                size={20}
                color={
                  colors.primaryText
                }
              />

              <Text
                style={[
                  styles.newChatText,
                  {
                    color:
                      colors.primaryText,
                  },
                ]}
              >
                New chat
              </Text>
            </Pressable>

            {recentChats.length > 0 && (
  <View style={styles.recentChatsSection}>
    <Text
      style={[
        styles.recentChatsTitle,
        {
          color: colors.textMuted,
        },
      ]}
    >
      Recent
    </Text>

    {recentChats.map((chat) => (
      <Pressable
        key={chat.id}
        style={({ pressed }) => [
          styles.recentChatItem,
          pressed && {
            backgroundColor:
              colors.surfaceSecondary,
          },
        ]}
        onPress={() => {
          closeMenu();

          router.push({
            pathname: "/",
            params: {
              chatId: chat.id,
            },
          });
        }}
      >
        <Ionicons
          name="chatbubble-outline"
          size={17}
          color={colors.textSecondary}
        />

        <Text
          style={[
            styles.recentChatText,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {chat.title}
        </Text>
      </Pressable>
    ))}
  </View>
)}

            <DrawerItem
              colors={colors}
              icon="chatbubbles-outline"
              title="History"
              onPress={() =>
                navigate("/history")
              }
            />

            <DrawerItem
              colors={colors}
              icon="folder-open-outline"
              title="Projects"
              onPress={() =>
                navigate("/projects")
              }
            />

            <DrawerItem
              colors={colors}
              icon="hardware-chip-outline"
              title="Models"
              onPress={() =>
                navigate(
                  "/model-selection"
                )
              }
            />

            <View
              style={[
                styles.drawerDivider,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <DrawerItem
              colors={colors}
              icon="person-circle-outline"
              title="Profile"
              onPress={() =>
                navigate("/profile")
              }
            />

            <DrawerItem
              colors={colors}
              icon="bar-chart-outline"
              title="Usage & Plan"
              onPress={() =>
                navigate("/usage")
              }
            />

            <DrawerItem
              colors={colors}
              icon="settings-outline"
              title="Settings"
              onPress={() =>
                navigate("/settings")
              }
            />

            <View
              style={[
                styles.drawerBottom,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.accountAvatar,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.accountAvatarText,
                    {
                      color:
                        colors.primaryText,
                    },
                  ]}
                >
                  N
                </Text>
              </View>

              <View
                style={styles.accountInfo}
              >
                <Text
                  style={[
                    styles.accountName,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Night.vanta
                </Text>

                <Text
                  style={[
                    styles.accountPlan,
                    {
                      color:
                        colors.textMuted,
                    },
                  ]}
                >
                  Free plan
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={colors.textMuted}
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
  colors,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.drawerItem,
        pressed && {
          backgroundColor:
            colors.surfaceSecondary,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={colors.textSecondary}
      />

      <Text
        style={[
          styles.drawerItemText,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={15}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
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
  },

  scroll: {
    flex: 1,
  },

  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
    justifyContent: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 29,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  subtitle: {
    maxWidth: 320,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
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
  },

  userText: {
    fontSize: 14,
    lineHeight: 21,
  },

  aiResponse: {
    width: "100%",
  },

  loadingResponse: {
    marginBottom: 25,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 9,
    gap: 3,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  loadingText: {
    fontSize: 12,
    fontWeight: "500",
  },

  composerWrapper: {
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom:
      Platform.OS === "android" ? 7 : 4,
  },

  composer: {
    minHeight: 55,
    maxHeight: 145,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 50,
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
    lineHeight: 20,
  },

  voiceButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  disclaimer: {
    marginTop: 6,
    marginBottom:
      Platform.OS === "android" ? 20 : 7,
    textAlign: "center",
    fontSize: 10,
  },

  filePreview: {
    height: 48,
    marginBottom: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  fileName: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
  },

  removeFile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
  },

  drawer: {
    width:
      Platform.OS === "android"
        ? "70%"
        : "82%",
    maxWidth: 360,
    height: "100%",
    paddingTop:
      Platform.OS === "android"
        ? 60
        : 58,
    paddingHorizontal: 14,
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
  },

  closeButton: {
    width: 37,
    height: 37,
    marginLeft: "auto",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  newChatButton: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 10,
  },

  newChatText: {
    fontSize: 13,
    fontWeight: "700",
  },

  drawerItem: {
    height: 51,
    paddingHorizontal: 11,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  drawerItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: "600",
  },

  drawerDivider: {
    height: 1,
    marginVertical: 12,
  },

  drawerBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom:
      Platform.OS === "android"
        ? 22
        : 30,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  accountAvatar: {
    width: 37,
    height: 37,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  accountAvatarText: {
    fontSize: 15,
    fontWeight: "700",
  },

  accountInfo: {
    flex: 1,
    marginLeft: 10,
  },

  accountName: {
    fontSize: 12.5,
    fontWeight: "600",
  },

  accountPlan: {
    marginTop: 2,
    fontSize: 10,
  },

  recentChatsSection: {
  marginTop: 8,
  marginBottom: 8,
},

recentChatsTitle: {
  fontSize: 11,
  fontWeight: "600",
  marginHorizontal: 11,
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

recentChatItem: {
  height: 43,
  paddingHorizontal: 11,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
},

recentChatText: {
  flex: 1,
  marginLeft: 10,
  fontSize: 12.5,
  fontWeight: "500",
},
});