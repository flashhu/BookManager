import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import axios from 'axios'
import { Table, Button, Icon, Select, Input, message, Spin } from 'antd'
import { API_DATA_BOOK, API_SEARCH_BOOK } from '../../constant/urls'
import BookInfoDialog from '../../component/bookInfoDialog'
import { CATE_TYPE } from '../../constant/data'

const { Option } = Select;

@inject('userStore')
@observer
class BookList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfoBox: false,
      bookList: [],
      editItem: null,
      loading: true
    }
  }

  //用于搜索，存放所有用户列表
  allData = []
  //用于搜索，存放搜索关键词
  searchItems = {}

  @computed
  get currUser() {
    return this.props.userStore.currUser
  }

  columns = [{
    title: '书号',
    dataIndex: 'book_number',
    key: 'book_number',
    width: '100px'
  }, {
    title: '类别',
    dataIndex: 'category',
      key: "category",
    width: '100px'
  }, {
    title: '书名',
    dataIndex: 'book_name',
      key: "book_name",
    width: '150px'
  }, {
    title: '出版社',
    dataIndex: 'publisher',
    key: "publisher",
    width: '150px'
  }, {
    title: '作者',
    dataIndex: 'author',
    key: "author",
    width: '100px'
  }, {
    title: '价格',
    dataIndex: 'price',
    key: "price",
    width: '100px',
  }, {
    title: '总藏书量',
    dataIndex: 'book_total',
    key: "book_total",
    width: '100px',
    }, {
      title: '库存',
      dataIndex: 'inventory',
      key: "inventory",
      width: '100px',
    }, {
    title: '编辑',
    key: 'action',
    width: '80px',
    align: 'center',
    render: (book) => (
      <span>
        <Icon type="edit" id="btn" title="编辑" onClick={() => this.showInfoDialog(book)} style={{ padding: 8 }} />
      </span>
    )
  }];

  showInfoDialog = (item) => {
    if (item === undefined) {
      item = null;
    }

    this.setState({
      showInfoBox: true,
      editItem: item
    })
  }

  async getData() {
    const r = await axios.get(API_DATA_BOOK);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allData = r.data.rows;
        this.setState({
          showInfoBox: false,
          bookList: r.data.rows,
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
    this.getData();
  }

  handleInfoDialogClose = (book) => {
    if(book) {
      //修改信息
      let data = [...this.state.bookList];
      for (let i = 0; i < data.length; i++) {
        if (data[i].book_number === book.book_number) {
          data[i] = book;
          this.setState({
            bookList: data,
            showInfoBox: false
          });
          break;
        }
      }
    }
    // 新增或删除信息
    this.getData();
  }

  handleFilterChange = (value) => {
    this.searchItems['category'] = value;
    this.handleSearch();
  }

  handleTextChange = (e) => {
    let attr = e.target.getAttribute('item');
    if (attr) {
      this.searchItems[attr] = e.target.value;
    }
  }

  async handleSearch() {
    this.setState({ loading: true });
    const r = await axios.post(API_SEARCH_BOOK, this.searchItems);
    if (r && r.status === 200) {
      if (r.data.code) {
        this.allData = r.data.rows;
        this.setState({
          bookList: r.data.rows,
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
    const { showInfoBox, editItem, bookList } = this.state;
    const seachBar = { width: 160, marginTop: 10, marginRight: 5 };

    if (!this.currUser) {
      return <Redirect to='/login' />
    }

    return (
      <Fragment>
        <Select defaultValue="所有类别" style={seachBar} onChange={this.handleFilterChange}>
          <Option value="all" key="all ">所有类别</Option>
          {CATE_TYPE.map((item) =>
            <Option value={item.name} key={item.id + ''}>{item.name}</Option>
          )}
        </Select>
        <Input
          placeholder="书号"
          item="book_number"
          allowClear
          prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={seachBar}
          onChange={this.handleTextChange}
        />
        <Input
          placeholder="书名"
          item="book_name"
          allowClear
          prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={seachBar}
          onChange={this.handleTextChange}
        />
        <Button type="primary" icon="search" onClick={() => this.handleSearch()}>搜索</Button>
        <Button
          type="primary"
          icon="plus"
          style={{ float: 'right', marginTop: 10 }}
          onClick={() => this.showInfoDialog()}
        >
          添加
        </Button>

        <Spin spinning={this.state.loading} size="large" delay={500}>
          <Table
            dataSource={bookList}
            columns={this.columns}
            rowKey={item => item.book_number + '*'}
            pagination={{ pageSize: 8 }}
            style={{ clear: 'both', marginTop: 10 }}
          />
        </Spin>

        <BookInfoDialog
          visible={showInfoBox}
          book={editItem}
          afterClose={() => this.setState({ showInfoBox: false })}
          onDialogConfirm={this.handleInfoDialogClose}
        />

      </Fragment>
    )
  }
}

export default BookList;