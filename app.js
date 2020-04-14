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
      const natureArray = result.photos;
      $(".resultGallery").empty();
      app.displayInfo(natureArray);
    });
  });
};

// Display data on the page
app.displayInfo = function (data) {
  data.forEach((photo) => {
    const returnedImage = photo.src.medium;
    const gallery = `<img class="returnedImage" src="${returnedImage}" alt=""/>`;
    $(".resultGallery").append(gallery);
  });
};

app.modalImage = function () {};

app.openModal = function () {};

// Start app
app.init = function () {
  app.getData();
};

$(function () {
  app.init();
});
