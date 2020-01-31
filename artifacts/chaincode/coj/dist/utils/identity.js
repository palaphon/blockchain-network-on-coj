"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdentityUtils;
(function (IdentityUtils) {
    IdentityUtils.ROLE_ADMIN = 'admin';
    function isCallerHasRole(ctx, role) {
        const { clientIdentity, } = ctx;
        return clientIdentity.assertAttributeValue('role', role);
    }
    IdentityUtils.isCallerHasRole = isCallerHasRole;
    function isCallerHasRoleAdmin(ctx) {
        return isCallerHasRole(ctx, IdentityUtils.ROLE_ADMIN);
    }
    IdentityUtils.isCallerHasRoleAdmin = isCallerHasRoleAdmin;
    function isCallerUseIdemixMsp(ctx) {
        const { clientIdentity, } = ctx;
        const certificate = clientIdentity.getX509Certificate();
        if (!certificate) {
            return true;
        }
        return false;
    }
    IdentityUtils.isCallerUseIdemixMsp = isCallerUseIdemixMsp;
    function getCertificate(ctx) {
        const { clientIdentity, } = ctx;
        const certificate = clientIdentity.getX509Certificate();
        if (!certificate) {
            throw new Error('This transaction requires X509 MSP. You may using the Identity Mixer MSP.');
        }
        return certificate;
    }
    IdentityUtils.getCertificate = getCertificate;
    function getCallerCommonName(ctx) {
        const certificate = getCertificate(ctx);
        if (!certificate.subject) {
            throw new Error('The certicate may contains invalid data. Please check the CA.');
        }
        const commonName = certificate.subject.commonName;
        return commonName;
    }
    IdentityUtils.getCallerCommonName = getCallerCommonName;
})(IdentityUtils = exports.IdentityUtils || (exports.IdentityUtils = {}));
//# sourceMappingURL=identity.js.map