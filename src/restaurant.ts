import { MinPriorityQueue } from 'datastructures-js';
import * as constants from './constants';

import Order from './order';
import { inputOrder } from './order';

interface PriorityQueueItem<T> {
    priority: number;
    element: T;
}

export default class Restaurant {
    private id: number;
    private name: string;
    private cookingSlots: number;
    private deliveryTimePerKm: number;
    private appetizerSlotRequired: number;
    private appetizerTimeRequired: number;
    private mainCourseSlotRequired: number;
    private mainCourseTimeRequired: number;
    
    private slotsWaitingTime: MinPriorityQueue<number>;

    public static totalRestarutant: number;

    constructor() {
        this.id     = ++Restaurant.totalRestarutant;
        this.name   = 'Restaurant_' + this.id;
        this.cookingSlots = constants.restaurant.COOKING_SLOTS; // *7
        this.deliveryTimePerKm = constants.restaurant.DELIVERY_TIME_PER_KM; //  * 8

        this.appetizerSlotRequired  = constants.restaurant.APPETIZER_SLOT_REQUIRED; //* 1
        this.appetizerTimeRequired  = constants.restaurant.APPETIZER_TIME_REQUIRED_MINS; //*17
        this.mainCourseSlotRequired = constants.restaurant.MAIN_COURSE_SLOT_REQUIRED; // *2
        this.mainCourseTimeRequired = constants.restaurant.MAIN_COURSE_TIME_REQURIED_MINS; // *29
        this.slotsWaitingTime = new MinPriorityQueue();
    }
    private computeMealPreparationAndDeliveryTime(meals: string[], distance: number) {
        const mealPreparationTIme =  meals.includes(constants.orderTypes.MAIN_COURSE) ? this.mainCourseTimeRequired : this.appetizerTimeRequired;
        const deliveryTime = distance * this.deliveryTimePerKm;
        return mealPreparationTIme + deliveryTime;

    }
    private findSlotsRequired(meals: string[]){
        let slotsRequired = 0;
        for(const meal of meals) {
            slotsRequired += (meal == constants.orderTypes.MAIN_COURSE) ? this.mainCourseSlotRequired : this.appetizerSlotRequired;
        }
        return slotsRequired;
    }

    public processOrders(orders: inputOrder[]) {

        for(const order of orders) {
            const newOrder = new Order(order.orderId, order.meals, order.distance);
            const slotsRequired = this.findSlotsRequired(order.meals);
            if(slotsRequired > this.cookingSlots){
               console.log(`Order ${order.orderId} is denied because restaurant cannot accomodate it.` );
                continue;
            }
            const timeForOrder = this.computeMealPreparationAndDeliveryTime(order.meals, order.distance);
            if(timeForOrder > constants.MAX_ORDER_WAIT_TIME_MINS){
                console.log(`Order ${order.orderId} is denied because maximum wait time exceeded.` );
                continue;
            }

            const availableSlots =  (this.cookingSlots - this.slotsWaitingTime.size());

            if(availableSlots >= slotsRequired) {
                for(let i =0; i<slotsRequired; i++) {
                    this.slotsWaitingTime.enqueue(timeForOrder);
                }
                console.log(`Order ${order.orderId} will get delivered in ${timeForOrder} minutes` )
            }
            else{
                let maxTime = 0;
                for(let i =0; i<slotsRequired; i++) {
                    const currentLeastTime = (this.slotsWaitingTime.dequeue()) as PriorityQueueItem<number>;
                    maxTime = Math.max(currentLeastTime.element, maxTime);
                }
                for(let i =0; i<slotsRequired; i++) {
                    this.slotsWaitingTime.enqueue(timeForOrder + maxTime);
                }
                console.log(`Order ${order.orderId} will get delivered in ${timeForOrder + maxTime} minutes`);
            }
        }
    }

}

Restaurant.totalRestarutant = 0;