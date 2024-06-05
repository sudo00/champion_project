import { Button, ButtonIcon, ButtonText, Card, CheckCircleIcon, CloseCircleIcon, DownloadIcon, HStack, Heading, Image, Text, VStack } from "@gluestack-ui/themed"
import { StyleSheet, View } from "react-native"

// source={{uri:`data:image/webp;base64,${image}`}}
const ImageResponseItem = ({ generationDate, promt, imageUrl }) => {
    return (
        <View>
            <Card
                P="$5"
                variant="elevated"
            >
                <VStack space="lg">
                    <Image style={styles.generatedImage} source={require("../../assets/splash.png")} />
                    <Heading>%Канал% %Высота%X%Ширина% </Heading>
                    <Text>Тестовый промт</Text>
                    <HStack space="md">
                        <Button variant="outline">
                            <ButtonIcon as={CheckCircleIcon} />
                        </Button>
                        <Button variant="outline">
                            <ButtonIcon as={CloseCircleIcon} />
                        </Button>
                        <Button>
                            <ButtonIcon as={DownloadIcon} />
                        </Button>
                    </HStack>
                </VStack>
            </Card>
        </View>
    )
}

export default ImageResponseItem;

const styles = StyleSheet.create({
    generatedImage: {
        width: 500,
        height: 500,
    },
    generatedItem: {
        height: 200,
        width: 140,
    }
})

