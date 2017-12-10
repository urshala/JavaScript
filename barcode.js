$(document).ready(function(){
	let submitButton = document.getElementById('submitButton');
	$(submitButton).click(function(){
		let barcode = document.getElementById('userInput').value.trim();
		if (barcode){
			if($('.myResult')){
				$('.myResult').remove();
			}
			let accountNumber = barcode.slice(1,17);
			let price = barcode.slice(18,25);
			price = price.split('');
			price.splice(-2,0,'.');
			price=parseFloat(price.join(''));
			
			let referenceNumber = barcode.slice(29,48);
			let dueDate = barcode.slice(48,);
			dueDate = (dueDate === '000000')? 'None' : dueDate;

			$('.barcodeImage').JsBarcode(barcode);

			let content = document.createElement('div');
			$(content).addClass('myResult');
			let par = `<p><span>Payee's IBAN: ${accountNumber}</span>
					 	<span>Amount to be paid: ${price}</span>
					 	<p><span>Reference Number: ${referenceNumber}</span>
					 		<span>Due date: ${dueDate}</span></p>`;
			$(content).append(par);
			let results = $('.results');
			$(results).append(content).addClass('displayResult');
			$('.toggleHide').addClass('toggleShow');
			document.getElementById('userInput').value = '';
		}

	})

	$('.toggleHide').click(function(){
		let toggleShowHide = this.innerHTML;
		if(toggleShowHide === 'Show')
			this.innerHTML = 'Hide'
		else
			this.innerHTML = 'Show';
		$('.results').slideToggle();

	})

	//change the background color of input when in foucs
	$('#userInput').focus(function(){
		$(this).css('background','lightgray');
	})
	
	
})


