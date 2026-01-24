INSERT INTO "_prisma_migrations" (
  "id",
  "checksum",
  "finished_at",
  "migration_name",
  "logs",
  "rolled_back_at",
  "started_at",
  "applied_steps_count"
)
SELECT
  '2fcc7d45-c771-4236-87a7-3cdcf0a7922b',
  '6f567b3cc7bf1a3fac5e3a825bca1de881aad12f30a8704b977d29a78da8b911',
  NOW(),
  '20260122090000_auth_tokens',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122090000_auth_tokens'
);
