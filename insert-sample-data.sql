-- Insert Categories
INSERT OR IGNORE INTO "Category" (id, name, slug, createdAt)
VALUES 
  ('cat1', 'Development Boards', 'dev-boards', datetime('now')),
  ('cat2', 'Components', 'components', datetime('now')),
  ('cat3', 'Measurement Tools', 'measurement-tools', datetime('now')),
  ('cat4', 'Kits & Bundles', 'kits-bundles', datetime('now')),
  ('cat5', 'Displays', 'displays', datetime('now')),
  ('cat6', 'Power & Batteries', 'power-batteries', datetime('now'));

-- Insert Users (Sellers)
INSERT OR IGNORE INTO "User" (id, email, passwordHash, name, role, createdAt, updatedAt)
VALUES 
  ('user1', 'seller@circulink.dev', 'hash1', 'Nora Chen', 'USER', datetime('now'), datetime('now')),
  ('user2', 'seller2@circulink.dev', 'hash2', 'Evan Moore', 'USER', datetime('now'), datetime('now'));

-- Insert Sample Items
INSERT OR IGNORE INTO "Item" (id, title, description, price, condition, status, images, sellerId, categoryId, createdAt, updatedAt)
VALUES 
  ('item1', 'Arduino Uno R3', 'Beginner-friendly board with pin labels and USB cable.', 158.00, 'GOOD', 'ACTIVE', '["https://dummyimage.com/300x300/4CAF50/ffffff?text=Arduino"]', 'user1', 'cat1', datetime('now'), datetime('now')),
  ('item2', 'Raspberry Pi 4B 4GB', 'Includes heatsinks and case, boots reliably.', 299.00, 'LIKE_NEW', 'ACTIVE', '["https://dummyimage.com/300x300/2196F3/ffffff?text=Raspberry"]', 'user1', 'cat1', datetime('now'), datetime('now')),
  ('item3', 'Digital Multimeter', 'Backlit display with fresh probes.', 79.00, 'GOOD', 'ACTIVE', '["https://dummyimage.com/300x300/FF9800/ffffff?text=Multimeter"]', 'user2', 'cat3', datetime('now'), datetime('now')),
  ('item4', 'Breadboard Starter Kit', 'Includes jumper wires and resistor pack.', 45.00, 'LIKE_NEW', 'ACTIVE', '["https://dummyimage.com/300x300/9C27B0/ffffff?text=Breadboard"]', 'user1', 'cat4', datetime('now'), datetime('now')),
  ('item5', 'Assorted Resistor Pack', '1/4W with common values, labeled bags.', 26.00, 'GOOD', 'ACTIVE', '["https://dummyimage.com/300x300/E91E63/ffffff?text=Resistors"]', 'user2', 'cat2', datetime('now'), datetime('now')),
  ('item6', '128x64 OLED Display', 'I2C OLED display, tested and working.', 36.00, 'GOOD', 'ACTIVE', '["https://dummyimage.com/300x300/00BCD4/ffffff?text=OLED"]', 'user1', 'cat5', datetime('now'), datetime('now')),
  ('item7', 'Li-ion Battery Pack (2x 18650)', 'Includes holder and JST connector.', 52.00, 'GOOD', 'ACTIVE', '["https://dummyimage.com/300x300/FFC107/ffffff?text=Battery"]', 'user2', 'cat6', datetime('now'), datetime('now'));
