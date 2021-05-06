import React, {Component} from 'react';
import RLoader from 'react-loader';

import './Loader.css';


class Loader extends Component {

    componentDidMount() {
        // if(this.props.isLoading) document.body.classList.add("disable-scroll")
        // else document.body.classList.remove("disable-scroll")
    }

    render() {
    var options = {
        lines: 13,
        length: 20,
        width: 10,
        radius: 30,
        scale: 1.00,
        corners: 1,
        color: '#005ba2',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 60,
        fps: 20,
        zIndex: 2e9,
        shadow: false,
        hwaccel: false,
        position: 'absolute'
    };

        return (
                <span>
                {
                (this.props.isLoading)  
                    ?
                    (
                    <span><RLoader loaded={!this.props.isLoading} options={options} className="spinner" />
                    <span className="load-text"> Carregando, por favor aguarde!</span>
                    </span>
                    )
                    :
                null
                }
                </span>
        );
    }
}

export default Loader;
