import { formFunctions } from './form-functions.js';
import { scrollbot } from './scrollbot.js';

function initPage () {

	let formClass = new formFunctions(document.querySelector(".form-purchase"));
	let customScroll = new scrollbot(".list-nights");
}


initPage();
