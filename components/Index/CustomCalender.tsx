import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import CalenderItem from './CalenderItem';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import { useAppTranslation } from '@/hooks/useAppTranslator';



const CustomCalender = ({ theme, changeMonth, savedSubscription, billingMarkers }: any) => {
  const {t } = useAppTranslation()

  const weekdays = [t("index.weekdays.mon"), t("index.weekdays.tue"), t("index.weekdays.wed"), t("index.weekdays.thu"), t("index.weekdays.fri"), t("index.weekdays.sat"), t("index.weekdays.sun")];


  const { width: screenWidth } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [days, setDays] = useState<any>([]);

  const translateX = useSharedValue(0);

  useEffect(() => {
    generateDays(currentDate);
  }, [currentDate]);

  const generateDays = (date: dayjs.Dayjs) => {
    const year = date.year();
    const month = date.month();
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = dayjs(new Date(year, month + 1, 0));

    const daysInMonth: any = [];

    let offset = (firstDay.day() + 6) % 7;

    for (let i = 0; i < offset; i++) {
      daysInMonth.push(null);
    }

    for (let i = 1; i <= lastDay.date(); i++) {
      daysInMonth.push(dayjs(new Date(year, month, i)).toDate());
    }

    setDays(daysInMonth);
  };

  const handlePrevMonth = () => {
    const prev = currentDate.subtract(1, 'month');
    setCurrentDate(prev);
    changeMonth([{ year: prev.year(), month: prev.month() + 1 }]);
    translateX.value = 0;
  };

  const handleNextMonth = () => {
    const next = currentDate.add(1, 'month');
    setCurrentDate(next);
    changeMonth([{ year: next.year(), month: next.month() + 1 }]);
    translateX.value = 0;
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const threshold = 80;
      if (e.translationX < -threshold) {
        translateX.value = withTiming(-screenWidth, { duration: 200 }, () => {
          runOnJS(handleNextMonth)();
        });
      } else if (e.translationX > threshold) {
        translateX.value = withTiming(screenWidth, { duration: 200 }, () => {
          runOnJS(handlePrevMonth)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={{ paddingHorizontal: '4%' }}>
        <View style={styles.weekdayContainer}>
          {weekdays.map((day) => (
            <View
              key={day}
              style={[
                {
                  justifyContent: 'center',
                  backgroundColor: theme.secondaryColor,
                  alignItems: 'center',
                  flex: 1,
                },
                styles.weekday,
              ]}
            >
              <Text style={{ color: theme.primaryText }}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Animated calendar grid */}
        <Animated.View style={[animatedStyle, { height: 300 }]}>
          <FlatList
            data={days}
            keyExtractor={(item, index) => item?.toString() ?? `empty-${index}`}
            numColumns={7}
            scrollEnabled={false}
            style={{ height: '100%' }}
            renderItem={({ item }) => (
              <CalenderItem
                item={item}
                theme={theme}
                savedSubscription={savedSubscription}
                billingMarkers={billingMarkers}
              />
            )}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  weekday: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginHorizontal: 2,
    borderRadius: 16,
  },
  weekdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CustomCalender;
