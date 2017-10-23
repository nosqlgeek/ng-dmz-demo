# Date Modeling Zone Demo

## Intro

The content here was created for the Data Modeling Zone event in 2017. The topic was 'NoSQL in the scope of Microservices and Polyglot Persistence'

## Purpose

The purpose of the demo is to show how different the fundamental data models (not the logical ones) of NoSQL databases are looking like.

* KV-Stores: Simplicity of the data model which allows 'high scalability'
* Graph DBS: More complex underlying model with focus on efficient traversal
* Pub-Sub: Give an example for exchanging data between services

## Idea

* Actor Profiles: This represents a User Profile Store. Redis will be used as a simple KV-Store (or Data Structure Store) by focusing on the storage and the retrieval of actor profiles.
* Movies Network: The network contains the information which movie is related to which other one and to which actor.
* Pub-Sub: If someone likes a Movie then the relevance of an actor will be increased as well.

Neo4j's 'Movies' demo data will be used.
