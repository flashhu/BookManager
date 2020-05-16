import { observable, action, runInAction } from 'mobx'
import { message } from 'antd'
import axios from 'axios'
import { API_USER_REGISTER, API_USER_LOGIN } from '../constant/urls'

class User {
  @observable 
  currUser = undefined

  @action 
  async login(user) {
    const r = await axios.post(API_USER_LOGIN, user);
    if (r && r.status === 200) {
      if(r.data.code) {
        runInAction(() => {
          this.currUser = r.data.user;
        })
        message.success(r.data.msg);
      }else {
        message.error(r.data.msg);
      }
    } else {
      message.error('网络错误', 0.7);
    }
  }


  @action 
  async register(params) {
    const r = await axios.post(API_USER_REGISTER, params);
    if (r && r.status === 200) {
      return r.data;
    } else {
      message.error('网络错误', 0.7);
    }
  }

  @action
  logout() {
    this.currUser = undefined
    message.success('登出成功')
  }
}

export default new User()