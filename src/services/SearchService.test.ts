import { Token, decodeToken } from '@agile-learning-institute/mentorhub-ts-api-utils';
import ElasticIO from '../store/ElasticIO';
import SearchService from './SearchService';

// Mock dependencies
jest.mock('../store/ElasticIO'); 

describe('SearchService', () => {
    let mockElastic: jest.Mocked<ElasticIO>;
    let mockToken: Token;

    beforeEach(() => {
        mockToken = {"userId":"","roles":["Staff"]}
        mockElastic = new ElasticIO("") as jest.Mocked<ElasticIO>;
        mockElastic.search = jest.fn();
    });

    test('test simple search', async () => {
        const query = { search: "curriculum" };
        const expectedElasticQuery = { query: { query_string: { query: "curriculum" } } };
        mockElastic.search.mockResolvedValueOnce({ hits: {hits: []}});
        const results = await SearchService.search(query, mockToken, mockElastic);
        expect(mockElastic.search).toHaveBeenCalledWith(expectedElasticQuery);
    });

    test('test elastic query', async () => {
        const query = { query: '{ "match": { "lastName": "Smith" } }' };
        const expectedElasticQuery = { query: { match: { lastName: "Smith" } } };
        mockElastic.search.mockResolvedValueOnce({ hits: {hits: []}});
        const results = await SearchService.search(query, mockToken, mockElastic);
        expect(mockElastic.search).toHaveBeenCalledWith(expectedElasticQuery);
    });
});