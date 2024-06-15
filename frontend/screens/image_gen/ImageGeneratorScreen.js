import { View, Image, StyleSheet } from "react-native"

import { useEffect, useState } from "react";
import axios from 'axios';
import { Col, Grid, Row } from "react-native-easy-grid";
import ImageHistory from "./ImageHistory";
import ImageForm from "./ImageForm";
import Header from "../../components/Header";

const ImageGeneratorScreen = ({ navigation }) => {
    return (
        <Grid>
            <Row>
                <Col size={1} style={{backgroundColor: "white"}}>
                    <ImageForm/>
                </Col>
                <Col size={2}>
                    <ImageHistory/>
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