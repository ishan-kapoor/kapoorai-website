const systemDetails = {
    'helpdesk': {
        title: 'Institution Helpdesk System',
        problem: 'Student queries are scattered across WhatsApp and emails. Staff are overwhelmed, and 30% of queries are either duplicated or lost.',
        solution: 'A unified portal that captures every query, tags it (Fees, Admin, Academics), and routes it to the right department instantly.',
        impact: 'Reduced response time by 60%. Staff saves 15+ hours per week on coordination.'
    },
    'engine': {
        title: 'Academic Operations Engine',
        problem: 'Data silos. Student grades are in LMS, attendance is in Excel, and fees in ERP. Manual syncing takes days.',
        solution: 'A custom middleware that syncs data in real-time, generating automated reports without human intervention.',
        impact: 'Eliminated data entry errors. Reporting time dropped from 3 days to 10 seconds.'
    },
    'ai-assist': {
        title: 'Institutional AI Assistant',
        problem: 'Staff spend half their day answering the same 10 basic policy questions for students.',
        solution: 'An internal AI trained on your institution’s policies and FAQs. Staff get immediate, accurate answers to any internal query.',
        impact: 'Reduces internal support tickets by 45%. Zero-wait time for policy lookups.'
    }
};

function openModal(id) {
    const data = systemDetails[id];
    const modal = document.getElementById('systemModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
        <h2 style="font-size: 28px; color: #0f172a; margin-bottom: 10px;">${data.title}</h2>
        <div class="detail-section">
            <h4>The Pain Point</h4>
            <p>${data.problem}</p>
        </div>
        <div class="detail-section">
            <h4>The Solution</h4>
            <p>${data.solution}</p>
        </div>
        <div class="detail-section">
            <h4>Impact</h4>
            <div class="highlight-box">${data.impact}</div>
        </div>
        <button class="cta-button" style="margin-top: 30px; width: 100%;" onclick="closeModal(); window.location.href='#contact'">Discuss this System</button>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('systemModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(e) {
    if (e.target == document.getElementById('systemModal')) closeModal();
}

// Mobile Menu
document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.left = '0';
    nav.style.width = '100%';
    nav.style.background = 'white';
    nav.style.padding = '20px';
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
