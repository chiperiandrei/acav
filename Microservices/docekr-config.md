## MariaDB/MySQL
```
docker pull mariadb

docker run --name user-management-mysqldb -p3306:3306 -e MYSQL_ROOT_PASSWORD=acav -e MYSQL_DATABASE=acav -d mariadb
```


## RabbitMQ
```
docker pull rabbitmq

docker run -d -p 15672:15672 -p 5672:5672 --name rabbit-acav rabbitmq:3-management
```

## Elastic Search
```
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.2.1

docker run -p 9200:9200 -p 9300:9300 --name elasticsearch-acav -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.2.1
```

## Kibana
```
docker pull docker.elastic.co/kibana/kibana:7.2.1

docker run --link elasticsearch-acav:elasticsearch -p 5601:5601 --name kibana-acav docker.elastic.co/kibana/kibana:7.2.1
```
