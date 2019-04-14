function BusStopService()
{
	var stops = [
		{ stopId: 1, lat: 33.760262, lng: -84.384706, donationsRaisedInDollars: 0, name: 'Hertz at Portman Blvd' },
		{ stopId: 2, lat: 33.760138, lng: -84.388043, donationsRaisedInDollars: 0, name: 'Peachtree Center Mall' },
		{ stopId: 3, lat: 33.757355, lng: -84.386423, donationsRaisedInDollars: 0, name: 'Georgia Pacific' },
		{ stopId: 4, lat: 33.758648, lng: -84.382754, donationsRaisedInDollars: 0, name: 'Sheraton Atlanta' },
		{ stopId: 5, lat: 33.755365, lng: -84.384921, donationsRaisedInDollars: 0, name: 'Loudermilk Center' },
		{ stopId: 6, lat: 33.756887, lng: -84.389417, donationsRaisedInDollars: 0, name: 'Rialto Arts Center' },
		{ stopId: 7, lat: 33.759215, lng: -84.391719, donationsRaisedInDollars: 0, name: 'Sky View Atlanta' },
		{ stopId: 8, lat: 33.762046, lng: -84.391708, donationsRaisedInDollars: 0, name: 'Centennial Park' },
		{ stopId: 9, lat: 33.763004, lng: -84.387041, donationsRaisedInDollars: 0, name: 'Suntrust Plaza' },
		{ stopId: 10, lat: 33.754661, lng: -84.380101, donationsRaisedInDollars: 0, name: 'Sweet Auburn Market' }
	];

	/**
	 * returns an array of all stops on success
	 * on failure, throws Error
	 */
	this.getAllStops = function ()
	{
		randomlyFailWith('Unable to read database');

		return clone(stops);
	}

	/**
	 * returns nothing on success
	 * on failure, throws Error
	 */
	this.addDonation = function (stopId, donationAmountInDollars)
	{
		randomlyFailWith('Unable to connect to database');

		var stop = stops.find(function (s)
		{
			return s.stopId === stopId;
		});

		if (!stop)
		{
			throw new Error('Stop with stop id ' + stopId + ' not found.');
		}

		stop.donationsRaisedInDollars += donationAmountInDollars;
	}


	// thanks to http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
	function clone(obj) 
	{
	    var copy;

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || 'object' != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error('Unable to copy obj! Its type is not supported.');
	}

	function randomlyFailWith(errorMessage)
	{
		if ((Math.random() * 100) > 80.0)
		{
			throw new Error(errorMessage);
		}
	}
}
export default BusStopService;