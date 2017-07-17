export default {
    'Form': {
        'types': {
            className: 'string',
            style: 'object',
            grid: 'number',
            action: 'string',
            method: ['post', 'get', 'ajax', 'custom'],
            target: 'string',
            submitText: 'string',
            layout: 'string',
            labelWidth: 'number',
            useDefaultSubmitBtn: 'bool'
        },
        'default': {
            method: 'get',
            submitText: '保存',
            layout: 'stack-inline',
            useDefaultSubmitBtn: true
        }
    },
    'input': {
        'types': {
            name: 'string',
            value: 'number',
            className: 'string',
            style: 'object',
            grid: 'number',
            type: ['input', 'number', 'integer'],
            placeholder: 'string',
            label: 'string'
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
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            data: 'item',
            stick: 'bool',
            layout: 'string',
            url: 'string'
        },
        'default': {
            label: 'Undefined',
            layout: 'inline'
        }
    },
    'checkbox': {
        'types': {
            name: 'string',
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            data: 'item',
            layout: 'string',
            url: 'string'
        },
        'default': {
            label: 'Undefined',
            layout: 'inline'
        }
    },
    'switch': {
        'types': {
            name: 'string',
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            checked: 'bool',
            size: ['default', 'small'],
            checkedText: 'string',
            unCheckedText: 'string',
            layout: 'string'
        },
        'default': {
            label: 'Undefined',
            size: 'default'
        }
    },
    'textarea': {
        'types': {
            name: 'string',
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            height: 'number',
            autoHeight: 'bool',
            grid: 'number'
        },
        'default': {
            label: 'Undefined'
        }
    },
    'file': {
        'types': {
            name: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool'
        },
        'default': {
            label: 'Undefined'
        }
    },
    'select': {
        'types': {
            name: 'string',
            value: 'string',
            label: 'string',
            className: 'string',
            style: 'object',
            disabled: 'bool',
            placeholder: 'string',
            valueField: 'string',
            textField: 'string',
            sep: 'string',
            optionsTpl: 'string',
            multi: 'bool',
            hasEmptyOption: 'bool',
            choiceText: 'string',
            url: 'string',
            data: 'item'
        },
        'default': {
            label: 'Undefined',
            sep: ',',
            multi: false,
            hasEmptyOption: false,
            choiceText: '--请选择--'
        }
    },
    'datetime': {
        'types': {
            name: 'string',
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            placeholder: 'string',
            timeOnly: 'bool',
            dateOnly: 'bool',
            monthOnly: 'bool',
            yearOnly: 'bool',
            format: 'string'
        },
        'default': {
            label: 'Undefined'
        }
    },
    'daterange': {
        'types': {
            startName: 'string',
            endName: 'string',
            value: 'string',
            className: 'string',
            style: 'object',
            label: 'string',
            disabled: 'bool',
            maxRange: 'number',
            startDate: 'string',
            endDate: 'string',
            sep: 'string'
        },
        'default': {
            label: 'Undefined',
            startName: 'startDate',
            endName: 'endDate',
            sep: '~'
        }
    },
    'row': {
        'types': {
            className: 'string',
            style: 'object'
        },
        'default': {
            className: 'cm-form-inline'
        }
    },
    'button': {
        'types': {
            label: 'string',
            className: 'string',
            style: 'object',
            theme: 'string',
            icon: 'string',
            iconAlign: ['left', 'right'],
            raised: 'bool',
            flat: 'bool',
            disabled: 'bool',
            href: 'string',
            target: 'string',
            size: ['small', 'default', 'large']
        },
        'default': {
            label: 'BUTTON',
            theme: 'primary',
            size: 'default',
            iconAlign: 'left'
        }
    },
    'label': {
        'types': {
            label: 'string',
            className: 'string',
            style: 'object'
        },
        'default': {
            label: 'Undefined'
        }
    },
    'promote': {
        'types': {
            label: 'string',
            className: 'string',
            style: 'object'
        },
        'default': {
            label: 'Undefined'
        }
    }
};
