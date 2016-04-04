
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
            }
        ],
        strict: true
    }
};