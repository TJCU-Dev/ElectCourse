
var cheerio = require('cheerio');//dom选择
const iconv = require('iconv-lite'); //gbk解码
function xk_list(Body){
var html = cheerio.load(Body);
var list = []
// console.log(html.text())
html('.table_biaogexian + table tr').map((i, tr)=>{
  list[i]=[]
  var _tr = cheerio.load(tr);

 _tr('.td_biaogexian').map((ii, td)=>{
     var _td = cheerio.load(td);
    list[i][ii]=  _td('p').text()
    // console.log(_td('p'))
     // iconv.decode(_td('p').html(), 'gb2312'); _td('p').text()
  })

})

return list
}

module.exports = xk_list
