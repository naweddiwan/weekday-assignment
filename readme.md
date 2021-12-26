# Weekend

## DB Schemas

1. tb_restaurant: Contains the available restaurants to which an order can be assigned

```sql
CREATE TABLE `tb_restaurant` (
    `restaurant_id` int NOT NULL AUTO_INCREMENT,
    `restaurant_name` varchar(256) NOT NULL,
    `available_slots` int NOT NULL DEFAULT 0,
    `delivery_time` int NOT NULL COMMENT 'mins/per_km',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`restaurant_id`)
);
```

1. tb_meals: Different types of meals a restaurant can have. These can be added in the cart as meals as customer.

```sql
CREATE TABLE `tb_meals` (
		`meal_id` int NOT NULL AUTO_INCREMENT,
		`restaurant_id` int NOT NULL,
		`slots_required` int NOT NULL,
		`time_required` int NOT NULL COMMENT 'in mins',
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		 PRIMARY KEY (`meal_id`),
		FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurant`(`restaurant_id`) 
)
```

1. tb_recipes: For each meal there can be recipes in which there can be customization for that meal, which customer can specify, these details will be stored in the json column of customizations

```sql
CREATE TABLE `tb_recipes` (
		`recipe_id` int NOT NULL AUTO_INCREMENT,
		`meal_id` int NOT NULL,
		`customizations` JSON DEFAULT NULL,
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		 PRIMARY KEY (`recipe_id`),
     FOREIGN KEY (`meal_id`) REFERENCES `tb_meals`(`meal_id`) 
);
```

1. tb_orders: orders created, updated stored are stored in this table which also stores whether the order is recurring  & what is the current status of order. When a customer places an order entry to this table is surely inserted.

```sql
CREATE TABLE `tb_orders` (
	`order_id` int NOT NULL AUTO_INCREMENT,
	`restaurant_id` int NOT NULL,
	`order_status` tinyint NOT NULL COMMENT '0-pending, 1-complete, 2-scheduled, 3-cancelled',
   `order_type` tinyint NOT NULL COMMENT '0-regular, 1-recurring', 
	`recurring_days` int DEFAULT 0 COMMENT 'days after which order is re triggered', 
	`recurring_time` varchar(50) DEFAULT NULL 'time at which order must be placed',
	`order_wait_time` int NOT NULL COMMENT 'wait time in mins',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`order_id`),
	KEY `order_wait_time` (`order_wait_time`) USING BTREE,
	FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurant`(`restaurant_id`) 
);
```

1. tb_order_meals: For each order there can be  multiple meals. Each of the meals will be stored as a row in this table with their order id

```sql
CREATE TABLE `tb_order_meals` (
		`order_meal_id` int NOT NULL AUTO_INCREMENT,
		`order_id` int NOT NULL,
		`meal_id` int NOT NULL,
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (`order_meal_id`),
		FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`),
		FOREIGN KEY (`meal_id`) REFERENCES `tb_meals`(`meal_id`) 
);
```

1. tb_order_recipes: For each meal there can be  multiple recipes. Each of the recipes will be stored as a row in this table with their order id and meal_id

```sql
CREATE TABLE `tb_order_recipes` (
		`order_recipe_id` int NOT NULL AUTO_INCREMENT,
		`order_id` int NOT NULL,
		`meal_id` int NOT NULL,
		`recipe_id` int DEFAULT NULL,
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (`order_recipe_id`),
		FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`),
		FOREIGN KEY (`meal_id`) REFERENCES `tb_meals`(`meal_id`),
		FOREIGN KEY (`recipe_id`) REFERENCES `tb_recipes`(`recipe_id`)
);
```

1. tb_scheduled_orders: All scheduled orders will be stored in this table with their scheduled times and corresponding order_id from tb_orders table

```sql
CREATE TABLE `tb_scheduled_orders` (
		`scheduled_order_id` int NOT NULL AUTO_INCREMENT,
		`order_id` int NOT NULL,
		`scheduled_time` timestamp DEFAULT NULL,
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (`scheduled_order_id`),
		KEY `scheduled_time` (`scheduled_time`) USING BTREE,
		FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`) 
);
```

1. tb_orders_recurring: This table stores the data of all the recurring orders that have been placed based on the condition stored in the tb_orders. This table can be considered as  a history of all recurring orders placed.

```sql
CREATE TABLE `tb_orders_recurring` (
		`recurring_order_id` int NOT NULL AUTO_INCREMENT,
		`order_id` int NOT NULL,
		`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (`recurring_order_id`),
		FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`) 
);
```

- Tables References

![Untitled](Weekend%20bc4b3e1a162443aaa85654ee66220045/Untitled.png)

- For scheduling orders:
    - We can use redis to set a key correpsonding to the order_id and with a expiration time of corresponding to the scheduled order’s time. When the key expires an order will be placed.
- For recurring orders:
    - We can have a crone service which will run at midnight and schedule order using the above logic for the  time stored in the recurring_time , created_at and updated_at.