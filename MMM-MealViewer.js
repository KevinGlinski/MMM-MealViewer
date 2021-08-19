

Module.register("MMM-MealViewer",{

	menus : {},

	// Default module config.
	defaults: {		
	},

	socketNotificationReceived: function(notification, payload) {
		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + JSON.stringify(payload));

		this.menus[payload.name] = payload.meals;

		this.updateDom();
	},

	
    start: function(){
		Log.info("Starting school lunch");

		this.config.schools.forEach((school )=> {			
			this.sendSocketNotification("ADD_SCHOOL", school);
		});
    },


	getTemplate: function () {
		return "menus.njk";
	},

	getTemplateData: function () {
		let schools = [];

		this.config.schools.forEach((school )=> {

			let schoolData = {
				name: school.name,				
			}

			if(this.menus[school.name]){
				schoolData.menus = this.menus[school.name];
			}

			schools.push(schoolData);
		});

		return {
			schools
		};
	},

	getStyles: function () {
		return ["MMM-MealViewer.css"];
	},
});