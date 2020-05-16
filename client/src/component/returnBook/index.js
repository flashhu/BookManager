import React, { Component } from 'react'
import axios from 'axios'
import { Form, Input, Button, Icon, message } from 'antd'
import { API_RETURN_BOOK } from '../../constant/urls'
import { getDateTime } from '../../util/date'

class ReturnBook extends Component {
  async doReturn(values) {
    const r = await axios.post(API_RETURN_BOOK, values);
    if (r && r.status === 200) {
      if (r.data.code) {
        message.success('还书成功！');
      } else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('输入有误，请重新根据提示填写！');
      } else {
        values['return_time'] = getDateTime();
        this.doReturn(values);
        this.props.form.resetFields();
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form >
        <Form.Item>
          {getFieldDecorator('reader_number', {
            rules: [{
              required: true,
              pattern: new RegExp(/^[1-9]\d*$/, "g"),
              message: '请输入读者工号！'
            }],
            initialValue: ''
          })(
            <Input
              placeholder="工号"
              allowClear
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('book_number', {
            rules: [{
              required: true,
              pattern: new RegExp(/^[1-9]\d*$/, "g"),
              message: '请输入书号！'
            }],
            initialValue: ''
          })(
            <Input
              placeholder="书号"
              allowClear
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={this.handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(ReturnBook);