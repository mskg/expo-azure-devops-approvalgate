import DynamoDB, { DocumentClient, TableName } from 'aws-sdk/clients/dynamodb';

export class BuildStore {
    private client: DynamoDB.DocumentClient;

    constructor(
        serviceConfigOptions: DynamoDB.Types.ClientConfiguration,
        private tableOptions: {
            tableName: TableName,
            ttl: number,
        },
    ) {
        this.client = new DocumentClient(serviceConfigOptions);
    }

    public async set(
        id: string,
        data: string,
        options?: { ttl?: number },
    ) {
        console.log('[BuildStore] set', id, data, options);

        const params = {
            ...this.tableOptions,
            ...options || {},
        };

        const item =
            params.ttl !== 0
                ? {
                    id,
                    data,
                    ttl: params.ttl,
                }
                : {
                    id,
                    data,
                };

        await this.client
            .put({
                TableName: params.tableName,
                Item: item,
            })
            .promise();
    }

    public async delete(id: string): Promise<boolean | void> {
        console.log('[BuildStore] delete', id);

        await this.client.delete({
            TableName: this.tableOptions.tableName,
            Key: { id },

        }).promise();
    }

    public async get(id: string): Promise<string | undefined> {
        console.log('[BuildStore] get', id);

        const reply = await this.client
            .query({
                TableName: this.tableOptions.tableName,
                KeyConditionExpression: '#id = :value',
                ExpressionAttributeNames: {
                    '#id': 'id',
                },
                ExpressionAttributeValues: {
                    ':value': id,
                },
            })
            .promise();

        // console.log(reply);
        // reply is null if key is not found
        if (
            reply &&
            reply.Items &&
            reply.Items[0]
        ) {
            const item = reply.Items[0];

            // compare ttl
            if (item.ttl && item.ttl < Math.floor(Date.now() / 1000)) {
                console.log('[BuildStore] item', id, 'was expired.');
                return undefined;
            }

            return item.data;
        }

        return;
    }
}
