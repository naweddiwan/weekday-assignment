export default class Order {
    private id: number;
    private meals: string[];
    private distance: number;

    constructor(id: number, meals: string[], distance: number ) {
        this.id = id;
        this.meals = meals;
        this.distance = distance;
    }

}

export interface inputOrder {
    orderId: number;
    meals: string[];
    distance: number;
}