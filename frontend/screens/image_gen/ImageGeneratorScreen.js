import { View, Image, StyleSheet } from "react-native"

import { useEffect, useState } from "react";
import axios from 'axios';
import { Col, Grid, Row } from "react-native-easy-grid";
import ImageHistory from "./ImageHistory";
import ImageForm from "./ImageForm";
import Header from "../../components/Header";
import { historyRequest } from "../../api/history";

const ImageGeneratorScreen = ({ navigation }) => {
    const [imageHistory, setImageHistory] = useState([])

    useEffect(() => {
        // Использовать web-socket в будущем!!! >_<
        setInterval(refreshHistory, 5000)
    }, [])

    const refreshHistory = () => {
        historyRequest({
            onSuccess: (data) => { setImageHistory(data) }
        })
    }
    const clearHistory = () => {
        clearHistoryRequest(
            {}
        )
    }
    useEffect(() => { refreshHistory() }, [])
    return (
        <Grid>
            <Row>
                <Col size={1} style={{backgroundColor: "white"}}>
                    <ImageForm
                        onClearImageHistory={clearHistory}
                        onRefreshImageHistory={refreshHistory}
                    />
                </Col>
                <Col size={2}>
                    <ImageHistory
                        imageHistory={imageHistory}
                        refreshHistory={refreshHistory}
                    />
                </Col>
            </Row>
        </Grid>
    );
}

export default ImageGeneratorScreen;

const styles = StyleSheet.create({
    logo: {
        width: 400,
        height: 400,
    },
});