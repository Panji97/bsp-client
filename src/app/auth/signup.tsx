import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Dimensions, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext'; // Tambahkan ini

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { setAuthData } = useAuth(); // Tambahkan ini
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [secureText, setSecureText] = useState<boolean>(true);
    const [secureConfirmText, setSecureConfirmText] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length <= 13) {
            setPhoneNumber(cleaned);
        }
    };

    const validateInputs = () => {
        if (!email) {
            Alert.alert('Validation Error', 'Please enter your email');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return false;
        }

        if (!password || password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInputs()) {
            return;
        }

        setLoading(true);

        try {
            const fullPhoneNumber = phoneNumber;

            const response = await fetch('http://localhost:1337/api/auth/local/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: fullPhoneNumber,
                    email: email,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Registration successful:', result);

                if (result.jwt) {
                    // Gunakan setAuthData dari context
                    await setAuthData(result.jwt, result.user);
                    router.push('/(tabs)/home');
                } else {
                    Alert.alert('Error', 'Registration successful but no token received');
                }
            } else {
                console.error('Registration failed:', result);

                let errorMessage = 'Registration failed. Please try again.';
                if (result.error && result.error.message) {
                    if (result.error.message.includes('unique')) {
                        errorMessage = 'Phone number or email already registered. Please use a different one.';
                    } else {
                        errorMessage = result.error.message;
                    }
                }

                Alert.alert('Registration Failed', errorMessage);
            }
        } catch (error) {
            console.error('Network Error:', error);
            Alert.alert(
                'Connection Error',
                'Unable to connect to server. Please check your internet connection and make sure the backend server is running.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.background}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="chevron-left" size={28} color="#2E7D32" />
                </TouchableOpacity>

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

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ height: height * 0.1 }} />

                    <View style={styles.signupPanel}>
                        <Text style={styles.panelTitle}>Welcome!</Text>
                        <Text style={styles.panelSubtitle}>Register your account using phone number</Text>

                        <View style={styles.inputLabelContainer}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.phoneInputWrapper}>
                                <View style={styles.countryCodeContainer}>
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
                                    editable={!loading}
                                />
                                <MaterialIcons name="phone-iphone" size={20} color="#A8ABB0" />
                            </View>
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#A8ABB0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
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
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)} disabled={loading}>
                                    <MaterialIcons
                                        name={secureText ? "visibility-off" : "visibility"}
                                        size={20}
                                        color="#A8ABB0"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <View style={styles.passwordInputContainer2}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#A8ABB0"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={secureConfirmText}
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)} disabled={loading}>
                                    <MaterialIcons
                                        name={secureConfirmText ? "visibility-off" : "visibility"}
                                        size={20}
                                        color="#A8ABB0"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signupButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('../auth/login')} disabled={loading}>
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
        paddingTop: 60,
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
        marginBottom: 0,
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
    signupButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    signupButtonDisabled: {
        backgroundColor: '#F68B1E80',
        opacity: 0.7,
    },
    signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { color: '#666', fontSize: 14 },
    signUpLinkText: { color: '#00512c', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});