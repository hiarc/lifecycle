console.log('server setup...');

const http = require('http');
const filesystem = require('fs');
const server = http.createServer();

/**
 * リクエストの受信
 * カレンダーへのアクセスはGETかつjsonを受信した場合とする
 * （カレンダーが無い場合は生成した後に読み込む）
 * カレンダーへの保存はPOSTかつjsonを受信した場合とする
 */
server.on('request', function(req, res) {
    const accessFilePath = '.' + req.url;
    switch (req.method){
        case 'GET' : 
            if(req.url.endsWith('.html')){
                filesystem.readFile(accessFilePath, 'UTF-8', (error, data) => {
                    res.writeHead(200, {'Content-Type' : 'text/html'});
                    res.end(data);
                });
            }else if(req.url.endsWith('.css')){
                filesystem.readFile(accessFilePath, 'UTF-8', (error, data) => {
                    res.writeHead(200, {'Content-Type' : 'text/css'});
                    res.end(data);
                });
            }else if(req.url.endsWith('.js')){
                filesystem.readFile(accessFilePath, 'UTF-8', (error, data) => {
                    res.writeHead(200, {'Content-Type' : 'text/javascript'});
                    res.end(data);
                });
            }else if(req.url.endsWith('.json')){
                filesystem.access(accessFilePath, filesystem.constants.F_OK, (err) => {
                    if(err){
                        console.log('file not exist')
                        createNewDiary(accessFilePath, res);
                    }else{
                        console.log('file exists')
                        loadFile(accessFilePath, res);
                    }
                });
            }else if(req.url == '/favicon.ico'){
                res.writeHead(404, {'Content-Type' : 'text/html'});
                res.end();
            }
            break;
        case 'POST' :
            if(req.url.endsWith('.json')){
                req.on('data', function(chunk) {
                    const data = JSON.parse(chunk); //JSONにパース
                    const stringData = JSON.stringify(data, null, 2); //JSON文字列化
                    filesystem.writeFile(accessFilePath, stringData, function(err){
                        console.log('writefile:' + accessFilePath);
                    });                    
                }).on('end', function() {
                    res.writeHead(200, {'Content-Type' : 'text/plane'});
                    res.end();
                })
            }
            break;
        default :
            break;
    }
});

server.listen(3000);
console.log('server started');

/**
 * カレンダーファイルを書き出し、レスポンスに乗せる
 */
const createNewDiary = function(filePath, response){
    let splitedPath = filePath.split('/');
    let fileName = splitedPath[splitedPath.length - 1];
    let year = fileName.slice(0, 4);
    let month = fileName.slice(4, 6);
    let json = buildNewDiaryJson(year, month);
    filesystem.writeFile(filePath, JSON.stringify(json, null, '  '), function(err){
        loadFile(filePath, response);
        console.log('writefile:' + filePath);
    });
}

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
/**
 * 年月から日数、曜日を持つカレンダーJSONを生成する
 */
const buildNewDiaryJson = function(year, month){
    let date = new Date(year, month, 0);
    numOfDays = date.getDate(); // 日数

    let json = {
        "year": year,
        "month": month,
        "name": "",
        "author": "",
        "days": {}
    }

    for(var i = 1; i <= numOfDays; i++){        
        let tmpDate = new Date(year, month - 1, i); // 月は0始まりため-1
        weekDayIdx = tmpDate.getDay(); //曜日
        json.days[i] = 
        {
            "star" : false,
            "date" : i,
            "weekday" : weekDays[weekDayIdx],
            "lifecycle" : {},
            "level" : 0,
            "note" : ""
        };
        for(var j = 0; j <= 23; j++){
            json.days[i].lifecycle[j] = "none";
        }
    }
    
    return json;
}

/**
 * カレンダーファイルの読み込みを行い、レスポンスに設定する
 */
const loadFile = function(accessFilePath, response){
    console.log('loadFile:' + accessFilePath);
    filesystem.readFile(accessFilePath, 'UTF-8', (error, data) => {
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(data);
    });
}