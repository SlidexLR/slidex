// Discord user ID for Lanyard API
const userId = "1192801918272155709";

// Function to fetch Discord status using Lanyard API
async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();

        if (data.success && data.data.discord_status) {
            const statusContainer = document.getElementById("discordStatus");
            const { discord_status, activities, spotify } = data.data;

            // Set the Discord status (Online, DND, etc.)
            const statusCircle = document.querySelector("#discordStatus .status .status-circle");
            const statusText = document.querySelector("#discordStatus .status .status-text");

            // Check if statusCircle and statusText exist before modifying them
            if (statusCircle && statusText) {
                statusCircle.style.backgroundColor = getStatusColor(discord_status);
                statusText.textContent = discord_status;
            }

            // Show game or Spotify activity
            const activityInfo = document.querySelector(".activity-info");
            const activityImage = document.querySelector(".activity-image");

            if (spotify) {
                activityInfo.style.display = 'block';
                activityImage.src = spotify.album_art_url || ''; // Use album art image
                activityImage.style.display = spotify.album_art_url ? 'block' : 'none'; // Hide if no image
                activityInfo.innerHTML = `
                    <p>Listening to ${spotify.song} by ${spotify.artist}</p>
                `;
            } else if (activities && activities.length > 0) {
                const game = activities.find(activity => activity.type === 0); // Game activity
                if (game) {
                    activityInfo.style.display = 'block';
                    activityImage.src = game.assets.large_image || ''; // Use game image
                    activityImage.style.display = game.assets.large_image ? 'block' : 'none'; // Hide if no image
                    activityInfo.innerHTML = `
                        <p>Playing ${game.name}</p>
                    `;
                } else {
                    activityInfo.style.display = 'none'; // Hide activity info if no game or Spotify
                }
            } else {
                activityInfo.style.display = 'none'; // Hide activity info if no activity
            }
        } else {
            console.error("Failed to fetch Discord status.");
        }
    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

// Function to map Discord status to color
function getStatusColor(status) {
    switch (status) {
        case 'online': return 'green';
        case 'dnd': return 'red';
        case 'idle': return 'yellow';
        case 'offline': return 'gray';
        default: return 'gray';
    }
}

fetchDiscordStatus();
