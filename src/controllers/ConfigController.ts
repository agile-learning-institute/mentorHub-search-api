import { Request, Response } from 'express';
import config from '../config/Config';
import Token from './Token';

export default class ConfigController {

  constructor() {
  }
  
  public getConfig = async (req: Request, res: Response) => {
    let token = new Token(req.header);
    res.json(config.withToken(token));
    res.status(200);
    console.info("GetConfig Completed");
  };
  
}
