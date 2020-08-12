var Service, Characteristic
var fs = require('fs');

var Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory('homebridge-motionsensor-file', 'fileMotionSensor', MyAccessory)
}

function MyAccessory (log, config) {
  this.log = log

  this.name = config["name"];
  this.filePath = config["file_path"];
  this.interval = Number(config["interval"]);
  
  this.service = new Service.OccupancySensor(this.name);
  this.service
      .getCharacteristic(Characteristic.OccupancyDetected)
      .on('get', this.getState.bind(this));

  //自動更新
  setInterval(this.updateState.bind(this), this.interval * 60 * 1000); //60 * 1000 で1分

  }


  MyAccessory.prototype.updateState =function () {
    value = fs.existsSync(this.filePath)
    this.service
      .getCharacteristic(Characteristic.OccupancyDetected).updateValue(value, null, "updateState");
  }



MyAccessory.prototype.getState =function (callback) {
    value = fs.existsSync(this.filePath)
    callback(null,value)
  }


  MyAccessory.prototype.getServices = function () {
    return [this.service]
  }
