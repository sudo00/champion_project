import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { HStack, ScrollView, VStack } from "@gluestack-ui/themed";

const ImageHistory = ({ }) => {
    return (
        <ScrollView w="100%" h="100%">
            <VStack p="$10" space="md">
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