$(document).ready(function () {
  $(".testimonial-slider").slick({
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,

    responsive: [
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          fade: true,
        },
      },
    ],
  });
});
