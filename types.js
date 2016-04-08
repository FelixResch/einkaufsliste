
module.exports = {
    user : {
        fields: [
            {
                name: 'username',
                required: true
            },
            {
                name: 'email',
                required: true,
                type: 'email'
            },
            {
                name: 'role',
                required: true
            },
            {
                name: 'password',
                required: true
            },
            {
                name: 'display'
            },
            {
                name: 'phone'
            },
            {
                name: '_id'
            }
        ],
        strict: true
    },
    product: {
        fields: [
            {
                name: 'display',
                required: true
            },
            {
                name: 'ean13',
                required: true
            },
            {
                name: 'lastPrice'
            },
            {
                name: '_id'
            }
        ],
        strict: true
    },
    list: {
        fields: [
            {
                name: 'current',
                required: true
            },
            {
                name: 'timestamp',
                required: true,
                type: 'timestamp'
            },
            {
                name: 'items',
                type: 'array',
                itemType: {
                    fields: [
                        {
                            name: '_id',
                            required: true
                        },
                        {
                            name: 'added',
                            required: true,
                            type: 'timestamp'
                        },
                        {
                            name: 'display',
                            required: true
                        },
                        {
                            name: 'amount',
                            required: true
                        },
                        {
                            name: 'state'
                        }
                    ],
                    strict: true
                }
            },
            {
                name: '_id'
            }
        ],
        strict: true
    }
};