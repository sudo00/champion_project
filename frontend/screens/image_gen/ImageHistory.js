import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { HStack, ScrollView, VStack } from "@gluestack-ui/themed";
import { useEffect } from "react";
import { historyRequest } from "../../api/history";

const ImageHistory = ({ }) => {
    useEffect(() => {
        historyRequest().then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    return (
        <ScrollView w="100%" h="100%">
            <VStack p="$10" space="md">
                <ImageResponseItem
                    imageId={1}
                    //bannerType={"NBO"}
                    productType={"ПК"}
                    originalPromt={"Test promt"}
                    imageUrl={"https://res.cloudinary.com/practicaldev/image/fetch/s--kdh2Ubyl--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gy0yiniansla31xttij5.png"}
                    imageHeight={900}
                    imageWidth={1600}
                    //onAddToBannerClick={()=> {}}
                />
            </VStack>
        </ScrollView>
    )
}

export default ImageHistory;

const styles = StyleSheet.create({
    responseHistory: {

    }
})