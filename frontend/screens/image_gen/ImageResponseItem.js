import {
    Box, Button, ButtonIcon, ButtonText, Card, Center, CheckCircleIcon, CloseCircleIcon, CloseIcon, DownloadIcon,
    HStack, Heading, Icon, Image, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack
} from "@gluestack-ui/themed"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { EXTRA_COLOR } from "../../ColorConst";
import { useRef, useState } from "react";

// source={{uri:`data:image/webp;base64,${image}`}}
const ImageResponseItem = ({ generationDate, promt, imageUrl }) => {
    const [showModal, setShowModal] = useState(false)
    const ref = useRef(null)
    const handlePressEvent = (event) => {
        console.log(event)
    }
    return (
        <View>
            <HStack>
                <Box w="30%"></Box>
                <Card
                    //style={styles.generatedItem}
                    w="70%"
                    P="$5"
                    variant="elevated"
                >
                    <VStack space="lg">
                        <Center>
                            <TouchableOpacity onPress={() => {
                                setShowModal(true)
                            }}>
                                <Image
                                    style={styles.generatedImage}
                                    backgroundColor={EXTRA_COLOR}
                                    source={"https://www.iephb.ru/wp-content/uploads/2021/01/img-placeholder.png"}
                                />
                            </TouchableOpacity>
                        </Center>
                        <Heading>%Канал% %Высота%X%Ширина% </Heading>
                        <Text>Тестовый промт skdfm;askdf;aklsdf;laksdf,asd;l,as;l,dvas;l,dc;asld,c;sl,dcal;,sdclsa,d,l sdkfmlksdmfvkmsdfvlkmsdfvlkmsdfklvmdsfklvmsdklfmvsdlkmfvls</Text>
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
            </HStack>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                finalFocusRef={ref}
                size="full"
                p="$20"
            >
                <ModalBackdrop />
                <ModalContent m="$20">
                    <ModalHeader>
                        <VStack>
                            <Heading size="lg">Изображение</Heading>
                            <Text>Тестовый промт</Text>
                        </VStack>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Center w="100%" h="100%">
                            <TouchableOpacity onPress={(event) => handlePressEvent(event)}>
                            <Image
                                style={styles.imagePreview}
                                resizeMode="contain"
                                backgroundColor={"#F00000"}
                                source={"https://www.iephb.ru/wp-content/uploads/2021/01/img-placeholder.png"}
                            />
                            </TouchableOpacity>
                        </Center>
                    </ModalBody>
                    {/* <ModalFooter></ModalFooter> */}
                </ModalContent>
            </Modal>
        </View>
    )
}

export default ImageResponseItem;

const styles = StyleSheet.create({
    generatedImage: {
        minHeight: "30em",
        minWidth: "30em",
        maxWidth: "35em",
        maxHeight: "35em",
    },
    imagePreview: {
        height: "80vh",
        width: "80vh",
        left: 0,
        right: 0
    },
    generatedItem: {
        height: "40em",
        width: "40em",
    }
})

