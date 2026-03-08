// ============================================================
// tracker.js — Client Tracker Module
// ============================================================

const Tracker = {
  sortField: 'auditDate',
  sortDir: 'desc',
  filterTier: 'ALL',

  render(container) {
    let audits = App.getAllAudits();

    // Filter
    if (this.filterTier !== 'ALL') {
      audits = audits.filter(a => a.scoring.tier === this.filterTier);
    }

    // Sort
    audits.sort((a, b) => {
      let va, vb;
      switch (this.sortField) {
        case 'clientName': va = a.clientName.toLowerCase(); vb = b.clientName.toLowerCase(); break;
        case 'score': va = a.scoring.totalScore; vb = b.scoring.totalScore; break;
        default: va = a.auditDate; vb = b.auditDate;
      }
      if (va < vb) return this.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Client Tracker</h1>
          <p class="page-subtitle">${audits.length} audit${audits.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button class="btn btn-primary" onclick="App.showNewAuditModal()">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v12M2 8h12"/></svg>
          New Audit
        </button>
      </div>

      <div class="filter-bar">
        <span style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;">Filter:</span>
        ${['ALL', 'GREEN', 'AMBER', 'RED'].map(f => `
          <button class="filter-btn ${this.filterTier === f ? 'active' : ''}" onclick="Tracker.setFilter('${f}')">${f}</button>
        `).join('')}
        <span style="margin-left:auto;font-size:0.8rem;color:var(--text-secondary);font-weight:600;">Sort:</span>
        <select onchange="Tracker.setSort(this.value)" style="width:auto;font-size:0.8rem;">
          <option value="auditDate-desc" ${this.sortField === 'auditDate' && this.sortDir === 'desc' ? 'selected' : ''}>Date (newest)</option>
          <option value="auditDate-asc" ${this.sortField === 'auditDate' && this.sortDir === 'asc' ? 'selected' : ''}>Date (oldest)</option>
          <option value="score-desc" ${this.sortField === 'score' && this.sortDir === 'desc' ? 'selected' : ''}>Score (high)</option>
          <option value="score-asc" ${this.sortField === 'score' && this.sortDir === 'asc' ? 'selected' : ''}>Score (low)</option>
          <option value="clientName-asc" ${this.sortField === 'clientName' && this.sortDir === 'asc' ? 'selected' : ''}>Name (A-Z)</option>
        </select>
      </div>

      ${audits.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-title">No audits found</div>
          <div class="empty-state-desc">${this.filterTier !== 'ALL' ? 'No audits match the current filter' : 'Create your first audit to get started'}</div>
        </div>
      ` : `
        <div class="card">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Sector</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Top Gaps</th>
                  <th>Package</th>
                  <th>Next Review</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${audits.map(a => {
                  const gaps = this.getTopGapNames(a);
                  return `
                    <tr class="clickable" onclick="App.navigate('scoring','${a.id}')">
                      <td><strong>${App.escapeHtml(a.clientName)}</strong></td>
                      <td style="font-size:0.85rem;">${App.escapeHtml(a.sector)}</td>
                      <td style="white-space:nowrap;">${a.auditDate}</td>
                      <td><strong>${a.scoring.totalScore}</strong>/100</td>
                      <td><span class="tier-badge tier-${a.scoring.tier}">${a.scoring.tier}</span></td>
                      <td><span class="status-badge status-${a.status === 'completed' ? 'PASS' : 'PENDING'}">${a.status}</span></td>
                      <td style="font-size:0.8rem;max-width:200px;">${gaps}</td>
                      <td>
                        <select onclick="event.stopPropagation()" onchange="Tracker.updatePackage('${a.id}', this.value)" style="font-size:0.8rem;width:auto;">
                          <option value="" ${!a.recommendedPackage ? 'selected' : ''}>—</option>
                          <option value="Setup" ${a.recommendedPackage === 'Setup' ? 'selected' : ''}>Setup</option>
                          <option value="Retainer" ${a.recommendedPackage === 'Retainer' ? 'selected' : ''}>Retainer</option>
                          <option value="Both" ${a.recommendedPackage === 'Both' ? 'selected' : ''}>Both</option>
                        </select>
                      </td>
                      <td>
                        <input type="date" value="${a.nextReviewDate || ''}"
                          onclick="event.stopPropagation()"
                          onchange="Tracker.updateReviewDate('${a.id}', this.value)"
                          style="font-size:0.8rem;width:auto;">
                      </td>
                      <td>
                        <button class="btn-icon" onclick="event.stopPropagation(); Tracker.confirmDelete('${a.id}', '${App.escapeHtml(a.clientName)}')" title="Delete" style="color:var(--red);">
                          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h10M5 6V4a1 1 0 011-1h2a1 1 0 011 1v2M12 6v7a1 1 0 01-1 1H5a1 1 0 01-1-1V6"/></svg>
                        </button>
                      </td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    `;
  },

  getTopGapNames(audit) {
    return audit.scoring.categories
      .map((cat, i) => ({ score: cat.score ?? 0, name: SCORING_CATEGORIES[i].name, weight: SCORING_CATEGORIES[i].weight }))
      .sort((a, b) => (a.score / 5 * a.weight) - (b.score / 5 * b.weight))
      .slice(0, 3)
      .map(g => g.name)
      .join(', ');
  },

  setFilter(tier) {
    this.filterTier = tier;
    this.render(document.getElementById('main-content'));
  },

  setSort(value) {
    const [field, dir] = value.split('-');
    this.sortField = field;
    this.sortDir = dir;
    this.render(document.getElementById('main-content'));
  },

  updatePackage(id, value) {
    const audit = App.getAudit(id);
    if (!audit) return;
    audit.recommendedPackage = value;
    App.saveAudit(audit);
  },

  updateReviewDate(id, value) {
    const audit = App.getAudit(id);
    if (!audit) return;
    audit.nextReviewDate = value;
    App.saveAudit(audit);
  },

  confirmDelete(id, name) {
    if (confirm(`Delete audit for "${name}"? This cannot be undone.`)) {
      App.deleteAudit(id);
      App.toast('Audit deleted');
      this.render(document.getElementById('main-content'));
    }
  }
};
