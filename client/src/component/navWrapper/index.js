import React, {Component} from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import { Layout, Menu, Icon, Avatar } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import myIcon from '../../image/orca.jpg'
import { MENU_MAIN } from '../../constant/data'

import 'antd/dist/antd.css'

const { Content, Sider, Footer } = Layout

@inject('userStore')
@observer
class NavWrapper extends Component{
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  @computed
  get currUser() {
    return this.props.userStore.currUser
  }

  doLogOut = () => {
    this.props.userStore.logout();
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    const path = this.props.location.pathname;
    return (
      <Layout style={{ minHeight: '100vh'}}>
        { !this.currUser && <Redirect to='/' />}
        <Sider
          width={152}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu 
            theme="dark"  
            mode="inline"
            selectedKeys={[path]}
          >
            <div style={{height:100,backgroundColor:"#002140", textAlign: 'center'}}>
              <Avatar src={myIcon} alt='' style={{width:60, height:60, marginTop:20}}/>
            </div>
            <div style={{ height: 30, backgroundColor: "#002140", textAlign: 'center'}}>
              { this.currUser ?
                <div>
                  <span style={{ color: '#fff', marginRight: 10, display:'inline-block'}}>{this.currUser["name"]}</span>
                  <span style={{ color: '#fff' }} onClick={this.doLogOut}>登出</span>
                </div>:
                <div>
                  <Link to='/login' style={{ color: '#fff', marginRight: 10 }}>登录</Link>
                  <Link to='/register' style={{ color: '#fff' }}>注册</Link>
                </div>
              }
            </div>
            {MENU_MAIN.map((item,j)=>
              <Menu.Item key={item.path}>
                <NavLink to={item.path}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </NavLink> 
              </Menu.Item>           
            )}
          </Menu>
        </Sider> 
        <Layout>
          <Content style={{ margin: '12px 12px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center'}}>
            ©2020 Created by flashhu
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(NavWrapper);
