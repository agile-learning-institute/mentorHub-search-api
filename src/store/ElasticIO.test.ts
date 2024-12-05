import ElasticIO from "./ElasticIO";

describe('ElasticIO', () => {
    let elastic: ElasticIO;

    beforeEach(() => {
        elastic = new ElasticIO({"node":"http://localhost:9200"});
        elastic.connect();
    });

    afterEach(() => {
        elastic.disconnect();
    })

    test('test simple search', async () => {
        const query = { "query": { "query_string": { "query": "curriculum" } } };
        const results = await elastic.search(query);
        expect(results).toHaveProperty("hits");
        expect(results.hits).toBeInstanceOf(Object);
        expect(results.hits).toHaveProperty("hits");
        expect(results.hits.hits).toBeInstanceOf(Array);
        expect(results.hits.hits.length).toBe(1);
        expect(results.hits.hits[0]).toHaveProperty("_index");
        expect(results.hits.hits[0]._index).toBe("mentorhub");
        expect(results.hits.hits[0]).toHaveProperty("_source");
        expect(results.hits.hits[0]._source).toHaveProperty("completed");
        expect(results.hits.hits[0]._source).toHaveProperty("now");
        expect(results.hits.hits[0]._source).toHaveProperty("next");
        expect(results.hits.hits[0]._source).toHaveProperty("later");
    });

    test('test two word search', async () => {
        const query = { query: { query_string: { query: "inactive person" } } };
        const results = await elastic.search(query);
        expect(results).toHaveProperty("hits");
        expect(results.hits).toBeInstanceOf(Object);
        expect(results.hits).toHaveProperty("hits");
        expect(results.hits.hits).toBeInstanceOf(Array);
        expect(results.hits.hits.length).toBe(9);
    });

    test('test elastic query', async () => {
        const query = {query:{match:{lastName:"Smith"}}};
        const results = await elastic.search(query);
        expect(results).toHaveProperty("hits");
        expect(results.hits).toBeInstanceOf(Object);
        expect(results.hits).toHaveProperty("hits");
        expect(results.hits.hits).toBeInstanceOf(Array);
        expect(results.hits.hits.length).toBe(10);
    });
});