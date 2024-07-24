import { Request, Response } from 'express';
import ElasticIO from "../store/ElasticIO";
import IndexCard from "../interfaces/IndexCard";

export default class SearchController {
    private elastic: ElasticIO;

    constructor(elastic: ElasticIO) {
      this.elastic = elastic;
    }

    public getIndexCards = async (req: Request, res: Response) => {
        let results: IndexCard[];
    
        try {
          results = await this.elastic.search(req.headers.query);
          res.json(results);
          res.status(200);
          console.info("Search Completed");
        } catch (error) {
          res.json({error: error});
          res.status(500);
          console.info("Search Failed");
        }
    }
}