var OfflineDatabase = require('./OfflineDatabase.js');

var db = OfflineDatabase.database

db.ref("users").push({"name":"Bob", "address":{"city":"New York", "country":"US"}}) // Push function
.then(id => console.log(id))
.catch(error => console.log(error.message)); 

db.ref("users/ID2/address/").once()  // Get one
.then(data => console.log(data))
.catch(error => console.log(error.message));

db.ref("users/ID2/address").remove()  // Delete Object by key
.then(status => console.log(status))
.catch(error => console.log(error.message));
