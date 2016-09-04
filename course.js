const request = require('request');//http请求
const cheerio = require('cheerio');//dom选择
const iconv = require('iconv-lite');//gbk解码
const infos = require('./infos.json');//选课信息

/**
  info.stuid;//教务系统账号
  info.pwd;//教务系统密码
  info.kch;//课程号
  info.kxh;//课序号
**/

const login = (stuid, pwd) => {
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
          data = iconv.decode(data, 'gbk');
          $ = cheerio.load(data);
          console.log($('body').text())
        }
      })
      .on('error', function(err) {
        reject(err)
      })
  });
};

const course = (kch, kxh) => {
  return new Promise((resolve, reject) => {
    request
      .defaults({ jar: true })
      .post('http://202.113.80.18:7777/pls/wwwbks/xk.CourseInput')
      .form({
        "p_qxrxk": kch,
        "p_qxrxk_kxh": kxh
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

const repeatLogin = (i, stuid, pwd, kch, kxh) => {
  console.log(stuid +' 第'+ i +'次尝试登录')
  login(stuid, pwd)
    .then((status) => {
      status === 302 ? repeatCourse(1, kch, kxh) : repeatLogin(i+1, stuid, pwd)
    })
}

const repeatCourse = (i, kch, kxh) => {
  console.log('第'+ i +'次尝试选课 '+ kch)
  course(kch, kxh)
    .then((data) => {
      $ = cheerio.load(data);
      true ? console.log($('.t').text()) : repeatCourse(i+1);//判断选课是否成功，未完成
    })
}

infos.map((info)=>{
  repeatLogin(1, info.stuid, info.pwd, info.kch, info.kxh)
})