document.addEventListener("DOMContentLoaded", function () {
   
    document.getElementById("entry").addEventListener("click", function () {
        document.getElementById("main-container").style.display = "flex";
        document.getElementById("entry").classList.add("fade-out");
        setTimeout(function () {
            document.getElementById("entry").style.display = "none";
        }, 500);
        

    });
    

        document.addEventListener("DOMContentLoaded", function () {
        const video = document.getElementById("background-video");
        const videos = ["vid1.mp4", "vid2.mp4", "vid3.mp4", "vid4.mp4", "vid5.mp4", "vid6.mp4", "vid7.mp4", "vid8.mp4", "vid9.mp4"];
    
        if (video) {
            const videoSource = videos[Math.floor(Math.random() * videos.length)];
            video.querySelector("source")?.remove(); 
            const sourceElement = document.createElement("source");
            sourceElement.src = videoSource;
            sourceElement.type = "video/mp4";
            video.appendChild(sourceElement);
            video.load();
    
            
            video.play().catch(error => {
                console.error("Video playback failed:", error);
               
            });
        }

    document.querySelectorAll('.pill-container').forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (-y / rect.height) * 30;
            const rotateY = (x / rect.width) * 30;
            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });

    const titleElement = document.title;
    const titleText = 'lidex';
    let titleIndex = 0;

    function titleTypeWriter() {
        if (titleIndex <= titleText.length) {
            document.title = titleElement + titleText.substring(0, titleIndex);
            titleIndex++;
            setTimeout(titleTypeWriter, 150);
        } else {
            setTimeout(reverseTitleTypeWriter, 2000);
        }
    }

    function reverseTitleTypeWriter() {
        if (titleIndex >= 0) {
            document.title = titleElement + titleText.substring(0, titleIndex);
            titleIndex--;
            setTimeout(reverseTitleTypeWriter, 150);
        } else {
            setTimeout(titleTypeWriter, 2000);
        }
    }
    titleTypeWriter();

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
                customStatus ? customStatus.state : "";
        } else {
            document.getElementById("discord-custom-status").textContent = "";
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
});
