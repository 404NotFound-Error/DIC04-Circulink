BEGIN;

-- Cleanup existing seeded records (including any rows owned by seeded users)
WITH target_users AS (
  SELECT id FROM "User" WHERE "email" IN (
    'seller@circulink.dev','seller2@circulink.dev','buyer@circulink.dev','buyer2@circulink.dev'
  )
), target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (SELECT id FROM target_users)
     OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "Favorite" WHERE "itemId" IN (SELECT id FROM target_items)
  OR id IN ('fav_1','fav_2','fav_3');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
), target_threads AS (
  SELECT id FROM "MessageThread" WHERE "itemId" IN (SELECT id FROM target_items)
)
DELETE FROM "Message" WHERE "threadId" IN (SELECT id FROM target_threads)
  OR id IN ('msg_1','msg_2');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "MessageThread" WHERE "itemId" IN (SELECT id FROM target_items)
  OR id IN ('thread_arduino_buyer');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "Order" WHERE "itemId" IN (SELECT id FROM target_items)
  OR id IN ('order_1','order_2');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "ItemView" WHERE "itemId" IN (SELECT id FROM target_items)
  OR id IN ('view_1','view_2','view_3','view_4','view_5');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "ItemStats" WHERE "itemId" IN (SELECT id FROM target_items)
  OR id IN ('stats_1','stats_2','stats_3');

WITH target_items AS (
  SELECT id FROM "Item" WHERE "sellerId" IN (
    SELECT id FROM "User" WHERE "email" IN (
      'seller@circulink.dev','seller2@circulink.dev'
    )
  ) OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery')
)
DELETE FROM "Item" WHERE id IN (SELECT id FROM target_items)
  OR id IN ('item_arduino','item_pi','item_meter','item_breadboard','item_resistors','item_oled','item_battery');

DELETE FROM "Profile" WHERE id IN ('profile_seller_1','profile_seller_2','profile_buyer_1','profile_buyer_2')
  OR "userId" IN (SELECT id FROM "User" WHERE "email" IN (
    'seller@circulink.dev','seller2@circulink.dev','buyer@circulink.dev','buyer2@circulink.dev'
  ));

DELETE FROM "User" WHERE id IN ('user_seller_1','user_seller_2','user_buyer_1','user_buyer_2')
  OR "email" IN ('seller@circulink.dev','seller2@circulink.dev','buyer@circulink.dev','buyer2@circulink.dev');

DELETE FROM "Category" WHERE id IN (
  'cat_components','cat_dev_boards','cat_measurement','cat_tools','cat_sensors','cat_power','cat_cables','cat_robotics','cat_displays','cat_kits'
) OR "slug" IN (
  'components','dev-boards','measurement-tools','tools-accessories','sensors','power-batteries','cables-connectors','robotics','displays','kits-bundles'
);

-- Categories
INSERT INTO "Category" ("id", "name", "slug", "createdAt") VALUES
  ('cat_components','Components','components',NOW()),
  ('cat_dev_boards','Development Boards','dev-boards',NOW()),
  ('cat_measurement','Measurement Tools','measurement-tools',NOW()),
  ('cat_tools','Tools & Accessories','tools-accessories',NOW()),
  ('cat_sensors','Sensors','sensors',NOW()),
  ('cat_power','Power & Batteries','power-batteries',NOW()),
  ('cat_cables','Cables & Connectors','cables-connectors',NOW()),
  ('cat_robotics','Robotics','robotics',NOW()),
  ('cat_displays','Displays','displays',NOW()),
  ('cat_kits','Kits & Bundles','kits-bundles',NOW());

-- Users
INSERT INTO "User" ("id","email","passwordHash","name","role","createdAt","updatedAt") VALUES
  ('user_seller_1','seller@circulink.dev','seeded-password-hash','Nora Chen','USER',NOW(),NOW()),
  ('user_seller_2','seller2@circulink.dev','seeded-password-hash','Evan Moore','USER',NOW(),NOW()),
  ('user_buyer_1','buyer@circulink.dev','seeded-password-hash','Riley Patel','USER',NOW(),NOW()),
  ('user_buyer_2','buyer2@circulink.dev','seeded-password-hash','Sophia Lin','USER',NOW(),NOW());

