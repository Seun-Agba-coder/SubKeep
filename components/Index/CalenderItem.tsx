import { View, Text, Image, StyleSheet, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import dayjs from 'dayjs';

function formatDate(date: Date) {
  return dayjs(date).format('YYYY-MM-DD'); // returns "YYYY-MM-DD"
}

const CalenderItem = ({ item, theme, billingMarkers }: any) => {
  const { width: screenWidth } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayMarkers, setSelectedDayMarkers] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const dateKey = item ? formatDate(item) : null;
  const markers = dateKey ? billingMarkers[dateKey] || [] : [];

  const handleOpenModal = () => {
    if (markers.length > 1) {
      setSelectedDayMarkers(markers);
      setSelectedDate(dateKey!);
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={markers.length > 1 ? 0.7 : 1}
        onPress={handleOpenModal}
        style={[
          {
            width: screenWidth / 8.8,
            backgroundColor: item && theme.secondaryColor,
            justifyContent: 'center',
            alignItems: 'center'
          },
          styles.dayCell
        ]}
      >
        {item ? (
          <View style={{ backgroundColor: theme.secondaryColor, alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
              {markers.length > 0 && (
                <View style={styles.imageContainer}>
                  <View style={{flexDirection: 'row', padding: 0}}>

                    <Image
                      source={{ uri: markers[0].iconurl }}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        marginTop: 2,
                        backgroundColor: markers[0].status === 'white' ? 'transparent' : markers[0].status
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: markers[0].status,
                        height: 8,
                        width: 8,
                        borderRadius: 4
                      }}
                    />
                  </View>
                  {markers.length > 1 && (
                    <Text style={{ fontSize: 10, color: theme.primaryText, marginLeft: 4 }}>
                      +{markers.length - 1}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <Text style={[{ color: theme.primaryText, fontSize: 16 }]}>{item.getDate()}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}></View>
        )}
      </TouchableOpacity>

      {/* Modal only for days with 2+ markers */}
      {modalVisible && (
        <Modal transparent visible animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                Subscriptions for {selectedDate}
              </Text>
              <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {selectedDayMarkers.map((marker, index) => (
                  <Image
                    key={`${marker.iconurl}-${index}`}
                    source={{ uri: marker.iconurl }}
                    style={{ width: 40, height: 40, borderRadius: 5 }}
                    resizeMode="contain"
                  />
                ))}
              </ScrollView>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Text style={{ color: '#fff' }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dayCell: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 10,
    borderColor: 'white',
    marginVertical: 4,
    marginHorizontal: '1%',
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: '#333',
    borderRadius: 20, 
    padding: 10,
    alignItems: 'center'
  }
});

export default CalenderItem;
