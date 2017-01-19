/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 GeoMoose
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

/** Component for rendering a toolbar!
 *
 */

import React, {Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { startTool } from '../actions/toolbar';

import { startService } from '../actions/service';
import { runAction } from '../actions/ui';

class Toolbar extends Component {

    constructor() {
        super();
        this.handleToolAction = this.handleToolAction.bind(this);
        this.renderTool = this.renderTool.bind(this);
    }

    handleToolAction(tool) {
        console.log('handleToolAction', tool);
        if(tool.actionType === 'service') {
            console.log('dispatching startService...');
            this.props.store.dispatch(startService(tool.name));
        } else if(tool.actionType == 'action') {
            this.props.store.dispatch(runAction(tool.name));
        }
    }

    renderTool(tool) {
        let tool_click = () => {
            this.handleToolAction(tool);
        };

        return (
            <button onClick={tool_click} key={tool.name}>
                <span className="icon"></span><span className="label">{tool.label}</span>
            </button>
        );
    }

    render() {
        return (
            <div className="toolbar">
                {
                    this.props.toolbar.map(this.renderTool)
                }
            </div>
        );
    }

};


const mapToolbarToProps = function(store) {
    return {
        toolbar: store.toolbar
    }
}

export default connect(mapToolbarToProps)(Toolbar);
