import React, { useEffect } from "react";
import {
    Box, Button, ButtonIcon, ButtonText, Card, Center, CheckCircleIcon, CloseCircleIcon, CloseIcon, DownloadIcon,
    HStack, Heading, Icon, Image, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Text, TrashIcon, VStack
} from "@gluestack-ui/themed"
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import { EXTRA_COLOR } from "../../ColorConst";
import { useRef, useState } from "react";
import FullWidthImage from "react-native-fullwidth-image";
import { Polyline, Svg } from "react-native-svg";

// source={{uri:`data:image/webp;base64,${image}`}}
const ImageResponseItem = ({ 
    generationDate, 
    bannerType, 
    productType, 
    promt, 
    imageUrl, imageWidth, imageHeight,
    onAddToBannerClick,
}) => {
    const [showModal, setShowModal] = useState(false)
    const ref = useRef(null)
    const [points, setPoints] = useState([])
    const [path, setPath] = useState("");
    useEffect(() => {
        setPath(points.map(p => `${p.x},${p.y}`).join(' '))
    }, [points])

    const handlePressEvent = (event) => {
        console.log(event)
        setPoints([
            ...points, { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
        ])
        console.log(points)
    }
    const clearPoints = () => {
        setPoints([])
    }
    const closeModal = () => { setShowModal(false) }

    const onDeleteItemClick = () => {

    }

    const onLoadImageClick = () => {

    }


    const drawPoints = (pointsArg) => {
        console.log("test")
        return pointsArg.map(point => {
            return (
                <TouchableOpacity key={point.x + point.y} style={{
                    padding: 10,
                    top: point.y - 15,
                    left: point.x - 15,
                    position: "absolute",
                    elevation: 10,
                    width: 30,
                    height: 30
                }}>
                    <View
                        style={{
                            borderWidth: 5,
                            borderColor: "red",
                            width: 10,//Math.abs(boxSize.width),
                            height: 10,//Math.abs(boxSize.height),
                        }}
                    ></View>
                </TouchableOpacity>

            );
        })
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
                                    source={imageUrl}
                                />
                            </TouchableOpacity>
                        </Center>
                        <Heading>{`${bannerType}_${productType}_${imageWidth}x${imageHeight}`} </Heading>
                        <Text>{promt}</Text>
                        <HStack space="md">
                            <Button onPress={onLoadImageClick}>
                                <ButtonIcon as={DownloadIcon} />
                            </Button>
                            <Button onPress={onDeleteItemClick} variant="outline">
                                <ButtonIcon as={TrashIcon} />
                            </Button>
                            {/* <Button variant="outline">
                                <ButtonIcon as={CheckCircleIcon} />
                            </Button> */}
                        </HStack>
                    </VStack>
                </Card>
            </HStack>



            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false) }}
                finalFocusRef={ref}
                size="full"
                p="$20"
            >
                <ModalBackdrop />
                <ModalContent m="$20">
                    <ModalHeader>
                        <VStack>
                            <Heading size="lg">Изображение</Heading>
                            <Text>{promt}</Text>
                            <Text>{`Выбрано точек: ${points.length}`}</Text>
                        </VStack>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Center w="100%" h="100%">
                            <ScrollView>
                                <Box>
                                    <Pressable onPress={(event) => handlePressEvent(event)}>
                                        <FullWidthImage
                                            width={imageWidth}
                                            height={imageHeight}
                                            source={{ uri: imageUrl }}
                                        />
                                        <Svg style={{
                                            elevation: 10,
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            height: imageHeight,
                                            width: imageWidth,
                                            //backgroundColor: "red"
                                        }} viewBox={`0 0 ${imageWidth} ${imageHeight}`}>
                                            <Polyline
                                                points={path}
                                                fill="#ff23234f"
                                                stroke={"red"}
                                                strokeWidth="5"
                                            />
                                        </Svg>
                                        {drawPoints(points)}
                                    </Pressable>
                                </Box>
                            </ScrollView>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <HStack space="md">
                            <Button isDisabled={!(points.length > 2)}>
                                <ButtonText>Изменить выделенную область</ButtonText>
                            </Button>
                            <Button action="negative" isDisabled={!(points.length > 0)}>
                                <ButtonText onPress={clearPoints}>Убрать выделение</ButtonText>
                            </Button>
                            <Button onPress={onAddToBannerClick}>
                                <ButtonText>Добавить на баннер</ButtonText>
                            </Button>
                            <Button variant="outline" onPress={setShowModal.bind(null, false)}>
                                <ButtonText>Закрыть</ButtonText>
                            </Button>
                        </HStack>
                    </ModalFooter>
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

