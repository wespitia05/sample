const API_KEY = "bc7c4e7c62d9e223e196bbd15978fc51"; // 🔥 TMDB API Key
const movie = JSON.parse(localStorage.getItem("selectedMovie"));

if (!movie) {
    alert("No movie selected!");
    window.location.href = "../homePage/homePage.html"; // ✅ Redirect if no movie is selected
} else {
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("moviePoster").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById("releaseYear").textContent = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
    document.getElementById("movieDescription").textContent = movie.overview || "No description available.";

    fetchMovieCast(movie.id);
}

// ✅ Fetch movie cast from TMDB API & make actors clickable
async function fetchMovieCast(movieId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        const data = await response.json();

        if (!data.cast || data.cast.length === 0) {
            document.getElementById("movieCast").textContent = "Cast information not available.";
            return;
        }

        // 🔥 Get first 15 cast members
        const castList = data.cast.slice(0, 15).map(actor => {
            return `<span class="actor-name" onclick="selectActor(${actor.id}, '${actor.name}')">${actor.name}</span>`;
        });

        document.getElementById("movieCast").innerHTML = castList.join(", ");
    } catch (error) {
        console.error("❌ Error fetching cast:", error);
        document.getElementById("movieCast").textContent = "Error loading cast.";
    }
}

window.selectActor = function (actorId, actorName) {
    console.log("✅ Saving actor:", actorId, actorName); // Debugging log
    localStorage.setItem("selectedActor", JSON.stringify({ id: actorId, name: actorName }));
    window.location.href = "../actorPage/actorPage.html";
};


