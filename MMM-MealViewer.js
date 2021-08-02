

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

		this.sendSocketNotification("hello")
		

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

	// // Override dom generator.
	// getDom: function() {
	// 	var wrapper = document.createElement("div");
	// 	// wrapper.innerHTML = "<table><tr><td>" + this.config.schoolName +" </td><td>Middle School</td><td>Rosa Parks</td></tr>"+
    //     // "<tr><td><ul><li>lunch</li></ul></td><td><ul><li>lunch</li></ul></td><td><ul><li>lunch</li></ul></td></tr>"
    //     // +"</table>";

    //     // wrapper.innerHTML = "<label>"+ this.config.schoolName + "</label><br/>"

	// 	html = "<table><tr><td></td><td>School Lunch</td><td></td></tr><tr>"

	// 	// Object.keys(this.menus).forEach((key)=>{
	// 	// 	html = html + "<td>" + key +" </td>"
	// 	// });

	// 	this.config.schools.forEach((school )=> {
	// 		html = html + "<td>" + school.name +" </td>"
	// 	});

	// 	html = html + "</tr><tr>"

	// 	this.config.schools.forEach((school )=> {
	// 		html + "<td>" 

	// 		if(this.menus[school.name]){
	// 			html = html + this.menus[school.name][0];
	// 		}
			
	// 		html = html + " </td>"
	// 	});

	// 	html = html + "</tr></table>"

	// 	wrapper.innerHTML = html

	// 	// wrapper = this.menu.length();

	// 	return wrapper;
	// },

	getStyles: function () {
		return ["MMM-MealViewer.css"];
	},
});