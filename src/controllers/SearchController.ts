import { Request, Response } from 'express';
import SearchService from "../services/SearchService";
import ElasticIO from '../store/ElasticIO';
import Token from './Token';

export default class SearchController {
    private elastic: ElasticIO;

    constructor(elastic: ElasticIO) {
      this.elastic = elastic;
    }

    public getIndexCards = async (req: Request, res: Response) => {
        let results = [];
    
        try {
          let token = new Token(req.header);
          results = await SearchService.search(req.query, token, this.elastic);
          res.json(results);
          res.status(200);
          console.info("Search Completed");
        } catch (error) {
          res.json({error: error});
          res.status(500);
          console.info("Search Failed", error);
        }
    }
}