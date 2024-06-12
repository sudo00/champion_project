import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import { HStack, VStack, Text, Icon, ScrollView, Textarea, TextareaInput, Center } from '@gluestack-ui/themed';
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
import { Badge, BadgeText } from "@gluestack-ui/themed"
import { EXTRA_COLOR } from "../../ColorConst";
import ColorBox from "../../components/ColorBox";
import ColorSquare from "../../components/ColorSquare";

const ImageForm = ({ }) => {
    const [imageWidth, setImageWidth] = useState(512)
    const [imageHeight, setImageHeight] = useState(512)
    const [imagesCount, setImagesCount] = useState(1)
    const [productType, setProductType] = useState("")
    const [channel, setChannel] = useState("")

    const [positivePrompt, setPositivePrompt] = useState('')
    const [negativePrompt, setNegativePrompt] = useState('')
    const extraOptions = ["ОПЦИЯ_1", "ОПЦИЯ_2", "ОПЦИЯ_3"]
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
                <Select>
                    <SelectTrigger variant="outline" size="md">
                        <SelectInput value={productType} placeholder="Тип продукта" onChangeText={setProductType} />
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
                            <SelectItem label="Потребительский кредит" value="ux" />
                            <SelectItem label="Кредитная карта" value="web" />
                            <SelectItem label="Кредит под залог недвижимости" value="cross-platform" />
                            <SelectItem label="Премиум" value="ui" />
                        </SelectContent>
                    </SelectPortal>
                </Select>

                <Text size="xl" bold="true">Фон</Text>
                <Text size="md">Тип баннера</Text>
                <Select>
                    <SelectTrigger variant="outline" size="md">
                        <SelectInput value={channel} placeholder="Соотношение сторон баннера на выходе" onChangeText={setChannel} />
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
                            <SelectItem label="МБ" value="ux" />
                            <SelectItem label="Email" value="web" />
                            <SelectItem label="ИБ" value="cross-platform" />
                            <SelectItem label="Пуш-уведомление" value="ui" />
                        </SelectContent>
                    </SelectPortal>
                </Select>
                <Text size="md">Расположение</Text>
                <Select>
                    <SelectTrigger variant="outline" size="md">
                        <SelectInput value={channel} placeholder="Расположение относительно баннера" onChangeText={setChannel} />
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
                            <SelectItem label="МБ" value="ux" />
                            <SelectItem label="Email" value="web" />
                            <SelectItem label="ИБ" value="cross-platform" />
                            <SelectItem label="Пуш-уведомление" value="ui" />
                        </SelectContent>
                    </SelectPortal>
                </Select>
                <Text size="md">Цвет фона</Text>
                <Center>
                    <HStack>
                        <TouchableOpacity><ColorSquare colorHex={"#F00000"}/></TouchableOpacity>
                        <TouchableOpacity><ColorSquare colorHex={"#F00000"}/></TouchableOpacity>
                        <TouchableOpacity><ColorSquare colorHex={"#F00000"}/></TouchableOpacity>
                    </HStack>
                </Center>
                <ColorBox colorHex={"#F00000"} colorName={"test"} isShowText={true}/>



                <Text size="xl" bold="true">Данные о клиенте</Text>
                <Button onPress={"getImage"} size="lg">
                    <ButtonText>Загрузить</ButtonText>
                </Button>

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
                                <Text size="md">Пресеты</Text>
                                <HStack space="3xl">
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Опция 1</BadgeText>
                                        {/* <BadgeIcon as={GlobeIcon} ml="$2" /> */}
                                    </Badge>
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Опция 1</BadgeText>
                                        {/* <BadgeIcon as={GlobeIcon} ml="$2" /> */}
                                    </Badge>
                                    <Badge size="md" variant="outline" borderRadius="$full" action="info">
                                        <BadgeText>Удалить фон таким образом, чтобы ......</BadgeText>
                                        {/* <BadgeIcon as={GlobeIcon} ml="$2" /> */}
                                    </Badge>

                                    {
                                        // extraOptions.map(item => {
                                        //     <Badge size="lg" variant="outline" borderRadius="$full" action="info">
                                        //         <BadgeText>{item}</BadgeText>
                                        //         {/* <BadgeIcon as={GlobeIcon} ml="$2" /> */}
                                        //     </Badge>
                                        // })
                                    }
                                </HStack>
                            </VStack>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Divider my="$1" />
                <HStack space="md">
                    <Button onPress={"getImage"} size="lg">
                        <ButtonText>Сгенерировать</ButtonText>
                    </Button>
                    <Button onPress={"getImage"} size="lg" action="negative">
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