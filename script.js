/* =================================================== */
/* CONFIGURATION & DATA INITIALIZATION                 */
/* =================================================== */
const CONFIG = {
    AUTH_CODE: "admin123",
    CATEGORIES: [
        "Prestasi Siswa", "Prestasi Guru", "Akademik", 
        "Pramuka", "OSIS", "Ekstrakurikuler", 
        "Event Sekolah", "Literasi", "Teknologi", "Pengumuman"
    ]
};

const dummyStaticContent = {
    kepsekName: "H. Andi Mahfud, M.Pd.",
    kepsekImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    kepsekWelcome: '"Selamat datang di Portal Berita Resmi SMPN 1 Lilirilau. Melalui platform digital ini, kami berkomitmen menyajikan transparansi informasi, publikasi prestasi siswa-siswi, serta kedinamisan proses belajar mengajar."',
    schoolTagline: "Cerdas, Berkarakter, Unggul, dan Berbudaya Digital",
    schoolAbout: "Membentuk insan cerdas, religius, adaptif teknologi, dan berwawasan lingkungan global lokal di Kabupaten Soppeng."
};

const dummyNews = [
    {
        id: "news_1",
        title: "Siswa SMPN 1 Lilirilau Sabet Medali Emas Olimpiade Sains Kabupaten Soppeng",
        category: "Prestasi Siswa",
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
        content: "Prestasi membanggakan kembali diukir oleh perwakilan siswa kelas VIII SMP Negeri 1 Lilirilau dalam ajang Olimpiade Sains tingkat Kabupaten Soppeng tahun 2026. Dengan mengandalkan analisis matematis yang kuat, tim sekolah berhasil meraih juara pertama.",
        author: "Mulyadi, S.Pd",
        date: "2026-05-12",
        views: 342
    },
    {
        id: "news_2",
        title: "Gerakan Literasi Digital: Implementasi E-Learning Modern di Kelas",
        category: "Akademik",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        content: "Dalam menyambut transformasi pendidikan abad 21, SMP Negeri 1 Lilirilau mengintegrasikan platform pembelajaran digital interaktif. Melalui pemanfaatan gawai secara edukatif.",
        author: "Admin Sekolah",
        date: "2026-05-25",
        views: 189
    }
];

const dummyAnnouncements = [
    { id: "ann_1", title: "Penerimaan Peserta Didik Baru (PPDB) Online 2026/2027", content: "Pendaftaran PPDB SMP Negeri 1 Lilirilau resmi dibuka mulai Juni 2026.", date: "2026-05-28", status: "Aktif" }
];

const dummyAgenda = [
    { id: "age_1", title: "Rapat Pleno Komite Sekolah", date: "2026-06-05" }
];

function seedDatabase() {
    if (!localStorage.getItem("db_static")) localStorage.setItem("db_static", JSON.stringify(dummyStaticContent));
    if (!localStorage.getItem("db_news")) localStorage.setItem("db_news", JSON.stringify(dummyNews));
    if (!localStorage.getItem("db_announcements")) localStorage.setItem("db_announcements", JSON.stringify(dummyAnnouncements));
    if (!localStorage.getItem("db_agenda")) localStorage.setItem("db_agenda", JSON.stringify(dummyAgenda));
}
seedDatabase();

let currentCategoryFilter = "all";
let currentAdminRole = "";
let analyticsChartInstance = null;

/* =================================================== */
/* DATABASE STORAGE GETTERS & SETTERS                 */
/* =================================================== */
function getStatic() { return JSON.parse(localStorage.getItem("db_static")) || dummyStaticContent; }
function setStatic(data) { localStorage.setItem("db_static", JSON.stringify(data)); applyStaticContent(); }
function getNews() { return JSON.parse(localStorage.getItem("db_news")) || []; }
function setNews(data) { localStorage.setItem("db_news", JSON.stringify(data)); renderAllPublicFeeds(); }
function getAnn() { return JSON.parse(localStorage.getItem("db_announcements")) || []; }
function setAnn(data) { localStorage.setItem("db_announcements", JSON.stringify(data)); renderAllPublicFeeds(); }
function getAge() { return JSON.parse(localStorage.getItem("db_agenda")) || []; }
function setAge(data) { localStorage.setItem("db_agenda", JSON.stringify(data)); renderAllPublicFeeds(); }

