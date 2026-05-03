import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View, TextInput, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureText, setSecureText] = useState<boolean>(true);

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ImageBackground className="flex-1 w-full h-full bg-black">
                {/* Header Section */}
                <View className="items-center pt-24">
                    <View className="flex-row items-center px-5">
                        <Image
                            source={require('../../../assets/images/icon_bspid.png')}
                            className="w-20 h-20 mr-4"
                            resizeMode="contain"
                        />
                        <View className="flex-shrink">
                            <Text className="text-xl font-bold text-[#F68B1E]">
                                Bang Sampah
                                <Text className="text-[#43B02A]"> Pintar</Text>
                            </Text>
                            <Text className="text-xs text-gray-400">
                                Digitalisasi Sampah Menjadi Emas
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    bounces={false}
                >
                    {/* Spacer to push content down */}
                    <View style={{ height: height * 0.25 }} />

                    {/* Login Panel */}
                    <View
                        className="bg-white rounded-t-[35px] px-6 pt-8 pb-10"
                        style={{ height: height * 0.75 }}
                    >
                        <Text className="text-3xl font-bold text-[#1A1A1A] mb-1">Welcome!</Text>
                        <Text className="text-sm text-gray-500 mb-8">Log In to your account using phone number</Text>

                        {/* Phone Number Input */}
                        <View className="mb-5">
                            <Text className="text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Phone Number</Text>
                            <View className="flex-row items-center bg-[#F8F9FB] rounded-full px-4 border border-[#F0F0F0]">
                                <View className="flex-row items-center">
                                    <Image
                                        source={{ uri: 'https://flagcdn.com/w40/id.png' }}
                                        className="w-6 h-4 rounded-sm mr-2"
                                    />
                                    <Text className="text-base font-bold text-[#1A1A1A]">+62</Text>
                                    <View className="w-[1px] h-5 bg-gray-300 mx-3" />
                                </View>
                                <TextInput
                                    className="flex-1 py-3.5 text-base text-[#1A1A1A]"
                                    placeholder="812-3456-7890"
                                    placeholderTextColor="#A8ABB0"
                                    value={phoneNumber}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={13}
                                />
                                <MaterialIcons name="phone-iphone" size={20} color="#A8ABB0" />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mb-5">
                            <Text className="text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Password</Text>
                            <View className="flex-row items-center bg-[#F8F9FB] rounded-full px-5 border border-[#F0F0F0]">
                                <TextInput
                                    className="flex-1 py-3.5 text-[#1A1A1A] text-sm"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#A8ABB0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={secureText}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    <MaterialIcons
                                        name={secureText ? "visibility-off" : "visibility"}
                                        size={20}
                                        color="#A8ABB0"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity className="self-end mb-6">
                            <Text className="text-[#00512c] text-xs font-semibold">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            className="bg-[#F68B1E] py-4 rounded-full items-center mb-10"
                            onPress={() => router.push('/(tabs)/home')}
                        >
                            <Text className="text-white text-base font-bold">Log In</Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <View className="flex-row justify-center items-center mb-16">
                            <Text className="text-gray-500 text-sm">Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('../auth/signup')}>
                                <Text className="text-[#00512c] text-sm font-bold underline pb-1"> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}