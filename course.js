const request = require('request');//http请求
const cheerio = require('cheerio');//dom选择
const iconv = require('iconv-lite');//gbk解码
const infos = require('./infos.json');//选课信息
const xk_list = require('./list.js');
/**
  info.stuid;//教务系统账号
  info.pwd;//教务系统密码
  info.kch;//课程号
  info.kxh;//课序号
**/

const login = (jar, stuid, pwd) => {
  return new Promise((resolve, reject) => {
    request
      .defaults({ jar: jar })
      .post('http://202.113.80.18:7777/pls/wwwbks/bks_login2.login')
      .form({
        "stuid": stuid,
        "pwd": pwd
      })
      .on('response', function(response) {
        resolve(response.statusCode)
      })
      .on('error', function(err) {
        reject(err)
      })
    setTimeout(()=>{
      reject('overtime')
    },20000)
  });
};

const elect = (jar, course) => {
  return new Promise((resolve, reject) => {
    request
      .defaults({ jar: jar })
      .post('http://202.113.80.18:7777/pls/wwwbks/xk.CourseInput')
      .form({
        "p_qxrxk": course.kch,
        "p_qxrxk_kxh": course.kxh
      })
      .on('data', function(data) {
        data = iconv.decode(data, 'gb2312');
          console.log(xk_list(data));
        resolve(data)
      })
      .on('error', function(err) {
        reject(err)
      })
  });
};

const runLogin = (jar, stuid, pwd, courses, i) => {
  console.log(stuid +'第'+ i +'次尝试登录')
  login(jar, stuid, pwd)
    .then((status) => {
      if(status === 302) {
        console.log('登录成功，cookie信息：')
        console.log(jar)
        courses.map((course)=>{
          var i = 1;
          var timer = setInterval(() => {
            repeatElect(jar, stuid, course, i, timer)
            i++
          },1000)
        })
      } else {
        console.log('登录失败，再次尝试')
        runLogin(jar, stuid, pwd, courses, i+1)
      }
    })
    .catch((err) => {
      if (err === 'overtime') {
        console.log('登录超时，再次尝试')
        runLogin(jar, stuid, pwd, courses, i+1)
      } else {
        console.log(err)
      }
    })
}//登录成功为止，成功后开始选课

const repeatElect = (jar, stuid, course, i, timer) => {
  console.log(stuid +' 第'+i+'次尝试选课 '+ course.kch +'-'+ course.kxh)
  elect(jar, course)
    .then((data) => {
      $ = cheerio.load(data);
      console.log($('body').text())//判断选课是否成功，未完成，成功则取消定时器timer,失败不做处理
    })
}

<<<<<<< HEAD
var i=[];
var j=[];

infos.map((info,index)=>{
  i[index] = 1;
  j[index] = request.jar()
  setInterval(()=>{
    repeatLogin(index+1, i[index], info.stuid, info.pwd, info.kch, info.kxh, j[index])
    i[index]++
  },10000)
})
=======
infos.map((info)=>{
  var j = request.jar()
  runLogin(j, info.stuid, info.pwd, info.courses, 1)
})
>>>>>>> 31c8490a577cfd925df314f00196e7f4b5f8989d
