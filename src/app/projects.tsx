import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
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

type IconName = keyof typeof Ionicons.glyphMap;

type Project = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  chats: number;
  files: number;
  updated: string;
  favorite: boolean;
};

const initialProjects: Project[] = [
  {
    id: "ritmsync",
    name: "RitmSync",
    description: "College management and student assistant app.",
    icon: "school-outline",
    chats: 18,
    files: 12,
    updated: "Today",
    favorite: true,
  },
  {
    id: "onithras",
    name: "OnithrasML",
    description: "Machine learning library and documentation.",
    icon: "analytics-outline",
    chats: 26,
    files: 18,
    updated: "Yesterday",
    favorite: true,
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Building a modern AI assistant application.",
    icon: "sparkles-outline",
    chats: 12,
    files: 7,
    updated: "Sep 17",
    favorite: false,
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    description: "CNN, ANN and PyTorch learning notes.",
    icon: "hardware-chip-outline",
    chats: 31,
    files: 9,
    updated: "Sep 15",
    favorite: false,
  },
];

export default function ProjectsPage() {
  const { colors } = useTheme();

  const [projects, setProjects] =
    useState<Project[]>(initialProjects);

  const [search, setSearch] = useState("");
  const [createVisible, setCreateVisible] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] =
    useState("");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }, [projects, search]);

  const favorites = filteredProjects.filter(
    (project) => project.favorite
  );

  const allProjects = filteredProjects.filter(
    (project) => !project.favorite
  );

  const createProject = () => {
    const name = projectName.trim();

    if (!name) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description:
        projectDescription.trim() ||
        "A new Trilok-On project.",
      icon: "folder-outline",
      chats: 0,
      files: 0,
      updated: "Just now",
      favorite: false,
    };

    setProjects((current) => [
      newProject,
      ...current,
    ]);

    setProjectName("");
    setProjectDescription("");
    setCreateVisible(false);
  };

  const toggleFavorite = (id: string) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              favorite: !project.favorite,
            }
          : project
      )
    );
  };

  const openProject = (project: Project) => {
    router.push({
      pathname: "/project",
      params: {
        id: project.id,
        name: project.name,
      },
    });
  };

  const closeCreateModal = () => {
    setCreateVisible(false);
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
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
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
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
            Projects
          </Text>

          <Pressable
            style={[
              styles.newButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setCreateVisible(true)}
          >
            <Ionicons
              name="add"
              size={18}
              color={colors.primaryText}
            />

            <Text
              style={[
                styles.newButtonText,
                {
                  color: colors.primaryText,
                },
              ]}
            >
              New
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textMuted}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search projects"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.searchInput,
              {
                color: colors.text,
              },
            ]}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {favorites.length > 0 && (
            <ProjectSection
              title="Favorites"
              projects={favorites}
              onOpen={openProject}
              onFavorite={toggleFavorite}
              colors={colors}
            />
          )}

          {allProjects.length > 0 && (
            <ProjectSection
              title="All projects"
              projects={allProjects}
              onOpen={openProject}
              onFavorite={toggleFavorite}
              colors={colors}
            />
          )}

          {filteredProjects.length === 0 && (
            <View style={styles.empty}>
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
                  name="folder-open-outline"
                  size={26}
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
                No projects found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                Create a new project or try another search.
              </Text>

              <Pressable
                style={[
                  styles.emptyButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setCreateVisible(true)}
              >
                <Ionicons
                  name="add"
                  size={17}
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
                  Create project
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={createVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCreateModal}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            {
              backgroundColor: colors.overlay,
            },
          ]}
          onPress={closeCreateModal}
        >
          <Pressable
            style={[
              styles.createSheet,
              {
                backgroundColor: colors.background,
              },
            ]}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: colors.border,
                },
              ]}
            />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleContainer}>
                <Text
                  style={[
                    styles.sheetTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  New project
                </Text>

                <Text
                  style={[
                    styles.sheetSubtitle,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                >
                  Organize chats, files and work in one
                  place.
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
                onPress={closeCreateModal}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Project name
            </Text>

            <TextInput
              value={projectName}
              onChangeText={setProjectName}
              placeholder="e.g. My AI Project"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              autoFocus
            />

            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Description
            </Text>

            <TextInput
              value={projectDescription}
              onChangeText={setProjectDescription}
              placeholder="What are you building?"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                styles.descriptionInput,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[
                styles.createButton,
                {
                  backgroundColor: colors.primary,
                },
                !projectName.trim() &&
                  styles.createButtonDisabled,
              ]}
              disabled={!projectName.trim()}
              onPress={createProject}
            >
              <Text
                style={[
                  styles.createButtonText,
                  {
                    color: colors.primaryText,
                  },
                ]}
              >
                Create project
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={colors.primaryText}
              />
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function ProjectSection({
  title,
  projects,
  onOpen,
  onFavorite,
  colors,
}: {
  title: string;
  projects: Project[];
  onOpen: (project: Project) => void;
  onFavorite: (id: string) => void;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryText: string;
    input: string;
    card: string;
    danger: string;
    overlay: string;
  };
}) {
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
        {title}
      </Text>

      <View style={styles.grid}>
        {projects.map((project) => (
          <Pressable
            key={project.id}
            style={({ pressed }) => [
              styles.projectCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => onOpen(project)}
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.projectIcon,
                  {
                    backgroundColor:
                      colors.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons
                  name={project.icon}
                  size={21}
                  color={colors.textSecondary}
                />
              </View>

              <Pressable
                style={styles.favoriteButton}
                onPress={() =>
                  onFavorite(project.id)
                }
                hitSlop={8}
              >
                <Ionicons
                  name={
                    project.favorite
                      ? "star"
                      : "star-outline"
                  }
                  size={17}
                  color={
                    project.favorite
                      ? colors.text
                      : colors.textMuted
                  }
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.projectName,
                {
                  color: colors.text,
                },
              ]}
              numberOfLines={1}
            >
              {project.name}
            </Text>

            <Text
              style={[
                styles.projectDescription,
                {
                  color: colors.textMuted,
                },
              ]}
              numberOfLines={2}
            >
              {project.description}
            </Text>

            <View style={styles.cardBottom}>
              <View style={styles.stat}>
                <Ionicons
                  name="chatbubble-outline"
                  size={12}
                  color={colors.textMuted}
                />

                <Text
                  style={[
                    styles.statText,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                >
                  {project.chats}
                </Text>
              </View>

              <View style={styles.stat}>
                <Ionicons
                  name="document-outline"
                  size={12}
                  color={colors.textMuted}
                />

                <Text
                  style={[
                    styles.statText,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                >
                  {project.files}
                </Text>
              </View>

              <Text
                style={[
                  styles.updated,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                {project.updated}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    height: 59,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  newButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  newButtonText: {
    fontSize: 11.5,
    fontWeight: "700",
  },

  searchBox: {
    height: 45,
    marginHorizontal: 15,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 9,
    fontSize: 13,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 21,
    paddingBottom: 35,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    marginLeft: 4,
    marginBottom: 9,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  projectCard: {
    width: "48.3%",
    minHeight: 190,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  projectIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  projectName: {
    marginTop: 13,
    fontSize: 14,
    fontWeight: "700",
  },

  projectDescription: {
    marginTop: 5,
    minHeight: 31,
    fontSize: 10.5,
    lineHeight: 15,
  },

  cardBottom: {
    marginTop: "auto",
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  statText: {
    fontSize: 9.5,
  },

  updated: {
    marginLeft: "auto",
    fontSize: 8.5,
  },

  empty: {
    alignItems: "center",
    paddingTop: 75,
    paddingBottom: 100,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 11,
    textAlign: "center",
  },

  emptyButton: {
    height: 40,
    marginTop: 17,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  emptyButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  createSheet: {
    paddingHorizontal: 17,
    paddingTop: 9,
    paddingBottom: 28,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    marginBottom: 17,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  sheetTitleContainer: {
    flex: 1,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "750",
  },

  sheetSubtitle: {
    maxWidth: 285,
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
  },

  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  inputLabel: {
    marginTop: 18,
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "650",
  },

  textInput: {
    height: 47,
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1,
    fontSize: 13,
  },

  descriptionInput: {
    height: 82,
    paddingTop: 12,
  },

  createButton: {
    height: 48,
    marginTop: 19,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  createButtonDisabled: {
    opacity: 0.4,
  },

  createButtonText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
});