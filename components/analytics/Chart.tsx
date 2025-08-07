import { Text, View, ScrollView, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import { ChartDataViaRange } from '@/utils/TimeRange';
import MinimalDropdown from '../ui/MinimalDropdowm';
import { useAppTranslation } from '@/hooks/useAppTranslator';

interface ChartProps {
  theme: {
    primaryText: string;
    [key: string]: any;
  };
  db: any;
  symbol: string;
}

interface DataPoint {
  [key: string]: number;
}

const Chart = ({ theme, db, symbol }: ChartProps) => {
  const { width } = useWindowDimensions();
  const {t } = useAppTranslation()
  const [selectedRange, setSelectedRange] = useState<string>('6 months');
  const [visible, setVisible] = useState<boolean>(false);
  const [trend, setTrend] = useState<any>([]);
 

  const timeOptions = [{name: t("Analytics.timeoptions.3months"), value: '3 months'}, {name: t("Analytics.timeoptions.6months"), value: '6 months'}, {name: t("Analytics.timeoptions.1year"), value: '1 year'}];

  useEffect(() => {
    const getFilteredData = async () => {
      try {
        
        const data = await ChartDataViaRange(db, selectedRange);
        console.log('DATA: ', data)
        
        if (data && data.length > 0) {
          setTrend(data);
        } else {
          // Fallback data when no data is available
          setTrend([
            { 'No Data': 0 }
          ]);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);

      } 
    };

    getFilteredData();
  }, [selectedRange, db]);

  const getChartData = () => {
    if (trend.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: trend.map((obj: DataPoint, index: number) => {
        const key = Object.keys(obj)[0];
        const formattedKey = key === 'undefine' ? 'N/A' : key;
        
        // For longer time periods, show fewer labels to prevent overcrowding
        if (trend.length > 6) {
          // Only show every other label for better readability
          return index % 2 === 0 ? formattedKey : '';
        }
        
        return formattedKey;
      }),
      datasets: [{ 
        data: trend.map((obj: DataPoint) => {
          const value = Object.values(obj)[0];
          return typeof value === 'number' ? value : 0;
        }) 
      }],
    };
  };

  const chartWidth = Math.max(width - 52, 250); // Ensure minimum width



  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={[styles.title, { color: theme.primaryText }]}>
          {t("analytics.monthlyspending")}
        </Text>
        <MinimalDropdown 
          list={timeOptions} 
          theme={theme} 
          label={t('analytics.timerange')}
          selected={t(`Analytics.timeoptions.${selectedRange}`)} 
          setSelected={setSelectedRange} 
          setVisible={setVisible} 
          visible={visible}
        />
      </View>

     
        <LineChart
          data={getChartData()}
          width={chartWidth}
          height={250}
          yAxisLabel={symbol || ''} 
          chartConfig={{
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
            labelColor: () => '#555',
            propsForLabels: {
              fontSize: Math.min(Math.max(chartWidth / (trend.length * 4), 8), 12), // Better responsive sizing
            },
            style: { borderRadius: 8 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#4285f4',
            },
            paddingRight: 10, // Reduce right padding for balance
          }}
          style={styles.chart}
          bezier
          withShadow={false}
          withDots={true}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
        />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 8,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
})

export default Chart;