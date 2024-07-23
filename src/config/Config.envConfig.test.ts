/**
 * This set of unit tests test config init from env
 */
import config from './Config';

describe('Config', () => {

    test('test BUILT_AT', () => {
        testConfigEnvironmentValue("BUILT_AT");
    });

    test('test CONFIG_FOLDER', () => {
        testConfigEnvironmentValue("CONFIG_FOLDER");
    });

    test('test PORT', () => {
        testConfigEnvironmentValue("PORT");
    });

    test('test TIMEOUT', () => {
        testConfigEnvironmentValue("TIMEOUT");
    });

    test('test CONNECTION_STRING', () => {
        testConfigEnvironmentValue("CONNECTION_STRING", true);
    });

    test('test PERSON_HOST', () => {
        testConfigEnvironmentValue("PERSON_HOST");
    });

    test('test PARTNER_HOST', () => {
        testConfigEnvironmentValue("PARTNER_HOST");
    });

    test('test TOPIC_HOST', () => {
        testConfigEnvironmentValue("TOPIC_HOST");
    });

    test('test CURRICULUM_HOST', () => {
        testConfigEnvironmentValue("CURRICULUM_HOST");
    });

    test('test ENCOUNTER_HOST', () => {
        testConfigEnvironmentValue("ENCOUNTER_HOST");
    });

    // Test that a configuration value was properly loaded from an environment variable
    function testConfigEnvironmentValue(configName: string, secret: boolean = false) {
        process.env[configName] = "ENVIRONMENT";
        config.initialize();
        process.env[configName] = "";

        const items = config.configItems;

        const item = items.find(i => i.name === configName);
        expect(item).toBeDefined();
        if (item) {
            expect(item.name).toBe(configName);
            expect(item.from).toBe("environment");
            if (secret) {
                expect(item.value).toBe("secret");
            } else {
                expect(item.value).toBe("ENVIRONMENT");
            }
        }
    }

});