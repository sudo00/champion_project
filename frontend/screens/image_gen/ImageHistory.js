import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"
import ImageResponseItem from "./ImageResponseItem";
import { HStack, ScrollView, VStack } from "@gluestack-ui/themed";

const ImageHistory = ({ }) => {
    return (
        <ScrollView w="100%" h="100%">
            <VStack p="$10" space="md">
                <ImageResponseItem
                    bannerType={"NBO"}
                    productType={"ПК"}
                    promt = {"Test promt"}
                    imageUrl={"https://raw.githubusercontent.com/sudo00/champion_project/main/backend/banner_plus_inpaint/photo_2024-06-11_12-07-02.jpg?token=GHSAT0AAAAAACSAMIPBHQASWX6JKEUJWJQAZTL72BA"}
                    imageHeight={512}
                    imageWidth={512}
                />
                <ImageResponseItem
                    bannerType={"NBO"}
                    productType={"ПК"}
                    promt = {"Test promt"}
                    imageUrl={"https://res.cloudinary.com/practicaldev/image/fetch/s--kdh2Ubyl--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gy0yiniansla31xttij5.png"}
                    imageHeight={900}
                    imageWidth={1600}
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