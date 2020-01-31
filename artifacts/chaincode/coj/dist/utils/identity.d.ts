import { Context } from "fabric-contract-api";
import { X509 } from "fabric-shim";
export declare namespace IdentityUtils {
    const ROLE_ADMIN = "admin";
    function isCallerHasRole(ctx: Context, role: string): boolean;
    function isCallerHasRoleAdmin(ctx: Context): boolean;
    function isCallerUseIdemixMsp(ctx: Context): boolean;
    function getCertificate(ctx: Context): X509.Certificate;
    function getCallerCommonName(ctx: Context): string;
}
