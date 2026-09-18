import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
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

type Chat = {
  id: string;
  title: string;
  preview: string;
  time: string;
  pinned?: boolean;
};

const initialChats: Chat[] = [
  {
    id: "1",
    title: "Machine Learning Roadmap",
    preview: "Explain machine learning from basics to advanced...",
    time: "Today",
    pinned: true,
  },
  {
    id: "2",
    title: "React Native App",
    preview: "How can I create a premium chat interface?",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "Neural Networks",
    preview: "Explain backpropagation with mathematics...",
    time: "Yesterday",
  },
  {
    id: "4",
    title: "Python Data Analysis",
    preview: "Let's start learning NumPy step by step...",
    time: "Sep 16",
  },
  {
    id: "5",
    title: "Linear Regression",
    preview: "Explain gradient descent and normal equation...",
    time: "Sep 15",
  },
  {
    id: "6",
    title: "CNN Architecture",
    preview: "What are filters, kernels and feature maps?",
    time: "Sep 14",
  },
];

export default function HistoryScreen() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [actionVisible, setActionVisible] = useState(false);

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

  const openMenu = (chat: Chat) => {
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
          ? { ...chat, pinned: !chat.pinned }
          : chat
      )
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
          onPress: (value) => {
            const title = value?.trim();

            if (!title) return;

            setChats((current) =>
              current.map((chat) =>
                chat.id === selectedChat.id
                  ? { ...chat, title }
                  : chat
              )
            );
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
      current.filter((chat) => chat.id !== selectedChat.id)
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
          onPress: () => {
            setChats((current) =>
              current.filter((chat) => chat.id !== selectedChat.id)
            );
            closeMenu();
          },
        },
      ]
    );
  };

  const openChat = (chat: Chat) => {
    router.push({
      pathname: "/",
      params: {
        chatId: chat.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{
        headerTransparent: true,
        headerShown: false

      }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#111"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSubtitle}>
              Your conversations
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color="#111"
            />
          </Pressable>
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={19}
            color="#8C8C8C"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations"
            placeholderTextColor="#A3A3A3"
            style={styles.searchInput}
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
                color="#A0A0A0"
              />
            </Pressable>
          )}
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "all" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "pinned" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("pinned")}
          >
            <Ionicons
              name="pin-outline"
              size={15}
              color={
                activeTab === "pinned" ? "#111" : "#888"
              }
            />

            <Text
              style={[
                styles.tabText,
                activeTab === "pinned" && styles.activeTabText,
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
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={27}
                  color="#777"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No conversations found
              </Text>

              <Text style={styles.emptyText}>
                Try another search or start a new conversation.
              </Text>

              <Pressable
                style={styles.emptyButton}
                onPress={() => router.replace("/")}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="#FFF"
                />

                <Text style={styles.emptyButtonText}>
                  New conversation
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {activeTab === "pinned"
                    ? "Pinned conversations"
                    : "Recent conversations"}
                </Text>

                <Text style={styles.count}>
                  {filteredChats.length}
                </Text>
              </View>

              <View style={styles.chatList}>
                {filteredChats.map((chat) => (
                  <Pressable
                    key={chat.id}
                    style={({ pressed }) => [
                      styles.chatCard,
                      pressed && styles.chatCardPressed,
                    ]}
                    onPress={() => openChat(chat)}
                    onLongPress={() => openMenu(chat)}
                  >
                    <View style={styles.chatIcon}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={19}
                        color="#555"
                      />
                    </View>

                    <View style={styles.chatContent}>
                      <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                          {chat.pinned && (
                            <Ionicons
                              name="pin"
                              size={13}
                              color="#777"
                              style={styles.pinIcon}
                            />
                          )}

                          <Text
                            style={styles.chatTitle}
                            numberOfLines={1}
                          >
                            {chat.title}
                          </Text>
                        </View>

                        <Text style={styles.chatTime}>
                          {chat.time}
                        </Text>
                      </View>

                      <Text
                        style={styles.chatPreview}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Trilok-On</Text>
          <View style={styles.footerDot} />
          <Text style={styles.footerStatus}>AI Assistant</Text>
        </View>

        <Modal
          visible={actionVisible}
          transparent
          animationType="fade"
          onRequestClose={closeMenu}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={closeMenu}
          >
            <Pressable
              style={styles.actionSheet}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <View style={styles.sheetChatIcon}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color="#555"
                  />
                </View>

                <View style={styles.sheetTitleContainer}>
                  <Text
                    style={styles.sheetTitle}
                    numberOfLines={1}
                  >
                    {selectedChat?.title}
                  </Text>

                  <Text style={styles.sheetSubtitle}>
                    Conversation options
                  </Text>
                </View>
              </View>

              <View style={styles.actionList}>
                <Pressable
                  style={styles.actionItem}
                  onPress={pinChat}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name={
                        selectedChat?.pinned
                          ? "pin-outline"
                          : "pin-outline"
                      }
                      size={20}
                      color="#333"
                    />
                  </View>

                  <Text style={styles.actionText}>
                    {selectedChat?.pinned
                      ? "Unpin conversation"
                      : "Pin conversation"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={renameChat}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color="#333"
                    />
                  </View>

                  <Text style={styles.actionText}>
                    Rename
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={archiveChat}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name="archive-outline"
                      size={20}
                      color="#333"
                    />
                  </View>

                  <Text style={styles.actionText}>
                    Archive
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionItem}
                  onPress={shareChat}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name="share-outline"
                      size={20}
                      color="#333"
                    />
                  </View>

                  <Text style={styles.actionText}>
                    Share
                  </Text>
                </Pressable>

                <View style={styles.divider} />

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
                      color="#C62828"
                    />
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      styles.deleteText,
                    ]}
                  >
                    Delete conversation
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.cancelButton}
                onPress={closeMenu}
              >
                <Text style={styles.cancelText}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9E9E6",
  },

  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },

  searchWrapper: {
    height: 50,
    marginHorizontal: 18,
    paddingHorizontal: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E5",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111",
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

  activeTab: {
    backgroundColor: "#111",
  },

  tabText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#FFF",
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
    color: "#222",
  },

  count: {
    marginLeft: 7,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: "#EAEAE7",
    color: "#777",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9E9E6",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  chatCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.995 }],
  },

  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F3F3F0",
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
    color: "#171717",
    fontWeight: "700",
  },

  chatTime: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },

  chatPreview: {
    marginTop: 5,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#8A8A8A",
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
    backgroundColor: "#ECECE9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 17,
    color: "#222",
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: "#929292",
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 22,
    height: 44,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    color: "#FFF",
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
    borderTopColor: "#EAEAE7",
  },

  footerText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "700",
  },

  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#AAA",
  },

  footerStatus: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.32)",
    justifyContent: "flex-end",
  },

  actionSheet: {
    backgroundColor: "#F7F7F5",
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
    backgroundColor: "#D0D0CD",
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
    backgroundColor: "#EAEAE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  sheetTitleContainer: {
    flex: 1,
  },

  sheetTitle: {
    fontSize: 15,
    color: "#181818",
    fontWeight: "700",
  },

  sheetSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },

  actionList: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E8E8E5",
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
    backgroundColor: "#F4F4F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEB",
    marginHorizontal: 14,
  },

  deleteIcon: {
    backgroundColor: "#FFF1F1",
  },

  deleteText: {
    color: "#C62828",
  },

  cancelButton: {
    height: 52,
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E8E8E5",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "700",
  },
});