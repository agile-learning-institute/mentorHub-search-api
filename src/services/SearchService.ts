import config from "../config/Config";
import Token from "../controllers/Token";
import ElasticIO from "../store/ElasticIO";

export default class SearchService {
    constructor() {}

    public static async search(query: any, token: Token, elastic: ElasticIO): Promise<any[]> {
        let result: any = { hits: { hits: [] } };

        // Check for "query" key - an elasticSearch Query object
        if (query["query"]) {
            const elasticQuery = { query: JSON.parse(query["query"]) };
            result = await elastic.search(elasticQuery);

        // Check for "search" key - a full-text search value
        } else if (query["search"]) {
            const elasticQuery = { query: { query_string: { query: query["search"] } } };
            result = await elastic.search(elasticQuery);

        // Throw error if neither key is present
        } else {
            throw new Error("Missing required parameter: 'query' or 'search' must be provided.");
        }

        return result.hits.hits;
    }
}