// ============================================================
// evidence.js — Evidence Request Checklist Module
// ============================================================

const Evidence = {
  filter: 'ALL',

  render(container) {
    const audit = App.getCurrentAudit();
    if (!audit) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No audit selected</div>
          <div class="empty-state-desc">Create or select an audit from the dashboard</div>
          <button class="btn btn-primary" onclick="App.showNewAuditModal()">New Audit</button>
        </div>`;
      return;
    }

    const items = audit.evidence;
    const total = items.length;
    const yes = items.filter(i => i.status === 'YES').length;
    const partial = items.filter(i => i.status === 'PARTIAL').length;
    const no = items.filter(i => i.status === 'NO').length;
    const pending = items.filter(i => i.status === 'PENDING').length;
    const pct = total ? Math.round(((yes + partial * 0.5) / total) * 100) : 0;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Evidence Request Checklist</h1>
          <p class="page-subtitle">Pre-audit document collection tracker — ${total} items across ${EVIDENCE_CATEGORIES.length} categories</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:2rem;font-weight:800;color:var(--primary);">${pct}%</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">evidence collected</div>
        </div>
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">
        <div class="stat-card" style="border-left:3px solid var(--green);">
          <div class="stat-card-label">Provided</div>
          <div class="stat-card-value" style="color:var(--green);">${yes}</div>
        </div>
        <div class="stat-card" style="border-left:3px solid var(--amber);">
          <div class="stat-card-label">Partial</div>
          <div class="stat-card-value" style="color:var(--amber);">${partial}</div>
        </div>
        <div class="stat-card" style="border-left:3px solid var(--red);">
          <div class="stat-card-label">Missing</div>
          <div class="stat-card-value" style="color:var(--red);">${no}</div>
        </div>
        <div class="stat-card" style="border-left:3px solid #94a3b8;">
          <div class="stat-card-label">Pending</div>
          <div class="stat-card-value" style="color:#64748b;">${pending}</div>
        </div>
      </div>

      <div class="progress-bar-wrap" style="height:12px;margin-bottom:24px;">
        <div class="progress-bar" style="width:${pct}%;background:${pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'};"></div>
      </div>

      <div class="filter-bar">
        <span style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;">Filter:</span>
        ${['ALL', 'YES', 'NO', 'PARTIAL', 'PENDING'].map(f => `
          <button class="filter-btn ${this.filter === f ? 'active' : ''}" onclick="Evidence.setFilter('${f}')">${f}</button>
        `).join('')}
      </div>

      ${EVIDENCE_CATEGORIES.map(cat => {
        const catItems = items.filter(i => i.categoryId === cat.id);
        const filteredItems = this.filter === 'ALL' ? catItems : catItems.filter(i => i.status === this.filter);
        if (filteredItems.length === 0 && this.filter !== 'ALL') return '';
        const catProvided = catItems.filter(i => i.status === 'YES').length;

        return `
          <div class="card" style="margin-bottom:12px;">
            <div class="card-header">
              <span>${cat.category} <span style="color:var(--text-muted);font-weight:400;font-size:0.85rem;">${cat.categoryAr}</span></span>
              <span style="font-size:0.8rem;color:var(--text-muted);">${catProvided}/${catItems.length}</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:40%;">Document</th>
                    <th style="width:120px;">Status</th>
                    <th style="width:150px;">Owner</th>
                    <th>Notes / Link</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredItems.map(item => {
                    const def = EVIDENCE_CATEGORIES.flatMap(c => c.items).find(d => d.id === item.id);
                    return `
                      <tr>
                        <td style="font-size:0.85rem;">${def ? def.document : ''}</td>
                        <td>
                          <select onchange="Evidence.updateStatus(${item.id}, this.value)" style="width:100%;">
                            ${['PENDING', 'YES', 'NO', 'PARTIAL'].map(s =>
                              `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>`
                            ).join('')}
                          </select>
                        </td>
                        <td>
                          <input type="text" value="${App.escapeHtml(item.owner)}"
                            onchange="Evidence.updateField(${item.id}, 'owner', this.value)"
                            placeholder="Owner" style="font-size:0.85rem;">
                        </td>
                        <td>
                          <input type="text" value="${App.escapeHtml(item.notes)}"
                            onchange="Evidence.updateField(${item.id}, 'notes', this.value)"
                            placeholder="Notes or link" style="font-size:0.85rem;">
                        </td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>`;
      }).join('')}
    `;
  },

  setFilter(filter) {
    this.filter = filter;
    this.render(document.getElementById('main-content'));
  },

  updateStatus(itemId, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    const item = audit.evidence.find(i => i.id === itemId);
    if (item) { item.status = value; App.saveAudit(audit); }
    this.render(document.getElementById('main-content'));
  },

  updateField(itemId, field, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    const item = audit.evidence.find(i => i.id === itemId);
    if (item) { item[field] = value; App.saveAudit(audit); }
  }
};
