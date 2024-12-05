import SearchController from './SearchController';
import { Request, Response } from 'express';
import SearchService from "../services/SearchService";
import ElasticIO from '../store/ElasticIO';
import Token from './Token';

// Mock dependencies
jest.mock('../store/ElasticIO'); 
jest.mock('../services/SearchService');

const mockRequest = (options = {}): Partial<Request> => ({
  ...options,
  query: {}, // Default query object
  header: jest.fn(), // Mock header method
});

const mockResponse = (): Partial<Response> & { json: jest.Mock } => {
  const res: any = {};
  res.json = jest.fn().mockReturnThis();
  res.status = jest.fn().mockReturnThis();
  return res as Partial<Response> & { json: jest.Mock };
};

describe('SearchController', () => {
  let searchController: SearchController;
  let mockElastic: ElasticIO;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockElastic = new ElasticIO();
    searchController = new SearchController(mockElastic);
    req = mockRequest();
    res = mockResponse();
    (SearchService.search as jest.Mock).mockResolvedValue([{ id: 1, name: "Test Card" }]);
  });

  test('getIndexCards should return results and set status 200', async () => {
    await searchController.getIndexCards(req as Request, res as Response);

    expect(SearchService.search).toHaveBeenCalledWith(req.query, expect.any(Token), mockElastic);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Test Card" }]);
  });

  test('getIndexCards should handle errors and set status 500', async () => {
    // Mock SearchService.search to throw an error
    (SearchService.search as jest.Mock).mockRejectedValue(new Error("Search error"));

    await searchController.getIndexCards(req as Request, res as Response);

    // Assert that the error was handled and status 500 was set
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: new Error("Search error") });
  });
});