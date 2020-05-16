import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import { Form, Input, Button, message } from 'antd'
import { Redirect } from 'react-router-dom'
import './index.less'

@inject('userStore')
@observer
class Register extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isRegister: false
    }
  }

  @computed
  get currUser() {
    return this.props.userStore.currUser;
  }

  doRegister = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('输入有误，请重新根据提示填写！');
      } else {
        this.props.userStore.register(values)
        .then(r => {
          if(r.code) {
            message.success(r.msg);
            this.setState({
              isRegister:true
            })
          }else{
            message.error(r.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className="g-register">
        {this.state.isRegister && <Redirect to='/login' />}
        <div className="m-box">
          <div className="m-title">图书管理系统</div>
          <div className="m-register">
            <Form {...layout}>
              <Form.Item label="工号">
                {getFieldDecorator('id', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: '请输入工号！'
                  }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入姓名！' }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('passwd', {
                  rules: [{
                    required: true,
                    message: '请输入密码！'
                  }]
                })(
                  <Input.Password allowClear />
                )}
              </Form.Item>
              <Form.Item label="确认密码">
                {getFieldDecorator('re_passwd', {
                  rules: [{ 
                    required: true, 
                    message: '请输入确认密码！' },
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback()//如果还没填写，则不进行一致性验证
                        }
                        if (value === getFieldValue('passwd')) {
                          callback()
                        } else {
                          callback('两次密码不一致')
                        }
                      }
                    }
                  ]
                })(
                  <Input.Password />
                )}
              </Form.Item>
              <Form.Item label="手机">
                {getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    max: 11,
                    pattern: /^1[3456789]\d{9}$/,
                    message: '请输入11位手机号！'
                  }],
                  initialValue: ''
                })(
                  <Input allowClear />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" block onClick={this.doRegister} className="u-btn">
                    注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Register);