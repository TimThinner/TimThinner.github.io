
(function($) {
	
	let TahkovaaraStartDate = undefined;
	let TahkovaaraEndDate = undefined;
	
	TahkovaaraReportError = function(errors) {
		const message = errors.join('<br/>');
		const html = '<div class="error-message"><p>'+message+'</p></div>';
		$(html).appendTo('#form-error-wrapper');
	}
	
	TahkovaaraValidate = function() {
		
		const messages = [];
		
		// Check that all params are included and there are no conflicting data in query.
		if (typeof TahkovaaraStartDate === 'undefined') {
			messages.push('Tulopäivä puuttuu!');
		} else {
			const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
			if (moment(TahkovaaraStartDate).isBefore(today)) {
				messages.push('Tulopäivä on menneisyydessä!');
			}
		}
		
		if (typeof TahkovaaraEndDate === 'undefined') {
			messages.push('Lähtöpäivä puuttuu!');
		}
		
		if (typeof TahkovaaraStartDate !== 'undefined' && typeof TahkovaaraEndDate !== 'undefined') {
			
			const s = moment(TahkovaaraStartDate).hours(0).minutes(0).seconds(0).milliseconds(0);
			const e = moment(TahkovaaraEndDate).hours(0).minutes(0).seconds(0).milliseconds(0);
			
			if (e.isSameOrBefore(s)) {
				messages.push('Lähtöpäivä on sama tai aikaisempi kuin tulopäivä!');
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
	TahkovaaraRegenerateMailToLink = function(id, date) {
		if (typeof date !== 'undefined') {
			if (id==='startdate') {
				TahkovaaraStartDate = date
			} else {
				TahkovaaraEndDate = date;
			}
			// Clear previous errors if any.
			$('#form-error-wrapper').empty();
			
			// Check that all params are included and there are no conflicting data in query.
			const messages = TahkovaaraValidate();
			if (messages.length > 0) {
				
				// Report all errors
				TahkovaaraReportError(messages);
				// Show disabled send-button.
				const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara">LÄHETÄ<i class="material-icons right">send</i></a>';
				$('#form-send-wrapper').empty().append(mailto);
				
			} else {
				// All good => we enable the "send" button.
				const p_count = 3;
				const s_date = moment(TahkovaaraStartDate).format('dddd DD.MM.YYYY');
				const e_date = moment(TahkovaaraEndDate).format('dddd DD.MM.YYYY');
				const body = 'Tulo%3A%20'+s_date+'%0D%0ALähtö%3A%20'+e_date+'%0D%0AHenkilömäärä%3A%20'+p_count+'%0D%0AJos haluat voit lisätä vielä vapaamuotoisen viestin tähän%3A%0D%0A%0D%0A%0D%0A';
				// LF 	line feed 			%0A
				// CR 	carriage return 	%0D
				
				const mailto = '<a class="waves-effect waves-light btn" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara&body=' + body + '">LÄHETÄ<i class="material-icons right">send</i></a>';
				$('#form-send-wrapper').empty().append(mailto);
			}
		}
	}
	
	$('#form-link').on('click',function() {
		// Open reservation FORM:
		
		$("#form-link-wrapper").hide();
		$("#form-params").show();
		
		// Create datepickers to datepicker placeholders:
		/*
			<div class="input-field col s6">
				<input placeholder="Placeholder" id="first_name" type="text" class="validate">
				<label for="first_name">First Name</label>
			</div>
		*/
		$('#startdate-wrapper').empty().append('<input id="startdate" type="text" class="datepicker"><label for="startdate">Tulopäivä:</label>');
		$('#enddate-wrapper').empty().append('<input id="enddate" type="text" class="datepicker"><label for="enddate">Lähtöpäivä:</label>');
		
		
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
				console.log(['onSelect startdate=',date]);
				TahkovaaraRegenerateMailToLink('startdate',date);
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
				if (typeof TahkovaaraStartDate !== 'undefined') {
					const nextDate = moment(TahkovaaraStartDate).add(1, 'days').toDate();
					$('#enddate').datepicker('setDate',nextDate);
				}
			},
			onSelect: function(date){
				console.log(['onSelect enddate=',date]);
				TahkovaaraRegenerateMailToLink('enddate',date);
			}
		});
	});
	
	$('#form-cancel').on('click',function() {
		$("#form-params").hide();
		$("#form-link-wrapper").show();
		// Clear global variables.
		TahkovaaraStartDate = undefined;
		TahkovaaraEndDate = undefined;
		// Remove the "Send" button.
		$('#form-send-wrapper').empty();
		// Destroy Picker plugins:
		$('#startdate').datepicker('destroy');
		$('#enddate').datepicker('destroy');
	});
	
})(jQuery);
