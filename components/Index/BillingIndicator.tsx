import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { billingType } from '@/constants/Styles/AppStyle';





interface BillingIndicatorProps {
  status: 'monthly' | 'yearly' | 'onetime' | 'inactive' | 'freetrial';
  children: string;
  theme: any
}

const BillingIndicator: React.FC<BillingIndicatorProps> = ({ status, children, theme }) => {

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: billingType[status] }]} />
      <Text style={[styles.text, { color: theme.primaryText }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 10,
  
  },
});

export default BillingIndicator;