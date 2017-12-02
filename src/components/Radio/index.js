/**
 * @author cqb 2016-04-27.
 * @module Radio
 */

import CheckBox from '../CheckBox/index';
import './Radio.less';

class Radio extends CheckBox {
    static displayName = 'Radio';

    static defaultProps = {
        value: '',
        checked: false,
        type: 'radio',
        className: 'cm-radio'
    };

    render () {
        return super.render();
    }
}

export default Radio;
