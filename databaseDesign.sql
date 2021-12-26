CREATE TABLE `tb_restaurant` (
    `restaurant_id` int NOT NULL AUTO_INCREMENT,
    `restaurant_name` varchar(256) NOT NULL,
    `available_slots` int NOT NULL DEFAULT 0,
    `delivery_time` int NOT NULL COMMENT 'mins/per_km',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`restaurant_id`)
);


CREATE TABLE `tb_meals` (
	`meal_id` int NOT NULL AUTO_INCREMENT,
	`restaurant_id` int NOT NULL,
	`slots_required` int NOT NULL,
	`time_required` int NOT NULL COMMENT 'in mins',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	 PRIMARY KEY (`meal_id`),
	FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurant`(`restaurant_id`) 
);

CREATE TABLE `tb_recipes` (
	`recipe_id` int NOT NULL AUTO_INCREMENT,
	`meal_id` int NOT NULL,
	`customizations` JSON DEFAULT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	 PRIMARY KEY (`recipe_id`),
    FOREIGN KEY (`meal_id`) REFERENCES `tb_meals`(`meal_id`) 
);

CREATE TABLE `tb_orders` (
	`order_id` int NOT NULL AUTO_INCREMENT,
	`restaurant_id` int NOT NULL,
	`order_status` tinyint NOT NULL COMMENT '0-pending, 1-complete, 2-scheduled, 3-cancelled',
    `order_type` tinyint NOT NULL COMMENT '0-regular, 1-recurring', 
	`recurring_days` int DEFAULT 0 COMMENT 'days after which order is re triggered', 
	`order_wait_time` int NOT NULL COMMENT 'wait time in mins',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`order_id`),
	KEY `order_wait_time` (`order_wait_time`) USING BTREE,
	FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurant`(`restaurant_id`) 
);

CREATE TABLE `tb_order_meals` (
	`order_meal_id` int NOT NULL AUTO_INCREMENT,
	`order_id` int NOT NULL,
	`meal_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`order_meal_id`),
	FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`),
	FOREIGN KEY (`meal_id`) REFERENCES `tb_meals`(`meal_id`) 
);

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

CREATE TABLE `tb_orders_recurring` (
	`recurring_order_id` int NOT NULL AUTO_INCREMENT,
	`order_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`recurring_order_id`),
	FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`order_id`) 
);