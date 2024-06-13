import React, { useEffect } from "react";
import {
    Box, Button, ButtonIcon, ButtonText, Card, Center, CheckCircleIcon, CloseCircleIcon, CloseIcon, DownloadIcon,
    HStack, Heading, Icon, Image, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack
} from "@gluestack-ui/themed"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { EXTRA_COLOR } from "../../ColorConst";
import { useRef, useState } from "react";
import FullWidthImage from "react-native-fullwidth-image";
import { Polyline, Svg } from "react-native-svg";

// source={{uri:`data:image/webp;base64,${image}`}}
const ImageResponseItem = ({ generationDate, promt, imageUrl }) => {
    const [showModal, setShowModal] = useState(false)
    const ref = useRef(null)
    // const [point1, setPoint1] = useState({ x: 0, y: 0 })
    // const [point2, setPoint2] = useState({ x: 0, y: 0 })
    // const [isSelectFirst, setIsSeletFirst] = useState(true)

    // const [boxTopLeftPoint, setBoxTopLeftPoint] = useState({ x: 0, y: 0 })
    // const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })
    // useEffect(() => {
    //     if (point1.x < point2.x && point1.y < point2.y) {
    //         setBoxTopLeftPoint({ x: point1.x, y: point1.y })
    //         setBoxSize({ width: point2.x - point1.x, height: point2.y - point1.y })
    //     } else if (point1.x < point2.x || point1.y < point2.y) {

    //     } else {
    //         setBoxTopLeftPoint({ x: point2.x, y: point2.y })
    //         setBoxSize({ width: point1.x - point2.x, height: point1.y - point2.y })
    //     }
    //     console.log(point1.x + ":" + point1.y)
    //     console.log(point2.x + ":" + point2.y)
    //     console.log("Box:" + boxTopLeftPoint.x + ":" + boxTopLeftPoint.y)
    //     console.log("Box size - " + boxSize.width + ":" + boxSize.height)
    //     console.log("IS select first - " + isSelectFirst)
    // }, [point1, point2])
    const [points, setPoints] = useState([{ x: 100, y: 100 }, { x: 150, y: 150 }])
    const handlePressEvent = (event) => {
        console.log(event)
        setPoints([
            ...points, { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
        ])
        //if (isSelectFirst) {
        //setPoint1({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })
        //setIsSeletFirst(false)
        //} else {
        //setPoint2({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })
        //setIsSeletFirst(true)
        //}
        console.log(points)
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

    const drawLines = (pointsArg) => {
        var lines = [{ topLeftX: 0, topLeftY: 0, angle: 0 }]
        var length = arr.length,
            element = null;
        for (var i = 0; i < length - 1; i++) {
            element = pointsArg[i];
            nextElement = pointsArg[i + 1]

        }
    }
    const clearPoints = () => {
        setPoints([])
    }
    const closeModal = () => { setShowModal(false) }
    const imgWidth = 1016
    const imgHeight = 678
    const [path, setPath] = useState("");
    useEffect(() => {
        setPath(points.map(p => `${p.x},${p.y}`).join(' '))
    }, [points])
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
                        <Heading>{`%Канал% ${imgWidth}x${imgHeight}`} </Heading>
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
                onClose={() => {setShowModal(false)}}
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
                            <Text>{`Выбрано точек: ${points.length}`}</Text>
                        </VStack>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Center w="100%" h="100%">
                            <Box>
                                <TouchableOpacity onPress={(event) => handlePressEvent(event)}>
                                    <FullWidthImage
                                        // style={styles.imagePreview}
                                        // resizeMode="contain"
                                        // backgroundColor={"#F00000"}
                                        width={imgWidth}
                                        height={imgHeight}
                                        source={{ uri: "https://www.iephb.ru/wp-content/uploads/2021/01/img-placeholder.png" }}
                                    />
                                    <Svg style={{
                                        elevation: 10,
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        height: imgHeight,
                                        width: imgWidth,
                                        //backgroundColor: "red"
                                    }} viewBox={`0 0 ${imgWidth} ${imgHeight}`}>
                                        <Polyline
                                            points={path}
                                            fill="#ff23234f"
                                            stroke={"red"}
                                            strokeWidth="5"
                                        />
                                    </Svg>
                                    {drawPoints(points)}
                                </TouchableOpacity>
                            </Box>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <HStack space="md">
                            <Button>
                                <ButtonText>Отправить</ButtonText>
                            </Button>
                            <Button action="negative">
                                <ButtonText onPress={clearPoints}>Очистить</ButtonText>
                            </Button>
                            <Button variant="outline" onPress={() => {setShowModal(false)}}>
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

