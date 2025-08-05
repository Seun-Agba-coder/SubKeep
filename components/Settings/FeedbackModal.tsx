import React, { useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import FeedbackDropdown from './FeedbackDropdown';
import {submitFeedbackToFirestore} from '@/Firebase/FirebaseBackend';
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; 



const FeedbackModal = ({ isVisible, onClose, theme, setSnackVisible, setSnackMessage }: { isVisible: boolean; onClose: () => void, theme: any, setSnackVisible: (visible: boolean) => void, setSnackMessage: (message: {message: string, color: string}) => void }) => {
  // State for form fields
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'General Feedback', value: 'general' },
    { label: 'Bug Report', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
  ]);
  
    const [userinfo, setUser] = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
   
  
     useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
  
              setIsAuthenticated(true)
              setUser(user)
          } else {
           
              setIsAuthenticated(false)
          }
          });
  
     } ,[])

  // Dummy function for submitting feedback
  const handleSubmit = async () => {
    // Check if essential fields are filled
    if (!userinfo) {
      Alert.alert("Please sign in to submit feedback");
      return;
    }
    if (!subject || !message) {
      Alert.alert("Please fill in the subject and message before submitting.");
      return;
    }
    
    try {
      await submitFeedbackToFirestore(feedbackType, subject, message)
          // In a real app, you would send this data to your backend
        console.log('Feedback Submitted:', { feedbackType, subject, message });

        // Close the modal and reset the form
        onClose();
        setFeedbackType('General Feedback');
        setSubject('');
        setMessage('');
        setSnackVisible(true)
        setSnackMessage({message: "Successfully submitted feedback", color: "#16A34A"})
    } catch (error) {
      console.log("Error submitting feedback:", error)
      setSnackVisible(true)
      setSnackMessage({message: "Something went wrong, try again later, check connection", color: "#DC2626"})
    }

    
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handles the back button on Android
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text} ]}>Give us your feedback</Text>
            <TouchableOpacity onPress={onClose}>
              <View style={styles.closeButton}>
                {/* Close Icon (X) using a simple Text component */}
                <Text style={[styles.closeButtonText, { color: theme.text} ]}>✕</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Feedback Form */}
          <View>
            {/* Feedback Type Selector (Dropdown simulation) */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text, marginBottom: -9, } ]}>Feedback Type</Text>
            <FeedbackDropdown open={open} setOpen={setOpen} value={value} setValue={setValue} items={items} setItems={setItems}/>
            </View>

            {/* Subject Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text} ]}>Subject</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={setSubject}
                value={subject}
                placeholder="e.g., App crashes when I..."
                placeholderTextColor="#A0A0A0"
              />
            </View>

            {/* Message Textarea */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text} ]}>Your Message</Text>
              <TextInput
                style={[styles.textInput, styles.textarea]}
                onChangeText={setMessage}
                value={message}
                placeholder="Tell us what you think..."
                placeholderTextColor="#A0A0A0"
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.background} ]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.submitButton, { backgroundColor: theme.primaryText} ]}
                onPress={handleSubmit}
              >
                <Text style={[styles.buttonText, styles.submitButtonText, { color: theme.background} ]}>Send Feedback</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalView: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a0a0a0',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 1,
    textAlign: 'left',
    
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  geminiButtonText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
  },
  selectInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
  },
  textarea: {
    height: 60,
    textAlignVertical: 'top', // Aligns text to the top for Android
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 2,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#2563eb', // A shade of blue similar to Tailwind
  },
  submitButtonText: {
    color: 'white',
  },
});


export default FeedbackModal