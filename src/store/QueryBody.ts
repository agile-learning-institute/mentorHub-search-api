class QueryBody
{
    query: {
        prefix: {
            [key: string]: string | number | undefined;
        };
    };
    size: number;
    from: number;

    constructor(queryString: string, size: number, from: number)
    {
        this.query = {
            prefix: {
                name: `${queryString}`,
            }
        };
        this.size = size;
        this.from = from;
    }
}

export default QueryBody;