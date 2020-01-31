"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrivateDataUtils;
(function (PrivateDataUtils) {
    PrivateDataUtils.COLLECTION = 'coj-voting';
    async function getBuffer(ctx, key) {
        const { stub } = ctx;
        const buffer = await stub.getPrivateData(PrivateDataUtils.COLLECTION, key);
        if (buffer === null || buffer === undefined) {
            throw new Error('Private data does not exists!');
        }
        return buffer;
    }
    PrivateDataUtils.getBuffer = getBuffer;
    async function getString(ctx, key) {
        const buffer = await getBuffer(ctx, key);
        return buffer.toString('utf8');
    }
    PrivateDataUtils.getString = getString;
    async function putString(ctx, key, value) {
        const { stub } = ctx;
        const buffer = await Buffer.from(value, 'utf8');
        await stub.putPrivateData(PrivateDataUtils.COLLECTION, key, buffer);
    }
    PrivateDataUtils.putString = putString;
    async function isPrivateDataExists(ctx, key) {
        try {
            await getBuffer(ctx, key);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    PrivateDataUtils.isPrivateDataExists = isPrivateDataExists;
    async function deleteData(ctx, key) {
        const { stub } = ctx;
        stub.deletePrivateData(PrivateDataUtils.COLLECTION, key);
    }
    PrivateDataUtils.deleteData = deleteData;
})(PrivateDataUtils = exports.PrivateDataUtils || (exports.PrivateDataUtils = {}));
//# sourceMappingURL=private-data.js.map