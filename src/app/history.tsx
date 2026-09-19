import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";
import {
  cleanupOldChats,
  deleteChat as deleteChatFromDatabase,
  getChats,
  getMessages,
  renameChat as renameChatInDatabase,
} from "../lib/chatDatabase";

type HistoryChat = {
  id: string;
  title: string;
  preview: string;
  time: string;
  pinned?: boolean;
};

export default function HistoryScreen() {
  const { colors } = useTheme();

  const [chats, setChats] = useState<HistoryChat[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");
  const [selectedChat, setSelectedChat] =
    useState<HistoryChat | null>(null);
  const [actionVisible, setActionVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadHistory = async () => {
        try {
          await cleanupOldChats();

          const storedChats = await getChats();

          if (!mounted) return;

          const historyChats: HistoryChat[] = [];

          for (const chat of storedChats) {
            const messages = await getMessages(chat.id);

            const lastUserMessage = [...messages]
              .reverse()
              .find((item) => item.role === "user");

            historyChats.push({
              id: chat.id,
              title: chat.title,
              preview:
                lastUserMessage?.content || "No messages",
              time: formatChatTime(chat.updatedAt),
            });
          }

          if (mounted) {
            setChats(historyChats);
          }
        } catch (error) {
          console.error(
            "LOAD HISTORY ERROR:",
            error
          );
        }
      };

      loadHistory();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chats.filter((chat) => {
      const matchesSearch =
        !query ||
        chat.title.toLowerCase().includes(query) ||
        chat.preview.toLowerCase().includes(query);

      const matchesTab =
        activeTab === "all" || chat.pinned === true;

      return matchesSearch && matchesTab;
    });
  }, [chats, search, activeTab]);

  const openMenu = (chat: HistoryChat) => {
    setSelectedChat(chat);
    setActionVisible(true);
  };

  const closeMenu = () => {
    setActionVisible(false);
  };

  const pinChat = () => {
    if (!selectedChat) return;

    setChats((current) =>
      current.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              pinned: !chat.pinned,
            }
          : chat
      )
    );

    setSelectedChat((current) =>
      current
        ? {
            ...current,
            pinned: !current.pinned,
          }
        : null
    );

    closeMenu();
  };

  const renameChat = () => {
    if (!selectedChat) return;

    Alert.prompt(
      "Rename conversation",
      "Enter a new name",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async (value) => {
            const title = value?.trim();

            if (!title) return;

            try {
              await renameChatInDatabase(
                selectedChat.id,
                title
              );

              setChats((current) =>
                current.map((chat) =>
                  chat.id === selectedChat.id
                    ? {
                        ...chat,
                        title,
                      }
                    : chat
                )
              );

              setSelectedChat((current) =>
                current
                  ? {
                      ...current,
                      title,
                    }
                  : null
              );
            } catch (error) {
              console.error(
                "RENAME CHAT ERROR:",
                error
              );
            }
          },
        },
      ],
      "plain-text",
      selectedChat.title
    );

    closeMenu();
  };

  const archiveChat = () => {
    if (!selectedChat) return;

    setChats((current) =>
      current.filter(
        (chat) => chat.id !== selectedChat.id
      )
    );

    closeMenu();
  };

  const shareChat = () => {
    if (!selectedChat) return;

    Alert.alert(
      "Share conversation",
      `"${selectedChat.title}" is ready to share.`
    );

    closeMenu();
  };

  const deleteChat = () => {
    if (!selectedChat) return;

    Alert.alert(
      "Delete conversation",
      "This conversation will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChatFromDatabase(
                selectedChat.id
              );

              setChats((current) =>
                current.filter(
                  (chat) =>
                    chat.id !== selectedChat.id
                )
              );

              setSelectedChat(null);
              closeMenu();
            } catch (error) {
              console.error(
                "DELETE CHAT ERROR:",
                error
              );
            }
          },
        },
      ]
    );
  };

  const openChat = (chat: HistoryChat) => {
    router.push({
      pathname: "/",
      params: {
        chatId: chat.id,
      },
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShown: false,
        }}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              History
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              Your conversations
            </Text>
          </View>

          <Pressable
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.replace("/")}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchWrapper,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={19}
            color={colors.textMuted}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.searchInput,
              {
                color: colors.text,
              },
            ]}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "all" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "all"
                      ? colors.primaryText
                      : colors.textSecondary,
                },
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "pinned" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setActiveTab("pinned")}
          >
            <Ionicons
              name="pin-outline"
              size={15}
              color={
                activeTab === "pinned"
                  ? colors.primaryText
                  : colors.textSecondary
              }
            />

            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "pinned"
                      ? colors.primaryText
                      : colors.textSecondary,
                },
              ]}
            >
              Pinned
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredChats.length === 0 ? (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor:
                      colors.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={27}
                  color={colors.textSecondary}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                No conversations found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                Try another search or start a new conversation.
              </Text>

              <Pressable
                style={[
                  styles.emptyButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => router.replace("/")}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={colors.primaryText}
                />

                <Text
                  style={[
                    styles.emptyButtonText,
                    {
                      color: colors.primaryText,
                    },
                  ]}
                >
                  New conversation
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {activeTab === "pinned"
                    ? "Pinned conversations"
                    : "Recent conversations"}
                </Text>

                <Text
                  style={[
                    styles.count,
                    {
                      backgroundColor:
                        colors.surfaceSecondary,
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {filteredChats.length}
                </Text>
              </View>

              <View style={styles.chatList}>
                {filteredChats.map((chat) => (
                  <Pressable
                    key={chat.id}
                    style={({ pressed }) => [
                      styles.chatCard,
                      {
                        backgroundColor:
                          colors.card,
                        borderColor:
                          colors.border,
                      },
                      pressed &&
                        styles.chatCardPressed,
                    ]}
                    onPress={() => openChat(chat)}
                    onLongPress={() =>
                      openMenu(chat)
                    }
                  >
                    <View
                      style={[
                        styles.chatIcon,
                        {
                          backgroundColor:
                            colors.surfaceSecondary,
                        },
                      ]}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={19}
                        color={
                          colors.textSecondary
                        }
                      />
                    </View>

                    <View
                      style={styles.chatContent}
                    >
                      <View
                        style={styles.titleRow}
                      >
                        <View
                          style={
                            styles.titleContainer
                          }
                        >
                          {chat.pinned && (
                            <Ionicons
                              name="pin"
                              size={13}
                              color={
                                colors.textMuted
                              }
                              style={
                                styles.pinIcon
                              }
                            />
                          )}

                          <Text
                            style={[
                              styles.chatTitle,
                              {
                                color:
                                  colors.text,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {chat.title}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.chatTime,
                            {
                              color:
                                colors.textMuted,
                            },
                          ]}
                        >
                          {chat.time}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.chatPreview,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {chat.preview}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.footerText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Trilok-On
          </Text>

          <View
            style={[
              styles.footerDot,
              {
                backgroundColor:
                  colors.textMuted,
              },
            ]}
          />

          <Text
            style={[
              styles.footerStatus,
              {
                color: colors.textMuted,
              },
            ]}
          >
            AI Assistant
          </Text>
        </View>

        <Modal
          visible={actionVisible}
          transparent
          animationType="fade"
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
                styles.actionSheet,
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
                <View
                  style={[
                    styles.sheetChatIcon,
                    {
                      backgroundColor:
                        colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color={
                      colors.textSecondary
                    }
                  />
                </View>

                <View
                  style={
                    styles.sheetTitleContainer
                  }
                >
                  <Text
                    style={[
                      styles.sheetTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedChat?.title}
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
                    Conversation options
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.actionList,
                  {
                    backgroundColor:
                      colors.surface,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Pressable
                  style={styles.actionItem}
                  onPress={pinChat}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor:
                          colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name="pin-outline"
                      size={20}
                      color={colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {selectedChat?.pinned
                      ? "Unpin conversation"
                      : "Pin conversation"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={renameChat}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor:
                          colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color={colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Rename
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={archiveChat}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor:
                          colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name="archive-outline"
                      size={20}
                      color={colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Archive
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={shareChat}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor:
                          colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name="share-outline"
                      size={20}
                      color={colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Share
                  </Text>
                </Pressable>

                <View
                  style={[
                    styles.divider,
                    {
                      backgroundColor:
                        colors.border,
                    },
                  ]}
                />

                <Pressable
                  style={styles.actionItem}
                  onPress={deleteChat}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      styles.deleteIcon,
                    ]}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.danger}
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      styles.deleteText,
                      {
                        color: colors.danger,
                      },
                    ]}
                  >
                    Delete conversation
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor:
                      colors.surface,
                    borderColor:
                      colors.border,
                  },
                ]}
                onPress={closeMenu}
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
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function formatChatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() ===
      yesterday.getFullYear() &&
    date.getMonth() ===
      yesterday.getMonth() &&
    date.getDate() ===
      yesterday.getDate();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    height: 76,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "500",
  },

  searchWrapper: {
    height: 50,
    marginHorizontal: 18,
    paddingHorizontal: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    paddingVertical: 0,
  },

  tabs: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 18,
    gap: 8,
  },

  tab: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  count: {
    marginLeft: 7,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
  },

  chatList: {
    gap: 9,
  },

  chatCard: {
    minHeight: 86,
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
  },

  chatCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.995 }],
  },

  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  chatContent: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  pinIcon: {
    marginRight: 5,
  },

  chatTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },

  chatTime: {
    fontSize: 11,
    fontWeight: "500",
  },

  chatPreview: {
    marginTop: 5,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "400",
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 22,
    height: 44,
    paddingHorizontal: 17,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  footer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderTopWidth: 1,
  },

  footerText: {
    fontSize: 12,
    fontWeight: "700",
  },

  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  footerStatus: {
    fontSize: 11,
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  actionSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },

  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 16,
  },

  sheetChatIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  sheetTitleContainer: {
    flex: 1,
  },

  sheetTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  sheetSubtitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "500",
  },

  actionList: {
    borderRadius: 20,
    paddingVertical: 5,
    borderWidth: 1,
  },

  actionItem: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    marginHorizontal: 14,
  },

  deleteIcon: {
    backgroundColor: "rgba(217,45,32,0.10)",
  },

  deleteText: {
    fontWeight: "600",
  },

  cancelButton: {
    height: 52,
    marginTop: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "700",
  },
});