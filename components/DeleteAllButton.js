import React from "react";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ListItem, List, ButtonGroup, Button, useTheme, Layout } from '@ui-kitten/components';

const confirmDelete = (removeAllCurrentItems) => {
	Alert.alert(
        "Confirm delete all",
        "Are you sure you want to delete all items in your stash?",
        [
          {
            text: "Cancel",
            //onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              removeAllCurrentItems();
            },
          },
        ]
      );
}

export default function DeleteAllButton({ removeAllCurrentItems, buttonType = 'icon' }) {
	const theme = useTheme();

	const promptForDelete = () => confirmDelete(removeAllCurrentItems);
	if (buttonType === 'icon') {
		return (
			<Button
		    	onPress={promptForDelete}
		      	style={{...styles.icon, backgroundColor: theme['color-danger-transparent-200'] }}
		      	status='danger'
		      	size='small'>
		      	<Ionicons name='trash-outline' size={20} color={theme['color-danger-600']} />
		    </Button>
		);	
	} else {
		return (
			<TouchableOpacity onPress={promptForDelete}>
				<View style={styles.button}>
					<Text style={{ color: "white" }}>Delete All</Text>
				</View>
			</TouchableOpacity>
		);
	};
};


const styles = StyleSheet.create({
  icon: {
	padding: 0,
  },
  button: {
    marginTop: "5%",
    width: "80%",
    height: 40,
    backgroundColor: "#FA4A0C",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
});