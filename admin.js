const SUPABASE_URL = "https://pnpbmqkygoywtgyebojg.supabase.co";
const SUPABASE_KEY = "sb_publishable_OpKvD_Opkxdfrn_pihIpIQ_lkEcSXmL";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const isLoginPage = Boolean(document.getElementById("loginForm"));
const formatValue = value => value === null || value === undefined || value === "" ? "-" : value;

async function requireSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error || !data.session) {
        window.location.href = "admin-login.html";
        return null;
    }
    return data.session;
}

if (isLoginPage) {
    document.querySelectorAll("[data-toggle-password]").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const input = document.getElementById(toggle.dataset.togglePassword);
            const isVisible = input.type === "password";
            input.type = isVisible ? "text" : "password";
            toggle.textContent = isVisible ? "Sembunyikan" : "Lihat";
            toggle.setAttribute("aria-pressed", String(isVisible));
        });
    });

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const recoveryForm = document.getElementById("recoveryForm");
    const isRecovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";

    if (isRecovery && recoveryForm) {
        loginForm.hidden = true;
        recoveryForm.hidden = false;
        document.querySelector(".login-card h1").textContent = "Buat Password Baru";
        document.querySelector(".login-card .muted").textContent = "Masukkan password baru untuk akun admin Anda.";
    }

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        loginMessage.textContent = "Memproses login...";
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            console.error(error);
            loginMessage.textContent = "Login gagal. Periksa email dan password Anda.";
            return;
        }
        window.location.href = "admin.html";
    });

    recoveryForm?.addEventListener("submit", async event => {
        event.preventDefault();
        const recoveryMessage = document.getElementById("recoveryMessage");
        const password = document.getElementById("newPassword").value;
        const confirmation = document.getElementById("confirmPassword").value;

        if (password !== confirmation) {
            recoveryMessage.textContent = "Kedua password tidak sama.";
            return;
        }

        recoveryMessage.textContent = "Menyimpan password baru...";
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) {
            console.error(error);
            recoveryMessage.textContent = "Password gagal diperbarui. Minta tautan recovery baru.";
            return;
        }

        window.location.href = "admin.html";
    });
} else {
    const state = { all: [], filtered: [], page: 1, perPage: 10 };
    const message = text => { document.getElementById("pageMessage").textContent = text; };
    const value = (participant, ...keys) => {
        for (const key of keys) if (participant[key] !== undefined && participant[key] !== null && participant[key] !== "") return participant[key];
        return "-";
    };

    function renderStats() {
        document.getElementById("totalCount").textContent = state.all.length;
        document.getElementById("pendingCount").textContent = state.all.filter(item => item.status_pembayaran === "menunggu").length;
        document.getElementById("verifiedCount").textContent = state.all.filter(item => item.status_pembayaran === "terverifikasi").length;
        document.getElementById("rejectedCount").textContent = state.all.filter(item => item.status_pembayaran === "ditolak").length;
    }

    function applyFilters() {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const competition = document.getElementById("competitionFilter").value;
        const status = document.getElementById("statusFilter").value;
        state.filtered = state.all.filter(item => {
            const haystack = [item.nomor_pendaftaran, item.nama_peserta, item.nama_tim, item.nama_brand, item.asal_instansi, item.no_whatsapp].join(" ").toLowerCase();
            return (!query || haystack.includes(query)) && (!competition || item.jenis_lomba === competition) && (!status || item.status_pembayaran === status);
        });
        state.page = 1;
        renderTable();
    }

    function renderCompetitionFilter() {
        const select = document.getElementById("competitionFilter");
        const current = select.value;
        select.innerHTML = '<option value="">Semua Lomba</option>';
        [...new Set(state.all.map(item => item.jenis_lomba).filter(Boolean))].sort().forEach(item => {
            const option = document.createElement("option"); option.value = item; option.textContent = item; select.appendChild(option);
        });
        select.value = current;
    }

    function makeCell(row, text) { const cell = document.createElement("td"); cell.textContent = formatValue(text); row.appendChild(cell); return cell; }

    async function viewProof(path) {
        const { data, error } = await supabaseClient.storage.from("bukti-transfer").createSignedUrl(path, 300);
        if (error || !data?.signedUrl) { console.error(error); message("Gagal membuka bukti transfer."); return; }
        window.open(data.signedUrl, "_blank", "noopener");
    }

    async function updateStatus(id, status) {
        const { error } = await supabaseClient.from("peserta").update({ status_pembayaran: status }).eq("id", id);
        if (error) { console.error(error); message("Gagal mengubah status pembayaran."); return; }
        message("Status pembayaran berhasil diperbarui."); await loadParticipants();
    }

    function renderTable() {
        const tbody = document.getElementById("participantTableBody"); tbody.innerHTML = "";
        const start = (state.page - 1) * state.perPage;
        const rows = state.filtered.slice(start, start + state.perPage);
        if (!rows.length) { const row = document.createElement("tr"); const cell = makeCell(row, "Tidak ada data peserta."); cell.colSpan = 12; cell.className = "empty"; tbody.appendChild(row); }
        rows.forEach((participant, index) => {
            const row = document.createElement("tr"); makeCell(row, start + index + 1); makeCell(row, participant.nomor_pendaftaran);
            makeCell(row, value(participant, "nama_peserta", "nama_tim", "nama_brand")); makeCell(row, participant.jenis_lomba); makeCell(row, participant.kategori);
            makeCell(row, participant.asal_instansi); makeCell(row, participant.kabupaten_kota); makeCell(row, participant.no_whatsapp); makeCell(row, participant.nama_pembina);
            const proof = makeCell(row, "");
            if (participant.bukti_transfer) { proof.textContent = ""; const button = document.createElement("button"); button.className = "button secondary"; button.textContent = "Lihat Bukti"; button.addEventListener("click", () => viewProof(participant.bukti_transfer)); proof.appendChild(button); } else proof.textContent = "-";
            const status = makeCell(row, ""); const badge = document.createElement("span"); badge.className = `status ${participant.status_pembayaran || "menunggu"}`; badge.textContent = formatValue(participant.status_pembayaran); status.appendChild(badge);
            const actions = makeCell(row, ""); actions.className = "actions";
            if (participant.id !== undefined && participant.status_pembayaran !== "terverifikasi") { const button = document.createElement("button"); button.className = "button primary"; button.textContent = "✓ Verifikasi"; button.addEventListener("click", () => updateStatus(participant.id, "terverifikasi")); actions.appendChild(button); }
            if (participant.id !== undefined && participant.status_pembayaran !== "ditolak") { const button = document.createElement("button"); button.className = "button secondary"; button.textContent = "✕ Tolak"; button.addEventListener("click", () => updateStatus(participant.id, "ditolak")); actions.appendChild(button); }
            tbody.appendChild(row);
        });
        const pages = Math.max(1, Math.ceil(state.filtered.length / state.perPage)); document.getElementById("pageIndicator").textContent = `Halaman ${state.page} dari ${pages}`;
        document.getElementById("previousPage").disabled = state.page <= 1; document.getElementById("nextPage").disabled = state.page >= pages;
    }

    async function loadParticipants() {
        message("Memuat data peserta...");
        const { data, error } = await supabaseClient.from("peserta").select("*");
        if (error) { console.error(error); message("Gagal mengambil data peserta."); state.all = []; state.filtered = []; renderStats(); renderTable(); return; }
        state.all = data || []; renderStats(); renderCompetitionFilter(); applyFilters(); message("");
    }

    function exportExcel() {
        if (!window.XLSX) { message("Library export Excel belum tersedia."); return; }
        const rows = state.filtered.map((item, index) => ({ No: index + 1, "Nomor Pendaftaran": item.nomor_pendaftaran, "Nama Peserta / Nama Tim": value(item, "nama_peserta", "nama_tim", "nama_brand"), "Jenis Lomba": item.jenis_lomba, Kategori: item.kategori, "Asal Instansi": item.asal_instansi, "Kabupaten/Kota": item.kabupaten_kota, WhatsApp: item.no_whatsapp, "Nama Pembina": item.nama_pembina, "Status Pembayaran": item.status_pembayaran, "Bukti Transfer": item.bukti_transfer }));
        const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), "Peserta"); XLSX.writeFile(book, "Albifest_2027_Data_Peserta.xlsx");
    }

    (async () => {
        if (!await requireSession()) return;
        document.getElementById("logoutButton").addEventListener("click", async () => { await supabaseClient.auth.signOut(); window.location.href = "admin-login.html"; });
        document.getElementById("searchInput").addEventListener("input", applyFilters); document.getElementById("competitionFilter").addEventListener("change", applyFilters); document.getElementById("statusFilter").addEventListener("change", applyFilters);
        document.getElementById("refreshButton").addEventListener("click", loadParticipants); document.getElementById("exportButton").addEventListener("click", exportExcel);
        document.getElementById("previousPage").addEventListener("click", () => { if (state.page > 1) { state.page--; renderTable(); } }); document.getElementById("nextPage").addEventListener("click", () => { if (state.page < Math.ceil(state.filtered.length / state.perPage)) { state.page++; renderTable(); } });
        await loadParticipants();
    })();
}