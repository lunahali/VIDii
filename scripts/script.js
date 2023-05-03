// JavaScript Document




var buttons = document.querySelectorAll("button[data-target]");
var popups = document.querySelectorAll(".popup");
var closeButtons = document.querySelectorAll(".closeButton");

function openPopup(popup) {
  popup.style.display = "block";
}

function closePopup(popup) {
  popup.style.display = "none";
}

for (var i = 0; i < buttons.length; i++) {
  var button = buttons[i];
  var popupId = button.getAttribute("data-target");
  var popup = document.getElementById(popupId);
  
  button.addEventListener("click", function() {
    var popupId = this.getAttribute("data-target");
    var popup = document.getElementById(popupId);
    openPopup(popup);
  });

  closeButtons[i].addEventListener("click", function() {
    var popupId = this.parentNode.getAttribute("id");
    var popup = document.getElementById(popupId);
    closePopup(popup);
  });

  popups[i].addEventListener("click", function(event) {
    if (event.target == this) {
      closePopup(this);
    }
  });
}








console.log("Howdy!");

function createCaroCarrousel(carrouselID) {
	let carrousel = document.querySelector("#"+carrouselID);
  let carrouselElementsContainer = carrousel.querySelector(":scope > ul");
	let carrouselElements = carrouselElementsContainer.querySelectorAll("li");
  let bolletjes = carrousel.querySelectorAll(":scope > nav a");
  let linkButtons = carrousel.querySelectorAll(":scope > a");
  
  let autoScrollInterval = 4000;
  let autoScrollTimer;
	
  
  /****************/
	/* DE BOLLETJES */
	/****************/
  
  // de bolletjes activeren
  function iniBolletjes() {
    for (bolletje of bolletjes) {
			// elk bolletje laten luisteren naar kliks
      bolletje.addEventListener("click", function(e){
				// als er geklikt wordt
        
				// de default-actie (de link volgen) niet uitvoeren
				e.preventDefault();

				// het nieuwe element opzoeken
				let newElement = carrousel.querySelector(this.hash);
        
        // dan naar het element scrollen
        scrollToElement(newElement);
        
        // auto-scroll stoppen als de gebruiker interactie heeft met de carrousel
			  stopAutoScroll();
      });
    }
	}
  
  
  /*****************************/
	/* LINKS/RECHTS LINK-BUTTONS */
	/*****************************/  

	// de links/rechts link-buttons initialiseren en activeren
  function iniLinkButtons() {    
    for(linkButton of linkButtons) {
			// beide link-buttins naar kliks laten luisteren
      linkButton.addEventListener("click", function(e){
        // als er geklikt wordt
				// de default-actie (de link volgen) niet uitvoeren
				e.preventDefault();

				// bepalen of er op 'previous' of 'next' geklikt is
				let direction = this.getAttribute("href");
				// naar het element gaan
				goToElement(direction);
        
        // auto-scroll stoppen als de gebruiker interactie heeft met de carrousel
			  stopAutoScroll();
      });
    }
	}
  
  
  /***************************/
	/* PIJLTJES OP TOETSENBORD */
	/***************************/
  
  // met pijltjes heen en weer als (een element in) de carrousel de focus heeft 
	function iniArrowKeys() {
		carrousel.addEventListener('keydown', function(e) {
				if ( e.code == "ArrowLeft") {
					e.preventDefault();
					if (e.shiftKey) {
						// naar eerste
						newElement = carrouselElementsContainer.firstElementChild;
						scrollToElement(newElement);
					} else {
						// naar vorige
						goToElement("previous");
					}
				}
				else if ( e.code == "ArrowRight") {
					e.preventDefault();
					if (e.shiftKey) {
						// naar laatste
						newElement = carrouselElementsContainer.lastElementChild;
						scrollToElement(newElement);
					} else {
						// naar volgende
						goToElement("next");
					}
				}
			});
  }
  
  
  /**********/
	/* SWIPEN */
	/**********/
  
  // werkt op touch devices (is te simuleren in de inspector)
	function iniSwipen() {
		let touchstartX = 0;
		let touchendX = 0;
    let touchstartY = 0;
		let touchendY = 0;
    
    // het begin van de swipe
		carrousel.addEventListener('touchstart', function(e) {
      // vastleggen waar de swipe is begonnen
			touchstartX = e.changedTouches[0].screenX;
			touchstartY = e.changedTouches[0].screenY;
		}, false);
    
    // het einde van de swipe
		carrousel.addEventListener('touchend', function(e) {
      // vastleggen waar de swipe is geeindigd
			touchendX = e.changedTouches[0].screenX;
			touchendY = e.changedTouches[0].screenY;
      // dan berekenen of en in welke richting
			handleGesture();
		}, false); 
    
    // berekenen of en in welke richting
		function handleGesture() {
      // de afgelegde afstand in X- en Y-richting bepalen
			let deltaX = touchendX - touchstartX;
			let deltaY = touchendY - touchstartY;
      
      // er is geswiped als de deltaX 5x zo groot is als deltaY
      // dat betekent een redelijk horizontale swipe
			if ( Math.abs(deltaX) > (Math.abs(deltaY) * 5) ) {
        // dan moet de afgelegde afstand ook nog groter zijn dan 30px
        // als de afstand positoef is dan is van links naar rechts geswiped
				if (deltaX > 30) {
					goToElement("previous");
          // previous link-button de focus geven
				  carrousel.querySelector(':scope > [href="previous"]').focus();
          // auto-scroll stoppen als de gebruiker interactie heeft met de carrousel
			    stopAutoScroll();
				}
        // als de afstand negatief is dan is van rechts naar links geswiped
				else if (deltaX < -30) {
					goToElement("next");
          // next link-button de focus geven
				  carrousel.querySelector(':scope > [href="next"]').focus();
          // auto-scroll stoppen als de gebruiker interactie heeft met de carrousel
			    stopAutoScroll();
				}
			}
		}
	}
  
  
  /*****************/
	/* AUTO SCROLLEN */
	/*****************/

	// auto scroll starten
	function startAutoScroll() {
    // de class "autoScrolling" toevoegen aan de carrousel
    carrousel.classList.add("autoScrolling");
    
    // een timer aanzetten
    autoScrollTimer = setInterval(function(){
      // als de timer afgaat naar het volgende element gaan
      goToElement("next");
    }, autoScrollInterval);
   
  }

	// auto scroll stoppen
  function stopAutoScroll() {
    // de class "autoScrolling" verwijderen van de carrousel
    carrousel.classList.remove("autoScrolling");
    // de timer stopzetten
    clearInterval(autoScrollTimer);
  }

	// auto scroll initieren en activeren
  function iniAutoScroll() {
    // de play button naar kliks laten luisteren
    let playButton = carrousel.querySelector(":scope > button");
    playButton.addEventListener("click", function() {
      // als de carrousel de class "autoScrolling" heeft dan stoppen
      if(carrousel.classList.contains("autoScrolling")) {
        stopAutoScroll();
      }
      // anders starten
      else {
        startAutoScroll();
      }
    });
		
    // auto scroll initieel starten
		startAutoScroll();
	}
  
  
  /*****************/
	/* START POSITIE */
	/*****************/
  
	// het eerste element en bolletje actief maaken
  function iniStartPosition() {
    // eerste element current maken
    carrouselElements[0].classList.add("current");
    // eerste bolletje current maken
		bolletjes[0].classList.add("current");
		// aan het begin van de container starten
    carrouselElementsContainer.scrollLeft = 0;
  }
  
  
  /*********************/
	/* ALGEMENE FUNCTIES */
	/*********************/
  
  //////////////////////////////////
  // naar volgende/vorige element //
  function goToElement(direction) {
		// het huidige current element opzoeken
		let currentElement = carrousel.querySelector(":scope > ul > .current");

		let newElement;
		if (direction == "previous") {
			// het nieuwe element is het vorige broertje/zusje
			newElement = currentElement.previousElementSibling;
			// checken of nieuwe element bestaat - anders naar laatste
			if (!newElement) {
				newElement = carrousel.querySelector(":scope > ul > li:last-of-type");
			}
		} else {
			// het nieuwe element is het volgende broertje/zusje
			newElement = currentElement.nextElementSibling;
			// checken of nieuwe element bestaat - anders naar eerste
			if (!newElement) {
				newElement = carrousel.querySelector(":scope > ul > li:first-of-type");
			}
		}

		// naar het nieuwe element scrollen
		scrollToElement(newElement);
  }
  
  
  ///////////////////////////
  // scroll to new element //
  function scrollToElement(newElement) {
    // carousel container opzoeken
    let carouselElementsContainer = newElement.closest("ul");

		// de linker offset van het nieuwe element bepalen 
		let newElementOffset = newElement.offsetLeft;
		
		// de carousel naar de berekende positie scrollen
		carouselElementsContainer.scrollTo({
			left: newElementOffset
		});
    
    // nieuwe element current element maken
    updateCurrentElement(newElement);

    // de bolletjes updaten
    updateBolletjes(newElement);
  }
  
  
  ////////////////////////////
	// update current element //
	function updateCurrentElement(newElement) {
		// het huidige current element opzoeken
		let currentElement = carrousel.querySelector(":scope > ul > .current");
		// de class current verwijderen
		currentElement.classList.remove("current");

		// aan nieuwe element de class current toevoegen
		newElement.classList.add("current");
	}

  
  //////////////////////
  // update bolletjes //
  function updateBolletjes(newElement){
		// het huidige current bolletje opzoeken
		let currentBolletje = carrousel.querySelector(":scope > nav .current");
		// de class current verwijderen
		currentBolletje.classList.remove("current");
		
		// het nieuwe bolletje opzoeken
    let newBolletje = carrousel.querySelector("a[href='#"+newElement.id+"']");
		// de class current toevoegen
		newBolletje.classList.add("current");
  }

  
	// de bolletjes activeren
  iniBolletjes();	
  // de linkbuttons activeren
  iniLinkButtons();
  // de pijltjestoetsen activeren 
  iniArrowKeys();
  // swipen activeren 
  iniSwipen();
  
  // de carrousel bij het begin starten
  iniStartPosition();
  // auto scroll activeren 
  iniAutoScroll();
}


/************************/
/* DE CARROUSEL CREËREN */
/************************/

// nadat de pagina geladen is, de carrousels activeren
(function() {
  // hier de id gebruiken van de section in de html
  createCaroCarrousel("everything");
  //je kunt hier ook meerdere carrousellen activeren
})();

// const openMoordenButton =
// document.querySelector("button:nth-of-type(4)");
// const moordDialog =
// document.querySelector("dialog");



// openMoordenButton.addEventListener("click, openmoordDialog");

// function openMoordenButton() {
//     moordDialog.showModal();
// }







