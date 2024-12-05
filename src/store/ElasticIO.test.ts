import ElasticIO from "./ElasticIO";

describe('ElasticIO', () => {
    let elastic: ElasticIO;

    beforeEach(() => {
        elastic = new ElasticIO();
        elastic.connect();
    });

    afterEach(() => {
        elastic.disconnect();
    })

    test('test simple search', async () => {
        const query = { query: { query_string: { query: "curriculum" } } };
        const results = await elastic.search(query);
        expect(results).toHaveProperty("hits");
        expect(results.hits).toBeInstanceOf(Object);
        expect(results.hits).toHaveProperty("hits");
        expect(results.hits.hits).toBeInstanceOf(Array);
        expect(results.hits.hits.length).toBe(1);
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
        const query = { query: { match: { lastName: "Smith" } } };
        const results = await elastic.search(query);
        expect(results).toHaveProperty("hits");
        expect(results.hits).toBeInstanceOf(Object);
        expect(results.hits).toHaveProperty("hits");
        expect(results.hits.hits).toBeInstanceOf(Array);
        expect(results.hits.hits.length).toBe(10);
    });
});