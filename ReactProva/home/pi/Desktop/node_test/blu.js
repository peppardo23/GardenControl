var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});


noble.on('discover', function(peripheral) {
  console.log('peripheral discovered (' + peripheral.id +
              ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
              ' connectable ' + peripheral.connectable + ',' +
              ' RSSI ' + peripheral.rssi + ':');
  console.log('\thello my local name is:');
  console.log('\t\t' + peripheral.advertisement.localName);
  console.log('\tcan I interest you in any of the following advertised services:');
  console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));
  console.log('\n'+peripheral.advertisement.serviceData);

  if(peripheral.advertisement.localName == 'ESP32_Sensors'){
    noble.stopScanning();
    peripheral.connect(function(error) {

      console.log('connected to :'+  peripheral.advertisement.localName );

      peripheral.discoverServices(null, function(error,services) {
        for (var i in services) {
          console.log(services[i].uuid);
        }
        var prova = services[4];
        //light ['4a9f']
        prova.discoverCharacteristics(null, function(error, chars){
          console.log('\n Caratteristiche: '+ chars);
          var hum = chars[0];

          
          
          // hum.write(new Buffer([0x31]), true, function(error) {
          //   console.log('set alert level to mid (1)');
          // });
          hum.read((error,data)=>{
            console.log('\nHumidity: ',data.readUInt16LE(0)+'%');
          });
          hum.on('data', function(data, isNotification){
            console.log('\nHumidity: ',data+'%');
          });
          

          hum.subscribe(function(error){
            console.log('\non');
          });
        });

      });
    });
    peripheral.disconnect(function(error) {
      console.log('disconnected from peripheral: ' + peripheral.uuid);
   });
  }
  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    console.log('\there is my service data:');
    // for (var i in serviceData) {
    //   console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
    // }
  }
  if (peripheral.advertisement.manufacturerData) {
    console.log('\there is my manufacturer data:');
    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
  }
  if (peripheral.advertisement.txPowerLevel !== undefined) {
    console.log('\tmy TX power level is:');
    console.log('\t\t' + peripheral.advertisement.txPowerLevel);
  }

  console.log();
});
