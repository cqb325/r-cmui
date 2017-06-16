export default {
    'Form': {
        'types': {
            className: 'string',
            style: 'object',
            grid: 'number',
            action: 'string',
            method: ["post","get","ajax","custom"],
            target: 'string',
            submitText: 'string',
            layout: 'string',
            useDefaultSubmitBtn: 'bool'
        },
        'default': {
            method: 'get',
            submitText: '保存',
            layout: 'inline',
            useDefaultSubmitBtn: true
        }
    }
}
