"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgentParser = void 0;
const UserAgentParser = (userAgent) => {
    let os = 'Unknown OS';
    if (userAgent.includes('Win'))
        os = 'Windows';
    else if (userAgent.includes('Mac'))
        os = 'MacOS';
    else if (userAgent.includes('X11'))
        os = 'UNIX';
    else if (userAgent.includes('Linux'))
        os = 'Linux';
    else if (/Android/.test(userAgent))
        os = 'Android';
    else if (/iPhone|iPad|iPod/.test(userAgent))
        os = 'iOS';
    return os;
};
exports.UserAgentParser = UserAgentParser;
