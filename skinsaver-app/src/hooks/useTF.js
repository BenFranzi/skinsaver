import React, { useState} from "react";
import { Image } from "react-native";
import * as tf from "@tensorflow/tfjs";
import { fetch as tfFetch } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet"; // remove after SkinSaver implementation
import {base64ImageToTensor, imageToTensor, resizeImage} from '../helpers/ImageUtils';

export default () => {
    const [processing, setProcessing] = useState(false);
    const [classifyStatus, setClassifyStatus] = useState(null);

    const classify = async (source) => {
        setClassifyStatus('helloworld');
        return new Promise(async (resolve, reject) => {
            try {
                if (!source) {
                    console.debug('no image provided!');
                    reject('No image provided');
                    return;
                }
                setClassifyStatus('Starting classify');
                await tf.ready();
                setClassifyStatus('Tensorflow ready');
                const model = await mobilenet.load();
                if (!!model && !processing) {
                    setClassifyStatus('Preparing image');
                    setProcessing(true);
                    let imageTensor = null;
                    if (Number.isInteger(source)) {
                        const imagePath = Image.resolveAssetSource(source);
                        const response = await tfFetch(
                            imagePath.uri,
                            {},
                            {isBinary: true}
                        );
                        const raw = await response.arrayBuffer();
                        imageTensor = await imageToTensor(raw);
                    } else {
                        const {base64} = await resizeImage(source.uri);
                        imageTensor = base64ImageToTensor(base64);
                    }
                    console.log('starting classification');
                    setClassifyStatus('Starting classification');
                    const predictions = await model.classify(imageTensor);
                    await tf.dispose([imageTensor]);
                    console.debug('completed classification');
                    setClassifyStatus('Completed classification');
                    setProcessing(false);
                    setClassifyStatus(null);
                    resolve(predictions);
                } else {
                    console.debug((processing) ? 'ml already in progress' : 'no model exists');
                }
            } catch (e) {
                reject('failed ' + e);
            }
        });
    };

    return [classify, processing, classifyStatus];
}
