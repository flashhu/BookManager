import React, { Component } from 'react'
import axios from 'axios'
import { Modal, Form, Input, Button, message, Select, Radio } from 'antd'
import { API_UPDATE_READER, API_DELETE_READER } from '../../constant/urls'
import { DEPT_TYPE } from '../../constant/data'

const { Option } = Select;

class ReaderInfoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            reader: {},
            deleteConfirm: false
        }
    }

    componentDidUpdate(prevProps) {
        // 点击添加 及 跳出弹窗后修改 state
        if (this.state.visible === prevProps.visible && prevProps.visible !== this.props.visible) {
            this.setState({
                visible: this.props.visible
            })
        }

        // 点击编辑
        if (this.props.reader && this.state.reader.reader_number !== this.props.reader.reader_number) {
            this.setState({
                visible: true,
                reader: this.props.reader,
                deleteConfirm: false
            })
        }
    }

    async handleUpdate(values) {
        const r = await axios.post(API_UPDATE_READER, values);
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
        const r = await axios.post(API_DELETE_READER, values);
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
            this.handleDel(this.state.reader);
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
                title="编辑读者信息"
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
                            {getFieldDecorator('reader_number', {
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
                        <Form.Item label="性别">
                            {getFieldDecorator('gender', {
                                rules: [{ required: true, message: '请输入书名！' }],
                                initialValue: ''
                            })(
                                <Radio.Group>
                                    <Radio.Button value="男">男</Radio.Button>
                                    <Radio.Button value="女">女</Radio.Button>
                                </Radio.Group>)}
                        </Form.Item>
                        <Form.Item label="手机">
                            {getFieldDecorator('telephone', {
                                rules: [{
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
                        <Form.Item label="学院">
                            {getFieldDecorator('department', {
                                initialValue: ''
                            })(
                                <Select placeholder="请选择">
                                    {DEPT_TYPE.map((item) =>
                                        <Option value={item} key={item.id + ''}>{item}</Option>
                                    )}
                                </Select>)}
                        </Form.Item>

                        {
                            this.props.reader && <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                                <Button
                                    type="danger"
                                    icon="delete"
                                    onClick={this.handleDelete}
                                    style={{ width: 250 }}>{this.state.deleteConfirm ? '点击确认删除 ' + this.state.reader.name: '删除'}</Button>
                            </Form.Item>
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
        if (!props.reader) {
            return;
        }
        return objToForm(props.reader);
    }
})(ReaderInfoDialog)

export default mForm;