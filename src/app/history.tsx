import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

type IconName = keyof typeof Ionicons.glyphMap;

type Chat = {
  id: string;
  title: string;
  preview: string;
  time: string;
  section: string;
  pinned?: boolean;
};

const initialChats: Chat[] = [
  {
    id: "1",
    title: "Explain gradient descent",
    preview: "Can you explain gradient descent step by step?",
    time: "12:42 PM",
    section: "Today",
    pinned: true,
  },
  {
    id: "2",
    title: "React Native AI app",
    preview: "Help me design the architecture for my app",
    time: "11:18 AM",
    section: "Today",
  },
  {
    id: "3",
    title: "CNN architecture",
    preview: "Explain convolution layers with an example",
    time: "Yesterday",
    section: "Yesterday",
  },
  {
    id: "4",
    title: "NumPy matrix operations",
    preview: "What is the difference between vector and matrix...",
    time: "Yesterday",
    section: "Yesterday",
  },
  {
    id: "5",
    title: "Logistic regression",
    preview: "Why does logistic regression need a sigmoid?",
    time: "Sep 15",
    section: "Previous 7 days",
  },
  {
    id: "6",
    title: "PyTorch neural network",
    preview: "How should I choose hidden layer sizes?",
    time: "Sep 14",
    section: "Previous 7 days",
  },
];

export default function HistoryPage() {
  const [chats, setChats] = useState(initialChats);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query) ||
        chat.preview.toLowerCase().includes(query)
    );
  }, [chats, search]);

  const pinnedChats = filteredChats.filter(
    (chat) => chat.pinned
  );

  const sections = [
    "Today",
    "Yesterday",
    "Previous 7 days",
  ];

  const openChat = (chat: Chat) => {
    router.push({
      pathname: "/chat",
      params: {
        chatId: chat.id,
        title: chat.title,
      },
    });
  };

  const openMenu = (chat: Chat) => {
    setSelectedChat(chat);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedChat(null);
  };

  const togglePin = () => {
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

    closeMenu();
  };

  const renameChat = () => {
    if (!selectedChat) return;

    const currentChat = selectedChat;

    closeMenu();

    Alert.prompt(
      "Rename chat",
      "Enter a new name",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: (text) => {
            if (!text?.trim()) return;

            setChats((current) =>
              current.map((chat) =>
                chat.id === currentChat.id
                  ? {
                      ...chat,
                      title: text.trim(),
                    }
                  : chat
              )
            );
          },
        },
      ],
      "plain-text",
      currentChat.title
    );
  };

  const deleteChat = () => {
    if (!selectedChat) return;

    const currentChat = selectedChat;

    Alert.alert(
      "Delete chat",
      `Delete "${currentChat.title}"?`,
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
              current.filter(
                (chat) => chat.id !== currentChat.id
              )
            );

            closeMenu();
          },
        },
      ]
    );
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#171717"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Chats
            </Text>

            <Text style={styles.headerSubtitle}>
              {chats.length} conversations
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color="#171717"
            />
          </Pressable>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchIcon}>
            <Ionicons
              name="search-outline"
              size={17}
              color="#777"
            />
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations"
            placeholderTextColor="#999"
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable
              style={styles.clearSearch}
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="#999"
              />
            </Pressable>
          )}
        </View>

        <View style={styles.quickActions}>
          <QuickAction
            icon="add"
            title="New chat"
            onPress={() => router.replace("/")}
            primary
          />

          <QuickAction
            icon="folder-open-outline"
            title="Projects"
            onPress={() => router.push("/projects")}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {pinnedChats.length > 0 && (
            <ChatSection
              title="Pinned"
              icon="pin-outline"
            >
              {pinnedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onPress={() => openChat(chat)}
                  onMenu={() => openMenu(chat)}
                />
              ))}
            </ChatSection>
          )}

          {sections.map((section) => {
            const sectionChats = filteredChats.filter(
              (chat) =>
                chat.section === section &&
                !chat.pinned
            );

            if (sectionChats.length === 0) return null;

            return (
              <ChatSection
                key={section}
                title={section}
              >
                {sectionChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    onPress={() => openChat(chat)}
                    onMenu={() => openMenu(chat)}
                  />
                ))}
              </ChatSection>
            );
          })}

          {filteredChats.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="search-outline"
                  size={24}
                  color="#777"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No conversations found
              </Text>

              <Text style={styles.emptyText}>
                Try another search term.
              </Text>
            </View>
          )}

          <View style={styles.accountCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
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

            <Pressable
              style={styles.accountArrow}
              onPress={() => router.push("/profile")}
            >
              <Ionicons
                name="chevron-forward"
                size={17}
                color="#888"
              />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLogo}>
              <Ionicons
                name="sparkles"
                size={12}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.footerText}>
              Trilok-On
            </Text>
          </View>
        </ScrollView>
      </View>

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
            style={styles.actionSheet}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetChatIcon}>
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color="#555"
                />
              </View>

              <View style={styles.sheetHeaderText}>
                <Text
                  style={styles.sheetTitle}
                  numberOfLines={1}
                >
                  {selectedChat?.title}
                </Text>

                <Text style={styles.sheetSubtitle}>
                  Chat options
                </Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            <ActionRow
              icon={
                selectedChat?.pinned
                  ? "pin"
                  : "pin-outline"
              }
              title={
                selectedChat?.pinned
                  ? "Unpin chat"
                  : "Pin chat"
              }
              onPress={togglePin}
            />

            <ActionRow
              icon="create-outline"
              title="Rename"
              onPress={renameChat}
            />

            <ActionRow
              icon="archive-outline"
              title="Archive"
              onPress={archiveChat}
            />

            <ActionRow
              icon="share-outline"
              title="Share"
              onPress={() => {
                closeMenu();

                Alert.alert(
                  "Share",
                  "Chat sharing will be available here."
                );
              }}
            />

            <ActionRow
              icon="trash-outline"
              title="Delete"
              danger
              onPress={deleteChat}
            />

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
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  title,
  onPress,
  primary = false,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickAction,
        primary && styles.quickActionPrimary,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={17}
        color={primary ? "#FFFFFF" : "#555"}
      />

      <Text
        style={[
          styles.quickActionText,
          primary && styles.quickActionTextPrimary,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function ChatSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: IconName;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color="#888"
          />
        )}

        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      </View>

      <View style={styles.chatList}>
        {children}
      </View>
    </View>
  );
}

