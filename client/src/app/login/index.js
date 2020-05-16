import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import { Form, Input, Button, Icon, message } from 'antd';
import './index.less'

@inject('userStore')
@observer
class Login extends Component {
  @computed
  get currUser() {
    return this.props.userStore.currUser
  }

  doLogin = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('输入有误，请重新根据提示填写！');
      }else {
        this.props.userStore.login(values);
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="g-login">
        { this.currUser && <Redirect to='/service' /> }
        <div className="m-box">
          <div className="m-title">图书管理系统</div>
          <div className="m-login">
            <Form>
              <Form.Item>
                {getFieldDecorator('manager_id', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: '请输入工号！'
                  }],
                  initialValue: ''
                })(
                  <Input
                    placeholder="工号"
                    allowClear
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    message: '请输入密码！'
                  }]
                })(
                  <Input.Password
                    placeholder="密码"
                    allowClear
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" block onClick={this.doLogin}>
                  登录
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" block>
                  <Link to='/register'>
                    注册
                  </Link>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login);