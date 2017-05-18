/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 Dan "Ducky" Little
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, {Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import res from 'res';
import { convertLength } from '../util.js';
import { zoomToResolution } from '../actions/map';

class JumpToScale extends Component {
    constructor (props) {
        super(props);
        this.options = [5000,10000,24000,50000,100000];
        this.dpi = res.dpi();
        this.state = {
            scale: null,
            units: null
        };
        this.getScaleFromResolution = this.getScaleFromResolution.bind(this);
        this.getResolutionFromScale = this.getResolutionFromScale.bind(this);
        this.onScaleSelect = this.onScaleSelect.bind(this);
    }
    getScaleFromResolution (resolution) {
        // get [projection units] per inch
        let unitsPerInch = resolution * this.dpi;
        // convert ol.unitType for use with convertLength util fn
        let scale = null;
        switch (this.state.units) {
            case 'ft':
                scale = convertLength(unitsPerInch, 'ft', 'in');
                break;
            case 'm':
                scale = convertLength(unitsPerInch, 'm', 'in');
                break;
            break;
            case 'us-ft':
                scale = convertLength(unitsPerInch, 'ft', 'in');
                break;
            default:
                break;
        }
        if(typeof scale === 'number') {
            scale = Math.round(scale);
        }
        return scale;
    }
    getResolutionFromScale (scale) {
        let resolution = null;
        let inchesPerPixel = scale / this.dpi;
        switch (this.state.units) {
            case 'ft':
                resolution = convertLength(inchesPerPixel, 'in', 'ft');
                break;
            case 'm':
                resolution = convertLength(inchesPerPixel, 'in', 'm');
                break;
            break;
            case 'us-ft':
                resolution = convertLength(inchesPerPixel, 'in', 'ft');
                break;
            default:
                break;
        }
        return resolution;
    }
    onScaleSelect (event) {
        let selectedScale = event.target.value;
        let resolution = this.getResolutionFromScale(selectedScale);
        this.props.store.dispatch(zoomToResolution(resolution));
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.projection !== null && nextProps.resolution !== null) {
            if(this.props.projection !== nextProps.projection) {
                let units = ol.proj.get(nextProps.projection).getUnits();
                this.setState({
                    units
                });
            }
            let scale = this.getScaleFromResolution(nextProps.resolution);
            this.setState({
                scale
            });
        }
    }
    render() {
        let options = [];
        for (let option of this.options) {
            options.push(<option key={option} value={option}>1:{option}</option>);
        }
        return (
            <select value="current" onChange={this.onScaleSelect}>
                <option disabled key="current" value="current">1:{this.state.scale}</option>
                {options}
            </select>
        );
    }
};

const mapToProps = function(store) {
    return {
        resolution: store.map.resolution,
        projection: store.map.projection
    }
}

export default connect(mapToProps)(JumpToScale);
