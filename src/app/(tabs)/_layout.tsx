import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: Platform.select({
                    ios: {
                        paddingBottom: 20,
                        height: 80,
                    },
                    android: {
                        paddingBottom: 20,
                        height: 100,
                    },
                }),
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarActiveTintColor: '#00512c',
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="transaction"
                options={{
                    tabBarActiveTintColor: '#00512c',
                    title: 'Transaction',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarActiveTintColor: '#00512c',
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}