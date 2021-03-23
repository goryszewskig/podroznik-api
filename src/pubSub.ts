import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres';

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.DATABASE_URL ? true : false
});

client.connect();

const pubSub = new PostgresPubSub({ client });

export default pubSub;
