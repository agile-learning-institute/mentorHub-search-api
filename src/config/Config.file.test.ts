/**
 * This set of unit tests test config init from files
 * and uses the files in /test/configTest
 */
import config from './Config';

describe('Config', () => {

    // Clear all mocks before each test
    beforeEach(() => {
        process.env.CONFIG_FOLDER = "./test/configTest"
        config.initialize();
        process.env.CONFIG_FOLDER = "";
    });

    test('test PORT', () => {
        testConfigFileValue("API_PORT");
    });

    test('test CONNECTION_STRING', () => {
        testConfigFileValue("CONNECTION_STRING", true);
    });

    test('test PERSON_HOST', () => {
        testConfigFileValue("PERSON_HOST");
    });

    test('test PARTNER_HOST', () => {
        testConfigFileValue("PARTNER_HOST");
    });

    test('test TOPIC_HOST', () => {
        testConfigFileValue("TOPIC_HOST");
    });

    test('test CURRICULUM_HOST', () => {
        testConfigFileValue("CURRICULUM_HOST");
    });

    test('test ENCOUNTER_HOST', () => {
        testConfigFileValue("ENCOUNTER_HOST");
    });

    // Test that a file based config value is used
    // Depends on the contents of ../../test/configTest
    function testConfigFileValue(configName: string, secret: boolean = false) {
        const items = config.configItems;

        const item = items.find(i => i.name === configName);
        expect(item).toBeDefined();
        if (item) {
            expect(item.name).toBe(configName);
            expect(item.from).toBe("file");
            if (secret) {
                expect(item.value).toBe("secret");
            } else {
                expect(item.value).toBe("TEST_VALUE");
            }
        }
    }
});