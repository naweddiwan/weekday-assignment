"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datastructures_js_1 = require("datastructures-js");
const constants = __importStar(require("./constants"));
const order_1 = __importDefault(require("./order"));
class Restaurant {
    constructor() {
        this.id = ++Restaurant.totalRestarutant;
        this.name = 'Restaurant_' + this.id;
        this.cookingSlots = constants.restaurant.COOKING_SLOTS; // *7
        this.deliveryTimePerKm = constants.restaurant.DELIVERY_TIME_PER_KM; //  * 8
        this.appetizerSlotRequired = constants.restaurant.APPETIZER_SLOT_REQUIRED; //* 1
        this.appetizerTimeRequired = constants.restaurant.APPETIZER_TIME_REQUIRED_MINS; //*17
        this.mainCourseSlotRequired = constants.restaurant.MAIN_COURSE_SLOT_REQUIRED; // *2
        this.mainCourseTimeRequired = constants.restaurant.MAIN_COURSE_TIME_REQURIED_MINS; // *29
        this.slotsWaitingTime = new datastructures_js_1.MinPriorityQueue();
    }
    computeMealPreparationAndDeliveryTime(meals, distance) {
        const mealPreparationTIme = meals.includes(constants.orderTypes.MAIN_COURSE) ? this.mainCourseTimeRequired : this.appetizerTimeRequired;
        const deliveryTime = distance * this.deliveryTimePerKm;
        return mealPreparationTIme + deliveryTime;
    }
    findSlotsRequired(meals) {
        let slotsRequired = 0;
        for (const meal of meals) {
            slotsRequired += (meal == constants.orderTypes.MAIN_COURSE) ? this.mainCourseSlotRequired : this.appetizerSlotRequired;
        }
        return slotsRequired;
    }
    processOrders(orders) {
        for (const order of orders) {
            const newOrder = new order_1.default(order.orderId, order.meals, order.distance);
            const slotsRequired = this.findSlotsRequired(order.meals);
            if (slotsRequired > this.cookingSlots) {
                console.log(`Order ${order.orderId} is denied because restaurant cannot accomodate it.`);
                continue;
            }
            const timeForOrder = this.computeMealPreparationAndDeliveryTime(order.meals, order.distance);
            if (timeForOrder > constants.MAX_ORDER_WAIT_TIME_MINS) {
                console.log(`Order ${order.orderId} is denied because maximum wait time exceeded.`);
                continue;
            }
            const availableSlots = (this.cookingSlots - this.slotsWaitingTime.size());
            if (availableSlots >= slotsRequired) {
                for (let i = 0; i < slotsRequired; i++) {
                    this.slotsWaitingTime.enqueue(timeForOrder);
                }
                console.log(`Order ${order.orderId} will get delivered in ${timeForOrder} minutes`);
            }
            else {
                let maxTime = 0;
                for (let i = 0; i < slotsRequired; i++) {
                    const currentTime = (this.slotsWaitingTime.dequeue());
                    maxTime = Math.max(currentTime.element, maxTime);
                }
                for (let i = 0; i < slotsRequired; i++) {
                    this.slotsWaitingTime.enqueue(timeForOrder + maxTime);
                }
                console.log(`Order ${order.orderId} will get delivered in ${timeForOrder + maxTime} minutes`);
            }
        }
    }
}
exports.default = Restaurant;
Restaurant.totalRestarutant = 0;
