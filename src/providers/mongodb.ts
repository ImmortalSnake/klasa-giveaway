/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Provider, util, ProviderStore } from 'klasa';
import { mongoOptions } from '../config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MongoClient } = require('mongodb');

export default class extends Provider {

    public db: any;

    public constructor(store: ProviderStore, file: string[], directory: string) {
        super(store, file, directory);
        this.db = {};
    }

    public async init(): Promise<void> {
        const mongoClient = await MongoClient.connect(mongoOptions.uri,
            util.mergeObjects(mongoOptions.options, { useNewUrlParser: true })
        );
        this.db = mongoClient.db('minecraft');
    }

    /* Table methods */

    public get exec(): any {
        return this.db;
    }

    public hasTable(table: string) {
        return this.db
            .listCollections()
            .toArray()
            .then((collections: any) => collections.some((col: any) => col.name === table));
    }

    public createTable(table: string) {
        return this.db.createCollection(table);
    }

    public deleteTable(table: string) {
        return this.db.dropCollection(table);
    }

    /* Document methods */

    public getAll(table: string, filter = []) {
        if (filter.length) {
            return this.db
                .collection(table)
                .find({ id: { $in: filter } }, { _id: 0 })
                .toArray();
        }
        return this.db
            .collection(table)
            .find({}, { _id: 0 })
            .toArray();
    }

    public getKeys(table: string) {
        return this.db
            .collection(table)
            .find({}, { id: 1, _id: 0 })
            .toArray();
    }

    public get(table: string, id: string) {
        return this.db.collection(table).findOne(resolveQuery(id));
    }

    public has(table: string, id: string) {
        return this.get(table, id).then(Boolean);
    }

    public getRandom(table: string) {
        return this.db.collection(table).aggregate({ $sample: { size: 1 } });
    }

    public create(table: string, id: string, doc = {}) {
        return this.db
            .collection(table)
            .insertOne(util.mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
    }

    public delete(table: string, id: string) {
        return this.db.collection(table).deleteOne(resolveQuery(id));
    }

    public update(table: string, id: string, doc = {}) {
        return this.db.collection(table).updateOne(resolveQuery(id), {
            $set: util.isObject(doc) ? flatten(doc) : parseEngineInput(doc)
        });
    }

    public replace(table: string, id: string, doc = {}) {
        return this.db
            .collection(table)
            .replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
    }

}

const resolveQuery = (query: any): any => util.isObject(query) ? query : { id: query };

function flatten(obj: object, path = ''): any {
    let output: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (util.isObject(value)) {
            output = Object.assign(
                output,
                flatten(value, path ? `${path}.${key}` : key)
            );
        } else { output[path ? `${path}.${key}` : key] = value; }
    }
    return output;
}

function parseEngineInput(updated: any): any {
    return Object.assign(
        {},
        ...updated.map((entry: any) => ({ [entry.data[0]]: entry.data[1] }))
    );
}
