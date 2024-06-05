import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { HStack, ScrollView, VStack } from "@gluestack-ui/themed";

const ImageHistory = ({ }) => {
    return (
        <ScrollView w="66%" h="100%">
            <VStack pl="$10" pr="$10" space="md">
                <ImageResponseItem />
                <ImageResponseItem />
            </VStack>
        </ScrollView>

    )
}

export default ImageHistory;

const styles = StyleSheet.create({
    responseHistory: {

    }
})