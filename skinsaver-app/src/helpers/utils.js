import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export const LocalTime = (pg) => {
    try {
        const date = new Date(Date.parse(pg));
        // Note: expo seems to ignore localization, pg times are not in UTC because of Typeorm
        // return date.toLocaleTimeString(Localization.locale, {hour: 'numeric', minute: 'numeric', hour12: true}) + " " + date.toLocaleDateString(Localization.locale);
        return date.toLocaleTimeString() + ` ${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
    } catch (e) {
        console.log('Invalid timestamp provided');
        return 'unavailable timestamp'
    }
};