/**
 * This set of unit tests test config init from env
 */
import Token from '../controllers/Token';
import config from './Config';
import { Request } from 'express';

const mockRequest = (): Partial<Request> => ({
    header: jest.fn(), 
});

describe('Config', () => {

    test('test getter for default port', () => {
        expect(config.getPort()).toBe(8081);
    });

    test('test getter for default getConfigFolder()', () => {
        expect(config.getConfigFolder()).toBe(getConfigValue( "CONFIG_FOLDER"));
    });

    test('test getter for default getConnectionSettings', () => {
        expect(config.getConnectionSettings()).toStrictEqual({"node":"https://@mentorhub-searchdb:9200"});
        expect(getConfigValue( "CONNECTION_STRING")).toBe("secret");
    });

    test('test withToken', () => {
        const req = mockRequest();
        const token = new Token(req.header as any);
        const withToken = config.withToken(token);
        expect(withToken).toHaveProperty("configItems");
        expect(withToken).toHaveProperty("apiVersion");
        expect(withToken).toHaveProperty("token");
        expect(withToken.token.user_id).toBe("AAAA00000000000000000000");
    });

    // Function to lookup a config value from the configItems list
    function getConfigValue(configItemName: string): string {
        const items = config.configItems;

        const item = items.find(i => i.name === configItemName);
        expect(item).toBeDefined();
        if (item) {
            return item.value;
        } else {
            return "";
        }
    }
});