const DISCORD_ID = '1192801918272155709';

async function fetchDiscordData() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await response.json();
      updateBio(data.data);
    } catch (error) {
      console.error('Error fetching Discord data:', error);
    }
  }
  
 
  function updateBio(data) {
    const avatar = document.getElementById('discord-avatar');
    const status = document.getElementById('discord-status');
  
    avatar.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;
  
    let statusText = `Status: ${data.discord_status}`;
    if (data.activities && data.activities.length > 0) {
      const activity = data.activities.find(a => a.type === 0); 
      if (activity) {
        statusText += ` - Playing ${activity.name}`;
      }
    }
    if (data.listening_to_spotify) {
      statusText += ` - Listening to ${data.spotify.song} by ${data.spotify.artist} on Spotify`;
    }
  
    status.textContent = statusText;
  }
  


const titleElement = document.title;
const titleText = 'slidex';
let index = 0;

function typeWriter() {
  if (index <= titleText.length) {
    document.title = titleElement + titleText.substring(0, index);
    index++;
    setTimeout(typeWriter, 150); 
  } else {
    setTimeout(reverseTypeWriter, 2000); 
  }
}

function reverseTypeWriter() {
  if (index >= 0) {
    document.title = titleElement + titleText.substring(0, index);
    index--;
    setTimeout(reverseTypeWriter, 150); 
  } else {
    setTimeout(typeWriter, 2); 
  }
}
document.addEventListener("DOMContentLoaded", function () {
    const enterButton = document.getElementById("enter-button");
    const welcomeScreen = document.getElementById("welcome-screen");
    const content = document.getElementById("content");
    const video = document.getElementById("background-video");

    const videos = ["vid1.mp4", "vid2.mp4", "vid3.mp4"];
    const videoSource = videos[Math.floor(Math.random() * videos.length)];
    video.src = videoSource;

    enterButton.addEventListener("click", function () {
        welcomeScreen.style.opacity = "0";
        setTimeout(() => {
            welcomeScreen.style.display = "none";
            content.classList.remove("hidden");
            video.muted = false;
            video.play();
        }, 500);
    });
});

document.addEventListener("mousemove", function (event) {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    document.body.appendChild(snowflake);

    snowflake.style.left = `${event.clientX}px`;
    snowflake.style.top = `${event.clientY}px`;

    const animationDuration = Math.random() * 2 + 2; 
    const translateX = Math.random() * 200 - 100; 
    const scale = Math.random() * 0.5 + 0.5; 

    snowflake.style.animation = `fall ${animationDuration}s linear`;
    snowflake.style.transform = `translateX(${translateX}px) scale(${scale})`;

    setTimeout(() => {
        snowflake.remove();
    }, animationDuration * 1000);
});

typeWriter();
fetchDiscordData();

