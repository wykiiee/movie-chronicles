import { router } from 'expo-router';
import { Film } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Onboarding from '../components/onboarding';

const { width } = Dimensions.get('window');

export default function Index() {
	const [onboardingComplete, setOnboardingComplete] = useState(false);

	const handleComplete = useCallback(() => {
		setOnboardingComplete(true);
	}, []);

	if (!onboardingComplete) {
		return <Onboarding onComplete={handleComplete} />;
	}

	return (
		<View style={styles.container}>
			<View style={{ alignItems: 'center' }}>
				<Film size={100} color='#8B5CF6' style={styles.icon} />
				<Animated.Text
					entering={FadeInDown.duration(500)}
					exiting={FadeOutUp.duration(500)}
					style={styles.title}
				>
					Welcome to MovieDiary
				</Animated.Text>
				<Animated.Text
					entering={FadeInDown.duration(500).delay(200)}
					exiting={FadeOutUp.duration(500).delay(200)}
					style={styles.subtitle}
				>
					Your personal movie journey begins here.
				</Animated.Text>
			</View>
			<View>
				<Animated.View
					entering={FadeInDown.duration(500).delay(400)}
					exiting={FadeOutUp.duration(500).delay(400)}
				>
					<TouchableOpacity
						style={styles.button}
						activeOpacity={0.8}
						onPress={() => router.push('/(auth)/register')}
					>
						<Text style={styles.buttonText}>Register</Text>
					</TouchableOpacity>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.duration(500).delay(500)}
					exiting={FadeOutUp.duration(500).delay(500)}
				>
					<TouchableOpacity
						style={[styles.button, { marginTop: 16 }]}
						onPress={() => router.push('/login')}
						activeOpacity={0.8}
					>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		padding: 24,
		backgroundColor: '#111827',
	},
	icon: {
		marginBottom: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 16,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		color: '#9CA3AF',
		marginBottom: 32,
		textAlign: 'center',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#8B5CF6',
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 9999,
		width: width - 48,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
