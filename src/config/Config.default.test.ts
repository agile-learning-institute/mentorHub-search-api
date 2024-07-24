/**
 * This set of unit tests test config init from env
 */
import config from './Config';

describe('Config', () => {

    test('test getPort', () => {
        config.initialize();
        expect(config.getPort()).toEqual(8081);
    });

    test('test getConfigFolder', () => {
        config.initialize();
        expect(config.getConfigFolder()).toBe("/opt/mentorhub-search-api");
    });    

    test('test BUILT_AT', () => {
        testConfigDefaultValue("BUILT_AT","LOCAL");
    });

    test('test CONFIG_FOLDER', () => {
        testConfigDefaultValue("CONFIG_FOLDER", "/opt/mentorhub-search-api");
    });

    test('test PERSON_HOST', () => {
        testConfigDefaultValue("PERSON_HOST","localhost:8083");
    });

    test('test PARTNER_HOST', () => {
        testConfigDefaultValue("PARTNER_HOST","localhost:8085");
    });

    test('test TOPIC_HOST', () => {
        testConfigDefaultValue("TOPIC_HOST","localhost:8087");
    });

    test('test CURRICULUM_HOST', () => {
        testConfigDefaultValue("CURRICULUM_HOST","localhost:8089");
    });

    test('test ENCOUNTER_HOST', () => {
        testConfigDefaultValue("ENCOUNTER_HOST","localhost:8091");
    });

    function testConfigDefaultValue(configName: string, expectedValue: string) {
        config.initialize();

        const items = config.configItems;

        const item = items.find(i => i.name === configName);
        expect(item).toBeDefined();
        if (item) {
            expect(item.name).toBe(configName);
            expect(item.from).toBe("default");
            expect(item.value).toBe(expectedValue);
        }
    }

});