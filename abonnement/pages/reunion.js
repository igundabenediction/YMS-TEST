/* =========================================================
   YMS STORE - RÉUNIONS VIP
   reunion.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const meetingTitle = document.getElementById("meetingTitle");
    const meetingDate = document.getElementById("meetingDate");
    const meetingList = document.getElementById("meetingList");

    const STORAGE_KEY = "ymsVipMeetings";

    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function getMeetings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (error) {
            console.error("Erreur lecture réunions :", error);
            return [];
        }
    }

    function saveMeetings(meetings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    }

    function generateMeetingCode() {

        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (let i = 0; i < 9; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );

            if (i === 2 || i === 5) {
                code += "-";
            }
        }

        return code;
    }

    function generateMeetingId() {
        return "meeting-" + Date.now() + "-" +
            Math.random().toString(36).substring(2, 8);
    }

    function formatDate(dateString) {

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Date inconnue";
        }

        return date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    /* =====================================================
       CRÉER UNE RÉUNION
    ===================================================== */

    window.createMeeting = function () {

        const title = meetingTitle.value.trim();
        const date = meetingDate.value;

        if (!title) {
            showMessage(
                "Veuillez entrer le titre de la réunion.",
                "error"
            );
            meetingTitle.focus();
            return;
        }

        if (!date) {
            showMessage(
                "Veuillez choisir la date et l'heure.",
                "error"
            );
            meetingDate.focus();
            return;
        }

        const selectedDate = new Date(date);
        const now = new Date();

        if (selectedDate <= now) {
            showMessage(
                "La réunion doit être programmée dans le futur.",
                "error"
            );
            return;
        }

        const meetings = getMeetings();

        const meetingCode = generateMeetingCode();

        const meeting = {

            id: generateMeetingId(),

            title: title,

            date: date,

            code: meetingCode,

            maxParticipants: 10,

            participants: 0,

            status: "programmée",

            createdAt: new Date().toISOString(),

            host: "YMS STORE",

            meetingUrl:
                "https://meet.jit.si/YMSSTORE-" +
                meetingCode.replace(/-/g, "")

        };

        meetings.push(meeting);

        saveMeetings(meetings);

        meetingTitle.value = "";
        meetingDate.value = "";

        renderMeetings();

        showMessage(
            "Réunion créée avec succès.",
            "success"
        );
    };


    /* =====================================================
       AFFICHER LES RÉUNIONS
    ===================================================== */

    function renderMeetings() {

        const meetings = getMeetings();

        if (!meetingList) {
            return;
        }

        if (meetings.length === 0) {

            meetingList.innerHTML = `
                <div class="empty-meetings">
                    <i class="fa-solid fa-video-slash"></i>

                    <h3>Aucune réunion programmée</h3>

                    <p>
                        Créez votre première réunion VIP.
                    </p>
                </div>
            `;

            return;
        }

        meetingList.innerHTML = "";

        meetings
            .sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            )
            .forEach(meeting => {

                const card = document.createElement("div");

                card.className = "meeting-card";

                card.innerHTML = `

                    <div class="meeting-header">

                        <div>

                            <span class="meeting-status">
                                <i class="fa-solid fa-circle"></i>
                                ${escapeHTML(meeting.status)}
                            </span>

                            <h3>
                                ${escapeHTML(meeting.title)}
                            </h3>

                        </div>

                        <button
                            class="delete-meeting"
                            onclick="deleteMeeting('${meeting.id}')"
                            title="Supprimer"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>


                    <div class="meeting-info">

                        <div>
                            <i class="fa-solid fa-calendar-days"></i>

                            <span>
                                ${formatDate(meeting.date)}
                            </span>
                        </div>


                        <div>
                            <i class="fa-solid fa-key"></i>

                            <span>
                                ${meeting.code}
                            </span>
                        </div>


                        <div>
                            <i class="fa-solid fa-users"></i>

                            <span>
                                ${meeting.participants}
                                /
                                ${meeting.maxParticipants}
                                participants
                            </span>
                        </div>

                    </div>


                    <div class="meeting-progress">

                        <div
                            class="meeting-progress-bar"
                            style="width:${Math.min(
                                (meeting.participants /
                                meeting.maxParticipants) * 100,
                                100
                            )}%"
                        ></div>

                    </div>


                    <div class="meeting-link">

                        <input
                            type="text"
                            value="${meeting.meetingUrl}"
                            readonly
                            id="link-${meeting.id}"
                        >

                        <button
                            onclick="copyMeetingLink('${meeting.id}')"
                            title="Copier le lien"
                        >
                            <i class="fa-solid fa-copy"></i>
                        </button>

                    </div>


                    <div class="meeting-actions">

                        <button
                            class="join-btn"
                            onclick="joinMeeting('${meeting.id}')"
                        >
                            <i class="fa-solid fa-video"></i>
                            Rejoindre
                        </button>


                        <button
                            class="start-btn"
                            onclick="startMeeting('${meeting.id}')"
                        >
                            <i class="fa-solid fa-play"></i>
                            Démarrer
                        </button>

                    </div>

                `;

                meetingList.appendChild(card);
            });
    }


    /* =====================================================
       REJOINDRE UNE RÉUNION
    ===================================================== */

    window.joinMeeting = function (meetingId) {

        const meetings = getMeetings();

        const meeting = meetings.find(
            item => item.id === meetingId
        );

        if (!meeting) {
            showMessage(
                "Réunion introuvable.",
                "error"
            );
            return;
        }

        if (
            meeting.participants >=
            meeting.maxParticipants
        ) {

            showMessage(
                "Cette réunion est complète. Maximum : 10 participants.",
                "error"
            );

            return;
        }

        meeting.participants++;

        saveMeetings(meetings);

        renderMeetings();

        window.open(
            meeting.meetingUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    /* =====================================================
       DÉMARRER UNE RÉUNION
    ===================================================== */

    window.startMeeting = function (meetingId) {

        const meetings = getMeetings();

        const meeting = meetings.find(
            item => item.id === meetingId
        );

        if (!meeting) {
            showMessage(
                "Réunion introuvable.",
                "error"
            );
            return;
        }

        meeting.status = "en direct";

        saveMeetings(meetings);

        renderMeetings();

        window.open(
            meeting.meetingUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    /* =====================================================
       COPIER LE LIEN
    ===================================================== */

    window.copyMeetingLink = async function (meetingId) {

        const meetings = getMeetings();

        const meeting = meetings.find(
            item => item.id === meetingId
        );

        if (!meeting) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                meeting.meetingUrl
            );

            showMessage(
                "Lien de réunion copié.",
                "success"
            );

        } catch (error) {

            const input =
                document.getElementById(
                    `link-${meetingId}`
                );

            if (input) {

                input.select();

                document.execCommand("copy");

                showMessage(
                    "Lien copié.",
                    "success"
                );
            }
        }
    };


    /* =====================================================
       SUPPRIMER UNE RÉUNION
    ===================================================== */

    window.deleteMeeting = function (meetingId) {

        const meetings = getMeetings();

        const meeting = meetings.find(
            item => item.id === meetingId
        );

        if (!meeting) {
            return;
        }

        const confirmed = confirm(
            `Voulez-vous supprimer la réunion "${meeting.title}" ?`
        );

        if (!confirmed) {
            return;
        }

        const updatedMeetings = meetings.filter(
            item => item.id !== meetingId
        );

        saveMeetings(updatedMeetings);

        renderMeetings();

        showMessage(
            "Réunion supprimée.",
            "success"
        );
    };


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showMessage(message, type = "success") {

        let notification =
            document.getElementById("meetingNotification");

        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "meetingNotification";

            document.body.appendChild(
                notification
            );
        }

        notification.className =
            `meeting-notification ${type}`;

        notification.innerHTML = `

            <i class="fa-solid ${
                type === "success"
                    ? "fa-circle-check"
                    : "fa-circle-exclamation"
            }"></i>

            <span>
                ${escapeHTML(message)}
            </span>

        `;

        notification.classList.add("show");

        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

        }, 3500);
    }


    /* =====================================================
       NETTOYAGE DES ANCIENNES RÉUNIONS
    ===================================================== */

    function updateExpiredMeetings() {

        const meetings = getMeetings();

        let changed = false;

        meetings.forEach(meeting => {

            const meetingDate =
                new Date(meeting.date);

            if (
                meetingDate < new Date() &&
                meeting.status === "programmée"
            ) {

                meeting.status = "terminée";

                changed = true;
            }
        });

        if (changed) {

            saveMeetings(meetings);

            renderMeetings();
        }
    }


    /* =====================================================
       INITIALISATION
    ===================================================== */

    renderMeetings();

    updateExpiredMeetings();

    setInterval(
        updateExpiredMeetings,
        60000
    );

});