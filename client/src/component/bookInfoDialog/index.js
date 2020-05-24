import React, { Component } from 'react'
import axios from 'axios'
import { Modal, Form, Input, Button, message, Select } from 'antd'
import { API_UPDATE_BOOK, API_DELETE_BOOK } from '../../constant/urls'
import { CATE_TYPE } from '../../constant/data'

const { Option } = Select;

class BookInfoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            book: {},
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
        if (this.props.book && this.state.book.book_number !== this.props.book.book_number) {
            this.setState({
                visible: true,
                book: this.props.book,
                deleteConfirm: false
            })
        }
    }

    async handleUpdate(values) {
        const r = await axios.post(API_UPDATE_BOOK, values);
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
        const r = await axios.post(API_DELETE_BOOK, values);
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
            this.handleDel(this.state.book);
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
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };

        return (
            <Modal
                title="编辑图书信息"
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
                        <Form.Item label="书号">
                            {getFieldDecorator('book_number', {
                                rules: [{
                                    required: true,
                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                    message: '请输入正确的书号！'
                                }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                    disabled={this.props.book ? true : false}
                                />)}
                        </Form.Item>
                        <Form.Item label="类别">
                            {getFieldDecorator('category', {
                                initialValue: ''
                            })(
                                <Select placeholder="请选择">
                                    {CATE_TYPE.map((item) =>
                                        <Option value={item.name} key={item.id + ''}>{item.name}</Option>
                                    )}
                                </Select>)}
                        </Form.Item>
                        <Form.Item label="书名">
                            {getFieldDecorator('book_name', {
                                rules: [{ required: true, message: '请输入书名！' }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>
                        <Form.Item label="出版社">
                            {getFieldDecorator('publisher', {
                                rules: [{ required: true, message: '请输入出版社！' }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>
                        <Form.Item label="作者">
                            {getFieldDecorator('author', {
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>
                        <Form.Item label="价格">
                            {getFieldDecorator('price', {
                                rules: [{
                                    required: true,
                                    pattern: new RegExp(/^(0|[1-9][0-9]*)(\.\d+)?$/, "g"),
                                    message: '请输入真实的价格（大于0）！'
                                }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>
                        <Form.Item label="总藏书量">
                            {getFieldDecorator('book_total', {
                                rules: [{
                                    required: true,
                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                    message: '藏书量至少为1！'
                                }],
                                initialValue: ''
                            })(
                                <Input
                                    placeholder=""
                                    allowClear
                                />)}
                        </Form.Item>

                        {
                            this.props.book && <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                                <Button
                                    type="danger"
                                    icon="delete"
                                    onClick={this.handleDelete}
                                    style={{ width: 300 }}>{this.state.deleteConfirm ? '点击确认删除《' + this.state.book.book_name + '》' : '删除'}</Button>
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
        if (!props.book) {
            return;
        }
        return objToForm(props.book);
    }
})(BookInfoDialog)

export default mForm;