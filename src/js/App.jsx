import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';


var App = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function () {
        return (
            <div className="app-container">
                <Tabs className="header-tabs">
                    <Tab label={<span className="label">About Me</span>}
                         icon={<FontIcon className="material-icons">person</FontIcon>}>
                        <div>
                            <p>
                                ...
                            </p>
                        </div>
                    </Tab>
                    <Tab label={<span className="label">Work</span>}
                         icon={<FontIcon className="material-icons">work</FontIcon>}>
                        <div>
                            <p>
                                ...
                            </p>
                        </div>
                    </Tab>
                    <Tab label={<span className="label">Education</span>}
                         icon={<FontIcon className="fa fa-graduation-cap"></FontIcon>}>
                        <div>
                            <p>
                                ...
                            </p>
                        </div>
                    </Tab>
                    <Tab label={<span className="label">Projects</span>}
                         icon={<FontIcon className="fa fa-flask"></FontIcon>}>
                        <div>
                            <p>
                                ...
                            </p>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
});

export default App;
