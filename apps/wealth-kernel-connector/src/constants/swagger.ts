export const SWAGGER = {
  QUERY_STRING: {
    TENANT_ID: {
      type: 'string',
      name: 'tenantId',
      description: `Bambu's tenant id.`,
      required: true,
    },
    IDEMPOTENCY_KEY: {
      type: 'string',
      name: 'idempotencyKey',
      description: 'The idempotency key to ensure idempotent requests.',
      required: false,
    },
  },
};
