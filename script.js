document.addEventListener("DOMContentLoaded", function () {
    const mainContainer = document.getElementById("main-container");
    const overlay = document.getElementById("overlay");
    const video = document.getElementById("background-video");

    // Blur content on load
    if (mainContainer) mainContainer.classList.add("blurred");

    // Overlay click = reveal main content + play video
    if (overlay) {
        overlay.addEventListener("click", function () {
            overlay.classList.add("hidden");
            if (mainContainer) mainContainer.classList.remove("blurred");
            if (video) video.play().catch(() => {});
        });
    }

    // Random video
    const videos = ["vid1.mp4", "vid2.mp4", "vid3.mp4", "vid4.mp4", "vid5.mp4", "vid6.mp4", "vid7.mp4", "vid8.mp4", "vid9.mp4"];
    if (video) {
        const source = videos[Math.floor(Math.random() * videos.length)];
        video.querySelector("source")?.remove();
        const sourceEl = document.createElement("source");
        sourceEl.src = source;
        sourceEl.type = "video/mp4";
        video.appendChild(sourceEl);
        video.load();
    }

    // 3D hover
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

    // Title typewriter
    const originalTitle = document.title;
    const titleText = 'lidex';
    let titleIndex = 0;
    function titleTypeWriter() {
        if (titleIndex <= titleText.length) {
            document.title = originalTitle + titleText.substring(0, titleIndex);
            titleIndex++;
            setTimeout(titleTypeWriter, 150);
        } else {
            setTimeout(reverseTitleTypeWriter, 2000);
        }
    }
    function reverseTitleTypeWriter() {
        if (titleIndex >= 0) {
            document.title = originalTitle + titleText.substring(0, titleIndex);
            titleIndex--;
            setTimeout(reverseTitleTypeWriter, 150);
        } else {
            setTimeout(titleTypeWriter, 2000);
        }
    }
    titleTypeWriter();

    // Lanyard websocket
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
        const avatarEl = document.getElementById("discord-avatar");
        const usernameEl = document.getElementById("discord-username");
        const statusEl = document.getElementById("discord-custom-status");
        const spotifyContainer = document.getElementById("spotify-container");

        if (data.discord_user && avatarEl && usernameEl) {
            avatarEl.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
            usernameEl.textContent = data.discord_user.username;
        }

        updateStatusCircle(data.discord_status);

        if (statusEl) {
            const customStatus = data.activities.find(act => act.type === 4);
            statusEl.textContent = customStatus ? customStatus.state : "";
        }

        if (spotifyContainer) {
            if (data.spotify) {
                const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${data.spotify.track_id}`;
                const iframe = document.createElement('iframe');
                iframe.src = spotifyEmbedUrl;
                iframe.width = "300";
                iframe.height = "80";
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
                spotifyContainer.innerHTML = "";
                spotifyContainer.appendChild(iframe);
                spotifyContainer.classList.remove("hidden");
            } else {
                spotifyContainer.classList.add("hidden");
            }
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
        if (statusCircle) {
            statusCircle.style.backgroundColor = colors[status] || "gray";
        }
    }
});