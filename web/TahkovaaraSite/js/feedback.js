/*

1. Arvosana Valikko 1-5 tähteä
2. Arvostelu (julkaistaan sivustolla)
•	Vapaa tekstikenttä
3. Yksityinen viesti, joka näkyy vain mökin omistajalle
•	Vapaa tekstikenttä

4. Nimi tai nimimerkki
Sähköpostiosoite

5. Olen vierailut kohteessa
•	Valikot: kuukausi ja vuosi
Lähetä arvostelu
Teksti: Kiitos arvostelustasi, tarkistamme ja lisäämme sen sivustolle lähiaikoina.
*/
(function($) {
	
	let feedbackRating = undefined;
	let feedbackText = '';
	let feedbackName = '';
	let feedbackPrivateMessage = '';
	let feedbackVisitMonthNumber = moment().month() + 1; // Number
	let feedbackVisitYear = moment().year(); // Current year
	
	feedbackConvertMonthNumberToName = function(number) {
		let name = 'Tammikuu';
		switch (number) {
			case 1: name = 'Tammikuu'; break;
			case 2: name = 'Helmikuu'; break;
			case 3: name = 'Maaliskuu'; break;
			case 4: name = 'Huhtikuu'; break;
			case 5: name = 'Toukokuu'; break;
			case 6: name = 'Kesäkuu'; break;
			case 7: name = 'Heinäkuu'; break;
			case 8: name = 'Elokuu'; break;
			case 9: name = 'Syyskuu'; break;
			case 10: name = 'Lokakuu'; break;
			case 11: name = 'Marraskuu'; break;
			case 12: name = 'Joulukuu'; break;
			default: break;
		}
		return name;
	}
	
	let feedbackVisitMonthName = feedbackConvertMonthNumberToName(feedbackVisitMonthNumber);
	
	feedbackReset = function() {
		$("#feedback-params").hide();
		$("#feedback-link-wrapper").show();
		
		// Clear global variables.
		feedbackRating = undefined;
		feedbackText = '';
		feedbackName = '';
		feedbackPrivateMessage = '';
		
		feedbackVisitMonthNumber = moment().month() + 1;
		feedbackVisitYear = moment().year(); // Current year
		feedbackVisitMonthName = feedbackConvertMonthNumberToName(feedbackVisitMonthNumber);
		
		// Remove the "Send" button.
		$('#feedback-send-wrapper').empty();
	}
	
	feedbackReportError = function(errors) {
		const message = errors.join('<br/>');
		const html = '<div class="error-message"><p>'+message+'</p></div>';
		$(html).appendTo('#feedback-error-wrapper');
	}
	
	feedbackValidate = function() {
		const messages = [];
		
		// Check that all params are included and there are no conflicting data in query.
		if (typeof feedbackRating === 'undefined') {
			messages.push('Arvostelu puuttuu!');
		}
		
		feedbackText = $('#public-feedback').val();
		if (feedbackText.length === 0) {
			messages.push('Viesti puuttuu!');
		}
		
		feedbackName = $('#feedback-name').val();
		if (feedbackName.length === 0) {
			messages.push('Nimi tai nimimerkki puuttuu!');
		}
		
		return messages;
	}
	
	feedbackGenerateMailToLink = function() {
		
		// Clear previous errors if any.
		$('#feedback-error-wrapper').empty();
		
		// Check that all params are included and there are no conflicting data in query.
		
		let private_message = '';
		feedbackPrivateMessage = $('#private-feedback').val();
		if (feedbackPrivateMessage.length > 0) {
			private_message = '%0D%0AYksityinen%20viesti%3A%20' + feedbackPrivateMessage;
		}
		
		const messages = feedbackValidate();
		if (messages.length > 0) {
			// Report all errors
			feedbackReportError(messages);
			// Show disabled send-button.
			const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:tahkovaara@intelcon.fi?subject=Arvostelu">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#feedback-send-wrapper').empty().append(mailto);
			
		} else {
			const body = 'Tähtiä%3A%20'+feedbackRating+
			'%0D%0AViesti%3A%20'+feedbackText + private_message +
			'%0D%0ANimi%3A%20'+feedbackName+
			'%0D%0AKuukausi%3A%20'+feedbackVisitMonthName+
			'%0D%0AVuosi%3A%20'+feedbackVisitYear+
			'%0D%0AJos haluat voit lisätä vielä vapaamuotoisen viestin tähän%3A%0D%0A%0D%0A%0D%0A';
			// LF 	line feed 			%0A
			// CR 	carriage return 	%0D
			
			const mailto = '<a id="mailto" class="waves-effect waves-light btn" href="mailto:tahkovaara@intelcon.fi?subject=Arvostelu&body=' + body + '">LÄHETÄ<i class="material-icons right">send</i></a>';
			$('#feedback-send-wrapper').empty().append(mailto);
			$('#mailto').on('click',function() {
				//setTimeout(() => {
				//	feedbackReset();
				//}, 1000);
			});
		}
	}
	
	$('#feedback-link').on('click',function() {
		
		// Open feedback FORM:
		
		$("#feedback-link-wrapper").hide();
		$("#feedback-params").show();
		
		// Clear previous errors if any.
		$('#feedback-error-wrapper').empty();
		// Show disabled send-button.
		const mailto = '<a class="waves-effect waves-light btn disabled" href="mailto:tahkovaara@intelcon.fi?subject=Arvostelu">LÄHETÄ<i class="material-icons right">send</i></a>';
		$('#feedback-send-wrapper').empty().append(mailto);
		
		const rating_markup = 
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<a href="javascript:void(0);" id="r-1" style="color:#ccc;"><i style="font-size:3rem;" class="material-icons">star</i></a>'+
					'<a href="javascript:void(0);" id="r-2" style="color:#ccc;"><i style="font-size:3rem;" class="material-icons">star</i></a>'+
					'<a href="javascript:void(0);" id="r-3" style="color:#ccc;"><i style="font-size:3rem;" class="material-icons">star</i></a>'+
					'<a href="javascript:void(0);" id="r-4" style="color:#ccc;"><i style="font-size:3rem;" class="material-icons">star</i></a>'+
					'<a href="javascript:void(0);" id="r-5" style="color:#ccc;"><i style="font-size:3rem;" class="material-icons">star</i></a>'+
				'</div>'+
			'</div>';
		$('#feedback-rating-wrapper').empty().append(rating_markup);
		
		$("#r-1").on('click',function() {
			feedbackRating = 1;
			$("#r-1").attr('style', 'color:#fa0');
			$("#r-2").attr('style', 'color:#ccc');
			$("#r-3").attr('style', 'color:#ccc');
			$("#r-4").attr('style', 'color:#ccc');
			$("#r-5").attr('style', 'color:#ccc');
			feedbackGenerateMailToLink();
		});
		$("#r-2").on('click',function() {
			feedbackRating = 2;
			$("#r-1").attr('style', 'color:#fa0');
			$("#r-2").attr('style', 'color:#fa0');
			$("#r-3").attr('style', 'color:#ccc');
			$("#r-4").attr('style', 'color:#ccc');
			$("#r-5").attr('style', 'color:#ccc');
			feedbackGenerateMailToLink();
		});
		$("#r-3").on('click',function() {
			feedbackRating = 3;
			$("#r-1").attr('style', 'color:#fa0');
			$("#r-2").attr('style', 'color:#fa0');
			$("#r-3").attr('style', 'color:#fa0');
			$("#r-4").attr('style', 'color:#ccc');
			$("#r-5").attr('style', 'color:#ccc');
			feedbackGenerateMailToLink();
		});
		$("#r-4").on('click',function() {
			feedbackRating = 4;
			$("#r-1").attr('style', 'color:#fa0');
			$("#r-2").attr('style', 'color:#fa0');
			$("#r-3").attr('style', 'color:#fa0');
			$("#r-4").attr('style', 'color:#fa0');
			$("#r-5").attr('style', 'color:#ccc');
			feedbackGenerateMailToLink();
		});
		$("#r-5").on('click',function() {
			feedbackRating = 5;
			$("#r-1").attr('style', 'color:#fa0');
			$("#r-2").attr('style', 'color:#fa0');
			$("#r-3").attr('style', 'color:#fa0');
			$("#r-4").attr('style', 'color:#fa0');
			$("#r-5").attr('style', 'color:#fa0');
			feedbackGenerateMailToLink();
		});
		
		const textarea_markup = 
			'<div class="row">'+
				'<div class="input-field col s12">'+
					'<textarea id="public-feedback" class="materialize-textarea"></textarea>'+
					'<label for="public-feedback">Viesti (julkaistaan sivustolla)</label>'+
				'</div>'+
			'</div>';
		$('#feedback-text-wrapper').empty().append(textarea_markup);
		
		
		const private_textarea_markup = 
			'<div class="row">'+
				'<div class="input-field col s12">'+
					'<textarea id="private-feedback" class="materialize-textarea"></textarea>'+
					'<label for="private-feedback">Yksityinen viesti, joka näkyy vain mökin omistajalle</label>'+
				'</div>'+
			'</div>';
		$('#feedback-private-text-wrapper').empty().append(private_textarea_markup);
		
		
		const visit_mmyyyy_markup =
			'<p style="color:#888;">Olen vieraillut kohteessa:</p>'+
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s6 center">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s12 center">'+ 
							'<div class="row" style="margin-top:0;margin-bottom:0;">'+
								'<div class="col s5 edit-item-change-month" id="visit-month" style="text-align:right;">'+feedbackVisitMonthName+'</div>'+
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-24px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="visit-month-up"><i class="small material-icons">add</i></a>'+
										'</div>'+
									'</div>'+
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="visit-month-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="col s6 center">'+
					'<div class="row" style="margin-top:24px;margin-bottom:0;">'+
						'<div class="col s12 center">'+ 
							'<div class="row" style="margin-top:-20px;margin-bottom:0;">'+
								'<div class="col s5 edit-item-change-year" id="visit-year" style="text-align:right;">'+feedbackVisitYear+'</div>'+
								'<div class="col s7">'+
									'<div class="row" style="margin-top:-4px;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="visit-year-up"><i class="small material-icons">add</i></a>'+
										'</div>'+ 
									'</div>'+ 
									'<div class="row" style="margin-top:0;margin-bottom:0;">'+
										'<div class="col s12 edit-item-change-button"><a href="javascript:void(0);" id="visit-year-down"><i class="small material-icons">remove</i></a>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
		$('#feedback-visit-mmyyyy-wrapper').empty().append(visit_mmyyyy_markup);
		
		
		const name_markup =
			'<div class="row">'+
				'<div class="input-field col s12">'+
					'<input id="feedback-name" type="text">'+
					'<label for="feedback-name">Nimi tai nimimerkki</label>'+
				'</div>'+
			'</div>';
		$('#feedback-name-wrapper').empty().append(name_markup);
		
		$('#public-feedback').on('change', function(){
			feedbackGenerateMailToLink();
		});
		
		$('#private-feedback').on('change', function(){
			feedbackGenerateMailToLink();
		});
		
		
		
		$('#feedback-name').on('change', function(){
			feedbackGenerateMailToLink();
		});
		
		$('#visit-month-up').on('click',function() {
			const now_yyyy =  moment().year(); // Number
			const now_mm = moment().month() + 1; // Number
			let MAX_MONTH = 12;
			if (feedbackVisitYear === now_yyyy) {
				MAX_MONTH = now_mm
			}
			if (feedbackVisitMonthNumber < MAX_MONTH) {
				feedbackVisitMonthNumber++;
				feedbackVisitMonthName = feedbackConvertMonthNumberToName(feedbackVisitMonthNumber);
				$('#visit-month').empty().append(feedbackVisitMonthName);
				feedbackGenerateMailToLink();
			}
		});
		$('#visit-month-down').on('click',function() {
			if (feedbackVisitMonthNumber > 1) {
				feedbackVisitMonthNumber--;
				feedbackVisitMonthName = feedbackConvertMonthNumberToName(feedbackVisitMonthNumber);
				$('#visit-month').empty().append(feedbackVisitMonthName);
				feedbackGenerateMailToLink();
			}
		});
		
		$('#visit-year-up').on('click',function() {
			const now_yyyy =  moment().year(); // Number
			if (feedbackVisitYear < now_yyyy) {
				feedbackVisitYear++;
				$('#visit-year').empty().append(feedbackVisitYear);
				if (feedbackVisitYear === now_yyyy) {
					// Check that month is not in the future
					const now_mm = moment().month() + 1; // Number
					if (feedbackVisitMonthNumber > now_mm) {
						feedbackVisitMonthNumber = now_mm;
						feedbackVisitMonthName = feedbackConvertMonthNumberToName(feedbackVisitMonthNumber);
						$('#visit-month').empty().append(feedbackVisitMonthName);
					}
				}
				feedbackGenerateMailToLink();
			}
		});
		$('#visit-year-down').on('click',function() {
			const now_yyyy =  moment().year(); // Number
			if (feedbackVisitYear > now_yyyy-4) {
				feedbackVisitYear--;
				$('#visit-year').empty().append(feedbackVisitYear);
				feedbackGenerateMailToLink();
			}
		});
		
		
	});
	
	$('#feedback-cancel').on('click',function() {
		feedbackReset();
	});
	
	
	
	feedbackReportFetchError = function(error) {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		if (typeof error.message !== 'undefined') {
			markup += error.message;
		} else {
			markup += 'Error without message has occurred.';
		}
		markup += '</p>';
		$('#feedback-feed').empty().append(markup);
	}
	/*
		Read feedback from file "feedback.json" and fill in the MARKUP tagged by 
			#feedback-feed
	*/
	fetch('./json/feedback.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			
			if (Array.isArray(myJson)) {
				// #history-mobile: put all paragraphs within one div
				
				myJson.forEach(a=>{
						//"message":"Kohde vastasi kohteen kuvausta.",
						//"name":"Tanja Kotkanoja",
						//"rating":5,
						//"time":"Joulukuu 2018"
					let rating_text = '';
					const star = '<i style="font-size:1rem;color:#fa0;" class="material-icons">star</i>';
					if (a.rating === 1) {
						rating_text = star;
					} else if (a.rating === 2) {
						rating_text = star + star;
					} else if (a.rating === 3) {
						rating_text = star + star + star;
					} else if (a.rating === 4) {
						rating_text = star + star + star + star;
					} else if (a.rating === 5) {
						rating_text = star + star + star + star + star;
					}
					const html = '<div style="padding:12px;background-color:#444;color:#fff;border:1px solid #ccc;"><p>'+a.message+'<br/>'+a.name+' '+rating_text+'<br/>'+a.time+'</p></div>';
					$(html).appendTo('#feedback-feed');
				});
				
			} else {
				feedbackReportFetchError({message:'Error: feedback.json content is NOT an Array.'});
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			feedbackReportFetchError(error);
		});
	
	
	
})(jQuery);
