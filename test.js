const request = require('request'); //http请求
const cheerio = require('cheerio'); //dom选择
const iconv = require('iconv-lite'); //gbk解码
const infos = require('./config/infos.json'); //选课信息
const xk_list = require('./list.js');

// process.argv[2]=='ck' & !process.argv[3]
console.log(process.argv)

  var j = request.jar();
  var cookie = request.cookie('ACCOUNT=201425100905193651;path=/pls/wwwbks/;');
  var url = 'http://202.113.80.18:7777';
  j.setCookie(cookie, url);

var ck = {
  url: 'http://202.113.80.18:7777/pls/wwwbks/xk.CourseInput',
  jar: j
}

function login(req) {
  console.log('login')
  return req
    .post('http://202.113.80.18:7777/pls/wwwbks/bks_login2.login')
    .form({
      "stuid": '20142510',
      "pwd": '123456'
    })
    .on('response', function(res) {
      ck.headers['Set-Cookie'] = res.headers['set-cookie']
      console.log(res.headers['set-cookie'])
      if(res.statusCode!==302){
        login(request)
      }
      if (res.headers['set-cookie'] ) {
        cx()
      }
    })
    .on('error', function(err) {
      console.log(err)
    })
}



function cx() {
  console.log('cx-----------')

  request.get(ck, function(error, response, body){
    console.log(response.statusCode)
    // console.log(iconv.decode(iconv.encode(body, 'gb2312'), "utf8") )

    var  data = iconv.encode(response.body, 'gbk') //iconv.decode(body, 'utf8');     //iconv.decode(response.body, 'GBK');
    console.log( xk_list(""+data) )
    // console.log(data)
    if (!error && response.statusCode == 200) {
      // console.log(response) // 打印google首页
      console.log(response.headers['Set-Cookie']) // 打印google首页
    }
  })
}
cx()



// ii = 0

// login(request)



// ii++
