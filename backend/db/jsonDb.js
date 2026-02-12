/**
 * jsonDb.js - Lightweight JSON file database for StackBlitz WebContainer compatibility
 * Mimics Mongoose API so controllers need minimal changes.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'data.json');

// --- Core Database ---
let db = { users: [], products: [], carts: [] };

function loadDb() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const raw = fs.readFileSync(DB_PATH, 'utf-8');
            db = JSON.parse(raw);
        }
    } catch (e) {
        console.warn('jsonDb: Could not load data.json, starting fresh.', e.message);
        db = { users: [], products: [], carts: [] };
    }
}

function saveDb() {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (e) {
        console.warn('jsonDb: Could not save data.json', e.message);
    }
}

// Load on startup
loadDb();

// --- Helpers ---
function generateId() {
    return crypto.randomBytes(12).toString('hex'); // 24 char hex like MongoDB ObjectId
}

function now() {
    return new Date().toISOString();
}

// Deep clone to avoid mutation
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// --- Query Engine (simple subset) ---

/**
 * Creates a Mongoose-like Model for a given collection name.
 */
function createModel(collectionName) {
    function getCollection() {
        if (!db[collectionName]) db[collectionName] = [];
        return db[collectionName];
    }

    // Build a document instance from raw data
    function wrapDocument(data) {
        const doc = clone(data);
        doc.save = async function () {
            const col = getCollection();
            const idx = col.findIndex(item => item._id === doc._id);
            doc.updatedAt = now();
            if (idx > -1) {
                col[idx] = stripMethods(doc);
            } else {
                doc.createdAt = doc.createdAt || now();
                col.push(stripMethods(doc));
            }
            saveDb();
            // Re-wrap for further saves
            Object.assign(this, clone(stripMethods(doc)));
            return this;
        };
        doc.toString = function () { return doc._id; };
        return doc;
    }

    function stripMethods(doc) {
        const plain = {};
        for (const key of Object.keys(doc)) {
            if (typeof doc[key] !== 'function') {
                plain[key] = doc[key];
            }
        }
        return plain;
    }

    function matchesQuery(item, query) {
        for (const key of Object.keys(query)) {
            if (String(item[key]) !== String(query[key])) return false;
        }
        return true;
    }

    // Populate helper: replace an ID field with the full document from another collection
    function populateField(doc, populatePath) {
        // Handle nested paths like 'items.productId'
        const parts = populatePath.split('.');
        if (parts.length === 2) {
            const [arrayField, refField] = parts;
            if (Array.isArray(doc[arrayField])) {
                doc[arrayField] = doc[arrayField].map(item => {
                    const refId = item[refField];
                    if (refId && typeof refId === 'string') {
                        // Look up in products collection
                        const refDoc = (db.products || []).find(p => p._id === refId);
                        if (refDoc) {
                            item[refField] = clone(refDoc);
                        }
                    }
                    return item;
                });
            }
        } else if (parts.length === 1) {
            const refId = doc[populatePath];
            if (refId && typeof refId === 'string') {
                // Try to find in all collections
                for (const colName of Object.keys(db)) {
                    const found = db[colName].find(d => d._id === refId);
                    if (found) {
                        doc[populatePath] = clone(found);
                        break;
                    }
                }
            }
        }
        return doc;
    }

    // --- Chainable Query Builder ---
    function createQuery(resultPromise) {
        let populatePaths = [];
        const query = {
            populate(pathStr) {
                populatePaths.push(pathStr);
                return query;
            },
            then(resolve, reject) {
                return resultPromise
                    .then(result => {
                        if (result && populatePaths.length > 0) {
                            if (Array.isArray(result)) {
                                result = result.map(doc => {
                                    for (const p of populatePaths) populateField(doc, p);
                                    return doc;
                                });
                            } else {
                                for (const p of populatePaths) populateField(result, p);
                            }
                        }
                        return result;
                    })
                    .then(resolve, reject);
            },
            catch(reject) {
                return query.then(undefined, reject);
            }
        };
        return query;
    }

    // --- Model API ---
    const Model = function (data) {
        const doc = wrapDocument({
            _id: generateId(),
            ...data,
            createdAt: now(),
            updatedAt: now()
        });
        return doc;
    };

    Model.find = function (query = {}) {
        return createQuery(
            Promise.resolve(
                getCollection()
                    .filter(item => matchesQuery(item, query))
                    .map(item => wrapDocument(item))
            )
        );
    };

    Model.findOne = function (query = {}) {
        return createQuery(
            Promise.resolve((() => {
                const found = getCollection().find(item => matchesQuery(item, query));
                return found ? wrapDocument(found) : null;
            })())
        );
    };

    Model.findById = function (id) {
        return createQuery(
            Promise.resolve((() => {
                const found = getCollection().find(item => item._id === id);
                return found ? wrapDocument(found) : null;
            })())
        );
    };

    Model.deleteMany = async function (query = {}) {
        const col = getCollection();
        if (Object.keys(query).length === 0) {
            db[collectionName] = [];
        } else {
            db[collectionName] = col.filter(item => !matchesQuery(item, query));
        }
        saveDb();
        return { deletedCount: col.length - getCollection().length };
    };

    Model.insertMany = async function (docs) {
        const col = getCollection();
        const inserted = docs.map(d => ({
            _id: generateId(),
            ...d,
            createdAt: now(),
            updatedAt: now()
        }));
        col.push(...inserted);
        saveDb();
        return inserted;
    };

    Model.countDocuments = async function (query = {}) {
        return getCollection().filter(item => matchesQuery(item, query)).length;
    };

    Model.modelName = collectionName;

    return Model;
}

// --- Exports ---
module.exports = {
    createModel,
    getDb: () => db,
    loadDb,
    saveDb,
    generateId
};
