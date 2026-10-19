const SUPABASE_URL = "https://pnpbmqkygoywtgyebojg.supabase.co";
const SUPABASE_KEY = "sb_publishable_OpKvD_Opkxdfrn_pihIpIQ_lkEcSXmL";
const STORAGE_BUCKET = "bukti-transfer";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
let currentStep = 1;

// ============================================
// LINK GRUP WHATSAPP
// EDIT LINK DI BAGIAN INI
// ============================================
const whatsappGroups = {
    "Pidato SD/MI/Sederajat": "https://chat.whatsapp.com/D78EPxmTvnLAvdHW1aFAT8?s=cl&p=a&mlu=0",
    "Pidato MTs/SMP/Sederajat": "https://chat.whatsapp.com/GgqsylNb1Fr7EsHyZq7dLn?s=cl&p=a&mlu=0",
    "LCC MTs/SMP/Sederajat": "https://chat.whatsapp.com/DzvPlItKAIO4wlsP9UZGiH?s=cl&p=a&mlu=0",
    "Mewarnai RA/TK": "https://chat.whatsapp.com/GyTHVzULUl53Q6TbnmbTia?s=cl&p=a&mlu=0",
    "Kaligrafi SMP/MTs/Sederajat": "https://chat.whatsapp.com/I1OherxeQjQ4tp3MvelPwv?s=cl&p=a&mlu=0",
    "Kaligrafi MA/SMA/Sederajat": "https://chat.whatsapp.com/JY7nwMEYHoL8cg92mjNQbB?s=cl&p=a&mlu=0",
    "Hadroh Habsy - Umum se-Jawa Barat": "https://chat.whatsapp.com/I1tUpdQgrnT73ZFtEkhdU5?s=cl&p=a&mlu=0",
    "Hadroh Banjari - Umum se-Jawa Barat": "https://chat.whatsapp.com/KiNKys51FpHGRKSJYam4ml?s=cl&p=a&mlu=0",
    "Bazar Albifest 2027": "https://chat.whatsapp.com/GOaQjV0OlLb0t2cPCgu4Cu?s=cl&p=a&mlu=0"
};

function getSelectedCompetitionValue() {
    const selected = document.querySelector('input[name="competition"]:checked');
    return selected ? selected.value.trim() : null;
}

function getWhatsappGroupLink() {
    const competitionValue = getSelectedCompetitionValue();

    if (!competitionValue) {
        return null;
    }

    const groupLink = whatsappGroups[competitionValue];

    if (!groupLink || typeof groupLink !== "string") {
        return null;
    }

    if (groupLink.startsWith("LINK_GRUP_")) {
        return null;
    }

    return groupLink;
}

