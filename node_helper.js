const NodeHelper = require("node_helper");
const Log = require("logger");
const fetch = require("node-fetch");
const MenuFetcher = require("./menuFetcher.js");

module.exports = NodeHelper.create({
    start: function () {
		Log.log("Starting node helper for:  " + this.name);
		this.fetchers = [];
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function (notification, payload) {
        Log.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);

		if (notification === "ADD_SCHOOL") {
            this.createFetcher(payload.name, payload.schoolKey);
		}
	},

    createFetcher: function (school, schoolKey) {
		
		let fetcher = new MenuFetcher(school, schoolKey);

        fetcher.onReceive((fetcher) => {
            Log.info("Got Menu " + school)
            this.broadcastMenu(fetcher);
        });

        fetcher.onError((fetcher, error) => {
            Log.error("menu Error. Could not fetch menu: ", fetcher.url(), error);
            this.sendSocketNotification("FETCH_ERROR", {
              school,
              url,
            });
        });

        this.fetchers[school] = fetcher;

		fetcher.startFetch();
	},

    broadcastMenu: function (fetcher) {
        Log.info("Broadcast menu " + fetcher.schoolName())
		this.sendSocketNotification("SCHOOL_MEALS", {
			name: fetcher.schoolName(),
			meals: fetcher.meals()
		});
	},

});