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
	
	constructor(options) {
		if (typeof options.languagemodel !== 'undefined') {
			this.LM = options.languagemodel;
		} else {
			this.LM = undefined;
		}
	}
	
	validate(a) {
		const messages = [];
		
		let validator_not_valid = ' not valid';
		let validator_missing = ' missing';
		let validator_too_short = ' too short';
		let validator_not_a_number = ' not a number';
		let validator_must_be_positive_number = ' must be positive number';
		let validator_must_be_greater_than_zero = ' must be greater than zero';
		
		if (typeof this.LM !== 'undefined') {
			const sel = this.LM.selected;
			validator_not_valid = this.LM['translation'][sel]['VALIDATOR_NOT_VALID'];
			validator_missing = this.LM['translation'][sel]['VALIDATOR_MISSING'];
			validator_too_short = this.LM['translation'][sel]['VALIDATOR_TOO_SHORT'];
			validator_not_a_number = this.LM['translation'][sel]['VALIDATOR_NOT_A_NUMBER'];
			validator_must_be_positive_number = this.LM['translation'][sel]['VALIDATOR_MUST_BE_POSITIVE_NUMBER'];
			validator_must_be_greater_than_zero = this.LM['translation'][sel]['VALIDATOR_MUST_BE_GREATER_THAN_ZERO'];
		}
		
		a.forEach(function(item) {
			if (item.test === 'email') {
				if (item.value.length > 0) {
					var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
					if (!re.test(item.value)) {
						messages.push(item.name + validator_not_valid);
					}
				} else {
					messages.push(item.name + validator_missing);
				}
			} else if (item.test === 'pass') {
				if (item.value.length > 0) {
					var min_length = 3;
					if (item.value.length < min_length) {
						messages.push(item.name + validator_too_short);
					}
				} else {
					messages.push(item.name + validator_missing);
				}
			} else if (item.test === 'exist') {
				if (item.value.length > 0) {
					// OK.
				} else {
					messages.push(item.name + validator_missing);
				}
			} else if (item.test === 'is_positive_number') {
				if (isNaN(item.value)) {
					messages.push(item.name + validator_not_a_number);
				} else {
					if (item.value <= 0) {
						messages.push(item.name + validator_must_be_positive_number);
					}
				}
			} else if (item.test === 'quantity') {
				if (isNaN(item.value)) {
					messages.push(item.name + validator_not_a_number);
				} else {
					if (item.value < 1) {
						messages.push(item.name + validator_must_be_greater_than_zero);
					}
				}
			}
		});
		return messages;
	}
}
