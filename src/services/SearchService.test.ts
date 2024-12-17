import Token from '../controllers/Token';
import ElasticIO from '../store/ElasticIO';
import SearchService from './SearchService';

// Mock dependencies
jest.mock('../store/ElasticIO'); 
jest.mock('../controllers/Token');

describe('SearchService', () => {
    let mockElastic: jest.Mocked<ElasticIO>;
    let mockToken: jest.Mocked<Token>;

    beforeEach(() => {
        mockElastic = new ElasticIO("") as jest.Mocked<ElasticIO>;
        mockElastic.search = jest.fn();
        const mockHeader = jest.fn((name: string) => undefined); 
        mockToken = new Token(mockHeader) as jest.Mocked<Token>;
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