const log = require('hexo-log')({ 'debug': false, 'slient': false });

/**
 * md文件返回 true
 * @param {*} data 
 */
function ignore(data) {
    // TODO: 好奇怪，试了一下, md返回true, 但却需要忽略 取反!
    var source = data.source;
    var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
    return ['md',].indexOf(ext) > -1;
}

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function action(data) {
    var reverseSource = data.source.split("").reverse().join("");
    var fileName = reverseSource.substring(3, reverseSource.indexOf("/")).split("").reverse().join("");

    // ![example](postname/example.jpg)  -->  {% asset_img example.jpg example %}
    var regExp = RegExp("!\\[(.*?)\\]\\(" + escapeRegex(fileName) + '/(.+?)\\)', "g");
    // hexo g
    data.content = data.content.replace(regExp, "{% asset_img $2 $1 %}","g");
    // <img src="2024-12-7-xxx/xxx.jpg"/>  -->  <img src="xxx/xxx.jpg"/>
    const regExp1 = RegExp('<img src="\\d{4}-\\d{1,2}-\\d{1,2}-', 'g');
    data.content = data.content.replace(regExp1, '<img src="');

    // log.info(`hexo-asset-img: filename: ${fileName}, title: ${data.title.trim()}`);
    
    return data;
}

hexo.extend.filter.register('before_post_render',(data)=>{
    if(!ignore(data)){
        action(data)
    }
}, 0);
