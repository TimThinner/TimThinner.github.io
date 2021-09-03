/*
New format for Validator
INPUT (array):
[
{"test" : "test to perform", "name": "Name of property", "value": "value to test"},
{"test" : "test to perform", "name": "Name of property", "value": "value to test"},
...
]
OUTPUT (array):
[
"Name of property MISSING",
...
]
*/
export default class Validator {
	
	constructor() {
		
	}
	
	validate(a) {
		const messages = [];
		a.forEach(function(item) {
			if (item.test === 'email') {
				if (item.value.length > 0) {
					var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
					if (!re.test(item.value)) {
						messages.push(item.name+" not valid");
					}
				} else {
					messages.push(item.name+" missing");
				}
			} else if (item.test === 'pass') {
				if (item.value.length > 0) {
					var min_length = 3;
					if (item.value.length < min_length) {
						messages.push(item.name+" too short");
					}
				} else {
					messages.push(item.name+" missing");
				}
			} else if (item.test === 'exist') {
				if (item.value.length > 0) {
					// OK.
				} else {
					messages.push(item.name+" missing");
				}
			} else if (item.test === 'is_positive_number') {
				if (isNaN(item.value)) {
					messages.push(item.name+" not a number");
				} else {
					if (item.value <= 0) {
						messages.push(item.name+" must be positive number");
					}
				}
			} else if (item.test === 'quantity') {
				if (isNaN(item.value)) {
					messages.push(item.name+" not a number");
				} else {
					if (item.value < 1) {
						messages.push(item.name+" must be greater than zero");
					}
				}
			}
		});
		return messages;
	}
}
