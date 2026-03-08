// ============================================================
// dashboard.js — Dashboard Module
// ============================================================

const Dashboard = {
  render(container) {
    const audits = App.getAllAudits();
    const now = new Date();
    const thisMonth = audits.filter(a => {
      const d = new Date(a.auditDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const avgScore = audits.length
      ? Math.round(audits.reduce((s, a) => s + (a.scoring.totalScore || 0), 0) / audits.length)
      : 0;
    const inProgress = audits.filter(a => a.status === 'in-progress').length;

    const tierCounts = { GREEN: 0, AMBER: 0, RED: 0 };
    audits.forEach(a => { tierCounts[a.scoring.tier] = (tierCounts[a.scoring.tier] || 0) + 1; });

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Overview of all tender readiness audits</p>
        </div>
        <button class="btn btn-primary" onclick="App.showNewAuditModal()">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v12M2 8h12"/></svg>
          New Audit
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-label">Total Clients</div>
          <div class="stat-card-value">${audits.length}</div>
          <div class="stat-card-sub">${inProgress} in progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">This Month</div>
          <div class="stat-card-value">${thisMonth.length}</div>
          <div class="stat-card-sub">audits conducted</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Average Score</div>
          <div class="stat-card-value">${avgScore}<span style="font-size:1rem;color:var(--text-muted)">/100</span></div>
          <div class="stat-card-sub">${audits.length ? getTier(avgScore) : '—'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Score Distribution</div>
          <div style="display:flex;gap:12px;margin-top:8px;align-items:flex-end;height:50px;">
            ${this.renderBar('GREEN', tierCounts.GREEN, audits.length)}
            ${this.renderBar('AMBER', tierCounts.AMBER, audits.length)}
            ${this.renderBar('RED', tierCounts.RED, audits.length)}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Recent Audits</div>
        ${audits.length === 0 ? `
          <div class="empty-state">
            <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v36a2 2 0 002 2h28a2 2 0 002-2V16l-12-14z"/><path d="M14 2v14h12"/></svg>
            <div class="empty-state-title">No audits yet</div>
            <div class="empty-state-desc">Create your first audit to get started</div>
            <button class="btn btn-primary" onclick="App.showNewAuditModal()">Create First Audit</button>
          </div>
        ` : `
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${audits.slice(0, 10).map(a => `
                  <tr class="clickable" onclick="App.navigate('scoring','${a.id}')">
                    <td><strong>${App.escapeHtml(a.clientName)}</strong></td>
                    <td>${App.escapeHtml(a.sector)}</td>
                    <td>${a.auditDate}</td>
                    <td><strong>${a.scoring.totalScore}</strong>/100</td>
                    <td><span class="tier-badge tier-${a.scoring.tier}">${a.scoring.tier}</span></td>
                    <td><span class="status-badge status-${a.status === 'completed' ? 'PASS' : 'PENDING'}">${a.status}</span></td>
                    <td>
                      <button class="btn-icon" onclick="event.stopPropagation(); App.navigate('scoring','${a.id}')" title="Open">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l7-7M9 5h3v3"/></svg>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  renderBar(tier, count, total) {
    const pct = total ? Math.max(8, (count / total) * 100) : 8;
    const color = TIER_CONFIG[tier].color;
    return `
      <div style="flex:1;text-align:center;">
        <div style="height:${pct}%;min-height:6px;background:${color};border-radius:4px 4px 0 0;margin-bottom:4px;"></div>
        <div style="font-size:0.75rem;font-weight:700;color:${color}">${count}</div>
        <div style="font-size:0.65rem;color:var(--text-muted)">${tier}</div>
      </div>`;
  }
};
