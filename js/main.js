/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global intel:false, google:false*/
var _map = null;
var _seconds = 30;
var _llbounds = null;
var myLatLng;
var oldLatLng = "";
var boolTripTrack = true;
//Create the google Maps and LatLng object 

function drawMap() {
    //Creates a new google maps object
    var latlng = new google.maps.LatLng(currentLatitude, currentLongitude);
    myLatLng = latlng;
    var mapOptions = {
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_TOP
        },
    };
    if (boolTripTrack === true) {
        _map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    }
}
//40.7655,-73.97204 = NYC
var currentLatitude = "40.713768";
var currentLongitude = "-73.016696";
var options = {
    timeout: 10000,
    maximumAge: 11000,
    enableHighAccuracy: true
};
//Success callback
var suc = function(p) {
        console.log("geolocation success", 4);
        //Draws the map initially
        if (_map === null) {
            currentLatitude = p.coords.latitude;
            currentLongitude = p.coords.longitude;
            drawMap();
        } else {
            myLatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        }
        //Creates a new google maps marker object for using with the pins
        if ((myLatLng.toString().localeCompare(oldLatLng.toString())) !== 0) {
            //Create a new map marker
            var Marker = new google.maps.Marker({
                position: myLatLng,
                map: _map
            });
            if (_llbounds === null) {
                //Create the rectangle in geographical coordinates
                _llbounds = new google.maps.LatLngBounds(new google.maps.LatLng(p.coords.latitude, p.coords.longitude)); //original
            } else {
                //Extends geographical coordinates rectangle to cover current position
                _llbounds.extend(myLatLng);
            }
            //Sets the viewport to contain the given bounds & triggers the "zoom_changed" event
            _map.fitBounds(_llbounds);
        }
        oldLatLng = myLatLng;
    };
var fail = function() {
        console.log("Geolocation failed. \nPlease enable GPS in Settings.", 1);
    };
var getLocation = function() {
        console.log("in getLocation", 4);
    };
    //Execute when the DOM loads
    //The Intel XDK intel.xdk.device.ready event fires once the Intel XDK has fully loaded. 
    //After the device has fired, you can safely make calls to Intel XDK function.    

function onDeviceReady() {
    try {
        if (intel.xdk.device.platform.indexOf("Android") != -1) {
            intel.xdk.display.useViewport(480, 480);
            document.getElementById("map_canvas").style.width = "480px";
        } else if (intel.xdk.device.platform.indexOf("iOS") != -1) {
            if (intel.xdk.device.model.indexOf("iPhone") != -1 || intel.xdk.device.model.indexOf("iPod") != -1) {
                intel.xdk.display.useViewport(320, 320);
                document.getElementById("map_canvas").style.width = "320px";
            } else if (intel.xdk.device.model.indexOf("iPad") != -1) {
                intel.xdk.display.useViewport(768, 768);
                document.getElementById("map_canvas").style.width = "768px";
            }
        }
        if (intel.xdk.iswin8) {
            document.getElementById("map_canvas").style.width = screen.width + "px";
            document.getElementById("map_canvas").style.height = screen.height + "px";
        }
        if (intel.xdk.geolocation !== null) {
            document.getElementById("map_canvas").style.height = screen.height + "px";
            intel.xdk.geolocation.watchPosition(suc, fail, options);
        }
    } catch (e) {
        alert(e.message);
    }
    try {
        //lock orientation
        intel.xdk.device.setRotateOrientation("portrait");
        intel.xdk.device.setAutoRotate(false);
    } catch (e) {}
    try {
        //manage power
        intel.xdk.device.managePower(true, false);
    } catch (e) {}
    try {
        //hide splash screen
        intel.xdk.device.hideSplashScreen();
    } catch (e) {}
}
document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);