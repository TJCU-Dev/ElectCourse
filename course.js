const request = require('request');//http请求
const cheerio = require('cheerio');//dom选择
const iconv = require('iconv-lite');//gbk解码
const info = require('./info.json');//选课信息

var stuid = info.stuid;//教务系统账号
var pwd = info.pwd;//教务系统密码
var p_qxrxk = info.p_qxrxk;//课程号
var p_qxrxk_kxh = info.p_qxrxk_kxh;//课序号

const login = () => {
  return new Promise((resolve, reject) => {
    request
      .defaults({ jar: true })
      .post('http://202.113.80.18:7777/pls/wwwbks/bks_login2.login')
      .form({
        "stuid": stuid,
        "pwd": pwd
      })
      .on('response', function(response) {
        resolve(response.statusCode)
      })
      .on('data', function(data) {
        if (data.length != 1) {
          data = iconv.decode(data, 'gb2312');
          $ = cheerio.load(data);
          console.log($('body').text())
        }
      })
      .on('error', function(err) {
        reject(err)
      })
  });
};

const course = () => {
  return new Promise((resolve, reject) => {
    request
      .defaults({ jar: true })
      .post('http://202.113.80.18:7777/pls/wwwbks/xk.CourseInput')
      .form({
        "p_qxrxk": p_qxrxk,
        "p_qxrxk_kxh": p_qxrxk_kxh
      })
      .on('data', function(data) {
        data = iconv.decode(data, 'gb2312');
        resolve(data)
      })
      .on('error', function(err) {
        reject(err)
      })
  });
};

const repeatLogin = (i) => {
  console.log('第'+ i +'次尝试登录')
  login()
    .then((status) => {
      status === 302 ? repeatCourse(1) : repeatLogin(i+1)
    })
}

const repeatCourse = (i) => {
  console.log('第'+ i +'次尝试选课')
  course()
    .then((data) => {
      $ = cheerio.load(data);
      true ? console.log($('.t').text()) : repeatCourse(i+1);//判断选课是否成功，未完成
    })
}

repeatLogin(1)