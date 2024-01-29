FROM postgres:16-alpine

ADD ./tables/ /docker-entrypoint-initdb.d/tables/
ADD ./seed/ /docker-entrypoint-initdb.d/seed/
ADD ./deploy_schemas.sql /docker-entrypoint-initdb.d/