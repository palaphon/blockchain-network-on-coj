/// <reference types="node" />
import { Context } from "fabric-contract-api";
export declare namespace AssetUtils {
    function getAssetFromBuffer<T>(buffer: Buffer): T;
    function getBufferFromAsset(asset: any): string;
    function getAsset<T>(ctx: Context, key: string): Promise<T>;
    function putAsset(ctx: Context, key: string, asset: any): Promise<void>;
    function putBlankAsset(ctx: Context, key: string): Promise<void>;
    function isAssetExists(ctx: Context, key: string): Promise<boolean>;
    function isPartialAssetExists(ctx: Context, key: string, attributes: string[]): Promise<boolean>;
    function countPartialAsset<T>(ctx: Context, key: string, attributes: string[]): Promise<number>;
    function getPartialAsset<T>(ctx: Context, key: string, attributes: string[]): Promise<{
        key: string;
        value: T;
    }[]>;
}