function renderWhatsappGroupButton() {
    const container = document.getElementById("successWhatsAppContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const groupLink = getWhatsappGroupLink();

    if (!groupLink) {
        const status = document.createElement("p");
        status.className = "whatsapp-status";
        status.textContent = "Link grup WhatsApp untuk kategori ini belum tersedia. Silakan hubungi panitia.";
        container.appendChild(status);
        return;
    }

    const link = document.createElement("a");
    link.href = groupLink;
    link.className = "btn primary whatsapp-btn";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "💬 GABUNG GRUP WHATSAPP";
    container.appendChild(link);
}

const form = document.getElementById("registrationForm");

function isValidWhatsapp(number) {
    return /^(?:\+62|62|0)8[0-9\s-]{8,15}$/.test(number);
}

const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");


// ============================================
// STEP NAVIGATION
// ============================================

function showStep(stepNumber) {

    currentStep = stepNumber;

    steps.forEach(step => {
        step.classList.remove("active");
    });

    document
        .getElementById(`step${stepNumber}`)
        .classList.add("active");


    progressSteps.forEach((step, index) => {

        const number = index + 1;

        step.classList.remove("active");
        step.classList.remove("completed");

        if (number === stepNumber) {
            step.classList.add("active");
        }

        if (number < stepNumber) {
            step.classList.add("completed");
        }

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// COMPETITION
// ============================================

const competitionInputs =
    document.querySelectorAll('input[name="competition"]');

const individualFields =
    document.getElementById("individualFields");

const teamFields =
    document.getElementById("teamFields");

const bazaarFields =
    document.getElementById("bazaarFields");

const coachContactCard =
    document.getElementById("coachContactCard");

const institutionCard =
    document.getElementById("institutionCard");


competitionInputs.forEach(input => {

    input.addEventListener("change", function () {

        const type = this.dataset.type;

        bazaarFields.classList.toggle("hidden", type !== "bazaar");
        coachContactCard.classList.toggle("hidden", type === "bazaar");
        institutionCard.classList.toggle("hidden", type === "bazaar");
        document.getElementById("lccTeamNameHint").classList.toggle(
            "hidden",
            this.value !== "LCC MTs/SMP/Sederajat"
        );

        if (type === "team") {

            teamFields.classList.remove("hidden");
            individualFields.classList.add("hidden");

            document
                .getElementById("participantName")
                .removeAttribute("required");

            document
                .getElementById("teamName")
                .setAttribute("required", "");

        } else if (type === "individual") {

            teamFields.classList.add("hidden");
            individualFields.classList.remove("hidden");

            document
                .getElementById("participantName")
                .setAttribute("required", "");

            document
                .getElementById("teamName")
                .removeAttribute("required");

        } else {

            teamFields.classList.add("hidden");
            individualFields.classList.add("hidden");

            document
                .getElementById("participantName")
                .removeAttribute("required");

            document
                .getElementById("teamName")
                .removeAttribute("required");

            document
                .getElementById("brandName")
                .setAttribute("required", "");

            document
                .getElementById("productName")
                .setAttribute("required", "");

            document
                .getElementById("bazaarWhatsapp")
                .setAttribute("required", "");

            document
                .getElementById("bazaarCity")
                .setAttribute("required", "");

            document
                .getElementById("coachName")
                .removeAttribute("required");

            document
                .getElementById("whatsapp")
                .removeAttribute("required");

            document
                .getElementById("institution")
                .removeAttribute("required");

            document
                .getElementById("city")
                .removeAttribute("required");

        }

        if (type !== "bazaar") {
            document.getElementById("coachName").setAttribute("required", "");
            document.getElementById("whatsapp").setAttribute("required", "");
            document.getElementById("institution").setAttribute("required", "");
            document.getElementById("city").setAttribute("required", "");
            document.getElementById("brandName").removeAttribute("required");
            document.getElementById("productName").removeAttribute("required");
            document.getElementById("bazaarWhatsapp").removeAttribute("required");
            document.getElementById("bazaarCity").removeAttribute("required");
        }

    });

});


// ============================================
// STEP 1
// ============================================

document
    .getElementById("nextStep1")
    .addEventListener("click", function () {

        const selected =
            document.querySelector(
                'input[name="competition"]:checked'
            );

        if (!selected) {

            alert("Silakan pilih cabang lomba terlebih dahulu.");

            return;
        }


        const type = selected.dataset.type;


        if (type === "individual") {

            const name =
                document.getElementById("participantName").value.trim();

            if (!name) {

                alert("Nama peserta wajib diisi.");

                document
                    .getElementById("participantName")
                    .focus();

                return;
            }

        } else if (type === "team") {

            const team =
                document.getElementById("teamName").value.trim();

            if (!team) {

                alert(
                    "Nama tim wajib diisi."
                );

                return;
            }

        } else {

            const brandName =
                document.getElementById("brandName").value.trim();

            const productName =
                document.getElementById("productName").value.trim();

            const bazaarWhatsapp =
                document.getElementById("bazaarWhatsapp").value.trim();

            const bazaarCity =
                document.getElementById("bazaarCity").value.trim();

            if (!brandName || !productName || !bazaarCity || !bazaarWhatsapp || !isValidWhatsapp(bazaarWhatsapp)) {

                alert("Nama brand, produk, dan kabupaten/kota usaha wajib diisi, serta nomor WhatsApp harus valid.");

                return;
            }
        }


        const institution =
            document.getElementById("institution").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const coach =
            document.getElementById("coachName").value.trim();

        const whatsapp =
            document.getElementById("whatsapp").value.trim();


        if (type !== "bazaar" && (
            !institution || !city || !coach || !whatsapp || !isValidWhatsapp(whatsapp)
        )) {

            alert(
                "Data instansi dan kontak pembina wajib dilengkapi."
            );

            return;
        }


        document.getElementById("selectedCompetition").textContent =
            selected.value;


        showStep(2);

    });


// ============================================
// STEP 2
// ============================================

document
    .getElementById("nextStep2")
    .addEventListener("click", function () {

        showStep(3);

    });


// ============================================
// PAYMENT
// ============================================

const transferProof =
    document.getElementById("transferProof");

const filePreview =
    document.getElementById("filePreview");


transferProof.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        filePreview.classList.add("hidden");
        return;
    }


    const maxSize = 5 * 1024 * 1024;

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Format file tidak diperbolehkan. Gunakan JPG, JPEG, PNG atau PDF."
        );

        this.value = "";

        filePreview.classList.add("hidden");

        return;
    }


    if (file.size > maxSize) {

        alert(
            "Ukuran file terlalu besar. Maksimal 5 MB."
        );

        this.value = "";

        filePreview.classList.add("hidden");

        return;
    }


    filePreview.innerHTML = `
        <strong>✓ File berhasil dipilih</strong>
        <br>
        ${file.name}
        <br>
        <small>
            ${(file.size / 1024 / 1024).toFixed(2)} MB
        </small>
    `;

    filePreview.classList.remove("hidden");

});


