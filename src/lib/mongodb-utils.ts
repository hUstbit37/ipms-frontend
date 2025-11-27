import { Filter, OptionalId, OptionalUnlessRequiredId, UpdateFilter, ObjectId } from 'mongodb';
import { getCollection } from './mongodb';

/**
 * Generic CRUD operations for MongoDB collections
 */

/**
 * Get a single document by ID
 */
export async function getDocument<T extends Document>(
  collectionName: string,
  id: string
) {
  const collection = await getCollection<T>(collectionName);
  return collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
}

/**
 * Update a document by ID
 */
export async function updateDocumentById<T extends Document>(
  collectionName: string,
  id: string,
  update: Partial<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as Filter<T>,
    { $set: update } as UpdateFilter<T>,
    { returnDocument: 'after' }
  );
  return result;
}

/**
 * Delete a document by ID
 */
export async function deleteDocumentById<T extends Document>(
  collectionName: string,
  id: string
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) } as Filter<T>);
  return result.deletedCount > 0;
}

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
  document: OptionalUnlessRequiredId<T>
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertOne(document);
  return result;
}

/**
 * Insert multiple documents into a collection
 */
export async function insertDocuments<T extends Document>(
  collectionName: string,
  documents: OptionalUnlessRequiredId<T>[]
) {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertMany(documents);
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
