/* ============================================================
   YMS STORE
   MESSAGERIE VIP
   messages.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const CONFIG = {
        logo: "../assets/image/IMG_3474.PNG",
        defaultAvatar: "../assets/image/default-user.png",

        /* Pour l'instant, l'historique est volontairement vide */
        clearHistoryOnLoad: true,

        /* Email YMS STORE */
        gmail: "ymstore@gmail.com"
    };

    const STORAGE = {
        messages: "ymsPrivateMessages",
        background: "ymsChatBackground"
    };


    /* =========================================================
       ÉLÉMENTS
    ========================================================= */

    const chatBox = document.getElementById("chatBox");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    const attachBtn = document.getElementById("attachBtn");
    const fileInput = document.getElementById("fileInput");
    const filePreview = document.getElementById("filePreview");

    const recordBtn = document.getElementById("recordBtn");
    const recordingBar = document.getElementById("recordingBar");
    const recordingTime = document.getElementById("recordingTime");
    const cancelRecording = document.getElementById("cancelRecording");

    const emojiBtn = document.getElementById("emojiBtn");
    const emojiPanel = document.getElementById("emojiPanel");

    const chatMenu = document.getElementById("chatMenu");
    const chatOptions = document.getElementById("chatOptions");
    const clearChat = document.getElementById("clearChat");

    const changeBackground =
        document.getElementById("changeBackground");

    const backgroundPanel =
        document.getElementById("backgroundPanel");

    const closeBackground =
        document.getElementById("closeBackground");

    const gmailBtn = document.getElementById("gmailBtn");
    const voiceCall = document.getElementById("voiceCall");
    const videoCall = document.getElementById("videoCall");


    /* =========================================================
       ÉTAT
    ========================================================= */

    let messages = [];

    let selectedFile = null;

    let mediaRecorder = null;
    let audioChunks = [];
    let recordingInterval = null;
    let recordingSeconds = 0;

    let stream = null;


    /* =========================================================
       UTILITAIRES
    ========================================================= */

    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent = value;

        return div.innerHTML;
    }


    function getTime() {

        return new Date().toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    function formatRecordingTime(seconds) {

        const min =
            String(
                Math.floor(seconds / 60)
            ).padStart(2, "0");

        const sec =
            String(
                seconds % 60
            ).padStart(2, "0");

        return `${min}:${sec}`;

    }


    function saveMessages() {

        try {

            localStorage.setItem(
                STORAGE.messages,
                JSON.stringify(messages)
            );

        } catch (error) {

            console.warn(
                "Impossible de sauvegarder les messages.",
                error
            );

        }

    }


    function loadMessages() {

        /*
         * IMPORTANT :
         * on démarre sans ancien historique.
         */

        if (CONFIG.clearHistoryOnLoad) {

            localStorage.removeItem(
                STORAGE.messages
            );

            messages = [];

            return;
        }


        try {

            const saved =
                localStorage.getItem(
                    STORAGE.messages
                );

            messages =
                saved
                    ? JSON.parse(saved)
                    : [];

            if (!Array.isArray(messages)) {
                messages = [];
            }

        } catch (error) {

            messages = [];

        }

    }


    /* =========================================================
       IMAGES
    ========================================================= */

    function fixImages() {

        document
            .querySelectorAll("img")
            .forEach(img => {

                img.addEventListener(
                    "error",
                    function () {

                        if (
                            !this.dataset.fallback
                        ) {

                            this.dataset.fallback =
                                "true";

                            this.src =
                                CONFIG.defaultAvatar;

                        }

                    }
                );

            });

    }


    /* =========================================================
       AFFICHAGE MESSAGES
    ========================================================= */

    function renderMessages() {

        if (!chatBox) {
            return;
        }


        chatBox.innerHTML = "";


        if (messages.length === 0) {

            chatBox.innerHTML = `

                <div class="empty-chat">

                    <div class="empty-chat-icon">

                        <i class="fa-solid fa-lock"></i>

                    </div>

                    <h3>
                        Conversation privée
                    </h3>

                    <p>
                        Vos messages avec YMS STORE
                        sont confidentiels.
                    </p>

                    <span>
                        <i class="fa-solid fa-shield-halved"></i>
                        Connexion privée
                    </span>

                </div>

            `;

            return;

        }


        const dateElement =
            document.createElement("div");

        dateElement.className =
            "chat-date";

        dateElement.textContent =
            "Aujourd'hui";

        chatBox.appendChild(
            dateElement
        );


        messages.forEach(
            message => {

                renderMessage(
                    message
                );

            }
        );


        scrollToBottom();

    }


    function renderMessage(message) {

        const row =
            document.createElement("div");

        row.className =
            `message-row ${
                message.sender === "member"
                    ? "sent"
                    : "received"
            }`;


        /* Avatar YMS */

        if (message.sender === "yms") {

            const avatar =
                document.createElement("div");

            avatar.className =
                "message-avatar-small";

            avatar.innerHTML = `

                <img
                    src="${CONFIG.logo}"
                    alt="YMS STORE">

            `;

            row.appendChild(
                avatar
            );

        }


        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";


        /* Auteur */

        if (message.sender === "yms") {

            const author =
                document.createElement("div");

            author.className =
                "message-author";

            author.textContent =
                "YMS STORE";

            bubble.appendChild(
                author
            );

        }


        /* TEXTE */

        if (
            message.type === "text"
        ) {

            const text =
                document.createElement("div");

            text.className =
                "message-text";

            text.innerHTML =
                escapeHTML(
                    message.text || ""
                ).replace(
                    /\n/g,
                    "<br>"
                );

            bubble.appendChild(
                text
            );

        }


        /* IMAGE */

        if (
            message.type === "image"
        ) {

            const image =
                document.createElement("img");

            image.className =
                "message-media";

            image.src =
                message.data;

            image.alt =
                "Image envoyée";

            bubble.appendChild(
                image
            );

        }


        /* VIDEO */

        if (
            message.type === "video"
        ) {

            const video =
                document.createElement("video");

            video.className =
                "message-media";

            video.controls = true;

            video.src =
                message.data;

            bubble.appendChild(
                video
            );

        }


        /* AUDIO */

        if (
            message.type === "audio"
        ) {

            const audio =
                document.createElement("audio");

            audio.className =
                "message-audio";

            audio.controls = true;

            audio.src =
                message.data;

            bubble.appendChild(
                audio
            );

        }


        /* FICHIER */

        if (
            message.type === "file"
        ) {

            const file =
                document.createElement("a");

            file.className =
                "message-file";

            file.href =
                message.data;

            file.download =
                message.fileName ||
                "fichier";

            file.target =
                "_blank";

            file.innerHTML = `

                <i class="fa-solid fa-file"></i>

                <span>
                    ${escapeHTML(
                        message.fileName ||
                        "Fichier"
                    )}
                </span>

            `;

            bubble.appendChild(
                file
            );

        }


        /* META */

        const meta =
            document.createElement("div");

        meta.className =
            "message-meta";

        meta.innerHTML = `

            <span>
                ${message.time || getTime()}
            </span>

        `;


        /* DOUBLE CHECK */

        if (
            message.sender === "member"
        ) {

            const read =
                document.createElement("span");

            read.className =
                "message-read blue";

            read.innerHTML = `

                <i class="fa-solid fa-check"></i>
                <i class="fa-solid fa-check"></i>

            `;

            meta.appendChild(
                read
            );

        }


        bubble.appendChild(
            meta
        );

        row.appendChild(
            bubble
        );


        chatBox.appendChild(
            row
        );


        /* Marquer les messages YMS comme lus */

        if (
            message.sender === "yms"
        ) {

            message.read = true;

        }

    }


    function scrollToBottom() {

        if (!chatBox) {
            return;
        }

        setTimeout(() => {

            chatBox.scrollTop =
                chatBox.scrollHeight;

        }, 50);

    }


    /* =========================================================
       ENVOYER MESSAGE
    ========================================================= */

    function sendMessage() {

        const text =
            messageInput
                ? messageInput.value.trim()
                : "";


        if (!text && !selectedFile) {

            return;

        }


        if (selectedFile) {

            sendSelectedFile();

        }


        if (text) {

            messages.push({

                id:
                    Date.now(),

                sender:
                    "member",

                type:
                    "text",

                text:
                    text,

                time:
                    getTime(),

                read:
                    true

            });

        }


        saveMessages();

        renderMessages();

        clearInput();

    }


    function clearInput() {

        if (messageInput) {

            messageInput.value =
                "";

        }

        selectedFile =
            null;

        if (fileInput) {

            fileInput.value =
                "";

        }

        if (filePreview) {

            filePreview.innerHTML =
                "";

            filePreview.classList.add(
                "hidden"
            );

        }

    }


    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =========================================================
       PIÈCE JOINTE
    ========================================================= */

    if (attachBtn && fileInput) {

        attachBtn.addEventListener(
            "click",
            () => {

                fileInput.click();

            }
        );

    }


    if (fileInput) {

        fileInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) {
                    return;
                }


                selectedFile =
                    file;


                showFilePreview(
                    file
                );

            }
        );

    }


    function showFilePreview(file) {

        if (!filePreview) {
            return;
        }


        filePreview.classList.remove(
            "hidden"
        );


        const url =
            URL.createObjectURL(
                file
            );


        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            filePreview.innerHTML = `

                <div class="preview-content">

                    <img
                        src="${url}"
                        alt="Aperçu">

                    <span>
                        ${escapeHTML(file.name)}
                    </span>

                    <button
                        type="button"
                        id="removePreview">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>

            `;

        }

        else {

            filePreview.innerHTML = `

                <div class="preview-file">

                    <i class="fa-solid fa-file"></i>

                    <span>
                        ${escapeHTML(file.name)}
                    </span>

                    <button
                        type="button"
                        id="removePreview">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>

            `;

        }


        const remove =
            document.getElementById(
                "removePreview"
            );


        if (remove) {

            remove.addEventListener(
                "click",
                clearInput
            );

        }

    }


    function sendSelectedFile() {

        if (!selectedFile) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                let type =
                    "file";


                if (
                    selectedFile.type
                        .startsWith("image/")
                ) {

                    type =
                        "image";

                }
                else if (
                    selectedFile.type
                        .startsWith("video/")
                ) {

                    type =
                        "video";

                }
                else if (
                    selectedFile.type
                        .startsWith("audio/")
                ) {

                    type =
                        "audio";

                }


                messages.push({

                    id:
                        Date.now(),

                    sender:
                        "member",

                    type:
                        type,

                    data:
                        event.target.result,

                    fileName:
                        selectedFile.name,

                    time:
                        getTime(),

                    read:
                        true

                });


                saveMessages();

                renderMessages();

            };


        reader.readAsDataURL(
            selectedFile
        );

    }


    /* =========================================================
       EMOJIS
    ========================================================= */

    if (emojiBtn && emojiPanel) {

        emojiBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                emojiPanel.classList.toggle(
                    "hidden"
                );

            }
        );

    }


    if (emojiPanel) {

        emojiPanel
            .querySelectorAll("button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (!messageInput) {
                            return;
                        }

                        messageInput.value +=
                            button.textContent;

                        messageInput.focus();

                    }
                );

            });

    }


    /* =========================================================
       MENU
    ========================================================= */

    if (chatMenu) {

        chatMenu.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                chatOptions.classList.toggle(
                    "hidden"
                );

            }
        );

    }


    /* =========================================================
       SUPPRIMER HISTORIQUE
    ========================================================= */

    if (clearChat) {

        clearChat.addEventListener(
            "click",
            () => {

                messages = [];

                localStorage.removeItem(
                    STORAGE.messages
                );

                renderMessages();

                chatOptions.classList.add(
                    "hidden"
                );

            }
        );

    }


    /* =========================================================
       FOND DE DISCUSSION
    ========================================================= */

    function applyBackground(name) {

        if (!chatBox) {
            return;
        }


        chatBox.classList.remove(
            "background-logo",
            "background-gold",
            "background-dark",
            "background-luxury"
        );


        chatBox.classList.add(
            `background-${name}`
        );


        try {

            localStorage.setItem(
                STORAGE.background,
                name
            );

        } catch (error) {}

    }


    function loadBackground() {

        const saved =
            localStorage.getItem(
                STORAGE.background
            );


        applyBackground(
            saved || "logo"
        );


        document
            .querySelectorAll(
                ".background-option"
            )
            .forEach(option => {

                option.classList.toggle(
                    "active",
                    option.dataset.background ===
                    (saved || "logo")
                );

            });

    }


    if (changeBackground) {

        changeBackground.addEventListener(
            "click",
            () => {

                backgroundPanel.classList.remove(
                    "hidden"
                );

                chatOptions.classList.add(
                    "hidden"
                );

            }
        );

    }


    if (closeBackground) {

        closeBackground.addEventListener(
            "click",
            () => {

                backgroundPanel.classList.add(
                    "hidden"
                );

            }
        );

    }


    document
        .querySelectorAll(
            ".background-option"
        )
        .forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    const background =
                        option.dataset.background;


                    applyBackground(
                        background
                    );


                    document
                        .querySelectorAll(
                            ".background-option"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    option.classList.add(
                        "active"
                    );

                }
            );

        });


    /* =========================================================
       ENREGISTREMENT AUDIO
    ========================================================= */

    if (recordBtn) {

        recordBtn.addEventListener(
            "click",
            toggleRecording
        );

    }


    async function toggleRecording() {

        if (
            mediaRecorder &&
            mediaRecorder.state === "recording"
        ) {

            stopRecording();

            return;

        }


        try {

            stream =
                await navigator.mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            audioChunks = [];


            mediaRecorder =
                new MediaRecorder(
                    stream
                );


            mediaRecorder.ondataavailable =
                event => {

                    if (
                        event.data.size > 0
                    ) {

                        audioChunks.push(
                            event.data
                        );

                    }

                };


            mediaRecorder.onstop =
                saveAudio;


            mediaRecorder.start();


            startRecordingUI();

        }

        catch (error) {

            alert(
                "Impossible d'accéder au microphone. Vérifiez les permissions du navigateur."
            );

            console.error(
                error
            );

        }

    }


    function startRecordingUI() {

        recordingSeconds =
            0;


        if (recordingBar) {

            recordingBar.classList.remove(
                "hidden"
            );

        }


        if (recordBtn) {

            recordBtn.classList.add(
                "recording"
            );

            recordBtn.innerHTML = `

                <i class="fa-solid fa-stop"></i>

            `;

        }


        recordingInterval =
            setInterval(
                () => {

                    recordingSeconds++;

                    if (recordingTime) {

                        recordingTime.textContent =
                            formatRecordingTime(
                                recordingSeconds
                            );

                    }

                },
                1000
            );

    }


    function stopRecording() {

        if (
            mediaRecorder &&
            mediaRecorder.state ===
            "recording"
        ) {

            mediaRecorder.stop();

        }


        if (stream) {

            stream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

            stream = null;

        }


        clearInterval(
            recordingInterval
        );


        recordingInterval =
            null;


        if (recordingBar) {

            recordingBar.classList.add(
                "hidden"
            );

        }


        if (recordBtn) {

            recordBtn.classList.remove(
                "recording"
            );

            recordBtn.innerHTML = `

                <i class="fa-solid fa-microphone"></i>

            `;

        }

    }


    function saveAudio() {

        if (
            audioChunks.length === 0
        ) {

            return;

        }


        const blob =
            new Blob(
                audioChunks,
                {
                    type:
                        "audio/webm"
                }
            );


        const reader =
            new FileReader();


        reader.onload =
            event => {

                messages.push({

                    id:
                        Date.now(),

                    sender:
                        "member",

                    type:
                        "audio",

                    data:
                        event.target.result,

                    time:
                        getTime(),

                    read:
                        true

                });


                saveMessages();

                renderMessages();

                audioChunks = [];

            };


        reader.readAsDataURL(
            blob
        );

    }


    if (cancelRecording) {

        cancelRecording.addEventListener(
            "click",
            () => {

                if (
                    mediaRecorder &&
                    mediaRecorder.state ===
                    "recording"
                ) {

                    mediaRecorder.onstop =
                        null;

                    mediaRecorder.stop();

                }


                if (stream) {

                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );

                    stream = null;

                }


                audioChunks = [];

                clearInterval(
                    recordingInterval
                );


                if (recordingBar) {

                    recordingBar.classList.add(
                        "hidden"
                    );

                }


                if (recordBtn) {

                    recordBtn.classList.remove(
                        "recording"
                    );

                    recordBtn.innerHTML = `

                        <i class="fa-solid fa-microphone"></i>

                    `;

                }

            }
        );

    }


    /* =========================================================
       GMAIL
    ========================================================= */

    if (gmailBtn) {

        gmailBtn.addEventListener(
            "click",
            () => {

                const gmailUrl =
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.gmail)}`;

                window.open(
                    gmailUrl,
                    "_blank"
                );

            }
        );

    }


    /* =========================================================
       APPEL VOCAL
    ========================================================= */

    if (voiceCall) {

        voiceCall.addEventListener(
            "click",
            () => {

                alert(
                    "L'appel vocal sera activé avec le système d'appel YMS STORE."
                );

            }
        );

    }


    /* =========================================================
       APPEL VIDÉO
    ========================================================= */

    if (videoCall) {

        videoCall.addEventListener(
            "click",
            async () => {

                try {

                    const localStream =
                        await navigator.mediaDevices
                            .getUserMedia({
                                video: true,
                                audio: true
                            });


                    localStream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );


                    alert(
                        "Caméra et microphone autorisés. Le module d'appel vidéo peut maintenant être connecté à votre système d'appel."
                    );

                }

                catch (error) {

                    alert(
                        "Autorisation caméra/microphone refusée."
                    );

                }

            }
        );

    }


    /* =========================================================
       INITIALISATION
    ========================================================= */

    loadMessages();

    loadBackground();

    fixImages();

    renderMessages();


    /* =========================================================
       EXPOSITION
    ========================================================= */

    window.YMSMessages = {

        send:
            sendMessage,

        render:
            renderMessages,

        clear:
            () => {

                messages = [];

                localStorage.removeItem(
                    STORAGE.messages
                );

                renderMessages();

            },

        getMessages:
            () => messages

    };

});