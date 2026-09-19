import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

export default function GithubCallback() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/login");
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F7F7F5",
            }}
        >
            <ActivityIndicator
                size="small"
                color="#171717"
            />
        </View>
    );
}