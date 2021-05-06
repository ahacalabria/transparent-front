import React, {Component} from 'react';

import './Required.css';

class Required extends Component {
    render() {
        return (
            <span><i className="required">*</i> {this.props.label}</span>
        );
    }
}

export default Required;
