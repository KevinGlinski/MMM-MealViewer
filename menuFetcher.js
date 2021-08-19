const Log = require("logger");
const fetch = require("node-fetch");

/**
 * @external Moment
 */
 const moment = require("moment");

const MenuFetcher = function (school, schoolKey) {
    let reloadInterval = 3600000; //hourly 
	let reloadTimer = null;
	
	let fetchFailedCallback = function () {};
	let eventsReceivedCallback = function () {};

	/**
	 * Initiates menu fetch.
	 */
	const fetchMenu = () => {
		clearTimeout(reloadTimer);
		reloadTimer = null;
		
        let date = moment().format("MM-DD-yyyy");

        Log.info("getting menu for " + date);

        fetch("https://api.mealviewer.com/api/v4/school/" + schoolKey + "/" + date +"/" + date +"/")
            .catch((error) => {
                fetchFailedCallback(this, error);
                scheduleTimer();
            })
            .then((response) => response.text())
            .then((responseData) => {
				let meals = {
					lunch: [],
					breakfast: []
				};

                let menu = JSON.parse(responseData);

                menu.menuSchedules.forEach((m)=>{
                    m.menuBlocks.forEach((i)=>{
                        
                        i.cafeteriaLineList.data.forEach((d)=>{
                            
                            d.foodItemList.data.forEach((item)=>{
                                if(item.item_Type === "Entree"){
                                    let meal = item.block_Name + " " + item.item_Name
                                    Log.info(school + " " + meal);

                                    if(meals[item.block_Name.toLowerCase()]) {
                                        if(meals[item.block_Name.toLowerCase()].indexOf(item.item_Name) === -1){
                                            meals[item.block_Name.toLowerCase()].push(item.item_Name);
                                        }
                                    }
                                }
                                
                            
                            });
                        })
                        
                    });
                });

                this.broadcastEvents(meals);

                scheduleTimer();

            })

	};

	/**
	 * Schedule the timer for the next update.
	 */
	const scheduleTimer = function () {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function () {
			fetchMenu();
		}, reloadInterval);
	};

	/* public methods */

	/**
	 * Initiate fetchMenu();
	 */
	this.startFetch = function () {
		fetchMenu();
	};

	/**
	 * Broadcast the existing events.
	 */
	this.broadcastEvents = function () {
		Log.info("Menu-Fetcher: Broadcasting " + meals.length + " events.");
		eventsReceivedCallback(this);
	};

	/**
	 * Sets the on success callback
	 *
	 * @param {Function} callback The on success callback.
	 */
	this.onReceive = function (callback) {
		eventsReceivedCallback = callback;
	};

	/**
	 * Sets the on error callback
	 *
	 * @param {Function} callback The on error callback.
	 */
	this.onError = function (callback) {
		fetchFailedCallback = callback;
	};

	/**
	 * Returns the url of this fetcher.
	 *
	 * @returns {string} The url of this fetcher.
	 */
	this.url = function () {
		return url;
	};

	/**
	 * Returns current available meals for this fetcher.
	 *
	 * @returns {object[]} The current available meals for this fetcher.
	 */
	this.meals = function () {
		return meals;
	};	
    
    this.schoolName = function () {
		return school;
	};
};

module.exports = MenuFetcher;
