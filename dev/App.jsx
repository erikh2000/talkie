import React from 'react';
import ReactDOM from 'react-dom';
import HomeScreen from './HomeScreen.jsx';
import NotFoundScreen from './NotFoundScreen.jsx';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory }
		from 'react-router';

class App extends React.Component {
	render() {
		return (
			<Router history={hashHistory}>
        <Route path='/' component={HomeScreen} />
				<Route path='*' component={NotFoundScreen} />
      </Router>
		);
	}
}

export default App;
