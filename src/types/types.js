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
            labelWidth: 'number',
            useDefaultSubmitBtn: 'bool'
        },
        'default': {
            method: 'get',
            submitText: '保存',
            layout: 'inline',
            useDefaultSubmitBtn: true
        }
    },
    'input': {
        'types': {
            className: 'string',
            style: 'object',
            grid: 'number',
            type: ["input","number","integer"],
            placeholder: 'string',
            label: 'string',
        },
        'default': {
            type: 'text',
            label: 'Undefined'
        }
    },
    'inputnumber': {
        'types': {
            name: 'string',
            value: 'number',
            className: 'string',
            style: 'object',
            min: 'number',
            max: 'number',
            step: 'number',
            label: 'string',
            disabled: 'bool'
        },
        'default': {
            min: 0,
            max: 100,
            step: 1,
            label: 'Undefined'
        }
    },
    'radio': {
        'types': {
            name: 'string',
            value: 'number',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            data: 'item'
        },
        'default': {
            label: 'Undefined'
        }
    }
}
