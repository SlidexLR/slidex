const DISCORD_ID = '1192801918272155709';

const socket = new WebSocket("wss://api.lanyard.rest/socket");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
});

socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);
  if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
    updateDiscordData(data.d);
  }
});

function updateDiscordData(data) {
  if (data.discord_user) {
    document.getElementById("discord-avatar").src =
      `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
    document.getElementById("discord-username").textContent = data.discord_user.username;
  }

  updateStatusCircle(data.discord_status);

  if (data.activities.length > 0) {
    const customStatus = data.activities.find(act => act.type === 4);
    document.getElementById("discord-custom-status").textContent =
      customStatus ? customStatus.state : "No custom status";
  } else {
    document.getElementById("discord-custom-status").textContent = "No custom status";
  }

  if (data.spotify) {
    const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${data.spotify.track_id}`;
    const iframe = document.createElement('iframe');
    iframe.src = spotifyEmbedUrl;
    iframe.width = "300";
    iframe.height = "80";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    document.getElementById("spotify-container").innerHTML = "";
    document.getElementById("spotify-container").appendChild(iframe);
    document.getElementById("spotify-container").classList.remove("hidden");
  } else {
    document.getElementById("spotify-container").classList.add("hidden");
  }
}

function updateStatusCircle(status) {
  const statusCircle = document.getElementById("status-circle");
  const colors = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "gray"
  };

  statusCircle.style.backgroundColor = colors[status] || "gray";
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
    setTimeout(typeWriter, 2000);
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

document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const noteInput = document.getElementById('note-input');
  const notesList = document.getElementById('notes-list');

  if (noteForm && noteInput && notesList) {
    function renderNote(note) {
      const li = document.createElement('li');
      li.textContent = note.text;
      notesList.appendChild(li);
    }

    async function loadNotes() {
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const notes = await response.json();
          notesList.innerHTML = ''; 
          notes.forEach(renderNote);
        } else {
          console.error('Failed to fetch notes:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }

    noteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const noteText = noteInput.value.trim();
      if (!noteText) return;

      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: noteText })
        });
        if (response.ok) {
          const newNote = await response.json();
          renderNote(newNote);
          noteInput.value = '';
        } else {
          console.error('Failed to post note:', response.statusText);
        }
      } catch (error) {
        console.error('Error posting note:', error);
      }
    });

    loadNotes();
  }
});

typeWriter();

