import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import axios from 'axios'
import { Modal, Form, Input, Button, message } from 'antd'
import { API_UPDATE_ADMIN, API_DELETE_ADMIN } from '../../constant/urls'

@inject('userStore')
@observer
class AdminInfoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            admin: {},
            deleteConfirm: false
        }
    }

    @computed
    get currUser() {
        return this.props.userStore.currUser;
    }

    componentDidUpdate(prevProps) {
        // 点击添加 及 跳出弹窗后修改 state
        if (this.state.visible === prevProps.visible && prevProps.visible !== this.props.visible) {
            this.setState({
                visible: this.props.visible
            })
        }

        // 点击编辑
        if (this.props.admin && this.state.admin.manager_id !== this.props.admin.manager_id) {
            this.setState({
                visible: true,
                admin: this.props.admin,
                deleteConfirm: false
            })
        }
    }

    async handleUpdate(values) {
        const r = await axios.post(API_UPDATE_ADMIN, values);
        if (r && r.status === 200) {
            if (r.data.code) {
                message.success(r.data.msg);
            } else {
                message.error(r.data.msg);
            }
        } else {
            message.error('网络错误', 0.7);
        }
    }

    async handleDel(values) {
        const r = await axios.post(API_DELETE_ADMIN, values);
        if (r && r.status === 200) {
            if (r.data.code) {
                this.setState({
                    visible: false
                });
                this.props.onDialogConfirm(undefined);
                message.success(r.data.msg);
            } else {
                message.error(r.data.msg);
            }
        } else {
            message.error('网络错误', 0.7);
        }
    }

    handleOk = e => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('表单数据有误，请根据提示填写！');
            } else {
                this.setState({
                    confirmLoading: true,
                });
                this.handleUpdate(values);
                setTimeout(() => {
                    this.setState({
                        visible: false,
                        confirmLoading: false
                    });
                    this.props.onDialogConfirm(values);
                }, 1000);
            }
        })
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    // 点击删除 出现二次确认
    handleDelete = () => {
        if (!this.state.deleteConfirm) {
            this.setState({
                deleteConfirm: true
            });
        } else {
            this.setState({
                visible: false
            })
            this.handleDel(this.state.admin);
        }
    }

    handleSubmit = (e) => {
        //通知 Web 浏览器不要执行与事件关联的默认动作
        e.preventDefault();
        console.log("handle submit");
    }

    render() {
        const { visible, confirmLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        return (
            <Modal
                title="编辑管理员信息"
                visible={visible}
                width={400}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                afterClose={this.props.afterClose}
                okText="保存"
                cancelText="取消"
            >
                <div>
                    <Form {...layout} onSubmit={this.handleSubmit}>
                        <Form.Item label="工号">
                            {getFieldDecorator('manager_id', {
                                rules: [{
                                    required: true,
                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                    message: '请输入正确的工号！'
                                }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                    disabled={this.props.admin ? true: false}
                                />)}
                        </Form.Item>
                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入书名！' }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>
                        <Form.Item label="手机">
                            {getFieldDecorator('telephone', {
                                rules: [{
                                    required: true,
                                    max: 11,
                                    pattern: /^1[3456789]\d{9}$/,
                                    message: '请输入11位手机号！'
                                }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>

                        {
                            this.props.admin && this.props.admin.manager_id !== this.currUser.manager_id  && <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                                <Button
                                    type="danger"
                                    icon="delete"
                                    onClick={this.handleDelete}
                                    style={{ width: 250 }}>{this.state.deleteConfirm ? '点击确认删除 ' + this.state.admin.name : '删除'}</Button>
                            </Form.Item>
                        }

                        {
                            !this.props.admin && 
                            <p style={{textAlign:'center'}}>新增管理员密码默认为 123456</p>
                        }

                    </Form>
                </div>
            </Modal>
        )
    }
}

const objToForm = (obj) => {
    let target = {}
    for (let [key, value] of Object.entries(obj)) {
        target[key] = Form.createFormField({ value })
    }
    return target
}

const mForm = Form.create({
    name: 'infoForm',
    mapPropsToFields(props) {
        if (!props.admin) {
            return;
        }
        return objToForm(props.admin);
    }
})(AdminInfoDialog)

export default mForm;