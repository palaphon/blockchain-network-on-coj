"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetUtils;
(function (AssetUtils) {
    function getAssetFromBuffer(buffer) {
        const string = buffer.toString('utf8');
        return JSON.parse(string);
    }
    AssetUtils.getAssetFromBuffer = getAssetFromBuffer;
    function getBufferFromAsset(asset) {
        return JSON.stringify(asset);
    }
    AssetUtils.getBufferFromAsset = getBufferFromAsset;
    async function getAsset(ctx, key) {
        const { stub } = ctx;
        const assetBuffer = await stub.getState(key);
        if (assetBuffer === null || assetBuffer === undefined) {
            throw new Error('Asset does not exists!');
        }
        if (assetBuffer.length === 0) {
            throw new Error('Asset does not exists!');
        }
        return JSON.parse(assetBuffer.toString('utf8'));
    }
    AssetUtils.getAsset = getAsset;
    async function putAsset(ctx, key, asset) {
        const { stub } = ctx;
        const assetBuffer = Buffer.from(JSON.stringify(asset));
        await stub.putState(key, assetBuffer);
    }
    AssetUtils.putAsset = putAsset;
    async function putBlankAsset(ctx, key) {
        const blankAsset = {};
        await putAsset(ctx, key, blankAsset);
    }
    AssetUtils.putBlankAsset = putBlankAsset;
    async function isAssetExists(ctx, key) {
        try {
            await getAsset(ctx, key);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    AssetUtils.isAssetExists = isAssetExists;
    async function isPartialAssetExists(ctx, key, attributes) {
        const { stub, } = ctx;
        const iterator = await stub.getStateByPartialCompositeKey(key, attributes);
        const assetIterationResult = await iterator.next();
        if (assetIterationResult.done) {
            return false;
        }
        return true;
    }
    AssetUtils.isPartialAssetExists = isPartialAssetExists;
    async function countPartialAsset(ctx, key, attributes) {
        const { stub, } = ctx;
        let assetCounter = 0;
        const iterator = await stub.getStateByPartialCompositeKey(key, attributes);
        while (true) {
            let assetIterationResult = await iterator.next();
            if (assetIterationResult.done) {
                break;
            }
            assetCounter += 1;
        }
        return assetCounter;
    }
    AssetUtils.countPartialAsset = countPartialAsset;
    async function getPartialAsset(ctx, key, attributes) {
        const { stub, } = ctx;
        const assets = [];
        const iterator = await stub.getStateByPartialCompositeKey(key, attributes);
        while (true) {
            const assetIterationResult = await iterator.next();
            if (assetIterationResult.done) {
                break;
            }
            const assetKey = assetIterationResult.value.getKey();
            const assetBuffer = assetIterationResult.value.getValue();
            const asset = getAssetFromBuffer(assetBuffer);
            assets.push({
                key: assetKey,
                value: asset,
            });
        }
        return assets;
    }
    AssetUtils.getPartialAsset = getPartialAsset;
})(AssetUtils = exports.AssetUtils || (exports.AssetUtils = {}));
//# sourceMappingURL=asset.js.map