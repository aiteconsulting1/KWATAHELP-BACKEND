define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "/home/lucien/Documents/github/Mapane/doc/main.js",
    "groupTitle": "/home/lucien/Documents/github/Mapane/doc/main.js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/alerts",
    "title": "Request fetch all alerts",
    "name": "AlertAll",
    "group": "Alert",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "alerts",
            "description": "<p>all alerts from database.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/alert.js",
    "groupTitle": "Alert"
  },
  {
    "type": "post",
    "url": "/create-alert",
    "title": "Request creating an alert",
    "name": "AlertCreate",
    "group": "Alert",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lat",
            "description": "<p>Latitude of the alert.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "long",
            "description": "<p>Longitude of the alert.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "desc",
            "description": "<p>description of the alert.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "postedBy",
            "description": "<p>The id of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "category",
            "description": "<p>the id of the category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>the address of the alert.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Alert created successfully.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/alert.js",
    "groupTitle": "Alert"
  },
  {
    "type": "get",
    "url": "/alerts/id",
    "title": "Request id the id of the user",
    "name": "AlertsHistory",
    "group": "Alert",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "alerts",
            "description": "<p>an object of all user's alerts.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/alert.js",
    "groupTitle": "Alert"
  },
  {
    "type": "put",
    "url": "/edit/id",
    "title": "Request id the id of the user",
    "name": "UserEdit",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "residence",
            "description": "<p>Residence of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Phone of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>User updated successfully.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>details  of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Request User Signup",
    "name": "UserSignup",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Optional Name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Phone of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Type of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>passord of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Account created successfully.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>details  of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "User"
  }
] });
