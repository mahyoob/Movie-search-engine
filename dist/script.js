//
function getByDataSearch(searchValue) {
  // the general search URL finishing with '&s'
  var url = `http://www.omdbapi.com/?&apikey=e131047c&s=`;
  var values = [];
  $('.movies-list').removeClass('h-screen');
  if (!searchValue) {
    //default 10 movies search name
    searchValue = 'potter';
  }
  // storing the ajax call in a variable
  var results = getDataFromApi(url, searchValue);

  // getting the needed array of objects out of this ajax call object
  if (results.Search) {
    results = results.Search;
  }
  var moviesList = [];
  // looping over the array to get the titles of the movies to use them in another title search url
  for (var i = 0; i < results.length; i++) {
    var movie = getByDataTitle(results[i].Title);
    moviesList.push(movie);
  }

  // array of objects containing the info wee need about the searched or default movies
  return moviesList;
}
// searching for movies by title
function getByDataTitle(title) {
  var url = `http://www.omdbapi.com/?&apikey=e131047c&t=`;
  return getDataFromApi(url, title);
}
// this function return the ajax call
function getDataFromApi(url1, value) {
  $.extend({
    getValues: function (url1) {
      var result = null;
      $.ajax({
        method: 'GET',
        async: false,
        url: url1 + value,
        success: function (data) {
          if (data.Error) {
            result = [];
            $('.movies-list').addClass('h-screen');
            alert(data.Error);
          } else {
            result = data;
          }
        },
      });
      return result;
    },
  });
  return $.getValues(url1);
}
// this function triggers when the page is loaded
$(document).ready(function () {
  var movies = getByDataSearch();
  createMovieListPage(movies);

  $('#movieForm').submit(function (event) {
    event.preventDefault();
    const movie = $('#movie').val();
    var movies = getByDataSearch(movie);
    createMovieListPage(movies);
  });
});
// getting the data out of each movie object to create it's own html element
function createMovieListPage(movies) {
  $('.movies-list').empty();
  for (var i = 0; i < movies.length; i++) {
    var element = createMovieElement(movies[i]);
    $('.movies-list').append(element);
  }
}

function createMovieElement(movie) {
  return `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden bg-gray-50 mt-2 md:max-w-2xl mt-2">
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img
            class="h-48 w-full rounded-xl object-cover md:w-48"
            src=${movie.Poster}
            alt="movie poster"
          />
        </div>
        <div class="movie-summary w-full">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold movie-header flex justify-between py-5 px-3">
            <div>${movie.Title} - ${movie.Runtime}</div>
            <div>${movie.Released}</div>
          </div>
          <hr />
          <div class="movie-body p-4">
            <div class="movie-genre text-gray-500">
              ${movie.Genre}
            </div>
            <p class="mt-2 movie-plot">
             ${movie.Plot}
            </p>
          </div>
        </div>
      </div>
    </div>
`;
}
