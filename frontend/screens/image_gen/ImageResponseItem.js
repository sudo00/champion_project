import React, { useEffect } from "react";
import {
    Box, Button, ButtonIcon, ButtonText, Card, Center, CheckCircleIcon, ChevronDownIcon, CloseCircleIcon, CloseIcon, DownloadIcon,
    HStack, Heading, Icon, Image, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Text, Textarea, TextareaInput, TrashIcon, VStack
} from "@gluestack-ui/themed"
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import { EXTRA_COLOR } from "../../ColorConst";
import { useRef, useState } from "react";
import FullWidthImage from "react-native-fullwidth-image";
import { Polyline, Svg } from "react-native-svg";
import { bannerTypes } from "../../model/banner/BannerType";
import { bannerColors } from "../../model/banner/BannerColors";
import ColorSquare from "../../components/ColorSquare";
import ColorBox from "../../components/ColorBox";
import { TASK_TYPE_BANNER, TASK_TYPE_INPAINT, generateRequest } from "../../api/generate";

// source={{uri:`data:image/webp;base64,${image}`}}
const ImageResponseItem = ({
    imageId,
    //generationDate, 
    //bannerType, 
    productType,
    originalPromt,
    imageUrl,
    imageWidth, imageHeight,
    //onAddToBannerClick,
}) => {
    const [showInpaintModal, setShowInpaintModal] = useState(false)
    const [showInpaintPromtModal, setShowInpaintPromtModal] = useState(false)
    const [inpaintPositivePromt, setInpaintPositivePromt] = useState("")
    const [inpaintNegativePromt, setInpaintNegativePromt] = useState("")

    const [showBannerModal, setShowBannerModal] = useState(false)

    const closeInpaintModal = () => { setShowInpaintModal(false) }
    const closeInpaintPromptModal = () => { setShowInpaintPromtModal(false) }
    const closeBannerModal = () => { setShowBannerModal(false) }

    const imageName = `${imageId}_${productType}_${imageWidth}x${imageHeight}`

    const [inpaintPath, setInpaintPath] = useState("")

    const onAddToBannerClick = ({
        bannerType, contentPosition, bannerColor,
    }) => {
        generateRequest(
            {
                taskType: TASK_TYPE_BANNER,
                taskData: {
                    image_id: imageId,
                    type: bannerType,
                    position: contentPosition,
                    color: bannerColor,
                }
            }
        ).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })

        setShowBannerModal(false)
        setShowInpaintModal(false)
        setShowInpaintPromtModal(false)


    }

    const onGenerateInapintClick = ({
        positivePromt, negativePromt,
    }) => {
        generateRequest(
            {
                taskType: TASK_TYPE_INPAINT,
                taskData: {
                    image_id: imageId,
                    mask: inpaintPath,
                    positive_prompt: positivePromt,
                    negative_prompt: negativePromt,
                }
            }
        ).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })

        setShowBannerModal(false)
        setShowInpaintModal(false)
        setShowInpaintPromtModal(false)
    }

    const onDeleteItemClick = () => {

    }

    const onLoadImageClick = () => {

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
                            <TouchableOpacity onPress={setShowInpaintModal.bind(null, true)}>
                                <Image
                                    style={styles.generatedImage}
                                    backgroundColor={EXTRA_COLOR}
                                    source={imageUrl}
                                />
                            </TouchableOpacity>
                        </Center>
                        <Heading>{ } </Heading>
                        <Text>{originalPromt}</Text>
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
            <InpaintModal
                isOpen={showInpaintModal}
                imageUrl={imageUrl}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                onClose={closeInpaintModal}
                imageName={imageName}
                originalPromt={originalPromt}
                onAddToBannerClick={setShowBannerModal.bind(null, true)}
                onEditAreaClcik={setShowInpaintPromtModal.bind(null, true)}
                onPathChanged={(path) => { setInpaintPath(path) }}
            />
            <InpaintPromtModal
                isOpen={showInpaintPromtModal}
                onClose={closeInpaintPromptModal}
                onGenerateInpaintClick={onGenerateInapintClick}
            />
            <BannerModal
                isOpen={showBannerModal}
                onClose={closeBannerModal}
                onAddToBannerClick={onAddToBannerClick}
            />
        </View>
    )
}

