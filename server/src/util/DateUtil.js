import moment from "moment";
export default class DateUtil {
    static getCurrentTime() {
        return new Date().getTime();
    }
    
    static getCurrentTimeInSeconds() {
        return Math.floor(Date.now() / 1000); //eslint-disable-line no-magic-numbers
    }

    static getUTCDateAndTime(dateString) {
        const date = new Date(dateString);
        const dateToISO = isNaN(date.getTime()) ? dateString : date.toISOString();
        return moment.utc(dateToISO).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
    }
}
