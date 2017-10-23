# Date Modeling Zone Demo

## Intro

The content here was created for the Data Modeling Zone event in 2017. The topic was 'NoSQL in the scope of Microservices and Polyglot Persistence'

## Purpose

The purpose of the demo is to show how different the fundamental data models (not the logical ones) of NoSQL databases are looking like.

* KV-Stores: Simplicity of the data model which allows 'high scalability'
* Graph DBS: More complex underlying model with focus on efficient traversal

In addition we will have a practical example how to async. exchange data between services:

* Pub-Sub: Give an example for exchanging data between services

## Idea

* Actor Profiles: This represents a typical user profile store. Redis will be used as a simple KV-Store (or Data Structure Store) by focusing on the storage and the retrieval of actor profiles.
* Movies Network: The network contains the information which movie is related to which other ones and to which actors.

Neo4j's 'Movies' demo data will be used.

Here some examples:

* Actor Profiles Service
  * Find actors by their id-s
  * Find actors by their properties
  
* Movies Network Service
  * Find all actors those played in a specific movie

* Data exchange between the services
  * If someone likes a movie in which the actor played then the relevance of an actor will be increased as well

## Demo (database tier only)

### Redis

* Install a single Redis instance

```
brew install redis
```

> BTW: On Linux just use the package manager of your distro


* Start a local Redis

> The demo is the same for Open Source and for Enterprise Redis

```
redis-server ./redis.conf 
```

* Connect to the local instance


```
redis-cli -h localhost -p 6379
```

* Initialize a Node project and install the Redis client library

```
npm install redis --save
```

* The tool 'load_redis' parses some JSON data and inserts Hashes into Redis

```
//Insert as HashMap
value_arr = [];

for (prop in json_value) {

  value_arr.push(prop);
  value_arr.push(json_value[prop]);
}

client.hmset(key, value_arr, function (err, res) {

  console.log(res);
});
```

* It also indexes by year of birth

```
if (json_value.hasOwnProperty("born")) {
  client.zadd("idx:born", parseInt(json_value.born), key, function (err, res) {
    console.log(res);
  });
}
```

* List all persons starting with a 'K'

```
KEYS Person::Ke*
```

* Get all properties

```
HGETALL Person::Keanu
``` 

* Get a specific property

```
HGET Person::Keanu name
```

* Scan by year of birth

```
ZRANGEBYSCORE idx:born 1978 1985
1) "Person::Emil"
2) "Person::ChristinaR"
3) "Person::NatalieP"
4) "Person::Rain"
5) "Person::EmileH"
```

* Optional: Show the Redis Pack Enterprise Web UI



### Neo4j

* Install Neo4j

```
brew install neo4j
```

* Start Neo4j

```
brew services -v start neo4j
```

* Inspect the ports

```
cat /usr/local/var/log/neo4j.log
Remote interface available at http://localhost:7474/
```

* Connect to the web console and import the data
* The default password is 'neo4j'
* Change it to 'test'
* Copy and past the Movies data creation script to the web console and press 'play'
* Execute a query

```
MATCH (keanu {name:"Keanu Reeves"})-[:ACTED_IN]->(movies {title:"The Matrix"})<-[:ACTED_IN]-(actors) RETURN actors
```

### Redis Pub/Sub

* Open a redis-cli

```
redis-cli -h localhost -p 6379
```

* Subscribe to a channel

```
SUBSCRIBE public
```

* Open another redis-cli
* Publish a message

```
PUBLISH public Person::Keanu 
```

* Enable key space notifications via redis-cli (https://redis.io/topics/notifications)

```
CONFIG SET notify-keyspace-events KEA
```

* Run redis-cli as a subscriber

```
redis-cli --csv psubscribe '__key*__:*'
```

* Change Keanu

```
HMSET Person::Keanu changed 1
```

> BTW: Redis Modules allow to turn Redis into a Hexastore backed GraphDBS: http://redisgraph.io

* Show the windows with the csv output
