import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');


export default function HomeScreen() {
    return (
        <SafeAreaView>
            <View>
                <Text>Home Screen</Text>
                {/* Konten utama untuk Home Screen */}
            </View>
        </SafeAreaView>
    );
}