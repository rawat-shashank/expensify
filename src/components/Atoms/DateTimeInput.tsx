import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { materialTheme } from "@/constants";
import { TouchableButton } from "./TouchableButtons";
import { Icons } from "./Icons";
import { TextLabel } from "./TextLabel";

interface DateTimeInputProps {
  value: string;
  label?: string;
  onChange: (time: string) => void;
}

const DateTimeInput = ({ value, label, onChange }: DateTimeInputProps) => {
  const [date, setDate] = useState(new Date(value));
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleOnChange = (_: DateTimePickerEvent, date: Date | undefined) => {
    if (!date) return;

    setDate(date);
    setShow(false);
    if (onChange) {
      onChange(date.toISOString());
    }
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View>
      {label && <TextLabel label={label} />}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingHorizontal: 16,
        }}
      >
        <TouchableButton
          style={styles.DateTimeButtons}
          onPress={showDatepicker}
        >
          <Icons name="calendar" />
          <Text style={styles.DateTimeText}>
            {date.toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </Text>
        </TouchableButton>
        <TouchableButton
          style={styles.DateTimeButtons}
          onPress={showTimepicker}
        >
          <Icons name="clock-outline" />
          <Text style={styles.DateTimeText}>
            {date.toLocaleTimeString("en-GB", {
              timeStyle: "short",
            })}
          </Text>
        </TouchableButton>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleOnChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  DateTimeButtons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  DateTimeText: {
    fontSize: 16,
  },
});

export default DateTimeInput;
