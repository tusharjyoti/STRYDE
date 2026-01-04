document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Mobile Navigation --- */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('is-active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    /* --- 2. Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.reveal, .fade-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));


    /* --- 3. Image Gallery Carousel --- */
    const galleryImg = document.getElementById('gallery-img');
    
    // UPDATED: Path to your images inside the STRYDE folder
    const images = [
        'STRYDE/img3.jpg',  // Big Group Photo
        'STRYDE/img4.jpg',  // Women Group Photo
        'STRYDE/img.jpg',   // Candid Two Women
        'STRYDE/img2.jpg'   // Candid Three Men
    ];
    let currentImgIndex = 0;

    function updateImage() {
        galleryImg.style.opacity = 0;
        setTimeout(() => {
            galleryImg.src = images[currentImgIndex];
            galleryImg.style.opacity = 1;
        }, 300);
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        currentImgIndex = (currentImgIndex + 1) % images.length;
        updateImage();
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
        updateImage();
    });

    setInterval(() => {
        currentImgIndex = (currentImgIndex + 1) % images.length;
        updateImage();
    }, 5000);


    /* --- 4. Dynamic Leaderboard --- */
    const menData = [
        { name: 'LEO', time: '22:30:00' },
        { name: 'DALSRANG', time: '23:10:00' },
        { name: 'AMIT BODO', time: '23:21:00' },
        { name: 'JAYDEN', time: '23:37:00' },
        { name: 'SHILISTER', time: '23:38:00' },
        { name: 'TUSHAR', time: '27:42:00' },
        { name: 'BANSHAI', time: '28:42:00' },
        { name: 'PRATIK', time: '28:43:00' },
        { name: 'RANDEL K', time: '29:28:00' },
        { name: 'SHANLANG', time: '30:00:00' }
    ];

    const womenData = [
        { name: 'MEBA', time: '26:57:00' },
        { name: 'WENDY', time: '31:33:00' },
        { name: 'MONYUNG', time: '32:00:00' },
        { name: 'MEDINA', time: '40:00:00' },
        { name: 'TENGCHINA', time: '42:43:00' }
    ];

    const tbody = document.getElementById('leaderboard-body');
    const tabBtns = document.querySelectorAll('.tab-btn');

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach((runner, index) => {
            const row = document.createElement('tr');
            let rank = index + 1;
            if(rank === 1) rank = '🥇';
            if(rank === 2) rank = '🥈';
            if(rank === 3) rank = '🥉';

            row.innerHTML = `
                <td>${rank}</td>
                <td>${runner.name}</td>
                <td>${runner.time}</td>
            `;
            row.style.animation = `slideUp 0.3s ease forwards ${index * 0.05}s`;
            row.style.opacity = '0';
            tbody.appendChild(row);
        });
    }

    renderTable(menData);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.target === 'women') {
                renderTable(womenData);
            } else {
                renderTable(menData);
            }
        });
    });


    /* --- 5. Registration & Logic --- */
    const runInfo = {
        date: "Sunday, Next Week",
        location: "Wards Lake",
        warmup: "6:00 AM",
        flagoff: "6:30 AM"
    };
    
    document.getElementById('dynamic-run-info').innerHTML = 
        `Next Run: <strong>${runInfo.date}</strong> at ${runInfo.location} <br>
         Warm-up: ${runInfo.warmup} | Flag-off: ${runInfo.flagoff}`;

    const planSelect = document.getElementById('plan');
    const planSummary = document.getElementById('plan-summary');
    
    document.querySelectorAll('.select-plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.target.dataset.value;
            planSelect.value = val;
            updateSummary();
            document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
        });
    });

    planSelect.addEventListener('change', updateSummary);

    function updateSummary() {
        if(planSelect.value === 'monthly') {
            planSummary.textContent = "You are paying ₹399. Includes 4 runs this month.";
            planSummary.style.color = "var(--primary)";
        } else {
            planSummary.textContent = "You are paying ₹99 for a single run.";
            planSummary.style.color = "#ccc";
        }
    }

    const form = document.getElementById('reg-form');
    const successMsg = document.getElementById('success-message');
    const recentList = document.getElementById('recent-list');

    loadRecentRegs();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fullname').value;
        const plan = document.getElementById('plan').value;
        const distance = document.getElementById('distance').value;

        const newReg = {
            name: name,
            plan: plan === 'monthly' ? 'Monthly Member' : 'Day Pass',
            distance: distance,
            time: new Date().toLocaleTimeString()
        };

        let registrations = JSON.parse(localStorage.getItem('stryde_regs')) || [];
        registrations.unshift(newReg);
        if(registrations.length > 5) registrations.pop();
        localStorage.setItem('stryde_regs', JSON.stringify(registrations));

        successMsg.classList.remove('hidden');
        loadRecentRegs();
        form.reset();
    });

    document.getElementById('close-success').addEventListener('click', () => {
        successMsg.classList.add('hidden');
    });

    function loadRecentRegs() {
        const regs = JSON.parse(localStorage.getItem('stryde_regs')) || [];
        recentList.innerHTML = '';
        
        if(regs.length === 0) {
            recentList.innerHTML = '<li style="justify-content:center; color:#666;">No recent registrations yet.</li>';
            return;
        }

        regs.slice(0, 3).forEach(reg => {
            const li = document.createElement('li');
            li.innerHTML = `${reg.name} <span style="font-size:0.8rem; color:var(--text-muted)">${reg.plan} (${reg.distance})</span>`;
            recentList.appendChild(li);
        });
    }
});