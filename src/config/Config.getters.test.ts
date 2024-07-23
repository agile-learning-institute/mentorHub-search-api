/**
 * This set of unit tests test config init from env
 */
import config from './Config';

describe('Config', () => {

    test('test getter for default port', () => {
        expect(config.getPort()).toBe(8084);
    });

    test('test getter for default timeout', () => {
        expect(config.getTimeout()).toBe(10);
    });

    test('test getter for default getConfigFolder()', () => {
        expect(config.getConfigFolder()).toBe(getConfigValue( "CONFIG_FOLDER"));
    });

    test('test getter for default getConnectionString', () => {
        expect(config.getConnectionString()).toBe("mongodb://root:example@localhost:27017");
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