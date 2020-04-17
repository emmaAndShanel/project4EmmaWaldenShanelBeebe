const app = {};

app.soundObject = {
  autumn: '/styles/assets/sounds/autumn.mp3',
  blossoms: '/styles/assets/sounds/blossoms.mp3',
  canyon: '/styles/assets/sounds/canyon.mp3',
  forest: '/styles/assets/sounds/forest.mp3',
  lights: '/styles/assets/sounds/lights.mp3',
  rainforest: '/styles/assets/sounds/rainforest.mp3',
  sky: '/styles/assets/sounds/sky.mp3',
  stream: '/styles/assets/sounds/stream.mp3',
  waves: '/styles/assets/sounds/waves.mp3',
}

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
      // Getting an array of image objects
      const natureArray = result.photos;
      // Creating an array of image urls
      const urls = natureArray.map((data) => data.url);

      // Looping over the urls extracts the image description
      urls.forEach((entry, index) => {
        const urlDetails = /^(https:\/\/www.pexels.com\/photo\/)([a-z-]+)([0-9/]+)/;
        const urlArray = entry.match(urlDetails);
        const urlDescription = urlArray[2];
        const urlDescriptionSpaced = urlDescription.replace(/-/g, " ");
        natureArray[index].altText = urlDescriptionSpaced;
      });

      // Emptys the gallery each time the user selects a new option
      $(".resultGallery").empty();
      app.displayInfo(natureArray);
      app.modalImage();
    });
  });
};

// Display data on the page
app.displayInfo = function (data) {
  // Loop through the array of photos and returns image to be displayed on the page with alt text
  data.forEach((photo) => {
    const returnedImage = photo.src.large;
    const gallery = `<img class="returnedImage" src="${returnedImage}" alt="${photo.altText}" tabindex="0  "/>`;
    $(".resultGallery").append(gallery);
  });
};


app.getSound = function () {
  $("option").on("click", function (e) {
    const userId = $(this).attr('id');
  for (let sound in app.soundObject) {
    const soundFile = app.soundObject[sound];
    if (userId === sound) {
      $('audio').html(`<source src="${soundFile}"><source>`);
      const audio = $('audio')
      audio[0].play();
      $('audio').prop('volume', 0.1)
    }
  }
})
}


// Start of the modal functionality
// Adding class to modal so that it appears on the page
app.openModal = () => {
  $modal.addClass("open");
  $(window).on("keyup", app.handleKeyUp);
};

// Removing class on modal to remove from page
app.closeModal = () => {
  $modal.removeClass("open");
};

// Allows user to click on image to close the modal
app.handleClickToClose = (e) => {
  if (e.target !== e.currentTarget) {
    app.closeModal();
  }
};

// Allows users to hit escape to close the modal if not using a mouse
app.handleKeyUp = (e) => {
  if (e.key === "Escape") return app.closeModal();
};

// Adds the image to the modal content box
app.modalImage = () => {
  $(".returnedImage").on("click", function (e) {
    $(".modalContent").html(
        `<figure><img src="${e.currentTarget.src}" alt="${e.currentTarget.alt}"/>
        <span class="close"><img src="./styles/assets/close.svg"/></span></figure>`
    );
    app.openModal();
  });
  // Allows user to use enter to open the modal
  $(".returnedImage").on("keyup", function (e) {
    if (e.key === "Enter") {
      $(".modalContent").html(`<img src="${e.currentTarget.src}" alt="${e.currentTarget.alt}"/>
      <span class="close"><img src="./styles/assets/close.svg"/></span>`);
      app.openModal();
    }
  });
};

// Waiting for document to be ready to initialize
// Start app
app.init = function () {
  app.getSound();
  $modal = $(".modal");
  app.getData();
  $modal.on("click", app.handleClickToClose);
};

// Waiting for document to be ready to initialize
$(function () {
  app.init();
});
