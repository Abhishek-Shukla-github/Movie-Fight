// const root = document.querySelector(".autocomplete");
// root.innerHTML = `
// <label><b>Search for a Movie</b></label>
// <input class="input"/>
// <div class="dropdown">
// <div class="dropdown-menu">
//   <div class="dropdown-content results">
//   </div>
// </div>
// </div>
// `;

// const input = document.querySelector("input");
// const dropdown = document.querySelector(".dropdown");
// const resultsWrapper = document.querySelector(".results");

// let onInput = async (event) => {
//   const movies = await fetchData(event.target.value);
//   //Closing Dropdown When no Movie is there
//   if (movies.length === 0) {
//     dropdown.classList.remove("is-active");
//     return;
//   }

//   resultsWrapper.innerHTML = "";
//   dropdown.classList.add("is-active");
//   for (let movie of movies) {
//     let option = document.createElement("a");
//     let imageSrc = movie.Poster === "N/A" ? "" : movie.Poster;
//     option.classList.add("dropdown-item");
//     option.innerHTML = `
//       <img src="${imageSrc}" />
//       ${movie.Title}
//     `;
//     resultsWrapper.appendChild(option);
//     //Updating Input Area & Closing dropdown when  a specific movie is clicked
//     option.addEventListener("click", () => {
//       dropdown.classList.remove("is-active");
//       input.value = movie.Title;
//       onMovieSelect(movie);
//     });
//   }
// };
// input.addEventListener("input", debounce(onInput, 500));

// //Dropdown Disappears on click
// document.addEventListener("click", (event) => {
//   if (!root.contains(event.target)) dropdown.classList.remove("is-active");
// });

//Generic Autocomplete configuration
const autocompleteConfig = {
  renderOption(movie) {
    let imageSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imageSrc}" />
    ${movie.Title} (${movie.Year})
  `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(search) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "8f602fe2",
        s: search,
      },
    });
    if (response.data.Error) return [];
    return response.data.Search;
  },
};

//Creating  Left autocomplete
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

//Creating  Left autocomplete
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

//Fetching info about movie
let leftMovie, rightMovie;
const onMovieSelect = async (movie, summaryTarget, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "8f602fe2",
      i: movie.imdbID,
    },
  });
  // return response;
  summaryTarget.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else rightMovie = response.data;

  //Condition to start comparison once both movies are loaded
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  let leftStats = document.querySelectorAll("#left-summary .notification");
  let rightStats = document.querySelectorAll("#right-summary .notification");

  leftStats.forEach((leftStat, index) => {
    rightStat = rightStats[index];
    let leftSideValue = parseFloat(leftStat.dataset.value);
    let rightSideValue = parseFloat(rightStat.dataset.value);

    // console.log(leftSideValue, rightStat);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
      console.log(leftSideValue, rightSideValue + "If block");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
      console.log(leftSideValue, rightSideValue + "Else block");
    }
  });
};

//Displaying summary of movies
const movieTemplate = (movieDetail) => {
  let metascore = parseInt(movieDetail.Metascore);
  let imdbRating = parseFloat(movieDetail.imdbRating);
  let awards = movieDetail.Awards.split(" ").reduce((prev, currWord) => {
    let value = parseInt(currWord);
    if (isNaN(value)) {
      return prev;
    } else return prev + value;
  }, 0);
  let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  console.log(metascore, imdbRating, imdbVotes, awards);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}"/>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
          <h4><em>Actors</em>:- ${movieDetail.Actors}</h4>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
  `;
};
