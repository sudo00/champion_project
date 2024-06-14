import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import { HStack, VStack, Text, Icon, ScrollView, Textarea, TextareaInput, Center, Switch } from '@gluestack-ui/themed';
import { Input, InputField } from '@gluestack-ui/themed';
import { Divider } from "@gluestack-ui/themed"
import {
    Select,
    SelectTrigger,
    SelectIcon,
    SelectInput,
    SelectPortal,
    SelectBackdrop,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectContent,
    SelectItem,
} from '@gluestack-ui/themed';
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    AccordionIcon,
    AccordionTitleText,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@gluestack-ui/themed';
import {
    Button,
    ButtonText,
    ButtonIcon,
    ButtonSpinner,
    ButtonGroup,
} from "@gluestack-ui/themed"
import { EXTRA_COLOR } from "../../ColorConst";
import ColorBox from "../../components/ColorBox";
import ColorSquare from "../../components/ColorSquare";
import { bannerTypes } from "../../model/banner/BannerType";
import { bannerColors } from "../../model/banner/BannerColors";

const ImageForm = ({ }) => {
    const [imageWidth, setImageWidth] = useState(512)
    const [imageHeight, setImageHeight] = useState(512)
    const [imagesCount, setImagesCount] = useState(1)
    const [productType, setProductType] = useState("")

    const [isAddBanner, setIsAddBanner] = useState(false)
    const [bannerType, setBannerType] = useState("")
    const [contentPosition, setContentPosition] = useState("")
    const [backgroundColor, setBackgroundColor] = useState("")

    const [positivePrompt, setPositivePrompt] = useState('')
    const [negativePrompt, setNegativePrompt] = useState('')

    const onGenerateImage = () => {

    }

    const onClearInput = () => {
        setImageWidth(512)
        setImageHeight(512)
        setImagesCount(1)
        setProductType("")
        setIsAddBanner(false)
        setBannerType("")
        setContentPosition("")
        setBackgroundColor("")
        setPositivePrompt("")
        setNegativePrompt("")
    }

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
        <ScrollView>
            <VStack p="$3" space="md">
                <Text size="xl" bold="true">Параметры изображений</Text>
                <Text size="md">Высота</Text>
                <Input>
                    <InputField value={imageHeight} onChangeText={setImageHeight} placeholder="Высота" />
                </Input>
                <Text size="md">Ширина</Text>
                <Input>
                    <InputField value={imageWidth} onChangeText={setImageWidth} placeholder="Ширина" />
                </Input>
                <Text size="md">Количество изображений</Text>
                <Input>
                    <InputField value={imagesCount} onChangeText={setImagesCount} valueplaceholder="Количество изображений" />
                </Input>
                <Text size="md">Тип рекламируемого продукта</Text>
                <Select
                    selectedValue={productType}
                    onValueChange={setProductType}
                >
                    <SelectTrigger variant="outline" size="md">
                        <SelectInput placeholder="Тип продукта" />
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
                            <SelectItem label="Потребительский кредит" value="ПК" />
                            <SelectItem label="Кредитная карта" value="КК" />
                            <SelectItem label="Кредит под залог недвижимости" value="КПЗН" />
                            <SelectItem label="Премиум" value="Премиум" />
                        </SelectContent>
                    </SelectPortal>
                </Select>

                <Text size="xl" bold="true">Баннер</Text>
                <HStack space="md">
                    <Text>Добавить на баннер</Text>
                    <Switch value={isAddBanner} onValueChange={setIsAddBanner} />
                </HStack>
                {isAddBanner ? <VStack space="md">
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
                </VStack> : <View/>}


                {/* <Text size="xl" bold="true">Данные о клиенте</Text>
                <Button onPress={"getImage"} size="lg">
                    <ButtonText>Загрузить</ButtonText>
                </Button> */}


                <Accordion
                    size="lg"
                    variant="unfilled"
                    type="single"
                    isCollapsible={true}
                    isDisabled={false}
                >
                    <AccordionItem value="a" backgroundColor={EXTRA_COLOR}>
                        <AccordionHeader m="$0">
                            <AccordionTrigger m="0$">
                                {({ isExpanded }) => {
                                    return (
                                        <>
                                            <AccordionTitleText>
                                                <Text size="lg" bold="true">Дополнительные параметры генерации</Text>
                                            </AccordionTitleText>
                                            {isExpanded ? (
                                                <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                            ) : (
                                                <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                            )}
                                        </>
                                    )
                                }}
                            </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionContent pt="2$" mt="0$">
                            <VStack space="md" m="0$">
                                <Textarea m="0$">
                                    <TextareaInput value={positivePrompt} onChangeText={setPositivePrompt} placeholder="Промт" />
                                </Textarea>
                                <Textarea>
                                    <TextareaInput value={negativePrompt} onChangeText={setNegativePrompt} placeholder="Негативный промт" />
                                </Textarea>
                                {/* <Text size="md">Пресеты</Text>
                                <HStack space="3xl">
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Опция 1</BadgeText>
                            
                                    </Badge>
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Опция 1</BadgeText>
                                    </Badge>
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Удалить фон таким образом, чтобы ......</BadgeText>
                                    </Badge>
                                </HStack> */}
                            </VStack>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Divider my="$1" />

                <HStack space="md">
                    <Button onPress={onGenerateImage} size="lg">
                        <ButtonText>Сгенерировать</ButtonText>
                    </Button>
                    <Button onPress={onClearInput} size="lg" action="negative">
                        <ButtonText>Очистить ввод</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </ScrollView>
    )
}

export default ImageForm;

const styles = StyleSheet.create(
    {
        noTopMargin: {
            margin: "0",
        }
    }
)