const InpaintModal = ({
    isOpen,
    imageUrl,
    imageWidth,
    imageHeight,
    onClose,
    imageName,
    originalPromt,
    onAddToBannerClick,
    onEditAreaClcik,
    onPathChanged,
}) => {
    const ref = useRef(null)

    const [points, setPoints] = useState([])
    const [path, setPath] = useState("");
    useEffect(() => {
        setPath(points.map(p => `${p.x},${p.y}`).join(' '))
        onPathChanged(path)
        console.log(path)
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={ref}
            size="full"
            p="$20"
        >
            <ModalBackdrop />
            <ModalContent m="$20">
                <ModalHeader>
                    <VStack>
                        <Heading size="lg">{imageName}</Heading>
                        <Text>{originalPromt}</Text>
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
                        <Button onPress={onEditAreaClcik} isDisabled={!(points.length > 2)}>
                            <ButtonText>Изменить выделенную область</ButtonText>
                        </Button>
                        <Button action="negative" isDisabled={!(points.length > 0)}>
                            <ButtonText onPress={clearPoints}>Убрать выделение</ButtonText>
                        </Button>
                        <Button onPress={onAddToBannerClick}>
                            <ButtonText>Добавить на баннер</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={onClose}>
                            <ButtonText>Закрыть</ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const InpaintPromtModal = ({
    isOpen,
    onClose,
    onGenerateInpaintClick,
}) => {
    const ref = useRef(null)

    const [positivePrompt, setPositivePrompt] = useState('')
    const [negativePrompt, setNegativePrompt] = useState('')

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={ref}
            size="lg"
            p="$20"
        >
            <ModalBackdrop />
            <ModalContent m="$20">
                <ModalHeader>
                    <VStack>
                        <Heading size="lg">Редактирование выбранной области</Heading>
                    </VStack>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Center w="100%" h="100%">
                        <VStack space="md" m="0$">
                            <Textarea m="0$">
                                <TextareaInput value={positivePrompt} onChangeText={setPositivePrompt} placeholder="Промт" />
                            </Textarea>
                            <Textarea>
                                <TextareaInput value={negativePrompt} onChangeText={setNegativePrompt} placeholder="Негативный промт" />
                            </Textarea>
                        </VStack>
                    </Center>
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <Button onPress={onGenerateInpaintClick.bind(null, positivePrompt, negativePrompt)}>
                            <ButtonText>Сгенерировать</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={onClose}>
                            <ButtonText>Закрыть</ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const BannerModal = ({
    isOpen,
    onClose,
    onAddToBannerClick,
}) => {
    const ref = useRef(null)

    const [bannerType, setBannerType] = useState("")
    const [contentPosition, setContentPosition] = useState("")
    const [backgroundColor, setBackgroundColor] = useState("")

    const renderBannerTypeOptions = () => {
        return bannerTypes.map(
            (type) => {
                return (
                    <SelectItem label={type.displayName} value={type.name} />
                )
            }
        )
    }
    const renderContentPositionOptions = (bannerTypeStr) => {
        if (bannerTypeStr != "") {
            selectedBannerType = bannerTypes.find((item) => item.name == bannerTypeStr)
            return selectedBannerType.availableSizes.map(
                (size) => {
                    return (
                        <SelectItem label={size.displayName} value={size.name} />
                    )
                }
            )
        }
    }
    const renderBannerColors = () => {
        return bannerColors.map(
            (color) => {
                return <TouchableOpacity onPress={setBackgroundColor.bind(null, color)}><ColorSquare colorHex={color} /></TouchableOpacity>
            }
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={ref}
            size="lg"
            p="$20"
        >
            <ModalBackdrop />
            <ModalContent m="$20">
                <ModalHeader>
                    <VStack>
                        <Heading size="lg">Параметры баннера</Heading>
                    </VStack>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    {/* <HStack space="md">
                    <Text>Добавить на баннер</Text>
                    <Switch value={isAddBanner} onValueChange={setIsAddBanner} />
                </HStack> */}
                    <VStack space="md">
                        <Text size="md">Тип баннера</Text>
                        <Select
                            selectedValue={bannerType}
                            onValueChange={setBannerType}
                        >
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput placeholder="Тип форм-фактора баннера" />
                                <SelectIcon mr="$3">
                                    <Icon as={ChevronDownIcon} />
                                </SelectIcon>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {renderBannerTypeOptions()}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        <Text size="md">Расположение изображения</Text>
                        <Select
                            selectedValue={contentPosition}
                            onValueChange={setContentPosition}
                        >
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput placeholder="Расположение относительно баннера" />
                                <SelectIcon mr="$3">
                                    <Icon as={ChevronDownIcon} />
                                </SelectIcon>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {renderContentPositionOptions(bannerType)}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        <Text size="md">Цвет баннера</Text>
                        <Center>
                            <HStack>
                                {renderBannerColors()}
                            </HStack>
                        </Center>
                        <ColorBox colorHex={backgroundColor} colorName={"Выбран цвет "} isShowText={true} />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <Button onPress={onAddToBannerClick.bind(null, bannerType, contentPosition, backgroundColor)}>
                            <ButtonText>Добавить</ButtonText>
                        </Button>
                        <Button variant="outline" onPress={onClose}>
                            <ButtonText>Закрыть</ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
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

