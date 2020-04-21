//namespace object
const app = {};

// object containing audio elements
app.soundObject = {};

app.soundObject.autumn = new Audio("styles/assets/sounds/autumn.mp3");
app.soundObject.autumn.loop = true;
app.soundObject.blossoms = new Audio("styles/assets/sounds/blossoms.mp3");
app.soundObject.blossoms.loop = true;
app.soundObject.canyon = new Audio("styles/assets/sounds/canyon.mp3");
app.soundObject.canyon.loop = true;
app.soundObject.forest = new Audio("styles/assets/sounds/forest.mp3");
app.soundObject.forest.loop = true;
app.soundObject.lights = new Audio("styles/assets/sounds/lights.mp3");
app.soundObject.lights.loop = true;
app.soundObject.rainforest = new Audio("styles/assets/sounds/rainforest.mp3");
app.soundObject.rainforest.loop = true;
app.soundObject.sky = new Audio("styles/assets/sounds/sky.mp3");
app.soundObject.sky.loop = true;
app.soundObject.stream = new Audio("styles/assets/sounds/stream.mp3");
app.soundObject.stream.loop = true;
app.soundObject.waves = new Audio("styles/assets/sounds/waves.mp3");
app.soundObject.waves.loop = true;

// soundMuted begins as false because sound automatically plays when user makes first option selection
app.isSoundMuted = false;

// Collect user input and store in a variable
app.getData = function () {
  $("select").on("change", (e) => {
    const userSelection = e.currentTarget.value;

    // Make AJAX request with user inputted data
    $.ajax({
      url: `https://api.pexels.com/v1/search?query=${userSelection}&per_page=15&page=1`,
      method: "GET",
      dataType: "json",
      headers: {
        authorization:
          "563492ad6f917000010000018090d1171f7a46398e0de7e0ada31b47",
      },
    }).then((result) => {
      // Gets an array of image objects
      const natureArray = result.photos;

      // Creates an array of image urls
      const urls = natureArray.map((data) => data.url);
      // Loops over the urls
      urls.forEach((entry, index) => {
        // extracts the image description from the url
        const urlDetails = /^(https:\/\/www.pexels.com\/photo\/)([a-z-]+)([0-9/]+)/;
        const urlArray = entry.match(urlDetails);
        const urlDescription = urlArray[2];
        // removes dashes from between words in image description
        const urlDescriptionSpaced = urlDescription.replace(/-/g, " ");
        // adds altText property with the image description to natureArray
        natureArray[index].altText = urlDescriptionSpaced;
      });

      // Empties the gallery each time the user selects a new option
      $(".resultGallery").empty();
      // Displays the images in a gallery on the page
      app.displayInfo(natureArray);
      // Modal pop up function
      app.modalImage();
    });
  });
};

// Displays data(images) on the page
app.displayInfo = function (data) {
  // Loops through the array of photos and returns image to be displayed on the page with alt text
  data.forEach((photo) => {
    const returnedImage = photo.src.large;
    const gallery = `<img class="returnedImage" src="${returnedImage}" alt="${photo.altText}" tabindex="0"/>`;
    $(".resultGallery").append(gallery);
  });
};

// Adds sound element to page
app.getSound = function () {
  // Determines what happens when the select option changes
  $("select").on("change", function () {
    // selects the ids of the children of the select (the options)
    const userId = $(this).children(":selected").attr("id");

    // loops through the sound object
    for (let sound in app.soundObject) {
      // checks if the id from the option matches the key of the sound object
      if (userId === sound) {
        // creates a variable with the matching audio element stored
        app.soundFile = app.soundObject[sound];
        // adds the audio element to the div with the class of audio
        $audioDiv.html(app.soundFile);

        // soundMuted is initially false so the soundfile plays when user first selects an option
        if (app.isSoundMuted === false) {
          app.soundFile.play();
        }
        // sets audio volume
        $("audio").prop("volume", 0.1);
        // displays the sound icon on the screen below the select element
        $soundToggle.addClass("soundOffVisible");
      }
    }
  });
  // Toggles the sound off and on when user clicks the sound icon
  $soundToggle.on("click", function () {
    if (app.isSoundMuted === false) {
      $audioDiv.html("");
      app.isSoundMuted = true;
      $soundToggle.attr("src", "./styles/assets/soundOn.svg");
    } else {
      $audioDiv.html(app.soundFile);
      $soundToggle.attr("src", "./styles/assets/soundOff.svg");
      app.soundFile.play();
      app.isSoundMuted = false;
    }
  });
  // Toggles the sound off and on when user presses enter while tabbing onto the sound icon.
  $soundToggle.on("keyup", function (e) {
    if (e.key === "Enter") {
      if (app.isSoundMuted === false) {
        // removes the audio element from the page
        $audioDiv.html("");
        app.isSoundMuted = true;
        //toggles the sound icon appearance
        $soundToggle.attr("src", "./styles/assets/soundOn.svg");
      } else {
        // adds the audio element to the page
        $audioDiv.html(app.soundFile);
        // toggles the sound icon appearance
        $soundToggle.attr("src", "./styles/assets/soundOff.svg");
        app.soundFile.play();
        app.isSoundMuted = false;
      }
    }
  });
};

// Start of the modal functionality
// Adding open class to modal so that it appears on the page
app.openModal = () => {
  $modal.addClass("open");
  $(window).on("keyup", app.handleKeyUp);
};

// Removing open class on modal to remove from page
app.closeModal = () => {
  $modal.removeClass("open");
};

// Allows user to click on image to close the modal
app.handleClickToClose = (e) => {
  if (e.target !== e.currentTarget) {
    app.closeModal();
  }
};

// Allows user to hit escape to close the modal if not using a mouse
app.handleKeyUp = (e) => {
  if (e.key === "Escape") return app.closeModal();
};

// Adds the image to the modal content box when a gallery image is clicked
app.modalImage = () => {
  $(".returnedImage").on("click", function (e) {
    $(".modalContent").html(
      `<figure><img src="${e.currentTarget.src}" alt="${e.currentTarget.alt}"/>
        <span class="close"><img src="./styles/assets/close.svg"/></span></figure>`
    );
    app.openModal();
  });
  // Allows user to press enter to open the modal
  $(".returnedImage").on("keyup", function (e) {
    if (e.key === "Enter") {
      $(".modalContent")
        .html(`<img src="${e.currentTarget.src}" alt="${e.currentTarget.alt}"/>
      <span class="close"><img src="./styles/assets/close.svg"/></span>`);
      app.openModal();
    }
  });
};

// Initialize function
app.init = function () {
  $audioDiv = $(".audio");
  $soundToggle = $(".soundOff");
  $modal = $(".modal");
  app.getData();
  app.getSound();
  $modal.on("click", app.handleClickToClose);
};

// Document Ready function
$(function () {
  app.init();
});
