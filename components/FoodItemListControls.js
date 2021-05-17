import React from "react";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";

import FoodItem from "../models/FoodItem";
import EditFoodItem from "./EditFoodItem";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Button,
  Text,
  useTheme,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";

const Header = ({ ...props }) => (
  <View {...props} style={[props.style, styles.cardHeader]}>
    <Text category="s1">Sort/Filter List</Text>
  </View>
);

const Footer = ({ onAccept, isValid, ...props }) => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button
      onPress={onAccept}
      style={styles.footerControl}
      size="small"
      disabled={!isValid}
    >
      OK
    </Button>
  </View>
);

export default function FoodItemListControls({
  onSortSelectChange,
  onAccept,
  selectValues,
  initialSortSelection,
  removeAllCurrentItems,
  // locations,
}) {
  const theme = useTheme();

  // const selectValues = ['Date Added', 'Expiration Date'];
  const [selectedIndex, setSelectedIndex] = React.useState(
    new IndexPath(selectValues.indexOf(initialSortSelection))
  );
  // const [locationSet, setLocationSet] = React.useState(new Set('all'));

  const selectItems = selectValues.map((item) => (
    <SelectItem title={item} key={item} />
  ));

  return (
    <Card
      style={styles.wrapper}
      disabled={true}
      header={() => <Header />}
      footer={() => <Footer onAccept={onAccept} isValid={true} />}
    >
      <Select
        selectedIndex={selectedIndex}
        onSelect={(indexPath) => {
          setSelectedIndex(indexPath);
          onSortSelectChange(selectValues[indexPath.row]);
        }}
        value={selectValues[selectedIndex.row]}
        style={styles.unitSelect}
      >
        {selectItems}
      </Select>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    padding: 10,
  },
  unitSelect: {
    width: "80%",
  },
  cardHeader: {
    padding: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
    minHeight: 50,
  },
  footerControl: {
    width: "100%",
  },
});
