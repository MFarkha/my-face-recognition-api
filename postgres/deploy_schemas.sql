-- Deploy fresh database tabels:
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'
-- test data:
\i '/docker-entrypoint-initdb.d/seed/seed.sql'