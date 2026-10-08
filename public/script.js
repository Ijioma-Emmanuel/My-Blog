//Menu-button animation//

const hamBtn = $('#menu-btn');
const times = $('.times');
const headerNav = $('.header-nav');

hamBtn.on('click', function () {
  hamBtn.addClass('disappear');
  times.addClass('appear');
  headerNav.addClass('active');
});

times.on('click', function () {
  hamBtn.removeClass('disappear');
  times.removeClass('appear');
  headerNav.removeClass('active');
});


//Image preview//

const imgInput = $('#imgInput');
const previewContainer = $('#imagePreview');
const previewedImg = $('.previewedImg');
const previewDefaultText = $('.image-text');

imgInput.on('change', function(){

    const file = this.files[0];


     if(file) {
        const reader = new FileReader ();

          reader.readAsDataURL(file);
        
    reader.addEventListener("load", function() {
           previewDefaultText.css('display', 'none');
           const prImg = previewedImg.attr('src', this.result);
           previewedImg.css('display', 'block');
    });


    } else {
        previewDefaultText.css('display', 'block');
       previewedImg.css('display', 'none');
        previewedImg.attr('src', "");

    }
});



//publish-button animation//

function create() {

  const form = $("#createform");
  const publish = $(".publish-btn");

  form.on("submit", (event) => {
   

    const data = new FormData(form[0]);

    const isFormEmpty = Array.from(data.values()).every(value => {
      if (value instanceof File) {
        return value.size === 0;
      }

      return value.trim() === "";
    });

    if (isFormEmpty) {
       event.preventDefault();
       
      publish.text("Publish Post");
    } else {
      publish.text("Publishing...");
    }
  });

}

create();




// Triggering a cancel/reset via custom code
$('.cancel-btn').on('click', () => {
  $('#createform')[0].reset();

  $('.previewedImg').css('display', 'none');
   $('.image-text').css('display', 'block');

});


//newsletter buttons

const nBtn1 = $(".newsletter button, .newsletter-form button, .newsletter2-content button");

nBtn1.on('click', function() {
  alert("Thanks for your interest! Newsletter subscriptions are coming soon.");

  $('.newsletter-form')[0].reset();
})



/* Category filter buttons */

const categoryButtons = document.querySelectorAll(".new-category-btn");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        window.location.href = `/filter?category=${category}`;
    });
});






