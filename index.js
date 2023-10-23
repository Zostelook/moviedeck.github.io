const URL = 'https://image.tmdb.org/t/p/original/';
const search_API_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = 'f531333d637d0c44abc85b3e74db2186';
const API_URL = "https://api.themoviedb.org/3/movie/top_rated";

let movies = [];

async function fatchMovies(page=1){
try{
    let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
    response = await response.json();
    movies = response.results;
    renderMovies(response.results)
}catch(error){
  console.log(error)
}
}

fatchMovies()

function renderMovies(movies){
    const moviesList = document.getElementById('movies-list');

    //clearing my moviesList before rending 
    moviesList.innerHTML = "";
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, vote_count} = movie;
        const listItem = document.createElement('li');
        listItem.className = 'card';

        let imageSource = poster_path?`${URL}/${poster_path}`:"https://play-lh.googleusercontent.com/xyGOxEnZv5EvFNGsPBSSBmT0MDEN1O_w5w5l6t_L4US3kNnSMB40rzBWea0CsyIACuRB";

        const imageTag = `<img
        class = 'poster'
        src = ${imageSource}
        alt = ${title}
        >`;

        listItem.innerHTML += imageTag;

        const titleTag = `<p class = 'title'>${title}</p>`;

        listItem.innerHTML += titleTag;
        

        let sectionTag = `<section class="vote-favoriteicon">
        <section class="vote">
            <p class="vote-count">Votes : ${vote_count}</p>
            <p class="vote-rating">Rating : ${vote_average}</p>
        </section>
        <i class="fa-regular fa-heart fa-2xl" id="favorite-icon"></i>
       </section>`;

       listItem.innerHTML += sectionTag;
        
       moviesList.appendChild(listItem);
    });
}
// we will sort the movies oldest to latest and vice-versa
let flag = 1;
const sortByDate = document.getElementById('sort-by-date');

function sortMoviesByDate(){
    let sortedMovies;
   if(flag===1){
     sortedMovies = movies.sort((movie1,movie2)=>{
        
        return new Date(movie1.release_date)-new Date(movie2.release_date)
      })
      sortByDate.textContent = 'sort by date (latest to oldest)'
      flag = -1;
   }else if(flag===-1){
    sortedMovies = movies.sort((movie1,movie2)=>{
        
        return new Date(movie2.release_date)-new Date(movie1.release_date)
      })

      sortByDate.textContent = 'sort by date (oldest to latest)'
      flag = 1;
   }

    renderMovies(sortedMovies);
}

const sortByRateButton = document.getElementById('sort-by-rating');
sortByRateButton.addEventListener('click',sortMoviesByRate)
let flagRate = 1;
function sortMoviesByRate(){
    let sortedMovies;

    if(flagRate==1){
       sortedMovies= movies.sort((rating1,rating2)=>{
            return (rating1.vote_average -rating2.vote_average);
        })
        
        sortByRateButton.textContent = 'sort by rating (most to least)';
        flagRate = -1;
        renderMovies(sortedMovies)
    }else if(flagRate == -1){
        sortedMovies= movies.sort((rating1,rating2)=>{
            return (rating2.vote_average -rating1.vote_average);
        })
        
        sortByRateButton.textContent = 'sort by rating (least to most)';
        flagRate = 1;
        renderMovies(sortedMovies)
    }
}

//pagination 
let currentPage = 1;
const previousButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumberButton = document.getElementById('page-number-button');

previousButton.disabled = true;

nextButton.addEventListener('click', ()=>{
    currentPage++;
     previousButton.disabled = false;
    // fatch movies of new page
    fatchMovies(currentPage)
    pageNumberButton.textContent = `Current Page: ${currentPage}`;
    if(currentPage===5){
        nextButton.disabled = true;
    }

})

previousButton.addEventListener('click',()=>{
    nextButton.disabled = false;
    currentPage--;
    fatchMovies(currentPage);

    pageNumberButton.textContent =  `Current Page: ${currentPage}`;

    if(currentPage==1){
        previousButton.disabled = true;
    }
})


const searchMovies = async (searchMovie)=>{
    try{
        console.log(searchMovie)
        const response = await fetch(`${search_API_URL}?query=${searchMovie}&api_key=${API_KEY}&language=en-us&page=1`);
        const result = await response.json();
        movies = result.results;

        renderMovies(movies)
    }catch(error){
        console.log(error);
    }
}
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

//I am going to use throttling concept for search button

function throttledFunctionForSearchButton(fn,delay){
    let timer = 0;
    return ()=>{
        if(timer){
            return;
        }
        timer = setTimeout(()=>{
           fn();
           timer = 0;
        },delay)
    }
}
searchButton.addEventListener('click',()=>{
    searchMovies(searchInput.value);
})

sortByDate.addEventListener('click',sortMoviesByDate);
