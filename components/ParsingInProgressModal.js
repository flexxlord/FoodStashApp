import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { Modal, Text, Spinner, Card, useTheme, Button } from "@ui-kitten/components";

const styles = StyleSheet.create({
	modalViewWrapper: {
	  flex: 1,
	  flexDirection: "row",
	  justifyContent: "center",
	  marginTop: 10,
	},
	modalHeaderText: {
		fontFamily: "Poppins_600SemiBold",
		marginBottom: 10,
		marginTop: 5
	},
	modalBackdropStyle: {
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	}
});

export default function ParsingInProgressModal({
	visible,
	parsingState,
	numItems,
	onClosePress
}) {
	const theme = useTheme();

	const ModalContent = () => {
		switch (parsingState) {
			case 'error':
				return (
					<Card disabled={true}>
		      			<Text style={{...styles.modalHeaderText, color: theme['color-danger-700']}}>
		        			Something went wrong while parsing :( Make sure your grocery receipt is on a flat surface and takes up as much of the camera screen as possible.
		      			</Text>
						<View style={styles.modalViewWrapper}>
				        	<Button
						    	onPress={onClosePress}
						      	// style={styles.footerControl}
						      	size='medium'
						      	// disabled={!isValid}
						    >
						      	OK
						    </Button>
				        </View>
				    </Card>
				);
		    case 'empty':
				return (
					<Card disabled={true}>
		      			<Text style={{...styles.modalHeaderText, color: theme['color-danger-700']}}>
		        			We weren't able to scan any foods from the image you provided.
		      			</Text>
						<View style={styles.modalViewWrapper}>
				        	<Button
						    	onPress={onClosePress}
						      	// style={styles.footerControl}
						      	size='medium'
						      	// disabled={!isValid}
						    >
						      	OK
						    </Button>
				        </View>
				    </Card>
				);
		    case 'progress':
				return (
					<Card disabled={true}>
		      			<Text style={{...styles.modalHeaderText, color: theme['color-info-700']}}>
		        			Parsing image...
		      			</Text>
						<View style={styles.modalViewWrapper}>
				        	<Spinner />
				        </View>
				    </Card>
				);
			case 'success':
				return (
					<Card disabled={true}>
		      			<Text style={{...styles.modalHeaderText, color: theme['color-success-700']}}>
		        			Receipt scanned successfully! {numItems} foods added to your pantry.
		      			</Text>
						<View style={styles.modalViewWrapper}>
				        	<Button
						    	onPress={onClosePress}
						      	// style={styles.footerControl}
						      	size='medium'
						      	// disabled={!isValid}
						    >
						      	GO TO PANTRY
						    </Button>
				        </View>
				    </Card>
				);
		}		
	};
	    
    return (
	    <Modal visible={visible} backdropStyle={styles.modalBackdropStyle}>
            {ModalContent()}
        </Modal>
    );
}