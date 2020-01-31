"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const validator_1 = require("./validator");
const not_valid_string_1 = require("../errors/not-valid-string");
var DateTimeUtils;
(function (DateTimeUtils) {
    function getDateTimeFromString(str) {
        const dateTimeObject = moment(str, moment.ISO_8601);
        if (!dateTimeObject.isValid()) {
            throw new Error('Date is not in ISO8601 format.');
        }
        return dateTimeObject;
    }
    DateTimeUtils.getDateTimeFromString = getDateTimeFromString;
    function isDateTimeReached(date) {
        const dateTimeObject = getDateTimeFromString(date);
        const nowObject = moment();
        if (nowObject.isBefore(dateTimeObject)) {
            return false;
        }
        return false;
    }
    DateTimeUtils.isDateTimeReached = isDateTimeReached;
    function getDateFromDateString(date) {
        if (!validator_1.ValidatorUtils.isStringValid(date)) {
            throw new not_valid_string_1.NotAValidStringError('date');
        }
        return DateTimeUtils.getDateTimeFromString(date);
    }
    DateTimeUtils.getDateFromDateString = getDateFromDateString;
})(DateTimeUtils = exports.DateTimeUtils || (exports.DateTimeUtils = {}));
//# sourceMappingURL=date-time.js.map