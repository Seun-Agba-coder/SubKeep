import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import IconButton from './IconButton';
import { useAppTranslation } from '@/hooks/useAppTranslator';

const getLocaleTag = (lang: string) => {
  switch (lang) {
    case 'en':
      return 'en';
    case 'fr':
      return 'fr';
    case 'es':
      return 'es';
    case 'tr':
      return 'tr';
    case 'it':
      return 'it';
    default:
      return lang;
  }
};

export default function DatePickerComponent({
  theme,
  date,
  setDate,
  validDate,
  label,
  dateSelected
}: any) {
  const [show, setShow] = useState(false);
  const { t, i18n } = useAppTranslation();

  const onConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    dateSelected.current = true;
    if (validDate) validDate.current = true;
    setShow(false);
  };

  const onCancel = () => {
    setShow(false);
  };

  const removeDate = () => {
    setDate(dayjs().toDate());
    dateSelected.current = false;
    if (validDate) validDate.current = false;
  };

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        style={[
          styles.dateContainer,
          {
            borderColor: theme.text,
            justifyContent: !dateSelected.current ? 'flex-start' : 'space-between',
            backgroundColor: dateSelected.current ? theme.secondaryColor : undefined
          }
        ]}
      >
        {dateSelected.current ? (
          <Text style={{ fontSize: 16, color: theme.text }}>{dayjs(date).locale(i18n.language).format('MMMM D, YYYY')}</Text>
        ) : (
          <Text style={{ color: 'grey' }}>{label}</Text>
        )}
        {dateSelected.current && (
          <IconButton name="close" size={26} color={theme.text} onPress={removeDate} />
        )}
      </Pressable>

      {/* Using built-in modal */}
      <DatePicker
        modal
        open={show}
      
        date={date}
        mode="date"
        locale={getLocaleTag(i18n.language)}
        onConfirm={onConfirm}
        onCancel={onCancel}
        theme="light"
        title="Select Date"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    borderWidth: 1,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 16
  }
});