const express = require("express");
const app = express();
const a = require("./myClasses.js");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 2500;
var fs = require('fs');
var noble = require('noble');



app.use(express.static("public"));
//qui faccio restituire la pagina con gli script react
app.get('/',(req, res)=>{
    fs.readFile("react_test.html", function (error, pgResp) {
        if (error) {
            res.writeHead(404);
            res.write('Contents you are looking are Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgResp);
        }

        res.end();
    });
   // res.send('<h1>hello</h1>');
});

// const Bug = new SensorBug('pippino');
//
// var json = Bug.getJSON();
// var buggino = null;
// noble.on('stateChange', function(state) {
//     if (state === 'poweredOn') {
//       noble.startScanning();
//       var buggino = new a.SensorBug();
//       buggino.getDevice('pippi');
//       setTimeout(() => {
//         console.log('timeout beyond time');
//         console.log('peri : '+ buggino.getName() + '\n'+buggino.getMac());

//     }, 20000);
//     } else {
//       noble.stopScanning();
//     }
//   });

//   setTimeout(() => {
//     console.log('timeout beyond time');
//     console.log('peri : '+ buggino);
//
// }, 10000);

// if(buggino!=null){
//   while(1){
//     console.log('peri : '+ buggino.name+buggino.mac);
//   }
// }
// noble.on('stateChange', function(state) {
//     if (state === 'poweredOn') {
//       noble.startScanning();
//     } else {
//       noble.stopScanning();
//     }
//   });

// noble.on('discover', function(peripheral) {
//     console.log('Found device with local name: ' + peripheral.advertisement.localName);
//     console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
//     console.log();
// });

const sensors = [{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
{'name':'Bug_1','temp': 20.3,'hum':60,'soil': 20, 'light': true, 'fan':true, "night":8},
                {'name':'Bug_2','temp': 24.0 ,'hum': 30, 'soil': 30, 'light': true, 'fan':false, "night":12},
                {'name':'Ciao','temp':2000,'hum':0, 'soil': 11, 'light': false, 'fan':true, "night":6}];


//qui gestisco tutte le chat con socket.io
io.on("connection", socket =>{

    console.log("\nClient Connesso");

    io.emit("update", sensors);

    socket.on("light" , (data) => {
        console.log(data);

    });
    socket.on("fan" , (data) => {
        console.log(data);

    });
    socket.on("night" , (data) => {
        console.log(data);

    });


});
server.listen(port, () => console.log("Server running on port " + port))
