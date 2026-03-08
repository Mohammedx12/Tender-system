// ============================================================
// app.js — Core application: Router, State, LocalStorage
// ============================================================

const App = {
  currentAuditId: localStorage.getItem('traCurrentAudit') || null,
  currentPage: 'dashboard',

  // --- LocalStorage ---
  load() {
    try {
      return JSON.parse(localStorage.getItem('traAudits')) || {};
    } catch { return {}; }
  },

  save(audits) {
    localStorage.setItem('traAudits', JSON.stringify(audits));
  },

  getAudit(id) {
    return this.load()[id] || null;
  },

  getCurrentAudit() {
    return this.currentAuditId ? this.getAudit(this.currentAuditId) : null;
  },

  saveAudit(audit) {
    const audits = this.load();
    audits[audit.id] = audit;
    this.save(audits);
  },

  deleteAudit(id) {
    const audits = this.load();
    delete audits[id];
    this.save(audits);
    if (this.currentAuditId === id) {
      this.currentAuditId = null;
      localStorage.removeItem('traCurrentAudit');
    }
  },

  getAllAudits() {
    const audits = this.load();
    return Object.values(audits).sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate));
  },

  // --- Create New Audit ---
  createAudit(clientName, sector) {
    const id = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const audit = {
      id,
      clientName,
      sector,
      auditDate: new Date().toISOString().split('T')[0],
      status: 'in-progress',
      scoring: {
        categories: SCORING_CATEGORIES.map(c => ({
          id: c.id, score: null, notes: '', remediation: '', owner: '', targetDate: ''
        })),
        totalScore: 0,
        tier: 'RED'
      },
      interview: {
        sections: INTERVIEW_SECTIONS.map(s => ({
          id: s.id,
          questions: s.questions.map((_, i) => ({ id: i, notes: '' }))
        }))
      },
      evidence: EVIDENCE_CATEGORIES.flatMap(cat =>
        cat.items.map(item => ({
          id: item.id, categoryId: cat.id, status: 'PENDING', owner: '', notes: ''
        }))
      ),
      heatmap: {
        checks: DQ_CHECKS.map(c => ({
          id: c.id, status: 'NA', severity: c.defaultSeverity, owner: '', notes: ''
        })),
        overallSignal: 'GREEN'
      },
      topGaps: ['', '', ''],
      recommendedPackage: '',
      nextReviewDate: '',
      generalNotes: ''
    };
    this.saveAudit(audit);
    this.currentAuditId = id;
    return audit;
  },

  // --- Scoring Calculation ---
  recalcScore(audit) {
    let total = 0;
    audit.scoring.categories.forEach((cat, i) => {
      const weight = SCORING_CATEGORIES[i].weight;
      const score = cat.score ?? 0;
      total += (score / 5) * weight;
    });
    audit.scoring.totalScore = Math.round(total * 10) / 10;
    audit.scoring.tier = getTier(audit.scoring.totalScore);
    return audit;
  },

  // --- Heatmap Calculation ---
  recalcHeatmap(audit) {
    const areaScores = {};
    const areaCounts = {};

    audit.heatmap.checks.forEach((check, i) => {
      const area = DQ_CHECKS[i].area;
      if (!areaScores[area]) { areaScores[area] = 0; areaCounts[area] = 0; }
      areaCounts[area]++;
      if (check.status === 'FAIL') {
        areaScores[area] += check.severity;
      }
    });

    let worstLevel = 'GREEN';
    for (const area of Object.keys(areaCounts)) {
      const riskScore = (areaScores[area] / (areaCounts[area] * 5)) * 100;
      const level = getRiskLevel(riskScore);
      if (level === 'RED') worstLevel = 'RED';
      else if (level === 'AMBER' && worstLevel !== 'RED') worstLevel = 'AMBER';
    }
    audit.heatmap.overallSignal = worstLevel;
    return audit;
  },

  // --- Router ---
  navigate(page, auditId) {
    if (auditId !== undefined) {
      this.currentAuditId = auditId;
      localStorage.setItem('traCurrentAudit', auditId);
    }
    this.currentPage = page;

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');

    // Update sidebar active state
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update audit context bar
    this.updateAuditBar();

    // Render page
    const main = document.getElementById('main-content');
    switch (page) {
      case 'dashboard':   Dashboard.render(main); break;
      case 'scoring':     Scoring.render(main); break;
      case 'interview':   Interview.render(main); break;
      case 'evidence':    Evidence.render(main); break;
      case 'heatmap':     Heatmap.render(main); break;
      case 'report':      Report.render(main); break;
      case 'tracker':     Tracker.render(main); break;
      case 'outreach':    Outreach.render(main); break;
      default:            Dashboard.render(main);
    }
  },

  updateAuditBar() {
    const bar = document.getElementById('audit-context-bar');
    const audit = this.getCurrentAudit();
    if (audit && this.currentPage !== 'dashboard' && this.currentPage !== 'tracker' && this.currentPage !== 'outreach') {
      const tier = TIER_CONFIG[audit.scoring.tier];
      bar.innerHTML = `
        <div class="audit-bar-content">
          <span class="audit-bar-client">${this.escapeHtml(audit.clientName)}</span>
          <span class="audit-bar-sector">${this.escapeHtml(audit.sector)}</span>
          <span class="audit-bar-date">${audit.auditDate}</span>
          <span class="tier-badge tier-${audit.scoring.tier}">${audit.scoring.tier}</span>
          <span class="audit-bar-score">${audit.scoring.totalScore}/100</span>
        </div>`;
      bar.style.display = 'flex';
    } else {
      bar.style.display = 'none';
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // --- Toast Notification ---
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  // --- New Audit Modal ---
  showNewAuditModal() {
    const modal = document.getElementById('new-audit-modal');
    modal.style.display = 'flex';
    document.getElementById('new-audit-name').value = '';
    document.getElementById('new-audit-sector').value = SECTORS[0];
    document.getElementById('new-audit-name').focus();
  },

  hideNewAuditModal() {
    document.getElementById('new-audit-modal').style.display = 'none';
  },

  handleNewAudit() {
    const name = document.getElementById('new-audit-name').value.trim();
    const sector = document.getElementById('new-audit-sector').value;
    if (!name) {
      this.toast('Please enter a client name', 'error');
      return;
    }
    const audit = this.createAudit(name, sector);
    this.hideNewAuditModal();
    this.toast(`Audit created for ${name}`);
    this.navigate('scoring', audit.id);
  },

  // --- Init ---
  init() {
    // Sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigate(page);
      });
    });

    // New audit button
    document.getElementById('btn-new-audit').addEventListener('click', () => this.showNewAuditModal());
    document.getElementById('modal-cancel').addEventListener('click', () => this.hideNewAuditModal());
    document.getElementById('modal-create').addEventListener('click', () => this.handleNewAudit());

    // Enter key in modal
    document.getElementById('new-audit-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleNewAudit();
    });

    // Close modal on backdrop click
    document.getElementById('new-audit-modal').addEventListener('click', (e) => {
      if (e.target.id === 'new-audit-modal') this.hideNewAuditModal();
    });

    // Mobile sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Start on dashboard
    this.navigate('dashboard');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
