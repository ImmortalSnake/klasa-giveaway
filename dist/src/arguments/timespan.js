"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Argument {
    run(arg, possible, message) {
        const duration = new klasa_1.Duration(arg);
        if (duration.offset > 0 && klasa_1.util.isNumber(duration.fromNow.getTime()))
            return duration.offset;
        throw message.language.get('RESOLVER_INVALID_DURATION', possible.name);
    }
}
exports.default = default_1;