/* =================================================== */
/* CORE VIEW & ROUTING ENGINE                          */
/* =================================================== */
function switchView(target) {
    document.getElementById("public-view").classList.add("hidden");
    document.getElementById("admin-login-view").classList.add("hidden");
    document.getElementById("admin-dashboard-view").classList.add("hidden");

    if (target === "public") {
        document.getElementById("public-view").classList.remove("hidden");
        applyStaticContent();
        renderAllPublicFeeds();
    } else if (target === "admin-login") {
        document.getElementById("admin-login-view").classList.remove("hidden");
    } else if (target === "admin-dashboard") {
        document.getElementById("admin-dashboard-view").classList.remove("hidden");
        initDashboardWorkspace();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const menuToggleBtn = document.getElementById("menu-toggle");
if(menuToggleBtn) {
    menuToggleBtn.addEventListener("click", () => {
        document.getElementById("nav-links").classList.toggle("active");
    });
}

function showSection(id) {
    document.getElementById("homepage-core-view").classList.remove("hidden");
    document.getElementById("article-detail-view").classList.add("hidden");
    const element = document.getElementById(id);
    if(element) element.scrollIntoView({ behavior: "smooth" });
    document.getElementById("nav-links").classList.remove("active");
}

/* =================================================== */
/* STATIC CONTENT ENGINE (APPLY & SAVE)                */
/* =================================================== */
function applyStaticContent() {
    const data = getStatic();
    
    // Terapkan ke elemen halaman publik
    const welcomeCard = document.querySelector(".welcome-card");
    if(welcomeCard) {
        welcomeCard.innerHTML = `
            <div class="welcome-header">
                <img src="${data.kepsekImg}" alt="Kepala Sekolah">
                <div>
                    <h3>Sambutan Kepala Sekolah</h3>
                    <p class="sub">SMPN 1 Lilirilau</p>
                </div>
            </div>
            <p class="welcome-text">${data.kepsekWelcome}</p>
            <div class="welcome-footer"><strong>${data.kepsekName}</strong></div>
        `;
    }

    const brandTextPara = document.querySelector(".brand-text p");
    if(brandTextPara) brandTextPara.innerText = data.schoolTagline;

    const footerInfoPara = document.querySelector(".footer-info p");
    if(footerInfoPara) footerInfoPara.innerText = data.schoolAbout;
}

function fillStaticForm() {
    const data = getStatic();
    document.getElementById("static-kepsek-name").value = data.kepsekName;
    document.getElementById("static-kepsek-img").value = data.kepsekImg;
    document.getElementById("static-kepsek-welcome").value = data.kepsekWelcome;
    document.getElementById("static-school-tagline").value = data.schoolTagline;
    document.getElementById("static-school-about").value = data.schoolAbout;
}

function saveStaticContent(e) {
    e.preventDefault();
    const updatedData = {
        kepsekName: document.getElementById("static-kepsek-name").value,
        kepsekImg: document.getElementById("static-kepsek-img").value,
        kepsekWelcome: document.getElementById("static-kepsek-welcome").value,
        schoolTagline: document.getElementById("static-school-tagline").value,
        schoolAbout: document.getElementById("static-school-about").value
    };
    setStatic(updatedData);
    alert("Konten statis profil sekolah berhasil diperbarui!");
}

/* =================================================== */
/* FEEDS COMPONENT RENDERING                           */
/* =================================================== */
document.addEventListener("DOMContentLoaded", () => {
    applyStaticContent();
    renderAllPublicFeeds();
    initHeroSliderLoop();
});

function renderAllPublicFeeds() {
    const newsData = getNews();
    const annData = getAnn();
    const ageData = getAge();

    const pillsContainer = document.getElementById("category-pills-container");
    if(pillsContainer) {
        let pillsHtml = `<span class="pill ${currentCategoryFilter === 'all' ? 'active' : ''}" onclick="filterCategory('all')">Semua Berita</span>`;
        CONFIG.CATEGORIES.slice(0, 5).forEach(cat => {
            pillsHtml += `<span class="pill ${currentCategoryFilter === cat ? 'active' : ''}" onclick="filterCategory('${cat}')">${cat}</span>`;
        });
        pillsContainer.innerHTML = pillsHtml;
    }

    const cardsContainer = document.getElementById("news-cards-container");
    if(cardsContainer) {
        let filtered = newsData;
        if(currentCategoryFilter !== "all") {
            filtered = newsData.filter(n => n.category.toLowerCase() === currentCategoryFilter.toLowerCase());
        }

        if(filtered.length === 0) {
            cardsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px 0;">Belum ada berita.</p>`;
        } else {
            cardsContainer.innerHTML = filtered.map(item => `
                <div class="news-card">
                    <div class="nc-image-wrap">
                        <img src="${item.image}" alt="${item.title}">
                        <span class="nc-badge">${item.category}</span>
                    </div>
                    <div class="nc-body">
                        <div>
                            <div class="nc-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
                                <span><i class="fas fa-eye"></i> ${item.views}</span>
                            </div>
                            <h3 onclick="openArticleDetail('${item.id}')">${item.title}</h3>
                            <p class="nc-excerpt">${item.content}</p>
                        </div>
                        <span class="btn-read-more" onclick="openArticleDetail('${item.id}')">Baca Selengkapnya <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `).join('');
        }
    }

    const sideAnn = document.getElementById("sidebar-pengumuman");
    if(sideAnn) {
        sideAnn.innerHTML = annData.filter(a => a.status === "Aktif").slice(0, 3).map(a => `
            <div class="quick-ann-card">
                <h4>${a.title}</h4>
                <p>${formatDate(a.date)}</p>
            </div>
        `).join('') || '<p>Tidak ada pengumuman.</p>';
    }

    const sideAge = document.getElementById("sidebar-agenda");
    if(sideAge) {
        sideAge.innerHTML = ageData.slice(0, 3).map(a => {
            const d = new Date(a.date);
            return `
                <div class="agenda-item">
                    <div class="agenda-date-box"><span>${d.getDate() || '01'}</span>${d.toLocaleString('id', { month: 'short' })}</div>
                    <div class="agenda-info"><h4>${a.title}</h4></div>
                </div>
            `;
        }).join('') || '<p>Agenda kosong.</p>';
    }

    const sidePop = document.getElementById("sidebar-populer");
    if(sidePop) {
        sidePop.innerHTML = [...newsData].sort((a,b) => b.views - a.views).slice(0,3).map(p => `
            <div class="pop-item" onclick="openArticleDetail('${p.id}')">
                <img src="${p.image}" alt="Popular">
                <div><h4>${p.title}</h4></div>
            </div>
        `).join('') || '<p>Belum tersedia.</p>';
    }

    const fullAnn = document.getElementById("full-announcement-container");
    if(fullAnn) {
        fullAnn.innerHTML = annData.map(a => `
            <div class="board-card">
                <h3>${a.title}</h3>
                <p style="font-size:11px; margin-bottom:10px; color:var(--text-muted);">${formatDate(a.date)}</p>
                <p>${a.content}</p>
            </div>
        `).join('');
    }

    const galContainer = document.getElementById("gallery-container");
    if(galContainer) {
        galContainer.innerHTML = newsData.slice(0,6).map(item => `
            <div class="gallery-item" onclick="openLightbox('${item.image}')">
                <img src="${item.image}">
                <div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>
            </div>
        `).join('');
    }
}

function filterCategory(cat) { 
    currentCategoryFilter = cat; 
    renderAllPublicFeeds(); 
}

function filterByMenu(cat, element) {
    document.querySelectorAll(".nav-item-link").forEach(el => el.classList.remove("active"));
    if(element) element.classList.add("active");
    
    document.getElementById("homepage-core-view").classList.remove("hidden");
    document.getElementById("article-detail-view").classList.add("hidden");
    
    filterCategory(cat);
    document.getElementById("nav-links").classList.remove("active");
}

/* =================================================== */
/* INTERACTIVE FUNCTIONS (SEARCH, DETAIL, LIGHTBOX)    */
/* =================================================== */
function handleLiveSearch() {
    const query = document.getElementById("global-search").value.toLowerCase();
    const cardsContainer = document.getElementById("news-cards-container");
    if(!query) { renderAllPublicFeeds(); return; }

    const filtered = getNews().filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
    cardsContainer.innerHTML = filtered.map(item => `
        <div class="news-card">
            <div class="nc-body">
                <h3 onclick="openArticleDetail('${item.id}')">${item.title}</h3>
                <p class="nc-excerpt">${item.content}</p>
            </div>
        </div>
    `).join('') || '<p>Tidak ditemukan.</p>';
}

function openArticleDetail(id) {
    const newsData = getNews();
    const idx = newsData.findIndex(n => n.id === id);
    if(idx === -1) return;

    newsData[idx].views += 1;
    localStorage.setItem("db_news", JSON.stringify(newsData));

    document.getElementById("homepage-core-view").classList.add("hidden");
    document.getElementById("article-detail-view").classList.remove("hidden");

    const item = newsData[idx];
    document.getElementById("detail-breadcrumb-cat").innerText = item.category;
    document.getElementById("detail-breadcrumb-title").innerText = item.title.substring(0,25) + "...";
    document.getElementById("detail-category").innerText = item.category;
    document.getElementById("detail-title").innerText = item.title;
    document.getElementById("detail-author").innerText = item.author;
    document.getElementById("detail-date").innerText = formatDate(item.date);
    document.getElementById("detail-views").innerText = item.views;
    document.getElementById("detail-image").src = item.image;
    document.getElementById("detail-content").innerHTML = `<p>${item.content}</p>`;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeArticleDetail() {
    document.getElementById("homepage-core-view").classList.remove("hidden");
    document.getElementById("article-detail-view").classList.add("hidden");
    renderAllPublicFeeds();
}

/* =================================================== */
/* ADMIN CMS CONTROL DASHBOARD                         */
/* =================================================== */
function handleLogin(e) {
    e.preventDefault();
    if(document.getElementById("login-password").value === CONFIG.AUTH_CODE) {
        currentAdminRole = document.getElementById("login-role").value;
        switchView("admin-dashboard");
    } else {
        alert("Sandi salah!");
    }
}

function handleLogout() { currentAdminRole = ""; switchView("public"); }

function initDashboardWorkspace() {
    document.getElementById("user-display-name").innerText = currentAdminRole;
    switchTab("dashboard");
}

function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".sidebar-menu li").forEach(el => el.classList.remove("active"));
    
    const targetTab = document.getElementById(`tab-${tabId}`);
    const targetMenu = document.getElementById(`menu-tab-${tabId}`);
    
    if(targetTab) targetTab.classList.remove("hidden");
    if(targetMenu) targetMenu.classList.add("active");

    document.getElementById("workspace-title").innerText = "CMS Kontrol Panel - " + tabId.toUpperCase();

    if(tabId === "dashboard") { renderCharts(); renderDashboardStats(); }
    if(tabId === "manage-static") fillStaticForm();
    if(tabId === "manage-news") renderNewsTable();
    if(tabId === "manage-announcements") renderAnnTable();
    if(tabId === "manage-agenda") renderAgendaTable();
}

function renderDashboardStats() {
    document.getElementById("dash-stat-news").innerText = getNews().length;
    document.getElementById("dash-stat-ann").innerText = getAnn().filter(a => a.status === "Aktif").length;
    document.getElementById("dash-stat-age").innerText = getAge().length;
}

function renderCharts() {
    const ctx = document.getElementById('analyticsChart');
    if(!ctx) return;
    if(analyticsChartInstance) analyticsChartInstance.destroy();

    const counts = CONFIG.CATEGORIES.map(c => getNews().filter(n => n.category === c).length);

    analyticsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: CONFIG.CATEGORIES.slice(0,5),
            datasets: [{ label: 'Jumlah Artikel', data: counts.slice(0,5), backgroundColor: '#D4AF37' }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

/* =================================================== */
/* CRUD FORM & UTILITIES                               */
/* =================================================== */
function renderNewsTable() {
    document.getElementById("table-news-body").innerHTML = getNews().map(n => `
        <tr>
            <td><img src="${n.image}" class="t-img"></td>
            <td><strong>${n.title}</strong></td>
            <td>${n.category}</td>
            <td>${n.author}</td>
            <td>${n.date}</td>
            <td>
                <button class="btn-table-action edit" onclick="openNewsModal('edit', '${n.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-table-action delete" onclick="deleteNews('${n.id}')"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `).join('');
}

function openNewsModal(mode, id = null) {
    const select = document.getElementById("news-cat-field");
    select.innerHTML = CONFIG.CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById("news-form").reset();
    document.getElementById("news-id-field").value = "";

    if(mode === 'edit' && id) {
        const item = getNews().find(n => n.id === id);
        if(item) {
            document.getElementById("news-id-field").value = item.id;
            document.getElementById("news-title-field").value = item.title;
            document.getElementById("news-cat-field").value = item.category;
            document.getElementById("news-img-field").value = item.image;
            document.getElementById("news-content-field").value = item.content;
        }
    }
    openModal('news-modal');
}

function saveNewsData(e) {
    e.preventDefault();
    let list = getNews();
    const id = document.getElementById("news-id-field").value;
    const data = {
        title: document.getElementById("news-title-field").value,
        category: document.getElementById("news-cat-field").value,
        image: document.getElementById("news-img-field").value,
        content: document.getElementById("news-content-field").value,
    };

    if(id) {
        const idx = list.findIndex(n => n.id === id);
        list[idx] = { ...list[idx], ...data };
    } else {
        list.unshift({ id: "news_"+Date.now(), ...data, author: currentAdminRole, date: new Date().toISOString().split('T')[0], views: 0 });
    }
    setNews(list); closeModal('news-modal'); renderNewsTable();
}

function deleteNews(id) { if(confirm("Hapus Berita?")) { setNews(getNews().filter(n => n.id !== id)); renderNewsTable(); } }

function renderAnnTable() {
    document.getElementById("table-ann-body").innerHTML = getAnn().map(a => `
        <tr><td>${a.title}</td><td>${a.date}</td><td>${a.status}</td><td><button class="btn-table-action delete" onclick="deleteAnn('${a.id}')"><i class="fas fa-trash"></i></button></td></tr>
    `).join('');
}
function openAnnModal() { document.getElementById("ann-form").reset(); openModal('ann-modal'); }
function saveAnnData(e) {
    e.preventDefault();
    let list = getAnn();
    list.unshift({
        id: "ann_"+Date.now(),
        title: document.getElementById("ann-title-field").value,
        status: document.getElementById("ann-status-field").value,
        content: document.getElementById("ann-content-field").value,
        date: new Date().toISOString().split('T')[0]
    });
    setAnn(list); closeModal('ann-modal'); renderAnnTable();
}
function deleteAnn(id) { if(confirm("Hapus?")) { setAnn(getAnn().filter(a => a.id !== id)); renderAnnTable(); } }

function renderAgendaTable() {
    document.getElementById("table-agenda-body").innerHTML = getAge().map(a => `
        <tr><td>${a.title}</td><td>${a.date}</td><td><button class="btn-table-action delete" onclick="deleteAgenda('${a.id}')"><i class="fas fa-trash"></i></button></td></tr>
    `).join('');
}
function openAgendaModal() { document.getElementById("agenda-form").reset(); openModal('agenda-modal'); }
function saveAgendaData(e) {
    e.preventDefault();
    let list = getAge();
    list.push({ id: "age_"+Date.now(), title: document.getElementById("agenda-title-field").value, date: document.getElementById("agenda-date-field").value });
    setAge(list); closeModal('agenda-modal'); renderAgendaTable();
}
function deleteAgenda(id) { if(confirm("Hapus?")) { setAge(getAge().filter(a => a.id !== id)); renderAgendaTable(); } }

function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }
function openLightbox(src) { document.getElementById("lightbox-img").src = src; document.getElementById("lightbox").classList.add("active"); }
function closeLightbox() { document.getElementById("lightbox").classList.remove("active"); }
function toggleDarkMode() { document.body.classList.toggle("dark-theme"); }
function formatDate(dStr) { return dStr ? new Date(dStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"; }

function initHeroSliderLoop() {
    const slider = document.getElementById("hero-slider");
    let current = 0;
    setInterval(() => {
        const list = getNews().slice(0,3);
        if(list.length < 2 || !slider) return;
        current = (current + 1) % list.length;
        slider.innerHTML = `
            <div class="slide active">
                <img src="${list[current].image}">
                <div class="slide-caption"><span class="badge red">${list[current].category}</span><h2>${list[current].title}</h2></div>
            </div>
        `;
    }, 5000);
}
