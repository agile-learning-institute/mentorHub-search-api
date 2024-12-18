/**
 * Class Config: This class manages configuration values 
 *      from the environment or configuration files, 
 *      and provides all data for the /config endpoint
 */

import { existsSync, readFileSync } from "fs";
import { join } from 'path';
import Token from "../controllers/Token";

interface ConfigItem {
    name: string;
    value: string;
    from: string;
}

export  class Config {
    private static instance: Config; // Singleton 

    configItems: ConfigItem[] = [];
    apiVersion: string = "";

    // Private Properties
    #configFolder: string = "./";
    #port: number = 0;
    #connectionSettings: any = {};

    // Default connection string for locally hosted database
    #defaultConnectionString: string = '{"node":"http://localhost:9200"}'; 

    /**
     * Constructor gets configuration values, loads the enumerators, and logs completion
     */
    constructor() {
        this.initialize();
    }

    public initialize() {      
        // Initialize Values
        this.configItems = [];
        this.apiVersion = "1.2." + this.getConfigValue("BUILT_AT", "LOCAL", false);
        this.#configFolder = this.getConfigValue("CONFIG_FOLDER", "/opt/mentorhub-search-api", false);
        this.#port = parseInt(this.getConfigValue("API_PORT", "8081", false));
        this.#connectionSettings = JSON.parse(this.getConfigValue("CONNECTION_STRING", this.#defaultConnectionString, true));

        // Initialize Config values that only used by the UI
        this.getConfigValue("PERSON_HOST", "localhost:8083", false);
        this.getConfigValue("PARTNER_HOST", "localhost:8085", false);
        this.getConfigValue("TOPIC_HOST", "localhost:8087", false);
        this.getConfigValue("CURRICULUM_HOST", "localhost:8089", false);
        this.getConfigValue("ENCOUNTER_HOST", "localhost:8091", false);

        console.info("Configuration Initialized:", JSON.stringify(this.configItems));
    }

    /**
     * Get the named configuration value, from the environment if available, 
     * then from a file if present, and finally use the provided default if not 
     * found. This will add a ConfigItem that describes where this data was found
     * to the configItems array. Secret values are not recorded in the configItem.
     * 
     * @param name 
     * @param defaultValue 
     * @param isSecret 
     * @returns the value that was found.
     */
    private getConfigValue(name: string, defaultValue: string, isSecret: boolean): string {
        let value = process.env[name] || defaultValue;
        let from = 'default';

        if (process.env[name]) {
            from = 'environment';
        } else {
            const filePath = join(this.#configFolder, name);
            if (existsSync(filePath)) {
                value = readFileSync(filePath, 'utf-8').trim();
                from = 'file';
            }
        }

        this.configItems.push({ 
            name: name, 
            value: isSecret ? "secret" : value, 
            from: from 
        });
        return value;
    }

    /**
     * Singleton Constructor
     */
    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    /** 
     * Simple Getters
     */
    public getPort(): Number {
        return this.#port;
    }

    public getConfigFolder(): string {
        return this.#configFolder;
    }

    public getConnectionSettings(): any {
        return this.#connectionSettings;
    }

    public withToken(token: Token): any {
        return {
            ...this,
            token,
        };    
    }
}

// Create a singleton instance of Config and export it
const config = Config.getInstance();
export default config;