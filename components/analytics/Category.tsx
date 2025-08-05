import React from 'react';
import { Text, useWindowDimensions, View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAppTranslation } from '@/hooks/useAppTranslator';

interface Data {
  data: any;
  theme: any
}

const Category = ({ data, theme }: Data) => {
  const { width } = useWindowDimensions();
  const { t} = useAppTranslation()
  console.log("Category component received data:", JSON.stringify(data));

  return (
    <View style={{
      width: '100%',
      padding: 16,
    }}>

      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: theme.primaryText,
      }}>{t("category.title")}</Text>

    {data.length > 0 ? (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
     
      }}>
        <View style={{marginLeft: "-3%"}}> {/* Reduced from -12% to -3% */}

          <PieChart
            data={data}
            width={width -200}
            height={100}
            chartConfig={{
              color: () => `${theme.primaryText}`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            hasLegend={false} // hide default legend
            center={[-4, 0]} 
            absolute
          />
        </View>

        {/* Manual legend beside pie chart */}
        <View style={{ marginLeft: '-25%' }}> {/* Added negative margin to pull legend closer */}
          {data.map((item: any, index: number) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: 6,
                  marginRight: 8,
                }}
              ></View>
            

              <Text style={{ color: theme.primaryText, fontSize: 10 }}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ) : (
      <Text style={{color: theme.primaryText}}>{t("analytics.category.emptyText")}</Text>
    
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,

    textAlign: 'center',
    marginBottom: 20,
  },
})

export default Category;