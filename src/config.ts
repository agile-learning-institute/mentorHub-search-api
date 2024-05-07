import fs from "fs";
import env from "../util/validateEnv";
interface ConfigItem
{
    name: string;
    value: string;
    from: string;
}

export default class Config
{
    configItems: ConfigItem[] = [];
    patch: string = " ";
    configFolder: string = " ";
    connectionString: string = " ";
    databaseName: string = " ";
    port: string = " ";
    ApiVersion: string = " ";
    databaseTimeout: number = 0;

    //DEFAULTS
    private static readonly versionMajor: string = "2";
    private static readonly versionMinor: string = "0";
    private static readonly defaultConfigFolder: string = "./";
    private static readonly defaultConnectionString: string = env.CONNECTION_STRING;
    private static readonly defaultDatabaseName: string = "N/A";
    private static readonly defaultPort: string = "8081";
    private static readonly defaultTimeout: number = 10;

    constructor()
    {
        this.patch = this.findStringValue("PATCH_LEVEL", "LocalDev", false);
        this.configFolder = this.findStringValue("CONFIG_FOLDER", Config.defaultConfigFolder, false);
        this.connectionString = this.findStringValue("CONNECTION_STRING", Config.defaultConnectionString, true);
        this.databaseName = this.findStringValue("DATABASE_NAME", Config.defaultDatabaseName, false);
        this.databaseTimeout = this.findIntValue("CONNECTION_TIMEOUT", Config.defaultTimeout, false);
        this.port = this.findStringValue("PORT", Config.defaultPort, false);
        this.ApiVersion = Config.versionMajor + "." + Config.versionMinor + "." + this.patch;
    }

    private findStringValue(key: string, defaultValue: string, secret: boolean): string
    {
        let theValue: string = defaultValue;
        let from: string = "default";
        const fileValue: string = this.fileValue(key);

        if (fileValue !== "") {
            theValue = fileValue;
            from = "file";
        }

        const envValue: string | undefined = process.env[key];
        if (envValue !== undefined) {
            theValue = envValue;
            from = "environment";
        }

        const theItem: ConfigItem = { name: key, from, value: secret ? "Secret" : theValue };
        this.configItems.push(theItem);

        return theValue;
    }

    private findIntValue(key: string, defaultValue: number, secret: boolean): number
    {
        const theValue: string = this.findStringValue(key, defaultValue.toString(), secret);
        return parseInt(theValue);
    }
    private fileValue(key: string): string
    {
        const theFile: string = this.configFolder + key;

        try {
            const fileContent: string = fs.readFileSync(theFile, { encoding: 'utf8', flag: 'r' });
            return fileContent;
        } catch (error) {
            return "";
        }
    }

    public getPort(): string
    {
        return this.port;
    }
}

