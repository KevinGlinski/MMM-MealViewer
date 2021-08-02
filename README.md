# Module: MMM-MealViewer
The module allows you to view MealViewer based school lunches.  This module will only work when your school lunch menu starts with the url ```https://schools.mealviewer.com/school/<schoolKey>```

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/KevinGlinski/MMM-MealViewer.git
````

Configure the module in your `config.js` file.

**Note:** After starting the Mirror, it will take a few seconds before events start to appear.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
        module: "MMM-MealViewer",
        position: "top_center",
        config: { 
            schools : [
                {
                    name: "High School",
                    schoolKey: "<schoolKey>"
                },
                {
                    name: "Middle School",
                    schoolKey: "<schoolKey>"
                },
                {
                    name: "Elementary School",
                    schoolKey: "<schoolKey>"
                },
            ]
            
        }
    }
]
````

Find the school key in the url to your lunch menu.

