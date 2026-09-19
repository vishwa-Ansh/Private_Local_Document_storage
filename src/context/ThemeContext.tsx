import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeColors = {
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

type ThemeContextType = {
  mode: ThemeMode;
  theme: "light" | "dark";
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "@trilok_on_theme";

const lightColors: ThemeColors = {
  background: "#F7F7F5",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F1EF",
  text: "#171717",
  textSecondary: "#555555",
  textMuted: "#8A8A8A",
  border: "#E5E5E2",
  primary: "#171717",
  primaryText: "#FFFFFF",
  input: "#FFFFFF",
  card: "#FFFFFF",
  danger: "#D92D20",
  overlay: "rgba(0,0,0,0.35)",
};

const darkColors: ThemeColors = {
  background: "#0B0B0C",
  surface: "#151517",
  surfaceSecondary: "#1D1D20",
  text: "#F5F5F5",
  textSecondary: "#B5B5B5",
  textMuted: "#777777",
  border: "#29292D",
  primary: "#FFFFFF",
  primaryText: "#111111",
  input: "#171719",
  card: "#151517",
  danger: "#FF5C5C",
  overlay: "rgba(0,0,0,0.65)",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();

  const [mode, setMode] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system"
        ) {
          setMode(savedTheme);
        }
      } catch (error) {
        console.error("Theme Load Error:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newMode: ThemeMode) => {
    setMode(newMode);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Theme Save Error:", error);
    }
  };

  const theme =
    mode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : mode;

  const colors = theme === "dark" ? darkColors : lightColors;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        colors,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}