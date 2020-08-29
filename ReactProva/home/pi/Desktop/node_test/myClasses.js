var noble = require('noble');

// var a = noble.peripheral;
const peri = function(name){
  const buggino = new SensorBug(name);
  return(buggino);
}



class SensorBug {

   constructor(name='Bug',mac=null,temp=null,hum=null,soil=null,light=null,fan=null,night=null){

      this.name = name
      this.mac = mac;
      this.TempCh = temp;
      // this.HumCh = new noble.Characteristic();
      // this.SoilCh = new noble.Characteristic();
      // this.LightCh = new noble.Characteristic();
      // this.FanCh = new noble.Characteristic();
      // this.NightCh = new noble.Characteristic();
      // this.connected = new noble.Characteristic();

      this.setName = this.setName.bind(this);
      this.getName = this.getName.bind(this);
      this.getMac = this.getMac.bind(this);
      this.setMac = this.setMac.bind(this);
      this.getJSON = this.getJSON.bind(this);
      this.setTempCH = this.setTempCH.bind(this);
      this.getDevice = this.getDevice.bind(this);

      // console.log(this);

   }

   setName(newName){
      this.name = newName;
   }

   getName(){
      return(this.name);
   }
   getMac(){
      return(this.mac);
   }

   setMac(newMac){
      this.mac = newMac;
   }
   setTempCH(characteristic){
     this.TempCh = characteristic;
   }
   getJSON(){
      return(
         {
            'name':this.name,
            'temp': 20.3,
            'hum':60,
            'soil': 20,
            'light': false,
            'fan':true,
            'night':8
         }
      );
   }

   getDevice(name){
     this.setName(name);
     var mac = 1;
     var temp = 2;
     var data = 'cose';
     var peri = noble.on('discover', function(peripheral,data) {
         console.log('Found device with local name: ' + peripheral.advertisement.localName);
         console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
         console.log(' with address <' + peripheral.address);
         console.log('data : '+data);
         var data = 'cose_diverse';
         if(peripheral.advertisement.localName == 'ESP32_Sensors'){

           noble.stopScanning();
           this.mac = peripheral.address;
           console.log('MACADDRESS : '+ this.mac); 
           peripheral.connect((error)=>{
             console.log('connected to :'+  peripheral.advertisement.localName );
             peripheral.discoverServices(null, (error,services) => {

                 for (var i in services) {
                   console.log(services[i].uuid);
                 }
                 var prova = services[4];
                 //light ['4a9f']
                 prova.discoverCharacteristics(null, (error, chars)=>{
                   console.log('\n Caratteristiche: '+ chars);
                   // Bug.setTempCH(chars[0]);
                   // // var hum = chars[0];
                   // Bug.TempCh.subscribe((error)=>{
                   //   console.log('\non');
                   // });
                   // Bug.TempCh.on('read',(data, isNotification)=>{
                   //     console.log('\nIs Notification: '+isNotification+'\nHumidity: '+data+'%');
                   // });
                   console.log('Sta ritornando');
                   temp = chars[0];

                   // hum.read((data)=>{
                   //   console.log('\nHumidity: ',data.readUInt16LE()*0.1+'%');
                   // });
                   // hum.write(new Buffer([0x30]), true, function(error) {
                   // console.log('set alert level to mid (1)');
                   // });

               });
             });
           });
           return;
         }
     });

     //l'indirizzo è sbagliato
     this.mac = peri.address;



   //
   //   this.mac = list;
   // // this.mac = list;
   }

 }

// module.exports.peri = peri;
module.exports.SensorBug = SensorBug;
