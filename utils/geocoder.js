const NodeGeocoder = require('node-geocoder'),
 options = {
  provider:process.env.GEOCODER_PROVIDER,
  apiKey:'AIzaSyAlbJEjGnDwzIwRJJomimekdLD3z7WxrRs', 
  formatter: null 
};
const geocoder = NodeGeocoder(options);
module.exports=geocoder;