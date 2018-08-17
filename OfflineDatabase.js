const fs = require("fs");
const message = require('./constant');

const dbFilePath = __dirname + "/" + "users.json";

class OfflineDatabase {
	constructor() {
			this.path = '';
	}

	ref(path) {
			this.path = path;
			
			return this;
	}

	push(userData) {
		return new Promise((reslove, reject) => {
			if (this.path != "users")
				reject(new Error(message.PATH_INVALID));
			
			let contents = fs.readFileSync(dbFilePath, 'utf8');
			contents = JSON.parse(contents);

			let maxId = 0;
			if (contents) {
				Object.keys(contents[this.path]).map(id => {
					let index = id.replace('ID', '');
					if (maxId < parseInt(index))
							maxId = parseInt(index);
				});
			}

			maxId++;
			let newUserId = `ID${maxId}`;
			contents['users'][newUserId] = userData;

			fs.writeFileSync(dbFilePath, JSON.stringify(contents));

			reslove(newUserId);
	})    
	}

	once() {
		return new Promise((resolve, reject) => {
			let jsonKeys = this.path.split('/');
			let contents = fs.readFileSync(dbFilePath, 'utf8');

			if (jsonKeys.length > 0) {
				contents = JSON.parse(contents);
				let temp = contents;

				jsonKeys.forEach(key => {
					if (key) {
						temp = temp[key];
						if (!temp)
							reject(new Error(message.PATH_INVALID));
						}
				})

				resolve(temp);
		}

		reject(new Error(message.PATH_INVALID));
		
		})
	}

	remove() {
		return new Promise((resolve, reject) => {
			let jsonKeys = this.path.split('/');

			if (jsonKeys.length > 0) {
				let contents = fs.readFileSync(dbFilePath, 'utf8');

				let deleteKey = jsonKeys[jsonKeys.length - 1];
				contents = JSON.parse(contents);
				let temp = contents;
				let ttemp = contents;

				jsonKeys.forEach(key => {
					if (key) {
						temp = temp[key];
						if (!temp) {
							reject(new Error(message.NOT_EXIST));
						} else {
							if (key === deleteKey) {
								let deleteObject = ttemp[key];
								let newJSONString = JSON.stringify(contents).replace(`,"${deleteKey}":${JSON.stringify(deleteObject)}`, '');
								
								fs.writeFileSync(dbFilePath, newJSONString, {flag: 'w'});
								resolve(message.SUCCESS);
							}
						}
					}
					ttemp = ttemp[key];
				})
			}
			reject(new Error(message.PATH_INVALID));
		})
	}
}

exports.database = new OfflineDatabase();