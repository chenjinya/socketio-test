var PORT = 3000;

//http://www.cnblogs.com/shawn-xie/archive/2013/06/06/3121173.html
var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("assets", pathname);
    //console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                // console.log(file);
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});

var io = require('socket.io')(server);


io.on('connection', function(socket){
    console.log('a user connected');
    
    //监听新用户加入
    socket.on('rtcmsg', function(obj){
        console.log('a user message');
        //向所有客户端广播发布的消息
        io.emit('rtcmsg', obj);
        // console.log(obj.username+'说：'+obj.content);
    });
    
    socket.on('newPeer', function(obj){
        console.log('a user message');
        //向所有客户端广播发布的消息
        io.emit('newPeer', obj);
        // console.log(obj.username+'说：'+obj.content);
    });
    //监听用户退出
    socket.on('disconnect', function(){
        console.log('a user disconnect');
    });
    
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        console.log('a user message');
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        // console.log(obj.username+'说：'+obj.content);
    });
  
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

