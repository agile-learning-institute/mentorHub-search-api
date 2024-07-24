/**
 * This set of unit tests test config init from env
 */
import config from './Config';

describe('Config', () => {

    test('test getter for default port', () => {
        expect(config.getPort()).toBe(8081);
    });

    test('test getter for default getConfigFolder()', () => {
        expect(config.getConfigFolder()).toBe(getConfigValue( "CONFIG_FOLDER"));
    });

    test('test getter for default getConnectionString', () => {
        expect(config.getConnectionString()).toBe('{"node":"https://@mentorhub-searchdb:9200","auth":{"username":"elastic","password":"o0=eLmmQbsrdEW89a-Id"},"tls":{"ca":"","rejectUnauthorized":false}}');
        expect(getConfigValue( "CONNECTION_STRING")).toBe("secret");
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