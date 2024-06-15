import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { ButtonText, HStack, ScrollView, VStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { historyRequest } from "../../api/history";
import { Button } from "react-native-web";

const ImageHistory = ({ imageHistory, refreshHistory}) => {
    const renderHistoryItems = () => {
        return imageHistory.map((historyItem) => {
            return (
                <ImageResponseItem
                    key={historyItem.id}
                    status={historyItem.status}
                    imageId={historyItem.id}
                    productType={historyItem.options.negative_prompt}
                    originalPromt={historyItem.options.positive_prompt}
                    imageName={historyItem.object_name}
                    imageWidth={historyItem.options.width}
                    imageHeight={historyItem.options.height}
                    onRefresh={refreshHistory}
                />
            )
        })
    }
    return (
            <ScrollView w="100%" h="100%">
                <VStack p="$10" space="md">
                    {renderHistoryItems()}
                </VStack>
            </ScrollView>
    )
}

export default ImageHistory;

const styles = StyleSheet.create({
    responseHistory: {

    },
    clearHistoryButton: {
        position: "absolute",
        left: 0,
        top: 0,
        elevation: 10,
        width:100,
        height: 64,
    },
    refreshButton: {
        position: "absolute",
        left: 0,
        top: 50,
        elevation: 10,
        width:100,
        height: 64,
    }
})