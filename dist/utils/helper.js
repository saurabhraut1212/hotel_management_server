"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canModifyOrder = void 0;
const canModifyOrder = (orderDate) => {
    const currentTime = new Date();
    const timeDifference = (currentTime.getTime() - orderDate.getTime()) / 1000 / 60;
    return timeDifference <= 10;
};
exports.canModifyOrder = canModifyOrder;