-- Profiles
INSERT INTO "Profile" ("id","userId","displayName","avatarUrl","university","phone","bio","createdAt","updatedAt") VALUES
  ('profile_seller_1','user_seller_1','Circuit Vendor','/uploads/sample-seller.jpg','Duke Kunshan University','+86 138 0000 1001','Focused on second-hand boards and lab gear.',NOW(),NOW()),
  ('profile_seller_2','user_seller_2','Lab Bench Supplies','/uploads/sample-seller-2.jpg','Stanford University','+1 650 555 0199','Selling surplus lab equipment from our robotics club.',NOW(),NOW()),
  ('profile_buyer_1','user_buyer_1','Circuit Learner','/uploads/sample-buyer.jpg','Duke University','+1 919 555 0147','DIY learner, always looking for starter kits.',NOW(),NOW()),
  ('profile_buyer_2','user_buyer_2','Maker Club Buyer','/uploads/sample-buyer-2.jpg','UC Berkeley','+1 510 555 0108','Buying supplies for weekend maker events.',NOW(),NOW());

-- Items
INSERT INTO "Item" ("id","title","description","price","condition","status","categoryId","sellerId","images","createdAt","updatedAt") VALUES
  ('item_arduino','Arduino Uno R3','Beginner-friendly board with pin labels and USB cable.',158.00,'GOOD','ACTIVE','cat_dev_boards','user_seller_1',ARRAY['/uploads/sample-uno.jpg']::text[],NOW(),NOW()),
  ('item_pi','Raspberry Pi 4B 4GB','Includes heatsinks and case, boots reliably.',299.00,'LIKE_NEW','ACTIVE','cat_dev_boards','user_seller_1',ARRAY['/uploads/sample-pi.jpg']::text[],NOW(),NOW()),
  ('item_meter','Digital Multimeter','Backlit display with fresh probes.',79.00,'GOOD','ACTIVE','cat_measurement','user_seller_2',ARRAY['/uploads/sample-meter.jpg']::text[],NOW(),NOW()),
  ('item_breadboard','Breadboard Starter Kit','Includes jumper wires and resistor pack.',45.00,'LIKE_NEW','ACTIVE','cat_kits','user_seller_1',ARRAY['/uploads/sample-breadboard.jpg']::text[],NOW(),NOW()),
  ('item_resistors','Assorted Resistor Pack','1/4W with common values, labeled bags.',26.00,'GOOD','ACTIVE','cat_components','user_seller_2',ARRAY['/uploads/sample-resistors.jpg']::text[],NOW(),NOW()),
  ('item_oled','128x64 OLED Display','I2C OLED display, tested and working.',36.00,'GOOD','ACTIVE','cat_displays','user_seller_1',ARRAY['/uploads/sample-oled.jpg']::text[],NOW(),NOW()),
  ('item_battery','Li-ion Battery Pack (2x 18650)','Includes holder and JST connector.',52.00,'GOOD','ACTIVE','cat_power','user_seller_2',ARRAY['/uploads/sample-battery.jpg']::text[],NOW(),NOW());

-- Favorites
INSERT INTO "Favorite" ("id","userId","itemId","createdAt") VALUES
  ('fav_1','user_buyer_1','item_arduino',NOW()),
  ('fav_2','user_buyer_1','item_pi',NOW()),
  ('fav_3','user_buyer_2','item_meter',NOW());

-- Message thread + messages
INSERT INTO "MessageThread" ("id","itemId","buyerId","sellerId","createdAt") VALUES
  ('thread_arduino_buyer','item_arduino','user_buyer_1','user_seller_1',NOW());

INSERT INTO "Message" ("id","threadId","senderId","body","isRead","createdAt") VALUES
  ('msg_1','thread_arduino_buyer','user_buyer_1','Hi! Is this still available?',false,NOW()),
  ('msg_2','thread_arduino_buyer','user_seller_1','Yes, still available. Want to meet on campus?',false,NOW());

-- Orders
INSERT INTO "Order" ("id","itemId","buyerId","sellerId","status","total","createdAt","updatedAt") VALUES
  ('order_1','item_arduino','user_buyer_1','user_seller_1','ACCEPTED',158.00,NOW(),NOW()),
  ('order_2','item_pi','user_buyer_2','user_seller_1','PENDING',299.00,NOW(),NOW());

-- Item views + stats
INSERT INTO "ItemView" ("id","itemId","viewerId","createdAt") VALUES
  ('view_1','item_arduino','user_buyer_1',NOW()),
  ('view_2','item_arduino','user_buyer_2',NOW()),
  ('view_3','item_arduino',NULL,NOW()),
  ('view_4','item_pi','user_buyer_1',NOW()),
  ('view_5','item_meter',NULL,NOW());

INSERT INTO "ItemStats" ("id","itemId","viewCount","lastViewedAt","createdAt","updatedAt") VALUES
  ('stats_1','item_arduino',3,NOW(),NOW(),NOW()),
  ('stats_2','item_pi',1,NOW(),NOW(),NOW()),
  ('stats_3','item_meter',1,NOW(),NOW(),NOW());

COMMIT;
