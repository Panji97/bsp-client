import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>(''); // TypeScript Fix
    const [password, setPassword] = useState<string>(''); // TypeScript Fix
    const [secureText, setSecureText] = useState<boolean>(true);

    // Fungsi dengan penanganan tipe data (TypeScript)
    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.background}>
                {/* Tombol Kembali - Pojok Kiri Atas */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="chevron-left" size={28} color="#2E7D32" />
                </TouchableOpacity>

                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Image
                            source={require('../../../assets/images/icon_bspid.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View>
                            <Text style={styles.title}>
                                Sign Up
                            </Text>
                            <Text style={styles.subtitle}>
                                Nasabah Bank Sampah Pintar
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} bounces={false}>
                    <View style={{ height: height * 0.16 }} />

                    <View style={styles.signupPanel}>
                        <Text style={styles.panelTitle}>Welcome!</Text>
                        <Text style={styles.panelSubtitle}>Register your account using phone number</Text>

                        {/* Input Nomor HP dengan Bendera Indonesia */}
                        <View style={styles.inputLabelContainer}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.phoneInputWrapper}>
                                <View style={styles.countryCodeContainer}>
                                    {/* Bendera Indonesia menggunakan Image */}
                                    <Image
                                        source={{ uri: 'https://flagcdn.com/w40/id.png' }}
                                        style={styles.flagIcon}
                                    />
                                    <Text style={styles.countryCodeText}>+62</Text>
                                    <View style={styles.divider} />
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
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

                        <View style={styles.inputLabelContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
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
                            <View style={styles.passwordInputContainer2}>
                                <TextInput
                                    style={styles.passwordInput}
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

                        {/* <TouchableOpacity style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => router.push('/(tabs)/home')}
                        >
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('../auth/login')}>
                                <Text style={styles.signUpLinkText}> Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1, width: '100%', height: '100%', backgroundColor: '#F5F5DC' },
    // Tombol Kembali - Bulat di pojok kiri atas
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        alignItems: 'center',
        paddingTop: 80,
    },

    headerRow: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: 4,
        paddingTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
    overlay: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    logo: { width: 120, height: 120, marginRight: 16 },

    signupPanel: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 40,
    },
    panelTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
    panelSubtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
    inputLabelContainer: { marginBottom: 20 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginLeft: 5 },

    // Style Input Phone & Bendera
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 25,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 24,
        height: 16,
        borderRadius: 2,
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#DDD',
        marginHorizontal: 12,
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
    },

    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 25,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 10,
    },
    passwordInputContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 25,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    passwordInput: { flex: 1, paddingVertical: 14, color: '#1A1A1A', fontSize: 14 },
    // forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 25 },
    // forgotPasswordText: { color: '#00512c', fontSize: 13, fontWeight: '600' },
    signupButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { color: '#666', fontSize: 14 },
    signUpLinkText: { color: '#00512c', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});