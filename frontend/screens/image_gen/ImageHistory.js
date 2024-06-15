import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { ButtonText, HStack, ScrollView, VStack } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { historyRequest } from "../../api/history";
import { Button } from "react-native-web";

const ImageHistory = ({ imageHistory }) => {
    const renderHistoryItems = () => {
        return imageHistory.map((historyItem) => {
            return (
                <ImageResponseItem
                    key={historyItem.id}
                    status={historyItem.status}
                    imageId={historyItem.id}
                    productType={"ПК"}
                    originalPromt={"Test promt"}
                    imageName={"7df411e3-f108-4cfd-b0de-151ccb0812ec.png"}
                    imageWidth={512}
                    imageHeight={512}
                    onRefresh={refreshHistory}
                />
            )
        })
    }
    return (
        <VStack>
            <ScrollView w="100%" h="100%">
                <VStack p="$10" space="md">
                    {renderHistoryItems()}
                    {/* <ImageResponseItem
                    imageId={1}
                    //bannerType={"NBO"}
                    productType={"ПК"}
                    originalPromt={"Test promt"}
                    imageUrl={"https://res.cloudinary.com/practicaldev/image/fetch/s--kdh2Ubyl--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gy0yiniansla31xttij5.png"}
                    imageHeight={900}
                    imageWidth={1600}
                //onAddToBannerClick={()=> {}}
                /> */}
                </VStack>
            </ScrollView>
        </VStack>
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