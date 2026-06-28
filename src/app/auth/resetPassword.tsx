// app/auth/resetPassword.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';

const { height, width } = Dimensions.get('window');

type ResetStep = 'phone' | 'otp' | 'new-password' | 'success';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {
        forgotPassword,
        verifyOTP,
        resetPassword,
        isLoading: authLoading
    } = useAuth();

    // State untuk multi-step
    const [currentStep, setCurrentStep] = useState<ResetStep>('phone');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpCode, setOtpCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Context dari halaman profile
    const fromProfile = params.fromProfile === 'true';

    // Timer OTP
    useEffect(() => {
        // Hanya jalankan timer jika di step otp dan timer > 0
        if (currentStep === 'otp' && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Cleanup interval
            return () => {
                clearInterval(interval);
            };
        }
        // Jika timer habis dan masih di step otp
        else if (currentStep === 'otp' && timer === 0) {
            setCanResend(true);
        }
    }, [currentStep, timer]); // Dependency: currentStep dan timer

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    const handleOtpChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setOtpCode(cleaned);
    };

    // Step 1: Kirim OTP
    const handleSendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        if (phoneNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number (min 10 digits)');
            return;
        }

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

            await forgotPassword(identifier);
            setCurrentStep('otp');
            setTimer(60);
            setCanResend(false);
            Alert.alert('Success', 'OTP code has been sent to your phone number');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verifikasi OTP
    const handleVerifyOTP = async () => {
        if (!otpCode || otpCode.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP code');
            return;
        }

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

            await verifyOTP(identifier, otpCode);
            setCurrentStep('new-password');
            Alert.alert('Success', 'OTP verified successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid OTP code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

            await forgotPassword(identifier);
            setTimer(60);
            setCanResend(false);
            Alert.alert('Success', 'New OTP code has been sent');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Buat Password Baru
    const handleResetPassword = async () => {
        if (!newPassword) {
            Alert.alert('Error', 'Please enter a new password');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

            await resetPassword(identifier, newPassword);
            setCurrentStep('success');

            Alert.alert(
                'Success',
                'Your password has been reset successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (fromProfile) {
                                router.back();
                            } else {
                                router.push('/auth/login');
                            }
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep === 'phone' || currentStep === 'success') {
            if (fromProfile) {
                router.back();
            } else {
                router.push('/auth/login');
            }
        } else {
            setCurrentStep('phone');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'phone':
                return renderPhoneStep();
            case 'otp':
                return renderOTPStep();
            case 'new-password':
                return renderNewPasswordStep();
            case 'success':
                return renderSuccessStep();
            default:
                return null;
        }
    };

    const renderPhoneStep = () => (
        <>
            <Text style={styles.welcomeTitle}>
                {fromProfile ? 'Change Password' : 'Forgot Password?'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
                {fromProfile
                    ? 'Enter your phone number to change your password'
                    : 'Enter your phone number to reset your password'}
            </Text>

            <View style={styles.inputSection}>
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
                        style={styles.phoneTextInput}
                        placeholder="812-3456-7890"
                        placeholderTextColor="#A8ABB0"
                        value={phoneNumber}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={13}
                        editable={!loading && !authLoading}
                    />
                    <MaterialIcons name="phone-iphone" size={20} color="#A8ABB0" />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                    We'll send an OTP code to your phone number for verification
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.primaryButton, (loading || authLoading) && styles.disabledButton]}
                onPress={handleSendOTP}
                disabled={loading || authLoading}
            >
                {(loading || authLoading) ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.primaryButtonText}>Send OTP Code</Text>
                )}
            </TouchableOpacity>
        </>
    );

    const renderOTPStep = () => (
        <>
            <Text style={styles.welcomeTitle}>Verify OTP</Text>
            <Text style={styles.welcomeSubtitle}>
                We've sent an OTP code to your phone number
            </Text>

            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>OTP Code</Text>
                <View style={styles.otpInputWrapper}>
                    <MaterialIcons name="security" size={20} color="#A8ABB0" />
                    <TextInput
                        style={styles.otpInput}
                        placeholder="Enter OTP code"
                        placeholderTextColor="#A8ABB0"
                        value={otpCode}
                        onChangeText={handleOtpChange}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!loading && !authLoading}
                    />
                </View>
            </View>

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {timer > 0 ? `Resend code in ${timer}s` : 'Code expired'}
                </Text>
                <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={!canResend || loading}
                >
                    <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
                        Resend
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.primaryButton, (loading || authLoading) && styles.disabledButton]}
                onPress={handleVerifyOTP}
                disabled={loading || authLoading}
            >
                {(loading || authLoading) ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.primaryButtonText}>Verify OTP</Text>
                )}
            </TouchableOpacity>
        </>
    );

    const renderNewPasswordStep = () => (
        <>
            <Text style={styles.welcomeTitle}>Create New Password</Text>
            <Text style={styles.welcomeSubtitle}>
                Enter your new password below
            </Text>

            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter new password"
                        placeholderTextColor="#A8ABB0"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showPassword}
                        editable={!loading && !authLoading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialIcons
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={24}
                            color="#A8ABB0"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm new password"
                        placeholderTextColor="#A8ABB0"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        editable={!loading && !authLoading}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <MaterialIcons
                            name={showConfirmPassword ? "visibility" : "visibility-off"}
                            size={24}
                            color="#A8ABB0"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.passwordRequirements}>
                <Text style={styles.requirementText}>Password must contain:</Text>
                <View style={styles.requirementItem}>
                    <MaterialIcons
                        name={newPassword.length >= 6 ? "check-circle" : "radio-button-unchecked"}
                        size={16}
                        color={newPassword.length >= 6 ? "#4CAF50" : "#9E9E9E"}
                    />
                    <Text style={styles.requirementText}>At least 6 characters</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.primaryButton, (loading || authLoading) && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={loading || authLoading}
            >
                {(loading || authLoading) ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                )}
            </TouchableOpacity>
        </>
    );

    const renderSuccessStep = () => (
        <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
                <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Password Reset Successfully!</Text>
            <Text style={styles.successSubtitle}>
                Your password has been changed. You can now login with your new password.
            </Text>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                    if (fromProfile) {
                        router.back();
                    } else {
                        router.push('/auth/login');
                    }
                }}
            >
                <Text style={styles.primaryButtonText}>
                    {fromProfile ? 'Back to Profile' : 'Go to Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ImageBackground style={styles.background}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                        disabled={loading || authLoading}
                    >
                        <MaterialIcons
                            name={currentStep === 'success' ? "home" : "chevron-left"}
                            size={28}
                            color="#2E7D32"
                        />
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
                                    {fromProfile ? 'Change Password' : 'Forgot Password'}
                                </Text>
                                <Text style={styles.subtitle}>
                                    Nasabah Bank Sampah Pintar
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Content Panel */}
                    <View style={styles.loginPanel}>
                        {renderStep()}

                        {/* Footer for phone step */}
                        {currentStep === 'phone' && (
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Remember your password?</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (fromProfile) {
                                            router.back();
                                        } else {
                                            router.push('/auth/login');
                                        }
                                    }}
                                    disabled={loading || authLoading}
                                >
                                    <Text style={styles.loginText}> Log In</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5DC',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    disabledButton: {
        opacity: 0.7,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#EDEDF5',
    },
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
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 8,
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
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    loginPanel: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        marginTop: 20,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 32,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        marginLeft: 4,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 9999,
        paddingHorizontal: 16,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 12,
    },
    phoneTextInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1A1A1A',
    },
    otpInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 9999,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        gap: 12,
    },
    otpInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#1A1A1A',
        fontSize: 16,
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 9999,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#1A1A1A',
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    timerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    resendText: {
        fontSize: 14,
        color: '#F68B1E',
        fontWeight: 'bold',
    },
    resendDisabled: {
        color: '#9E9E9E',
    },
    passwordRequirements: {
        marginBottom: 24,
        padding: 12,
        backgroundColor: '#F8F9FB',
        borderRadius: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    requirementText: {
        fontSize: 12,
        color: '#6B7280',
    },
    primaryButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 16,
        borderRadius: 9999,
        alignItems: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    loginText: {
        color: '#00512c',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        paddingBottom: 4,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    successIconContainer: {
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 12,
    },
    successSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
});