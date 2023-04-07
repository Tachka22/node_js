const http = require('node:http');


const host= '127.0.0.1';
const port = 3001;
var counter = 0;

// const users = [{"name": "John", "email":"segj@seg.tr"}, {"name": "Ann", "email":"esg!@seg.tr"}];

//let comments = [{"name" : "Comments", "value":"1"}, {"name" : "Comments", "value":"2"}];
let comments = [ "Comments1", "Comments2"];
//Генерация html таблицы ответа
function generateTable(str, count){
    let html = '<table>\n'
    html+= '<tr>\n'
        html+=`<td style="border: 1px solid;padding: 20px ">${str}</td>\n`
        html+=`<td style="border: 1px solid;padding: 20px">${count}</td>\n`
        html+='</tr>\n'
    html+='</table>\n'
    return html;
}

const server = http.createServer((req, res )=>{
    // информация о запросе
    console.log("Url: " + req.url);
    console.log("Тип запроса: " + req.method);
    console.log("User-Agent: " + req.headers["user-agent"]);

    // счётчик запросов
    counter+=1;

    //корень
    if(req.url === "/"){
        res.setHeader('Content-Type', 'text/plain');
        res.write('Hello, world');
        res.end();
    }
    else if(req.url === "/stats"){
        if(req.method === 'GET'){
            res.statusCode  = 200;
            res.setHeader('Content-Type', 'text/html');
            let userAgent = req.headers["user-agent"].toString();
            res.end(generateTable(userAgent,counter));
        }
        else if(req.method === 'POST'){
                res.setHeader('Content-Type', 'text/plain');
                res.end('Error! No POST request');
        }
        else{
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.write('Bad Request');
            res.end();
        }

    }
    else if(req.url === "/comments"){
        if(req.method === 'GET'){
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(comments))
        }
        else if(req.method === 'POST'){
            let body = "";
            req.on('data', (chunk) =>{
                body +=chunk.toString();
            });
                req.on('end', () =>{
                comments.push(body);
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(comments))
            });
        }
        else{
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.write('Bad Request');
            res.end();
        }
    }
    
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.write('Not Found');
        res.end();
    }

});

server.listen(port,host, () => {
    console.log(' server is running. http://'+host+':'+port);
});

server.on('connection', () => {
    console.log('Новое подключение');
});
