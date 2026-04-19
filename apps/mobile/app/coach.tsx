import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SquatAnalyzer } from '@fitness/utils';
import { SquatAnalysis, PoseLandmark } from '@fitness/types';

const { width, height } = Dimensions.get('window');

// MVP: Mock pose data for demonstration (real TFLite integration in v2)
function mockLandmarks(): PoseLandmark[] {
  return Array.from({ length: 33 }, (_, i) => ({
    x: 0.3 + Math.random() * 0.4,
    y: i * 0.03 + Math.random() * 0.02,
    z: 0,
    visibility: 0.9,
  }));
}

export default function CoachScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const analyzerRef = useRef(new SquatAnalyzer());
  const [analysis, setAnalysis] = useState<SquatAnalysis>({
    phase: 'STANDING', repCount: 0, kneeAngle: 180, hipAngle: 180, backAngle: 0, feedback: [],
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    // In production: integrate expo-tensorflow or send frames to a local model
    const interval = setInterval(() => {
      const landmarks = mockLandmarks();
      const result = analyzerRef.current.analyze(landmarks);
      setAnalysis(result);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your exercise form in real-time.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const severityColor = (type: string) =>
    type === 'error' ? '#ef4444' : type === 'warning' ? '#eab308' : '#22c55e';

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front">
        {/* Header overlay */}
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Squat Coach</Text>
            <TouchableOpacity
              style={[styles.startButton, isActive && styles.stopButton]}
              onPress={() => {
                if (isActive) analyzerRef.current.reset();
                setIsActive((v) => !v);
              }}
            >
              <Text style={styles.startButtonText}>{isActive ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Stats overlay */}
        {isActive && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{analysis.repCount}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { fontSize: 18 }]}>{analysis.phase}</Text>
              <Text style={styles.statLabel}>Phase</Text>
            </View>
          </View>
        )}

        {/* Feedback overlay */}
        {isActive && analysis.feedback.length > 0 && (
          <View style={styles.feedbackContainer}>
            {analysis.feedback.slice(0, 2).map((f, i) => (
              <View
                key={i}
                style={[styles.feedbackItem, { borderColor: severityColor(f.type) }]}
              >
                <Text style={[styles.feedbackText, { color: severityColor(f.type) }]}>
                  {f.type === 'error' ? '✗' : f.type === 'warning' ? '⚠' : '✓'} {f.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Angles bottom bar */}
        {isActive && (
          <View style={styles.anglesBar}>
            {[
              { label: 'Knee', value: analysis.kneeAngle },
              { label: 'Hip', value: analysis.hipAngle },
              { label: 'Back', value: analysis.backAngle },
            ].map((a) => (
              <View key={a.label} style={styles.angleItem}>
                <Text style={styles.angleValue}>{a.value.toFixed(0)}°</Text>
                <Text style={styles.angleLabel}>{a.label}</Text>
              </View>
            ))}
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  permissionTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  permissionText: { color: '#9ca3af', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  primaryButton: { backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: { padding: 8 },
  backText: { color: '#9ca3af', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  startButton: {
    backgroundColor: '#22c55e', borderRadius: 8,
    paddingVertical: 8, paddingHorizontal: 20,
  },
  stopButton: { backgroundColor: '#dc2626' },
  startButtonText: { color: '#fff', fontWeight: '600' },
  statsContainer: {
    flexDirection: 'row', gap: 12, padding: 16,
  },
  statBox: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12,
    padding: 12, alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  statLabel: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  feedbackContainer: { padding: 16, gap: 8 },
  feedbackItem: {
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8,
    borderWidth: 1, padding: 10,
  },
  feedbackText: { fontSize: 13 },
  anglesBar: {
    position: 'absolute', bottom: 40, left: 16, right: 16,
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16, padding: 16,
  },
  angleItem: { flex: 1, alignItems: 'center' },
  angleValue: { color: '#22c55e', fontSize: 20, fontWeight: 'bold' },
  angleLabel: { color: '#9ca3af', fontSize: 11 },
});

