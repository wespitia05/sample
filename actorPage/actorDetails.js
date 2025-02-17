const API_KEY = "bc7c4e7c62d9e223e196bbd15978fc51";

document.addEventListener("DOMContentLoaded", function () {
    const actor = JSON.parse(localStorage.getItem("selectedActor"));

    if (!actor) {
        alert("no actor selected!");
        window.location.href = "../homePage/homePage.html";
        return;
    }

    console.log("loaded actor from storage:", actor);
    fetchActorDetails(actor.id);
});

async function fetchActorDetails(actorId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`
        );
        const data = await response.json();

        console.log("full actor data from TMDB:", data);

        if (!data || !data.name) {
            console.error("no valid actor data found!");
            document.getElementById("actorBio").textContent = "error loading actor details";
            return;
        }

        console.log("updating HTML with actor data...");

        document.getElementById("actorName").textContent = data.name || "Unknown Actor";
        document.getElementById("actorImage").src = data.profile_path
            ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
            : "https://via.placeholder.com/400/cccccc/ffffff?text=No+Image";

        document.getElementById("actorBio").textContent = data.biography || "Biography not available.";

        fetchActorMovies(actorId);
    } catch (error) {
        console.error("error fetching actor details:", error);
        document.getElementById("actorBio").textContent = "error loading actor details.";
    }
}



async function fetchActorMovies(actorId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`
        );
        const data = await response.json();

        console.log("🟢 Actor movies data:", data); // ✅ Debugging Log

        if (!data.cast || data.cast.length === 0) {
            document.getElementById("knownMovies").textContent = "No known movies.";
            return;
        }

        // 🔥 Sort movies from most recent to oldest
        const sortedMovies = data.cast
            .filter(movie => movie.release_date) // Remove movies with no release date
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Sort descending

        // 🔥 Get first 5 sorted movies
        const movieTitles = sortedMovies.slice(0, 30).map(movie => `${movie.title} (${movie.release_date.split("-")[0]})`);
        document.getElementById("knownMovies").textContent = movieTitles.join(", ");

    } catch (error) {
        console.error("❌ Error fetching actor movies:", error);
        document.getElementById("knownMovies").textContent = "Error loading movies.";
    }
}


