import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTranslation } from '@/hooks/useAppTranslator';

const { width, height } = Dimensions.get('window');

export const AnalyticsPaywallOverlay = ({ onUpgradePress, visible = true, theme, mode}: any) => {
  if (!visible) return null;

  const {t} = useAppTranslation()

  return (
    <BlurView intensity={100} style={styles.blurOverlay}>
      
      <View style={[styles.overlayContainer, {backgroundColor: mode === 'dark' ? 'rgba(8, 0, 0, 0.99)':'rgba(255, 255, 255, 0.99)'}] }>
        <View style={styles.lockContainer}>
          {/* Lock Icon with Gradient Background */}
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.lockIconContainer}
          >
            <Feather name="lock" size={28} color="#FFFFFF" />
          </LinearGradient>
          
          {/* Main Heading */}
          <Text style={[styles.title, {color: theme.primaryText}]}>{t('paywall.title')}</Text>
          
          {/* Description */}
          <Text style={[styles.description, {color: theme.primaryText}]}>
          {t('paywall.subtitle')}</Text>
          
          {/* Feature List */}
          <View style={styles.featureList}>
            <FeatureItem text={t('paywall.advantage1')} theme={theme} />
            <FeatureItem text={t('paywall.advantage2')} theme={theme} />
            {/* <FeatureItem text="Export and share reports" theme={theme} /> */}
            <FeatureItem text={t('paywall.advantage3')}  theme={theme} />
          </View>
          
          {/* Upgrade Button */}
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={onUpgradePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.upgradeButtonText, {color: theme.primaryText}]}>{t('paywall.buttontitle')} </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Trust Signal */}
          <Text style={[styles.trustSignal, {color: theme.primaryText}]}>
          {t('paywall.paywall guarantee')} 
          </Text>
        </View>
      </View>
  
    </BlurView>
  );
};

// Feature Item Component
const FeatureItem = ({ text, theme }: {text: string, theme: any}) => (
  <View style={styles.featureItem}>
    <View style={styles.checkmark} />
    <Text style={[styles.featureText, {color: theme.primaryText}]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
  },
  overlayContainer: {
    overflow: 'hidden', // Add this line
    width: width * 0.85,
    maxWidth: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    borderRadius: 30,
    
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  lockContainer: {
    alignItems: 'center',
    overflow: 'hidden',
   
    width: '100%',
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    alignItems: 'center',
    padding:10,
    marginBottom: 24,
  },
  featureList: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  trustSignal: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default AnalyticsPaywallOverlay;