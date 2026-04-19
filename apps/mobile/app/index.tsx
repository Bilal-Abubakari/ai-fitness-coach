import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AI-Powered • Real-time • On-Device</Text>
      </View>

      <Text style={styles.title}>
        Your Personal{'\n'}
        <Text style={styles.titleAccent}>AI Fitness Coach</Text>
      </Text>

      <Text style={styles.subtitle}>
        Real-time form correction using your phone camera. Instant feedback, no cloud processing.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/coach')}
        >
          <Text style={styles.primaryButtonText}>Start Coaching →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.secondaryButtonText}>View Progress</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🎯', title: 'Real-time Feedback', desc: 'Instant form corrections' },
          { icon: '📊', title: 'Track Progress', desc: 'Reps, sets, and analytics' },
          { icon: '🔒', title: 'Privacy First', desc: 'All AI runs on-device' },
        ].map((f) => (
          <View key={f.title} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#030712',
  },
  badge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderColor: 'rgba(34,197,94,0.3)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  badgeText: { color: '#22c55e', fontSize: 12 },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  titleAccent: { color: '#22c55e' },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: { gap: 12, width: '100%', marginBottom: 48 },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#d1d5db', fontSize: 16, fontWeight: '600' },
  features: { flexDirection: 'row', gap: 12 },
  featureCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  featureIcon: { fontSize: 24, marginBottom: 6 },
  featureTitle: { color: '#fff', fontSize: 11, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  featureDesc: { color: '#6b7280', fontSize: 10, textAlign: 'center' },
});

