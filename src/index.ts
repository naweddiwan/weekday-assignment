import Order from "./order";
import Restaurant from "./restaurant";
import fs from 'fs';

main();

function main() {
    const fileContent = fs.readFileSync('./input.txt', 'utf-8');
    const orders = JSON.parse(fileContent);

    const restaurant = new Restaurant();
    restaurant.processOrders(orders);
}