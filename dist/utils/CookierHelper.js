"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cookie {
    /**
     *
     * @param res Express.Response
     * @param cookieName Provide cookie name
     * @param cookieValue Provide a cookie value
     * @param cookieOptions Provide cookie options
     * @returns Express.Cookie
     */
    static createCookie(res, cookieName, cookieValue, cookieOptions) {
        return res.cookie(cookieName, cookieValue, cookieOptions);
    }
    /**
     *
     * @param req Express.Request
     * @returns {Record<string, any>}
     */
    static getCookie(req) {
        return req.cookies;
    }
}
exports.default = Cookie;
