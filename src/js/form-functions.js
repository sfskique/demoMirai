export class formFunctions {
	
	constructor(el) {
		this.form = el;
		this.requiredEls = this.form.querySelectorAll('[required]');
		this.numericEls =  this.form.querySelectorAll('.numeric');
		this.emailEls =  this.form.querySelectorAll('input[type="email"]');
		this.phoneEls =  this.form.querySelectorAll('input[type="tel"]');
		this.classCreditCard = "input-credit-card";
		this.creditCardWrap = this.form.querySelector('.'+this.classCreditCard);
		this.creditCardInputs = this.creditCardWrap.querySelectorAll('input[type="text"]');
		this.iconsCards  = this.form.querySelectorAll('.check-card');
		this.classExpirationCreditCard = "input-card-expiration";
		this.expirationCreditCardWrap = this.form.querySelector('.'+this.classExpirationCreditCard);
		this.expirationCreditCardInputs = this.expirationCreditCardWrap.querySelectorAll('input[type="text"]');
		this.classTextAreaWrap = "textarea-wrap";
		this.textAreaWrap = this.form.querySelector('.'+this.classTextAreaWrap );
		this.classRadioAccordionWrap = "wrap-radio-accordion";
		this.radioAccordionWrapEls = this.form.querySelectorAll('.'+this.classRadioAccordionWrap);
		this.selectorRadioAccordion = "input.accordion";
		this.testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		this.testPhone = /^6[0-9]{8}$/;
		this.testAmex = /^(?:3[47][0-9]{13})$/;
		this.testMasterCard = /^(?:5[1-5][0-9]{14})$/;
		this.testVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/; 
		this.eventsChange = [ "propertychange", "change", "click", "keyup", "input", "paste" ];
		this._init();
	}

	_init () {

		this._events();
		this.checkEnableButtons();
		this.checkCreditCard();
		this.checkExpirationCreditCard();
		
	}
	
	_events () {

		//Look for changes in the value required
		this.requiredEls.forEach((el) => {
			for (var i in this.eventsChange) {
				el.addEventListener(this.eventsChange[i], (evt) => {
					this.checkEnableButtons(el);
				});
			}
		});

		
		this.radioAccordionWrapEls.forEach((elWrap) => {
			elWrap.querySelector(this.selectorRadioAccordion).addEventListener("change", (evt) => {
				if(evt.target.checked) {
					this.checkEnableButtons();
				}
			});
		});

		//only numeric
		this.numericEls.forEach((el) => {
			for (var i in this.eventsChange) {
				el.addEventListener(this.eventsChange[i], (evt) => {
					el.value = el.value.replace(/[^\d\.]/g,'');
				});
			}
		});

		//error dinamic email
		this.emailEls.forEach((el) => {
			el.addEventListener("blur", (evt) => {
				let elField = el.parentNode;
				if (!this.testEmail.test(el.value)) {
					elField.classList.add('error');
				} else {
					elField.classList.remove('error');
				}
			});
		});

		//error dinamic phone
		this.phoneEls.forEach((el) => {
			el.addEventListener("blur", (evt) => {
				let elField = el.parentNode;
				if (!this.testPhone.test(el.value)) {
					elField.classList.add('error');
				} else {
					elField.classList.remove('error');
				}
			});
		});

		//credit number
		this.creditCardWrap.addEventListener("click", (evt) => {
			if(evt.target.classList.contains(this.classCreditCard)){
				this.creditCardInputs[0].focus();
			}
		});

		this.creditCardInputs.forEach((el) => {
			el.addEventListener("keyup", (evt) => {
				this.selectNextInput(el);
				this.checkCreditCard();
			});	
		});

		this.expirationCreditCardWrap.addEventListener("click", (evt) => {
			if(evt.target.classList.contains(this.classExpirationCreditCard)){
				this.expirationCreditCardInputs[0].focus();
			}
		});

		this.expirationCreditCardInputs.forEach((el) => {
			el.addEventListener("keyup", (evt) => {
				this.selectNextInput(el);
				this.checkExpirationCreditCard();
			});	
		});

		//texarea
		this.textAreaWrap.addEventListener("click", (evt) => {
			if(evt.target.type !== "textarea"){
				this.textAreaWrap.querySelector("textarea").focus();
				this.textAreaWrap.classList.add("focus");
			}
		});

		this.textAreaWrap.querySelector("textarea").addEventListener("blur", (evt) => {
			this.textAreaWrap.classList.remove("focus");
		});

	}

	checkEnableButtons (elForm) {
		let btn = document.querySelector('[data-id-check-required="'+this.form.getAttribute('id')+'"]');
		if(btn){
			let disabled=false;
			var elform = this.form.querySelectorAll('[required]:not([disabled]):not(.disabled)');
			elform.forEach((el) => {

				let wrapRadio = this.closestByClass(el, this.classRadioAccordionWrap);
				if(wrapRadio !== null){
					let checkRadio = wrapRadio.querySelector(this.selectorRadioAccordion);
					if(!checkRadio.checked) {
						return;
					}
				}

				if(el.type && el.type === 'checkbox'){
					if(!el.checked) { disabled=true; };
				} else if(el.type && el.type === 'email'){
					if (!this.testEmail.test(el.value)) { disabled=true; };
				} else if(el.type && el.type === 'tel'){
					if (!this.testPhone.test(el.value)) { disabled=true; };
				} else {
					if((el.value === '' || el.value === -1 || el.value === '--') && el.style.backgroundColor !== 'rgb(250, 255, 189)') { disabled=true; };
				};
	
			});

			if(disabled){
				btn.classList.add('disabled');
				btn.disabled = true;
			} else {
				btn.classList.remove('disabled');
				btn.disabled = false;
			}
		}
		
	}

	checkCreditCard () {
		let number = "";
		this.creditCardInputs.forEach((el) => {
			let value = el.value;
			if(value.length === 4){
				number+= value;
			}
		});


		this.creditCardWrap.parentNode.classList.remove("error");
		this.iconsCards.forEach((el) => { el.classList.remove("off"); });
		
		if(number.length === 16){

			this.iconsCards.forEach((el) => { el.classList.add("off"); });
			let parentIcons = this.iconsCards[0].parentNode;

			if(number.match(this.testAmex)){
				parentIcons.querySelector(".card-amex").classList.remove("off");
			} else if(number.match(this.testMasterCard)){
				parentIcons.querySelector(".card-mastercard").classList.remove("off");
			} else if(number.match(this.testVisa)){
				parentIcons.querySelector(".card-visa").classList.remove("off");
			} else {
				this.creditCardWrap.parentNode.classList.add("error");
			}
		}
	}

	checkExpirationCreditCard () {
		this.expirationCreditCardWrap.parentNode.classList.remove("error");
		let value1 = this.expirationCreditCardInputs[0].value;
		let value2 = this.expirationCreditCardInputs[1].value
		if(value1.length === 2 && value2.length === 4) {
			let currentYear = new Date().getFullYear();
			if(value1 > 12 || value2 < currentYear || value2 > (currentYear+10)){
				this.expirationCreditCardWrap.parentNode.classList.add("error");
			}
		}
	}

	selectNextInput (el) {
		let value = el.value;
		let maxLength = parseInt(el.getAttribute("maxlength"));
		let indexCursor = el.selectionStart;
		let next = el.nextSibling.nextSibling;
		if(value.length === maxLength && indexCursor === maxLength && next !== null){
			next.focus();
			next.setSelectionRange(0, next.value.length)
		}
	}

	closestByClass (el, clazz) {
		while (!el.classList.contains(clazz)) {
			el = el.parentNode;
			if (!el || el === document.querySelector("body")) {
				return null;
			}
		}
		return el;
	}

}
