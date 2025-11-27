import { Filter, OptionalId, UpdateFilter } from 'mongodb';
import { getCollection } from './mongodb';

/**
 * Generic CRUD operations for MongoDB collections
 */

/**
 * Find documents in a collection
 */
export async function findDocuments<T extends Document>(
  collectionName: string,
  filter: Filter<T> = {},
  options: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  } = {}
) {
  const collection = await getCollection<T>(collectionName);
  const { limit = 100, skip = 0, sort } = options;

  const cursor = collection.find(filter).skip(skip).limit(limit);

  if (sort) {
    cursor.sort(sort);
  }

  return cursor.toArray();
}

/**
 * Find one document in a collection
 */
export async function findOneDocument<T extends Document>(
  collectionName: string,
  filter: Filter<T>
) {
  const collection = await getCollection<T>(collectionName);
  return collection.findOne(filter);
}

/**
 * Insert a document into a collection
 */
export async function insertDocument<T extends Document>(
  collectionName: string,
  document: OptionalId<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertOne(document as OptionalId<T>);
  return result;
}

/**
 * Insert multiple documents into a collection
 */
export async function insertDocuments<T extends Document>(
  collectionName: string,
  documents: OptionalId<T>[]
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertMany(documents as OptionalId<T>[]);
  return result;
}

/**
 * Update a document in a collection
 */
export async function updateDocument<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: UpdateFilter<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.updateOne(filter, update);
  return result;
}

/**
 * Update multiple documents in a collection
 */
export async function updateDocuments<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: UpdateFilter<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.updateMany(filter, update);
  return result;
}

/**
 * Delete a document from a collection
 */
export async function deleteDocument<T extends Document>(
  collectionName: string,
  filter: Filter<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteOne(filter);
  return result;
}

/**
 * Delete multiple documents from a collection
 */
export async function deleteDocuments<T extends Document>(
  collectionName: string,
  filter: Filter<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteMany(filter);
  return result;
}

/**
 * Count documents in a collection
 */
export async function countDocuments<T extends Document>(
  collectionName: string,
  filter: Filter<T> = {}
) {
  const collection = await getCollection<T>(collectionName);
  return collection.countDocuments(filter);
}

/**
 * Check if a document exists
 */
export async function documentExists<T extends Document>(
  collectionName: string,
  filter: Filter<T>
) {
  const count = await countDocuments(collectionName, filter);
  return count > 0;
}
