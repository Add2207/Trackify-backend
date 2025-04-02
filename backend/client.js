const BACKEND_URL = "http://localhost:3001";

// Redirects to backend for Spotify login
function login() {
    window.location.href = `${BACKEND_URL}/login`;
}

// Retrieves user_id from URL query parameters
const getUserIdFromURL = () => new URLSearchParams(window.location.search).get("user_id");

// Get user_id from URL (after login) and store it
const userId = getUserIdFromURL();
if (userId) {
    localStorage.setItem("user_id", userId);
    window.history.replaceState({}, document.title, "/"); // Clean up the URL
}

// Retrieve stored user_id
const storedUserId = localStorage.getItem("user_id");

// If user_id exists, fetch user data
if (storedUserId) {
    fetch(`${BACKEND_URL}/me?user_id=${storedUserId}`)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                document.getElementById("spotify-login").style.display = "none";
                loadUserData(storedUserId);
            } else {
                localStorage.removeItem("user_id"); // If invalid, clear storage
            }
        })
        .catch(error => console.error("Error verifying user:", error));
} else {
    document.getElementById("spotify-login").addEventListener("click", login);
}

// Fetch and display user data from the backend
async function loadUserData(userId) {
    try {
        const response = await fetch(`${BACKEND_URL}/me?user_id=${userId}`);
        const data = await response.json();

        // Update UI with user data
        document.getElementById("username").innerText = data.display_name;
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Logout function (clears stored user ID)
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = `${BACKEND_URL}/logout`; // Redirect to backend logout (if implemented)
}

// Add Logout button dynamically (Optional)
const logoutButton = document.createElement("button");
logoutButton.innerText = "Logout";
logoutButton.onclick = logout;
document.body.appendChild(logoutButton);
