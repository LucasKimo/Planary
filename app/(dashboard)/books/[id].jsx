import { StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

// themed components
import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'

const BookDetails = () => {
  const { id } = useLocalSearchParams()

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedText>Book Details - {id}</ThemedText>
    </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  }
})