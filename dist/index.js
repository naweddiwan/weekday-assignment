"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restaurant_1 = __importDefault(require("./restaurant"));
const fs_1 = __importDefault(require("fs"));
main();
function main() {
    const fileContent = fs_1.default.readFileSync('./input.txt', 'utf-8');
    const orders = JSON.parse(fileContent);
    const restaurant = new restaurant_1.default();
    restaurant.processOrders(orders);
}
