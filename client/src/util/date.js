import moment from 'moment'

//'2020-05-12 13:15:16'
export let getDateTime = () => {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
}