// ============================================
// COPY REKENING
// ============================================

document
    .getElementById("copyAccount")
    .addEventListener("click", function () {

        const account =
            document.getElementById("accountNumber").textContent.trim();

        navigator.clipboard.writeText(account);

        this.textContent = "✓ Nomor rekening disalin";

        setTimeout(() => {

            this.textContent =
                "📋 Salin Nomor Rekening";

        }, 2000);

    });


document
    .getElementById("copyDana")
    .addEventListener("click", function () {

        const danaNumber =
            document.getElementById("danaNumber").textContent.trim();

        navigator.clipboard.writeText(danaNumber);

        this.textContent = "✓ Nomor DANA disalin";

        setTimeout(() => {

            this.textContent =
                "📋 Salin Nomor DANA";

        }, 2000);

    });


// ============================================
// STEP 3
// ============================================

document
    .getElementById("nextStep3")
    .addEventListener("click", function () {

        if (!transferProof.files.length) {

            alert(
                "Bukti transfer wajib diupload sebelum melanjutkan."
            );

            return;
        }


        showSummary();

        showStep(4);

    });


// ============================================
// SUMMARY
// ============================================

function showSummary() {

    const selected =
        document.querySelector(
            'input[name="competition"]:checked'
        );

    const type =
        selected.dataset.type;


    let participant = "";
    let participantLabel = "";


    if (type === "individual") {

        participant =
            document
                .getElementById("participantName")
                .value;

        participantLabel = "Nama Peserta";

    } else if (type === "team") {

        participant =
            document
                .getElementById("teamName")
                .value;

        participantLabel = "Nama Tim";

    } else {

        participant =
            document
                .getElementById("brandName")
                .value;

        participantLabel = "Nama Brand";

    }


    const institution =
        document.getElementById("institution").value;

    const city =
        document.getElementById("city").value;

    const coach =
        document.getElementById("coachName").value;

    const whatsapp =
        document.getElementById("whatsapp").value;

    const file =
        transferProof.files[0];


    document.getElementById("summary").innerHTML = `

        <div class="summary-item">

            <span>Cabang Lomba</span>

            <strong>
                ${selected.value}
            </strong>

        </div>


        <div class="summary-item">

            <span>
                ${participantLabel}
            </span>

            <strong>
                ${participant}
            </strong>

        </div>


        ${type === "bazaar" ? `
            <div class="summary-item">
                <span>Produk</span>
                <strong>${document.getElementById("productName").value}</strong>
            </div>

            <div class="summary-item">
                <span>Kabupaten / Kota Usaha</span>
                <strong>${document.getElementById("bazaarCity").value}</strong>
            </div>

            <div class="summary-item">
                <span>Sertifikat Halal</span>
                <strong>${document.getElementById("halalCertificate").value || "Tidak dicantumkan"}</strong>
            </div>

            <div class="summary-item">
                <span>WhatsApp Bazar</span>
                <strong>${document.getElementById("bazaarWhatsapp").value}</strong>
            </div>
        ` : ""}


        ${type !== "bazaar" ? `
            <div class="summary-item">
                <span>Instansi</span>
                <strong>${institution}</strong>
            </div>

            <div class="summary-item">
                <span>Kabupaten / Kota</span>
                <strong>${city}</strong>
            </div>
        ` : ""}


        ${type !== "bazaar" ? `
            <div class="summary-item">
                <span>Pembina / Pendamping</span>
                <strong>${coach}</strong>
            </div>

            <div class="summary-item">
                <span>WhatsApp</span>
                <strong>${whatsapp}</strong>
            </div>
        ` : ""}


        <div class="summary-item">

            <span>Bukti Transfer</span>

            <strong>
                ✓ ${file.name}
            </strong>

        </div>

    `;

}


// ============================================
// BACK BUTTON
// ============================================

document.querySelectorAll("[data-back]").forEach(button => {

    button.addEventListener("click", function () {

        const step =
            parseInt(this.dataset.back);

        showStep(step);

    });

});


