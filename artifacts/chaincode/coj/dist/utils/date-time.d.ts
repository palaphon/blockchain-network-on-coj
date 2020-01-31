import * as moment from 'moment';
export declare namespace DateTimeUtils {
    function getDateTimeFromString(str: string): moment.Moment;
    function isDateTimeReached(date: string): boolean;
    function getDateFromDateString(date: string): moment.Moment;
}
