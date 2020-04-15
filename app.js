// An app that generates nature images for users based on their selection from a dropdown of options
// A landing page with title and message about how to use the app
// A dropdown menu with nature search terms
// A background where the images will be displayed below the dropdown
// Create app namespace to hold all methods
// Add event listener to collect the user input from the dropdown
// Save user input in a variable
// Use that variable to make AJAX request
// Display related images on the page in a gallery
// When user clicks on an image it scales up in size (modal)

// Stretch goals
// Create a carousel on the modal of the images that users can click through
// Add soothing nature sounds

const app = {};

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
      `<img src="${e.currentTarget.src}" alt="${e.currentTarget.alt}"/>
      <span class="close"><img src="./styles/assets/close.svg"/></span>`
    );
    app.openModal();
  });
  // Allows user to use enter to open the modal
  $(".returnedImage").on("keyup", function (e) {
    if (e.key === "Enter") {
      $(".modalContent").html(`<img src="${e.currentTarget.src}" alt=""/>`);
      app.openModal();
    }
  });
};

// Start app
app.init = function () {
  $modal = $(".modal");
  app.getData();
  $modal.on("click", app.handleClickToClose);
};

// Waiting for document to be ready to initialize
// Start app
app.init = function () {
  $modal = $(".modal");
  app.getData();
  $modal.on("click", app.handleClickToClose);
};

// Waiting for document to be ready to initialize
$(function () {
  app.init();
});
