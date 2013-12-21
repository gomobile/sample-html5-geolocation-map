    var _map = null;
    var _seconds = 30;
	var _llbounds = null;

	var boolTripTrack=true;  //use this flag to continually update the GPS location and leave markers every 30 seconds

    function initialize()
    { }

    function drawMap()
    {
        var latlng = new google.maps.LatLng(currentLatitude,currentLongitude);
        var mapOptions = {
            zoom:10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.HYBRID,
			zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.SMALL,
			  position: google.maps.ControlPosition.LEFT_TOP
            },
        };

        if (boolTripTrack==true)
        {
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

	var suc = function(p){
		console.log("geolocation success",4);

		if( _map == null ) {
			currentLatitude = p.coords.latitude;
			currentLongitude = p.coords.longitude;
			drawMap();
		}

	  	var myLatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
	  	var beachMarker = new google.maps.Marker({
		  position: myLatLng,
		  map: _map
		});

		if( _llbounds == null )
			_llbounds = new google.maps.LatLngBounds(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
		else
			_llbounds.extend(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
		_map.fitBounds(_llbounds);
	};

	var fail = function(){
		console.log("Geolocation failed. \nPlease enable GPS in Settings.",1);
	};

    var getLocation = function()
    {
        console.log("in getLocation",4);
    }

    function onDeviceReady()
    {
        try
        {
            if (intel.xdk.device.platform.indexOf("Android")!=-1)
            {
                intel.xdk.display.useViewport(480,480);
                document.getElementById("map_canvas").style.width="480px";
            }
            else if (intel.xdk.device.platform.indexOf("iOS")!=-1)
            {
                if (intel.xdk.device.model.indexOf("iPhone")!=-1 || intel.xdk.device.model.indexOf("iPod")!=-1)
                {
                    intel.xdk.display.useViewport(320,320);
                    document.getElementById("map_canvas").style.width="320px";
                }
                else if (intel.xdk.device.model.indexOf("iPad")!=-1)
                {
                    intel.xdk.display.useViewport(768,768);
                    document.getElementById("map_canvas").style.width="768px";
                }
            }
            
           if (intel.xdk.iswin8) {
                document.getElementById("map_canvas").style.width = screen.width + "px"
                document.getElementById("map_canvas").style.height = screen.height + "px";
            }

            
			if (intel.xdk.geolocation != null)
			{
				document.getElementById("map_canvas").style.height = screen.height + "px";
				intel.xdk.geolocation.watchPosition(suc,fail,options);
			}
        }
        catch(e)
        {
            alert(e.message);
        }

        try
        {
            //lock orientation
            intel.xdk.device.setRotateOrientation("portrait");
            intel.xdk.device.setAutoRotate(false);
        }
        catch(e) {}

        try
        {
            //manage power
            intel.xdk.device.managePower(true,false);
        }
        catch(e) {}
		
		try
		{
			//hide splash screen
			intel.xdk.device.hideSplashScreen();
        }
        catch(e) {}		
    }


    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);
