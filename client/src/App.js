import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { configure } from 'mobx'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component'
import NavWrapper from './component/navWrapper';
import injects from './store';

// 不允许在动作之外进行状态修改
configure({enforceActions: 'observed'})

class App extends Component{
  render() {
    return (
      <Provider {...injects}>
        <Router>
          <Switch>
            <Route path='/login' exact component={loadable(() => import('./app/login'))} />>
            <Route path='/register' exact component={loadable(() => import('./app/register'))} />
            <Route path='/' render={() => (
              <NavWrapper>
                <Switch>
                  <Route path='/user' exact component={loadable(() => import('./app/user'))} />
                  <Route path='/book' exact component={loadable(() => import('./app/book'))} />
                  {/* <Route path='/service' exact component={loadable(() => import('./app/service'))} /> */}
                </Switch>
              </NavWrapper>
            )}/>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
