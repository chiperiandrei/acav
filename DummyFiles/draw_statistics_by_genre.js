function drawStatisticsByGenre(gen, no_of_people) {
  const file_icons_genre = 'icons-genre/';
  var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
  canvas.width = 550;
  canvas.height = 250;


  var background = new Image();
  background.onload = drawbro;
  background.onerror = function () { alert(background.src + ' not loaded successfully!') };
  background.src = "imgbackground.jpg";

  var genre = new Image();
  genre.onload = drawbro;
  genre.onerror = function () { alert(background.src + ' not loaded successfully!') };
  genre.src = file_icons_genre + gen + ".png";
  gen = gen.replace(/[&\/\\#,+()$~%.'":*?_<>{}]/g, ' ');

  no_of_images = 2;

  function drawbro() {
    if (--no_of_images > 0) { return; }
    ctx.font = '20px serif';
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(genre, 10, 80, 40, 40);
    ctx.fillText(`There are ${no_of_people} people listening music ${gen}`, 60, 100);
  }

}
