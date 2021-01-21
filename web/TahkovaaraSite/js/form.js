/*

*/
(function($) {
	
	let formStartDate = undefined;
	let formEndDate = undefined;
	let formPersonCountAdults = 1;
	let formPersonCountChildren = 0;
	let formHotTub = 'Ei';
	let formHotTubDays = 0;
	let formHotTubDaysMax = 1; // Max 1 day, but if dates are given => calculate from those.
	let formLinen = 'Ei';
	let formLinenCount = 0;
	let formLinenCountMax = 8; // Max 8 linen.
	let formCleaning = 'Ei';
	let formPets = 'Ei';
	
	let formFirstName = undefined;
	let formLastName = undefined;
	let formAddress = undefined;
	let formTelephoneNumber = undefined;
	let formBirthDate = undefined;
	
	formReset = function() {
		$("#form-params").hide();
		$("#form-link-wrapper").show();
		// Clear global variables.
		formStartDate = undefined;
		formEndDate = undefined;
		formPersonCountAdults = 1;
		formPersonCountChildren = 0;
		formHotTub = 'Ei';
		formHotTubDays = 0;
		formHotTubDaysMax = 1; // Max 1 day, but if dates are given => calculate from those.
		formLinen = 'Ei';
		formLinenCount = 0;
		formLinenCountMax = 8; // Max 8 linen.
		formCleaning = 'Ei';
		formPets = 'Ei';
		
		formFirstName = undefined;
		formLastName = undefined;
		formAddress = undefined;
		formTelephoneNumber = undefined;
		formBirthDate = undefined;
		
		// Remove the "Send" button.
		$('#form-send-wrapper').empty();
		// Destroy Picker plugins:
		$('#startdate').datepicker('destroy');
		$('#enddate').datepicker('destroy');
	}
	
	formReportError = function(errors) {
		const message = errors.join('<br/>');
		const html = '<div class="error-message"><p>'+message+'</p></div>';
		$(html).appendTo('#form-error-wrapper');
	}
	
	formValidate = function() {
		
		const messages = [];
		
		// Check that all params are included and there are no conflicting data in query.
		if (typeof formStartDate === 'undefined') {
			messages.push('Tulopäivä puuttuu!');
		} else {
			const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
			if (moment(formStartDate).isBefore(today)) {
				messages.push('Tulopäivä ei saa olla menneisyydessä!');
			}
		}
		
		if (typeof formEndDate === 'undefined') {
			messages.push('Lähtöpäivä puuttuu!');
		}
		
		if (typeof formStartDate !== 'undefined' && typeof formEndDate !== 'undefined') {
			
			const s = moment(formStartDate).hours(0).minutes(0).seconds(0).milliseconds(0);
			const e = moment(formEndDate).hours(0).minutes(0).seconds(0).milliseconds(0);
			
			if (e.isSameOrBefore(s)) {
				messages.push('Lähtöpäivän täytyy olla tulopäivän jälkeen!');
			}
			formHotTubDaysMax = e.diff(s, 'days'); // //[days, years, months, seconds, ...]
		}
		
		const total = formPersonCountAdults + formPersonCountChildren;
		if (total > 8) {
			messages.push('Henkilömäärä ei saa olla yli 8!');
		}
		
		formFirstName = $('#first-name').val();
		formLastName = $('#last-name').val();
		formAddress = $('#address').val();
		formTelephoneNumber = $('#telephone-number').val();
		formBirthDate = $('#birth-date').val();
		
		if (formFirstName.length === 0) {
			messages.push('Etunimi puuttuu!');
		}
		if (formLastName.length === 0) {
			messages.push('Sukunimi puuttuu!');
		}
		if (formAddress.length === 0) {
			messages.push('Osoite puuttuu!');
		}
		if (formTelephoneNumber.length === 0) {
			messages.push('Puhelinnumero puuttuu!');
		}
		if (formBirthDate.length === 0) {
			messages.push('Syntymäaika puuttuu!');
		}
		
		return messages;
	}
	/*
				"form-link-wrapper"
					"form-link"
				"form-params"
					"form-error-wrapper"
					"form-cancel"
					"form-send-wrapper"
	*/
	// hide => style="display:none"
	// show => style="display:block"
	formGenerateMailToLink = function() {
		
		// Clear previous errors if any.
		$('#form-error-wrapper').empty();
		// Check that all params are included and there are no conflicting data in query.
		const messages = formValidate();
		if (messages.length > 0) {
			// Report all errors
			formReportError(messages);
			// Show disabled send-button.
			const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:tahkovaara@intelcon.fi?subject=Tahkovaara">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#form-send-wrapper').empty().append(mailto);
			
		} else {
			// All good => we enable the "send" button.
			const s_date = moment(formStartDate).format('dddd DD.MM.YYYY');
			const e_date = moment(formEndDate).format('dddd DD.MM.YYYY');
			
			let HotTubText = 'Ei';
			if (formHotTub === 'Yes') {
				HotTubText = 'Kyllä ' + formHotTubDays + ' vrk';
			}
			
			let LinenText = 'Ei';
			if (formLinen === 'Yes') {
				LinenText = 'Kyllä ' + formLinenCount + ' kpl';
			}
			
			const body = 'Tulo%3A%20'+s_date+'%0D%0ALähtö%3A%20'+e_date+
			'%0D%0AAikuisia%3A%20'+formPersonCountAdults+
			'%0D%0ALapsia%3A%20'+formPersonCountChildren+
			'%0D%0APalju%3A%20'+HotTubText+
			'%0D%0ALiinavaatteet%3A%20'+LinenText+
			'%0D%0ALoppusiivous%3A%20'+formCleaning+
			'%0D%0ALemmikki%3A%20'+formPets+
			'%0D%0AEtunimi%3A%20'+formFirstName+
			'%0D%0ASukunimi%3A%20'+formLastName+
			'%0D%0AOsoite%3A%20'+formAddress+
			'%0D%0APuhelinnumero%3A%20'+formTelephoneNumber+
			'%0D%0ASyntymäaika%3A%20'+formBirthDate+
			'%0D%0AJos haluat voit lisätä vielä vapaamuotoisen viestin tähän%3A%0D%0A%0D%0A%0D%0A';
			// LF 	line feed 			%0A
			// CR 	carriage return 	%0D
			
			const mailto = '<a id="mailto" class="waves-effect waves-light btn" href="mailto:tahkovaara@intelcon.fi?subject=Tahkovaara&body=' + body + '">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#form-send-wrapper').empty().append(mailto);
			$('#mailto').on('click',function() {
				//setTimeout(() => {
				//	formReset();
				//}, 1000);
			});
		}
	}
	
	$('#form-link').on('click',function() {
		// Open reservation FORM:
		
		$("#form-link-wrapper").hide();
		$("#form-params").show();
		
		// Clear previous errors if any.
		$('#form-error-wrapper').empty();
		// Show disabled send-button.
		const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:tahkovaara@intelcon.fi?subject=Tahkovaara">LÄHETÄ<i class="material-icons right">send</i></a>';
		$('#form-send-wrapper').empty().append(mailto);
		
		
		// Tulopvm		Lähtöpvm
		//
		//
		// Henkilömäärä erikseen aikuiset lapset (alle 18v)
		// Kylpypalju (Ei,Kyllä) jos kyllä montako vrk?
		// Liinavaatteet (Ei,Kyllä), jos kyllä monta kpl?
		// Loppusiivous (Ei,Kyllä)
		// Lemmikki (Ei,Kyllä)
		// Varaajan nimi, osoite, email, puh, syntymäaika.
		
		const person_count_markup =
			
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6 center">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s4 center" style="color:#888";>Aikuisia:</div>'+
						'<div class="col s8 center">'+ 
							'<div class="row" style="margin-top:-20px;margin-bottom:0;">'+
								
								'<div class="col s5 edit-item-change-number" id="adults" style="text-align:right;">'+formPersonCountAdults+'</div>'+
								
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-4px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="adults-up"><i class="small material-icons">add</i></a>'+
										'</div>'+
									'</div>'+
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="adults-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
								
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s4 center" style="color:#888";>Lapsia (alle 18&nbsp;v):</div>'+
						'<div class="col s8 center">'+ 
							'<div class="row" style="margin-top:-20px;margin-bottom:0;">'+
								
								'<div class="col s5 edit-item-change-number" id="children" style="text-align:right;">'+formPersonCountChildren+'</div>'+
								
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-4px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="children-up"><i class="small material-icons">add</i></a>'+
										'</div>'+ 
									'</div>'+ 
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="children-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
								
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
			
			
		/*
			Create datepickers to datepicker placeholders:
			<div class="input-field col s12 m6" id="startdate-wrapper" style="margin-bottom:16px;"></div>
			<div class="input-field col s12 m6" id="enddate-wrapper" style="margin-bottom:16px;"></div>
		*/
		$('#startdate-wrapper').empty().append('<input id="startdate" type="text" class="datepicker"><label for="startdate">Tulopäivä:</label>');
		$('#enddate-wrapper').empty().append('<input id="enddate" type="text" class="datepicker"><label for="enddate">Lähtöpäivä:</label>');
		
		$('#person-count-wrapper').empty().append(person_count_markup);
		
		const hottub_markup =
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<p style="padding-left:1rem"><label><input type="checkbox" id="hottub" class="filled-in" /><span>Kylpypalju (lisähintaan)</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center" id="hottub-days-wrapper" style="display:none">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s4 center" style="color:#888";>vrk</div>'+
						'<div class="col s8 center">'+ 
							'<div class="row" style="margin-top:-20px;margin-bottom:0;">'+
								
								'<div class="col s5 edit-item-change-number" id="hottub-days" style="text-align:right;">'+formHotTubDays+'</div>'+
								
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-4px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="hottub-days-up"><i class="small material-icons">add</i></a>'+
										'</div>'+
									'</div>'+
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="hottub-days-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
								
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#hottub-wrapper').empty().append(hottub_markup);
		
		const linen_markup =
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<p style="padding-left:1rem"><label><input type="checkbox" id="linen" class="filled-in" /><span>Liinavaatteet</span></label></p>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center" id="linen-count-wrapper" style="display:none">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s4 center" style="color:#888";>kpl</div>'+
						'<div class="col s8 center">'+ 
							'<div class="row" style="margin-top:-20px;margin-bottom:0;">'+
								
								'<div class="col s5 edit-item-change-number" id="linen-count" style="text-align:right;">'+formLinenCount+'</div>'+
								
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-4px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="linen-count-up"><i class="small material-icons">add</i></a>'+
										'</div>'+
									'</div>'+
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="linen-count-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
								
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#linen-wrapper').empty().append(linen_markup);
		
		const cleaning_markup =
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6">'+
					'<div class="row" style="margin-top:16px;margin-bottom:0;">'+
						'<p style="padding-left:1rem"><label><input type="checkbox" id="cleaning" class="filled-in" /><span>Loppusiivous</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#cleaning-wrapper').empty().append(cleaning_markup);
		
		const pet_markup =
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6">'+
					'<div class="row" style="margin-top:16px;margin-bottom:0;">'+
						'<p style="padding-left:1rem"><label><input type="checkbox" id="pets" class="filled-in" /><span>Lemmikki</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#pet-wrapper').empty().append(pet_markup);
		
		const name_markup =
			'<div class="row">'+
				'<div class="input-field col s6">'+
					'<input id="first-name" type="text">'+
					'<label for="first-name">Etunimi</label>'+
				'</div>'+
				'<div class="input-field col s6">'+
					'<input id="last-name" type="text">'+
					'<label for="last-name">Sukunimi</label>'+
				'</div>'+
			'</div>';
		$('#name-wrapper').empty().append(name_markup);
		
		const address_markup =
			'<div class="row">'+
				'<div class="input-field col s12">'+
					'<input id="address" type="text">'+
					'<label for="address">Osoite</label>'+
				'</div>'+
			'</div>';
		$('#address-wrapper').empty().append(address_markup);
		
		const tel_markup =
			'<div class="row">'+
				'<div class="input-field col s6">'+
					'<input id="telephone-number" type="text">'+
					'<label for="telephone-number">Puhelinnumero</label>'+
				'</div>'+
				'<div class="input-field col s6">'+
					'<input id="birth-date" type="text">'+
					'<label for="birth-date">Syntymäaika</label>'+
				'</div>'+
			'</div>';
		$('#telephone-wrapper').empty().append(tel_markup);
		
		$('#adults-up').on('click',function() {
			if (formPersonCountAdults < 8) {
				formPersonCountAdults++;
				$('#adults').empty().append(formPersonCountAdults);
				// New: when person count is modified => if LINEN is included => automatically modify the LINEN count.
				if (formLinen === 'Yes') {
					const total = formPersonCountAdults + formPersonCountChildren;
					if (total > 8) {
						formLinenCount = 8;
					} else {
						formLinenCount = total;
					}
					$('#linen-count').empty().append(formLinenCount);
				}
				formGenerateMailToLink();
			}
		});
		$('#adults-down').on('click',function() {
			if (formPersonCountAdults > 1) {
				formPersonCountAdults--;
				$('#adults').empty().append(formPersonCountAdults);
				// New: when person count is modified => if LINEN is included => automatically modify the LINEN count.
				if (formLinen === 'Yes') {
					const total = formPersonCountAdults + formPersonCountChildren;
					if (total > 8) {
						formLinenCount = 8;
					} else {
						formLinenCount = total;
					}
					$('#linen-count').empty().append(formLinenCount);
				}
				formGenerateMailToLink();
			}
		});
		$('#children-up').on('click',function() {
			if (formPersonCountChildren < 7) {
				formPersonCountChildren++;
				$('#children').empty().append(formPersonCountChildren);
				// New: when person count is modified => if LINEN is included => automatically modify the LINEN count.
				if (formLinen === 'Yes') {
					const total = formPersonCountAdults + formPersonCountChildren;
					if (total > 8) {
						formLinenCount = 8;
					} else {
						formLinenCount = total;
					}
					$('#linen-count').empty().append(formLinenCount);
				}
				formGenerateMailToLink();
			}
		});
		$('#children-down').on('click',function() {
			if (formPersonCountChildren > 0) {
				formPersonCountChildren--;
				$('#children').empty().append(formPersonCountChildren);
				// New: when person count is modified => if LINEN is included => automatically modify the LINEN count.
				if (formLinen === 'Yes') {
					const total = formPersonCountAdults + formPersonCountChildren;
					if (total > 8) {
						formLinenCount = 8;
					} else {
						formLinenCount = total;
					}
					$('#linen-count').empty().append(formLinenCount);
				}
				formGenerateMailToLink();
			}
		});
		
		$('#hottub').on('change', function () {
			if ($(this).prop("checked")) {
				formHotTub = 'Yes';
				formHotTubDays = 1;
				$('#hottub-days').empty().append(formHotTubDays);
				// If 'yes' => ask how many days hottub is needed.
				$('#hottub-days-wrapper').show();
				
			} else {
				formHotTub = 'Ei';
				formHotTubDays = 0;
				$('#hottub-days').empty().append(formHotTubDays);
				// If 'no' => remove additional question
				$('#hottub-days-wrapper').hide();
			}
			formGenerateMailToLink();
		});
		
		$('#hottub-days-up').on('click',function() {
			if (formHotTubDays < formHotTubDaysMax) {
				formHotTubDays++;
				$('#hottub-days').empty().append(formHotTubDays);
				formGenerateMailToLink();
			}
		});
		$('#hottub-days-down').on('click',function() {
			if (formHotTubDays > 1) {
				formHotTubDays--;
				$('#hottub-days').empty().append(formHotTubDays);
				formGenerateMailToLink();
			}
		});
		
		$('#linen').on('change', function () {
			if ($(this).prop("checked")) {
				formLinen = 'Yes';
				formLinenCount = formPersonCountAdults + formPersonCountChildren;
				$('#linen-count').empty().append(formLinenCount);
				// If 'yes' => ask how many linens are needed.
				$('#linen-count-wrapper').show();
				
			} else {
				formLinen = 'Ei';
				formLinenCount = 0;
				$('#linen-count').empty().append(formLinenCount);
				// If 'no' => remove additional question
				$('#linen-count-wrapper').hide();
			}
			formGenerateMailToLink();
		});
		
		$('#linen-count-up').on('click',function() {
			if (formLinenCount < formLinenCountMax) {
				formLinenCount++;
				$('#linen-count').empty().append(formLinenCount);
				formGenerateMailToLink();
			}
		});
		$('#linen-count-down').on('click',function() {
			if (formLinenCount > 1) {
				formLinenCount--;
				$('#linen-count').empty().append(formLinenCount);
				formGenerateMailToLink();
			}
		});
		
		
		$('#cleaning').on('change', function () {
			if ($(this).prop("checked")) {
				formCleaning = 'Kyllä';
			} else {
				formCleaning = 'Ei';
			}
			formGenerateMailToLink();
		});
		
		$('#pets').on('change', function () {
			if ($(this).prop("checked")) {
				formPets = 'Kyllä';
			} else {
				formPets = 'Ei';
			}
			formGenerateMailToLink();
		});
		
		
		$('#first-name').on('change', function(){
			formGenerateMailToLink();
		});
		$('#last-name').on('change', function(){
			formGenerateMailToLink();
		});
		$('#address').on('change', function(){
			formGenerateMailToLink();
		});
		$('#telephone-number').on('change', function(){
			formGenerateMailToLink();
		});
		$('#birth-date').on('change', function(){
			formGenerateMailToLink();
		});
		
		
		
		// Initialize Picker plugins:
		$('#startdate').datepicker({
			autoClose: true,
			firstDay:1,
			format: 'dddd dd.mm.yyyy',
			i18n: {
				cancel:'Cancel',
				clear:'Clear',
				done:'Ok',
				months:['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
				monthsShort:['Tammi','Helmi','Maalis','Huhti','Touko','Kesä','Heinä','Elo','Syys','Loka','Marras','Joulu'],
				weekdays:['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
				weekdaysShort:['Su','Ma','Ti','Ke','To','Pe','La'],
				weekdaysAbbrev:['Su','Ma','Ti','Ke','To','Pe','La']
				//weekdaysAbbrev:['S','M','T','K','T','P','L']
			},
			onSelect: function(date){
				formStartDate = date;
				formGenerateMailToLink();
			}
		});
		
		$('#enddate').datepicker({
			autoClose: true,
			firstDay:1,
			format: 'dddd dd.mm.yyyy',
			i18n: {
				cancel:'Cancel',
				clear:'Clear',
				done:'Ok',
				months:['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
				monthsShort:['Tammi','Helmi','Maalis','Huhti','Touko','Kesä','Heinä','Elo','Syys','Loka','Marras','Joulu'],
				weekdays:['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
				weekdaysShort:['Su','Ma','Ti','Ke','To','Pe','La'],
				weekdaysAbbrev:['Su','Ma','Ti','Ke','To','Pe','La']
				//weekdaysAbbrev:['S','M','T','K','T','P','L']
			},
			onOpen: function() {
				if (typeof formStartDate !== 'undefined') {
					const nextDate = moment(formStartDate).add(1, 'days').toDate();
					$('#enddate').datepicker('setDate',nextDate);
				}
			},
			onSelect: function(date){
				formEndDate = date;
				formGenerateMailToLink();
			}
		});
	});
	
	$('#form-cancel').on('click',function() {
		formReset();
	});
	
})(jQuery);
