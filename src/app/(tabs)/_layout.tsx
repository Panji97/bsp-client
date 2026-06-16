import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // <-- Ini membuat teks menjadi invisible
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                        },
                        android: {
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                        },
                    }),
                    borderTopWidth: 0,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                // tabBarLabelStyle: {
                //     fontSize: 11,
                //     fontWeight: '600',
                //     marginTop: 4,
                // },
                tabBarItemStyle: {
                    borderRadius: 30,
                    marginHorizontal: 4,
                },
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarActiveTintColor: '#FF6B35',
                    // title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    tabBarActiveTintColor: '#FF6B35',
                    // title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                            <Ionicons
                                name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'}
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarActiveTintColor: '#FF6B35',
                    // title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                            <Ionicons
                                name={focused ? 'person-circle' : 'person-circle-outline'}
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    activeIcon: {
        backgroundColor: '#FFF0E8',
    },
});