// ============================================
// SUBMIT
// ============================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const agreement =
        document.getElementById("agreement").checked;


    if (!agreement) {

        alert(
            "Silakan centang pernyataan bahwa data sudah benar."
        );

        return;
    }


    const selected =
        document.querySelector('input[name="competition"]:checked');

    const file = transferProof.files[0];

    if (!selected) {
        alert("Silakan pilih cabang lomba terlebih dahulu.");
        return;
    }

    if (!file) {
        alert("Bukti transfer wajib diupload sebelum mengirim pendaftaran.");
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ];

    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
        alert("Bukti transfer harus JPG, JPEG, PNG atau PDF dengan ukuran maksimal 5 MB.");
        return;
    }

    const type = selected.dataset.type;

    if (!(file instanceof File)) {
        alert("File bukti transfer tidak valid. Silakan pilih file lagi.");
        return;
    }

    const number = generateRegistrationNumber();
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const safeOriginalName = originalName || "bukti-transfer";
    const filePath = `${number}-${Date.now()}-${safeOriginalName}`;

    const participantName = type === "individual"
        ? document.getElementById("participantName").value.trim()
        : "";
    const teamName = type === "team"
        ? document.getElementById("teamName").value.trim()
        : "";
    const bazaarWhatsapp = type === "bazaar"
        ? document.getElementById("bazaarWhatsapp").value.trim()
        : "";

    if (
        (type === "individual" && !participantName) ||
        (type === "team" && !teamName) ||
            (type === "bazaar" && (
            !document.getElementById("brandName").value.trim() ||
            !document.getElementById("productName").value.trim() ||
            !document.getElementById("bazaarCity").value.trim() ||
            !bazaarWhatsapp || !isValidWhatsapp(bazaarWhatsapp)
        ))
    ) {
        alert("Data pendaftar belum lengkap.");
        return;
    }

    try {
        const uploadResult = await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadResult.error) {
            alert(`Upload bukti transfer gagal: ${uploadResult.error.message}`);
            return;
        }

        const registrationNotes = [
            document.getElementById("notes").value.trim()
        ].filter(Boolean).join("\n");

        const registrationData = {
            nomor_pendaftaran: number,
            nama_peserta: type === "bazaar"
                ? document.getElementById("brandName").value.trim()
                : participantName || teamName,
            jenis_lomba: selected.value,
            kategori: type,
            asal_instansi: type === "bazaar"
                ? document.getElementById("brandName").value.trim()
                : document.getElementById("institution").value.trim(),
            kabupaten_kota: type === "bazaar"
                ? document.getElementById("bazaarCity").value.trim()
                : document.getElementById("city").value.trim(),
            no_whatsapp: type === "bazaar"
                ? bazaarWhatsapp
                : document.getElementById("whatsapp").value.trim(),
            nama_pembina: type === "bazaar"
                ? null
                : document.getElementById("coachName").value.trim(),
            bukti_transfer: filePath,
            status_pembayaran: "menunggu",
            nama_tim: teamName || null,
            nama_brand: type === "bazaar"
                ? document.getElementById("brandName").value.trim()
                : null,
            produk: type === "bazaar"
                ? document.getElementById("productName").value.trim()
                : null,
            nomor_sertifikat_halal: type === "bazaar"
                ? document.getElementById("halalCertificate").value.trim() || null
                : null,
            catatan: registrationNotes || null
        };

        console.log("=== DATA PESERTA YANG AKAN DIKIRIM ===");
        console.log(JSON.stringify(registrationData, null, 2));
        console.log("=== END DATA PESERTA ===");

        let insertResult = await supabaseClient
            .from("peserta")
            .insert(registrationData);

        if (insertResult.error) {
            console.error("=== SUPABASE INSERT ERROR ===");
            console.error("message:", insertResult.error.message);
            console.error("code:", insertResult.error.code);
            console.error("details:", insertResult.error.details);
            console.error("hint:", insertResult.error.hint);
            console.error("payload:", registrationData);
            console.error("=== END SUPABASE ERROR ===");

            await supabaseClient.storage.from(STORAGE_BUCKET).remove([filePath]);
            alert(`Data pendaftaran gagal disimpan: ${insertResult.error.message}`);
            return;
        }
    } catch (error) {
        console.error("SUPABASE SUBMIT CATCH ERROR:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            payload: {
                number,
                filePath,
                fileName: file.name
            }
        });

        await supabaseClient.storage.from(STORAGE_BUCKET).remove([filePath]);
        alert(`Pendaftaran gagal diproses: ${error.message}`);
        return;
    }

    document.getElementById("registrationNumber").textContent = number;
    form.classList.add("hidden");
    document.querySelector(".progress-wrapper").classList.add("hidden");
    document.getElementById("successPage").classList.remove("hidden");

    renderWhatsappGroupButton();

    localStorage.setItem("albifest_registration_number", number);

});


// ============================================
// REGISTRATION NUMBER
// ============================================

function generateRegistrationNumber() {

    const random =
        Math.floor(
            10000 + Math.random() * 90000
        );

    return `ALB-2027-${random}`;

}