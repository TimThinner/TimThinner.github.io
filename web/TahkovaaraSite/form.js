/*

*/
(function($) {
	
	let formStartDate = undefined;
	let formEndDate = undefined;
	let formPersonCount = 1;
	let formHotTub = 'Ei';
	
	formReset = function() {
		$("#form-params").hide();
		$("#form-link-wrapper").show();
		// Clear global variables.
		formStartDate = undefined;
		formEndDate = undefined;
		formPersonCount = 1;
		formHotTub = 'Ei';
		// Remove the "Send" button.
		$('#form-send-wrapper').empty();
		// Destroy Picker plugins:
		$('#startdate').datepicker('destroy');
		$('#enddate').datepicker('destroy');
		// Destroy Select plugin:
		$('select').formSelect('destroy');
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
			const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#form-send-wrapper').empty().append(mailto);
			
		} else {
			// All good => we enable the "send" button.
			const s_date = moment(formStartDate).format('dddd DD.MM.YYYY');
			const e_date = moment(formEndDate).format('dddd DD.MM.YYYY');
			const body = 'Tulo%3A%20'+s_date+'%0D%0ALähtö%3A%20'+e_date+'%0D%0AHenkilömäärä%3A%20'+formPersonCount+'%0D%0APalju%3A%20'+formHotTub+'%0D%0AJos haluat voit lisätä vielä vapaamuotoisen viestin tähän%3A%0D%0A%0D%0A%0D%0A';
			// LF 	line feed 			%0A
			// CR 	carriage return 	%0D
			const mailto = '<a id="mailto" class="waves-effect waves-light btn" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara&body=' + body + '">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#form-send-wrapper').empty().append(mailto);
			$('#mailto').on('click',function() {
				setTimeout(() => {
					formReset();
				}, 1000);
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
		const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara">LÄHETÄ<i class="material-icons right">send</i></a>';
		$('#form-send-wrapper').empty().append(mailto);
		
		/*
			Create datepickers to datepicker placeholders:
			<div class="input-field col s12 m6" id="startdate-wrapper" style="margin-bottom:16px;"></div>
			<div class="input-field col s12 m6" id="enddate-wrapper" style="margin-bottom:16px;"></div>
		*/
		
		const select_markup = '<select class="browser-default" id="person-count"><option value="1" selected>1</option>'+
			'<option value="2">2</option>'+
			'<option value="3">3</option>'+
			'<option value="4">4</option>'+
			'<option value="5">5</option>'+
			'<option value="6">6</option>'+
			'<option value="7">7</option>'+
			'<option value="8">8</option>'+
			'</select><label>Valitse henkilömäärä</label>';
		
		$('#startdate-wrapper').empty().append('<input id="startdate" type="text" class="datepicker"><label for="startdate">Tulopäivä:</label>');
		$('#enddate-wrapper').empty().append('<input id="enddate" type="text" class="datepicker"><label for="enddate">Lähtöpäivä:</label>');
		$('#person-count-wrapper').empty().append(select_markup);
		$('#hottub-wrapper').empty().append('<p style="padding-left:1rem"><label><input type="checkbox" id="hottub" class="filled-in" /><span>Kylpypalju tunnelmavalaistuksella (lisähintaan)</span></label></p>');
		
		$('select').formSelect();
		
		$('#person-count').on('change',function() {
			formPersonCount = $(this).val();
			formGenerateMailToLink();
		});
		
		$('#hottub').on('change', function () {
			if ($(this).prop("checked")) {
				formHotTub = 'Kyllä';
			} else {
				formHotTub = 'Ei';
			}
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
