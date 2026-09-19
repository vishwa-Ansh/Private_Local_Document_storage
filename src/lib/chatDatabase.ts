import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

export type Chat = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type Message = {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export async function getDatabase() {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync(
    "trilok_on.db"
  );

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      chatId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (chatId)
        REFERENCES chats(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS messages_chatId_index
    ON messages(chatId);

    CREATE INDEX IF NOT EXISTS messages_createdAt_index
    ON messages(createdAt);
  `);

  return database;
}

export async function cleanupOldChats() {
  const db = await getDatabase();

  const cutoff =
    Date.now() - 30 * 24 * 60 * 60 * 1000;

  await db.runAsync(
    `
    DELETE FROM chats
    WHERE updatedAt < ?
    `,
    cutoff
  );
}

export async function createChat(title: string) {
  const db = await getDatabase();

  const id =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  const now = Date.now();

  await db.runAsync(
    `
    INSERT INTO chats
    (id, title, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
    `,
    id,
    title,
    now,
    now
  );

  return id;
}

export async function addMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string
) {
  const db = await getDatabase();

  const id =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  const now = Date.now();

  await db.runAsync(
    `
    INSERT INTO messages
    (id, chatId, role, content, createdAt)
    VALUES (?, ?, ?, ?, ?)
    `,
    id,
    chatId,
    role,
    content,
    now
  );

  await db.runAsync(
    `
    UPDATE chats
    SET updatedAt = ?
    WHERE id = ?
    `,
    now,
    chatId
  );

  return id;
}

export async function getChats() {
  const db = await getDatabase();

  return db.getAllAsync<Chat>(
    `
    SELECT *
    FROM chats
    ORDER BY updatedAt DESC
    `
  );
}

export async function getMessages(chatId: string) {
  const db = await getDatabase();

  return db.getAllAsync<Message>(
    `
    SELECT *
    FROM messages
    WHERE chatId = ?
    ORDER BY createdAt ASC
    `,
    chatId
  );
}

export async function deleteChat(chatId: string) {
  const db = await getDatabase();

  await db.runAsync(
    `
    DELETE FROM chats
    WHERE id = ?
    `,
    chatId
  );
}
export async function deleteMessage(messageId: string) {
  const db = await getDatabase();

  await db.runAsync(
    `
    DELETE FROM messages
    WHERE id = ?
    `,
    messageId
  );
}
export async function renameChat(
  chatId: string,
  title: string
) {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE chats
    SET title = ?, updatedAt = ?
    WHERE id = ?
    `,
    title,
    Date.now(),
    chatId
  );
}