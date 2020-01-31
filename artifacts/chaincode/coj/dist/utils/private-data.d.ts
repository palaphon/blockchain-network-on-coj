/// <reference types="node" />
import { Context } from "fabric-contract-api";
export declare namespace PrivateDataUtils {
    const COLLECTION: string;
    function getBuffer(ctx: Context, key: string): Promise<Buffer>;
    function getString(ctx: Context, key: string): Promise<string>;
    function putString(ctx: Context, key: string, value: string): Promise<void>;
    function isPrivateDataExists(ctx: Context, key: string): Promise<boolean>;
    function deleteData(ctx: Context, key: string): Promise<void>;
}
