import React, { Component } from 'react'
import { Tabs } from 'antd'
import BorrowBook from '../../component/borrowBook';
import ReturnBook from '../../component/returnBook';
import './index.less'

const { TabPane } = Tabs;

class BookService extends Component {
  render() {
      return (
        <div className="g-service">
          <div className="m-form">
            <Tabs defaultActiveKey="0">
              <TabPane tab="借书" key="0">
                <BorrowBook />
              </TabPane>
              <TabPane tab="还书" key="1">
                <ReturnBook />
              </TabPane>
            </Tabs>
          </div>
        </div>
      )
  }
}

export default BookService;