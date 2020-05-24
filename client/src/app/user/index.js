import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import axios from 'axios'
import { API_DATA_ADMIN, API_DATA_READER, API_SEARCH_ADMIN, API_SEARCH_READER } from '../../constant/urls'
import { Table, Button, Icon, Select, Input, message, Spin, Tabs } from 'antd'
import AdminInfoDialog from '../../component/adminInfoDialog'
import ReaderInfoDialog from '../../component/readerInfoDialog'
import { DEPT_TYPE } from '../../constant/data' 

const { Option } = Select;
const { TabPane } = Tabs;

@inject('userStore')
@observer
class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdminBox: false,
      showReaderBox: false,
      adminList: [],
      readerList: [],
      editAdmin: null,
      editReader: null,
      loading: true
    }
  }

  //用于搜索，存放所有用户列表
  allData = []
  allAdmin = []
  allReader = []
  //用于搜索，存放搜索关键词
  searchAdminItems = {}
  searchReaderItems = {}

  @computed
  get currUser() {
    return this.props.userStore.currUser
  }

  adminColumns = [{
    title: '工号',
    dataIndex: 'manager_id',
    key: 'manager_id',
    width: '100px'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: "name",
    width: '100px'
  }, {
    title: '联系方式',
    dataIndex: 'telephone',
    key: "telephone",
    width: '100px'
  }, {
    title: '编辑',
    key: 'action',
    width: '80px',
    align: 'center',
    render: (admin) => (
      <span>
        <Icon type="edit" id="btn" title="编辑" onClick={() => this.showAdminDialog(admin)} style={{ padding: 8 }} />
      </span>
    )
  }];

  readerColumns = [{
    title: '工号',
    dataIndex: 'reader_number',
    key: 'reader_number',
    width: '100px'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key:"name",
    width:'100px'
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: "gender",
      width: '100px'
    }, {
    title: '联系方式',
    dataIndex: 'telephone',
    key:"telephone",
    width:'100px'
  }, {
    title: '学院',
    dataIndex: 'department',
    key:"department",
    width:'100px'
  }, {
    title: '编辑',
    key: 'action',
    width: '80px',
    align: 'center',
    render: (reader) => (
      <span>
        <Icon type="edit" id="btn" title="编辑" onClick={() => this.showReaderDialog(reader)} style={{ padding: 8 }} />
      </span>
    )
  }];

  showAdminDialog = (item) => {
    if (item === undefined) {
      item = null;
    }

    this.setState({
      showAdminBox: true,
      editAdmin: item
    })
  }

  showReaderDialog = (item) => {
    if (item === undefined) {
      item = null;
    }

    this.setState({
      showReaderBox: true,
      editReader: item
    })
  }

  async getAdminData() {
    const r = await axios.get(API_DATA_ADMIN);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allAdmin = r.data.rows; 
        this.setState({
          showAdminBox: false,
          adminList: r.data.rows,
          loading: false
        })
        // console.log(r.data.msg);
      } else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }

  async getReaderData() {
    const r = await axios.get(API_DATA_READER);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allReader = r.data.rows;
        this.setState({
          showReaderBox: false,
          readerList: r.data.rows,
          loading: false
        })
        // console.log(r.data.msg);
      } else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }
  
  componentDidMount() {
    this.getAdminData();
    this.getReaderData();
  }

  handleAdminInfoDialogClose = (admin) => {
    if (admin) {
      //修改信息
      let data = [...this.state.adminList];
      for (let i = 0; i < data.length; i++) {
        if (data[i].manager_id === admin.manager_id) {
          data[i] = admin;
          this.setState({
            adminList: data,
            showAdminBox: false
          });
          break;
        }
      }
    }
    // 新增或删除信息
    this.getAdminData();
  }

  handleReaderInfoDialogClose = (reader) => {
    if (reader) {
      //修改信息
      let data = [...this.state.readerList];
      for (let i = 0; i < data.length; i++) {
        if (data[i].reader_number === reader.reader_number) {
          data[i] = reader;
          this.setState({
            readerList: data,
            showReaderBox: false
          });
          break;
        }
      }
    }
    // 新增或删除信息
    this.getReaderData();
  }

  handleAdminTextChange = (e) => {
    let attr = e.target.getAttribute('item');
    if (attr) {
      this.searchAdminItems[attr] = e.target.value;
    }
  }

  handleReaderFilterChange = (value) => {
    if (typeof (value) === "string") { //部门
      this.searchReaderItems['department'] = value;
    }
    if (typeof (value) === "number") { //就职状态
      this.searchReaderItems['status'] = value;
    }
    this.handleReaderSearch();
  }

  handleReaderTextChange = (e) => {
    let attr = e.target.getAttribute('item');
    if (attr) {
      this.searchReaderItems[attr] = e.target.value;
    }
  }

  async handleAdminSearch() {
    this.setState({loading: true});
    const r = await axios.post(API_SEARCH_ADMIN, this.searchAdminItems);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allData = r.data.rows;
        this.setState({
          adminList: r.data.rows,
          loading: false
        })
        message.success(r.data.msg);
      } else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }

  async handleReaderSearch() {
    this.setState({ loading: true });
    const r = await axios.post(API_SEARCH_READER, this.searchReaderItems);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allData = r.data.rows;
        this.setState({
          readerList: r.data.rows,
          loading: false
        })
        message.success(r.data.msg);
      } else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }

  render() {
    const { showAdminBox, showReaderBox, editAdmin, editReader, readerList, adminList } = this.state;
    const seachBar = {width:160, marginTop:10, marginRight:5};

    if(!this.currUser){
      return <Redirect to='/login' />
    }

    return (
      <Fragment>
          <Tabs defaultActiveKey="admin">
            <TabPane tab="管理员" key="admin">
              <Input
                placeholder="工号"
                item="manager_id"
                allowClear
                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={seachBar}
                onChange={this.handleAdminTextChange}
              />
              <Input
                placeholder="姓名"
                item="name"
                allowClear
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={seachBar}
                onChange={this.handleAdminTextChange}
              />
              <Button type="primary" icon="search" onClick={() => this.handleAdminSearch()}>搜索</Button>
              <Button
                type="primary"
                icon="plus"
                style={{ float: 'right', marginTop: 10 }}
                onClick={() => this.showAdminDialog()}
              >
                添加
            </Button>

              <Spin spinning={this.state.loading} size="large" delay={500}>
                <Table
                  dataSource={adminList}
                  columns={this.adminColumns}
                  rowKey={item => item.manager_id + '$'}
                  pagination={{ pageSize: 7 }}
                  style={{ clear: 'both', marginTop: 10 }}
                />
              </Spin>
            </TabPane>
            <TabPane tab="读者" key="reader">
              <Select defaultValue="所有学院" style={seachBar} onChange={this.handleReaderFilterChange}>
                <Option value="all" key="all">所有学院</Option>
                {DEPT_TYPE.map((item) =>
                  <Option value={item} key={item.id + ''}>{item}</Option>
                )}
              </Select>
              <Input
                placeholder="工号"
                item="reader_number"
                allowClear
                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={seachBar}
                onChange={this.handleReaderTextChange}
              />
              <Input
                placeholder="姓名"
                item="name"
                allowClear
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={seachBar}
                onChange={this.handleReaderTextChange}
              />
              <Button type="primary" icon="search" onClick={() => this.handleReaderSearch()}>搜索</Button>
              <Button
                type="primary"
                icon="plus"
                style={{ float: 'right', marginTop: 10 }}
                onClick={() => this.showReaderDialog()}
              >
                添加
            </Button>

              <Spin spinning={this.state.loading} size="large" delay={500}>
                <Table
                  dataSource={readerList}
                  columns={this.readerColumns}
                  rowKey={item => item.reader_number + '@'}
                  pagination={{ pageSize: 7 }}
                  style={{ clear: 'both', marginTop: 10 }}
                />
              </Spin>
            </TabPane>
          </Tabs>


        <AdminInfoDialog
          visible={showAdminBox}
          admin={editAdmin}
          afterClose={() => this.setState({ showAdminBox: false })}
          onDialogConfirm={this.handleAdminInfoDialogClose}
        />

        <ReaderInfoDialog
          visible={showReaderBox}
          reader={editReader}
          afterClose={() => this.setState({ showReaderBox: false })}
          onDialogConfirm={this.handleReaderInfoDialogClose}
        />

      </Fragment>    
    )
  }
}

export default UserList;