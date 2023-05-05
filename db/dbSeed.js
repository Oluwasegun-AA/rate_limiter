import { v4 as uuidv4 } from 'uuid';

import { Password } from '../helpers';
import query from './dbSetup';

const seedDb = async () => {
  const userId = uuidv4();
  const dropTables = 'DROP TABLE IF EXISTS "Users", "Mails" CASCADE;';
  const userTable = `CREATE TABLE IF NOT EXISTS "Users"(
        id uuid PRIMARY KEY NOT NULL UNIQUE,
        username varchar(255) NOT NULL UNIQUE,
        "firstName" varchar(255),
        "lastName" varchar(255),
        email varchar(255),
        password varchar(255) NOT NULL,
        "rateLimit" integer NOT NULL DEFAULT '10');`;
  const mailTable = `CREATE TABLE IF NOT EXISTS "Mails"(
        id uuid PRIMARY KEY NOT NULL UNIQUE,
        body varchar NOT NULL,
        subject varchar NOT NULL,
        "author" uuid NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NULL);
      ALTER TABLE "Mails" ADD CONSTRAINT "FK_ba16b7fcf16a986fcfdc67d74e2" FOREIGN KEY ("author") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`;

  const createUser = `INSERT INTO "Users" (id, username, email, "firstName", "lastName", password, "rateLimit")
      VALUES ('${userId}', 'segun', 'oluwasegunadepoju.gmail.com', 'test', 'user', '${Password.encrypt('password')}', '10');`;

  const createMails = `INSERT INTO "Mails" (id, subject, body, author)
      VALUES ('${uuidv4()}', 'hello', 'This is a test message', '${userId}')`;

  const initializeTables =
    dropTables +
    userTable +
    mailTable +
    createUser +
    createMails

  await query(initializeTables);
};

const initializeDb = async () => {
  try {
    await seedDb();
  } catch (err) {
    process.stdout.write(`error: ${err}\n`);
  }
  process.stdout.write('All Tables created successfully!\n');
};

initializeDb();
