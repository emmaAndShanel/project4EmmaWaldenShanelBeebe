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
      app.displayInfo(natureArray, userSelection);
      app.modalImage(userSelection);
    });
  });
};

// Display data on the page
app.displayInfo = function (data, alt) {
  data.forEach((photo) => {
    const returnedImage = photo.src.landscape;
    const gallery = `<img class="returnedImage" src="${returnedImage}" alt="Photo of ${alt}" tabindex="0  "/>`;
    $(".resultGallery").append(gallery);
  });
};

app.openModal = () => {
  $modal.addClass("open");
  $(window).on("keyup", app.handleKeyUp);
};

app.closeModal = () => {
  $modal.removeClass("open");
};

app.handleClickToClose = (e) => {
  if (e.target !== e.currentTarget) {
    app.closeModal();
  }
};

app.handleKeyUp = (e) => {
  if (e.key === "Escape") return app.closeModal();
};

app.modalImage = (alt) => {
  $(".returnedImage").on("click", function (e) {
    $(".modalContent").html(
      `<img src="${e.currentTarget.src}" alt="Photo of ${alt}"/>`
    );
    app.openModal();
  });
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

$(function () {
  app.init();
});
