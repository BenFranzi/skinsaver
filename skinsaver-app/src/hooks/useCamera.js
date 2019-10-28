import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useState} from 'react';
import useTF from './useTF';

export default () => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [cameraError, setErr] = useState(null); // REVIEW: needed?

    const useCamera = async (isCamera) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            setErr(`permissions not granted: ${JSON.stringify(status, null, 2)}`);
        } else {
            let image;
            if (isCamera) {
                image = await ImagePicker.launchCameraAsync();
            } else {
                image = await ImagePicker.launchImageLibraryAsync();
            }
            if (image.cancelled) {
                // setErr('image capture cancelled');
            } else {
                if (image.type !== 'image') {
                    // setErr('non-image captured');
                } else {
                    return image;
                }
            }
        }
    };

    const picker = (cb) => {
        return showActionSheetWithOptions({
                options: ['Camera', 'Files', 'Cancel'],
                cancelButtonIndex: 2, // Note: on iPad this is hidden because standard flow is to tap outside to cancel
            },
            async buttonIndex => {
                switch (buttonIndex) {
                    case 0: // Camera
                        cb(await useCamera(true));
                        break;
                    case 1: // Files
                        cb(await useCamera(false));
                        break;
                    default:
                        break; // do nothing
                }
            });
    };

    return [picker, cameraError];
};