function ChatItem({
  chat,
  onPress,
  onMenu,
}: {
  chat: Chat;
  onPress: () => void;
  onMenu: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chatItem,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      onLongPress={onMenu}
    >
      <View style={styles.chatIcon}>
        <Ionicons
          name="chatbubble-outline"
          size={17}
          color="#555"
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatTitleRow}>
          <Text
            style={styles.chatTitle}
            numberOfLines={1}
          >
            {chat.title}
          </Text>

          {chat.pinned && (
            <Ionicons
              name="pin"
              size={12}
              color="#888"
            />
          )}
        </View>

        <Text
          style={styles.chatPreview}
          numberOfLines={1}
        >
          {chat.preview}
        </Text>
      </View>

      <View style={styles.chatRight}>
        <Text style={styles.chatTime}>
          {chat.time}
        </Text>

        <Pressable
          style={styles.menuButton}
          onPress={onMenu}
          hitSlop={8}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={17}
            color="#999"
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

function ActionRow({
  icon,
  title,
  danger = false,
  onPress,
}: {
  icon: IconName;
  title: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionRow,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.actionIcon,
          danger && styles.actionIconDanger,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#C0392B" : "#444"}
        />
      </View>

      <Text
        style={[
          styles.actionText,
          danger && styles.dangerText,
        ]}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={15}
        color="#AAA"
        style={styles.actionArrow}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  container: {
    flex: 1,
  },

  header: {
    height: 62,
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

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 9.5,
    color: "#999",
  },

  searchWrapper: {
    height: 47,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEDED9",
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 9,
    fontSize: 13,
    color: "#222",
  },

  clearSearch: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  quickActions: {
    paddingHorizontal: 15,
    marginTop: 11,
    flexDirection: "row",
    gap: 8,
  },

  quickAction: {
    height: 37,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#EAEAE5",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  quickActionPrimary: {
    backgroundColor: "#171717",
  },

  quickActionText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#555",
  },

  quickActionTextPrimary: {
    color: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 30,
  },

  section: {
    marginBottom: 21,
  },

  sectionHeader: {
    height: 26,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  chatList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E0E0DB",
    overflow: "hidden",
  },

  chatItem: {
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E0",
  },

  pressed: {
    backgroundColor: "#F0F0EC",
  },

  chatIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  chatContent: {
    flex: 1,
    marginLeft: 11,
  },

  chatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  chatTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#292929",
  },

  chatPreview: {
    marginTop: 4,
    fontSize: 10.5,
    color: "#999",
  },

  chatRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  chatTime: {
    fontSize: 9.5,
    color: "#999",
  },

  menuButton: {
    width: 28,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  empty: {
    alignItems: "center",
    paddingTop: 75,
    paddingBottom: 100,
  },

  emptyIcon: {
    width: 57,
    height: 57,
    borderRadius: 19,
    backgroundColor: "#EAEAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 11,
    color: "#999",
  },

  accountCard: {
    marginTop: 2,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0DB",
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 16,
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

  accountArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F1F1ED",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  footerLogo: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  footerText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },

  actionSheet: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 27,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: "#F7F7F5",
  },

  sheetHandle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C8C8C2",
    marginBottom: 16,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  sheetChatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EAEAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  sheetHeaderText: {
    flex: 1,
    marginLeft: 10,
  },

  sheetTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#292929",
  },

  sheetSubtitle: {
    marginTop: 3,
    fontSize: 10,
    color: "#999",
  },

  sheetDivider: {
    height: 1,
    backgroundColor: "#DEDED9",
    marginVertical: 13,
  },

  actionRow: {
    height: 52,
    paddingHorizontal: 7,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#EAEAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  actionIconDanger: {
    backgroundColor: "#F9E8E6",
  },

  actionText: {
    marginLeft: 11,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  dangerText: {
    color: "#C0392B",
  },

  actionArrow: {
    marginLeft: "auto",
  },

  cancelButton: {
    height: 49,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#E8E8E3",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#444",
  },
});