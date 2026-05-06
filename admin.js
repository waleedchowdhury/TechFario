const API_BASE = resolveApiBase();
const tokenKey = 'techfario_admin_token';

function resolveApiBase() {
  const configured =
    window.TECHFARIO_CONFIG?.apiBaseUrl ||
    window.TECHFARIO_API_BASE ||
    localStorage.getItem('techfario_api_base') ||
    '';

  if (configured.trim()) {
    return configured.trim().replace(/\/$/, '');
  }

  if (window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:5000';
  }

  if (window.location.hostname.endsWith('github.io')) {
    return '';
  }

  return window.location.origin;
}

const state = {
  token: localStorage.getItem(tokenKey),
  projects: [],
  team: [],
  reviews: [],
  subscribers: [],
  editor: null
};

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.borderColor = type === 'error' ? 'rgba(255, 100, 124, 0.5)' : 'rgba(49, 230, 160, 0.42)';
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

async function api(path, options = {}) {
  if (!API_BASE) {
    throw new Error('Live backend is not connected yet. Add your hosted API URL in site-config.js.');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      logout(false);
    }

    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function toggleView(authenticated) {
  document.getElementById('loginView').hidden = authenticated;
  document.getElementById('dashboardView').hidden = !authenticated;
}

function logout(withMessage = true) {
  state.token = null;
  localStorage.removeItem(tokenKey);
  toggleView(false);
  if (withMessage) {
    showToast('Logged out.');
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function compact(value, fallback = '-') {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : fallback;
  }

  return value || fallback;
}

function table(headers, rows) {
  if (!rows.length) {
    return '<div class="loader">No records yet.</div>';
  }

  return `
    <table class="admin-table">
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  `;
}

function renderStats(stats) {
  const labels = [
    ['Total Projects', stats.totalProjects],
    ['Total Team Members', stats.totalTeamMembers],
    ['Total Reviews', stats.totalReviews],
    ['Newsletter Subscribers', stats.totalNewsletterSubscribers]
  ];

  document.getElementById('statsGrid').innerHTML = labels
    .map(
      ([label, value]) => `
        <article class="admin-card">
          <strong>${value}</strong>
          <span>${label}</span>
        </article>
      `
    )
    .join('');
}

function renderProjects() {
  const rows = state.projects.map(
    (item) => `
      <tr>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.description)}</td>
        <td>${escapeHtml(compact(item.techStack))}</td>
        <td><a class="card-link" href="${item.liveLink}" target="_blank" rel="noreferrer">Open</a></td>
        <td>
          <div class="row-actions">
            <button class="small-button" data-edit-project="${item._id}" type="button">Edit</button>
            <button class="small-button danger" data-delete-project="${item._id}" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `
  );

  document.getElementById('projectsTable').innerHTML = table(
    ['Title', 'Description', 'Tech Stack', 'Live Link', 'Actions'],
    rows
  );
}

function renderTeam() {
  const rows = state.team.map(
    (item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.role)}</td>
        <td>${escapeHtml(compact(item.skills))}</td>
        <td>${escapeHtml(Object.values(item.socialLinks || {}).filter(Boolean).length)} links</td>
        <td>
          <div class="row-actions">
            <button class="small-button" data-edit-member="${item._id}" type="button">Edit</button>
            <button class="small-button danger" data-delete-member="${item._id}" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `
  );

  document.getElementById('teamTable').innerHTML = table(['Name', 'Role', 'Skills', 'Social', 'Actions'], rows);
}

function renderReviews() {
  const rows = state.reviews.map(
    (item) => `
      <tr>
        <td>${escapeHtml(item.name)}<br><span>${escapeHtml(item.position)}</span></td>
        <td>${escapeHtml(item.review)}</td>
        <td>${item.rating}/5</td>
        <td>${item.verified ? '<span class="verified">Verified</span>' : 'Pending'}</td>
        <td><a class="card-link" href="${item.proofImage}" target="_blank" rel="noreferrer">Proof</a></td>
        <td>
          <div class="row-actions">
            <button class="small-button approve" data-verify-review="${item._id}" data-verified="${!item.verified}" type="button">
              ${item.verified ? 'Reject' : 'Approve'}
            </button>
            <button class="small-button danger" data-delete-review="${item._id}" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `
  );

  document.getElementById('reviewsTable').innerHTML = table(
    ['Client', 'Review', 'Rating', 'Status', 'Proof', 'Actions'],
    rows
  );
}

function renderSubscribers() {
  const rows = state.subscribers.map(
    (item) => `
      <tr>
        <td>${escapeHtml(item.email)}</td>
        <td>${new Date(item.subscribedAt).toLocaleString()}</td>
      </tr>
    `
  );

  document.getElementById('subscribersTable').innerHTML = table(['Email', 'Subscribed'], rows);
}

async function loadDashboard() {
  try {
    const [stats, projects, team, reviews, subscribers] = await Promise.all([
      api('/api/admin/stats'),
      api('/api/projects'),
      api('/api/team'),
      api('/api/reviews/admin'),
      api('/api/newsletter/subscribers')
    ]);

    state.projects = projects;
    state.team = team;
    state.reviews = reviews;
    state.subscribers = subscribers;
    renderStats(stats);
    renderProjects();
    renderTeam();
    renderReviews();
    renderSubscribers();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

const fieldSets = {
  project: [
    ['title', 'Title', 'text'],
    ['description', 'Description', 'textarea'],
    ['image', 'Image URL', 'url'],
    ['techStack', 'Tech Stack', 'text'],
    ['liveLink', 'Live Link', 'url']
  ],
  member: [
    ['name', 'Name', 'text'],
    ['role', 'Role', 'text'],
    ['skills', 'Skills', 'text'],
    ['image', 'Image URL', 'url'],
    ['linkedin', 'LinkedIn', 'url'],
    ['github', 'GitHub', 'url'],
    ['twitter', 'Twitter', 'url'],
    ['website', 'Website', 'url']
  ]
};

function flattenMember(item = {}) {
  return {
    ...item,
    skills: (item.skills || []).join(', '),
    linkedin: item.socialLinks?.linkedin || '',
    github: item.socialLinks?.github || '',
    twitter: item.socialLinks?.twitter || '',
    website: item.socialLinks?.website || ''
  };
}

function openEditor(type, item = null) {
  const dialog = document.getElementById('editorDialog');
  const fields = document.getElementById('dialogFields');
  const values = type === 'member' ? flattenMember(item) : { ...item, techStack: (item?.techStack || []).join(', ') };

  state.editor = {
    type,
    id: item?._id || null
  };

  document.getElementById('dialogTitle').textContent = `${item ? 'Edit' : 'Add'} ${type === 'project' ? 'Project' : 'Team Member'}`;
  fields.innerHTML = fieldSets[type]
    .map(([name, label, inputType]) => {
      const value = escapeHtml(values?.[name] || '');
      const wide = ['description', 'image', 'liveLink', 'skills', 'website'].includes(name) ? 'wide' : '';

      if (inputType === 'textarea') {
        return `<label class="${wide}">${label}<textarea name="${name}" rows="4" required>${value}</textarea></label>`;
      }

      return `<label class="${wide}">${label}<input name="${name}" type="${inputType}" value="${value}" ${['linkedin', 'github', 'twitter', 'website'].includes(name) ? '' : 'required'} /></label>`;
    })
    .join('');

  dialog.showModal();
}

function editorPayload() {
  const form = document.querySelector('#editorDialog .dialog-card');
  const data = formObject(form);
  const listFromText = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean);

  if (state.editor.type === 'project') {
    return {
      title: data.title,
      description: data.description,
      image: data.image,
      techStack: listFromText(data.techStack),
      liveLink: data.liveLink
    };
  }

  return {
    name: data.name,
    role: data.role,
    skills: listFromText(data.skills),
    image: data.image,
    socialLinks: {
      linkedin: data.linkedin,
      github: data.github,
      twitter: data.twitter,
      website: data.website
    }
  };
}

async function saveEditor() {
  const form = document.querySelector('#editorDialog .dialog-card');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const { type, id } = state.editor;
  const endpoint = type === 'project' ? '/api/projects' : '/api/team';
  const method = id ? 'PUT' : 'POST';
  const path = id ? `${endpoint}/${id}` : endpoint;

  try {
    await api(path, {
      method,
      body: JSON.stringify(editorPayload())
    });
    document.getElementById('editorDialog').close();
    showToast(`${type === 'project' ? 'Project' : 'Team member'} saved.`);
    await loadDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function removeResource(path, message) {
  if (!window.confirm(message)) {
    return;
  }

  try {
    await api(path, { method: 'DELETE' });
    showToast('Deleted.');
    await loadDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function wireNavigation() {
  document.querySelector('.admin-nav').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-panel]');

    if (!button) {
      return;
    }

    document.querySelectorAll('.admin-nav button').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.panel).classList.add('active');
  });
}

function wireActions() {
  document.body.addEventListener('click', async (event) => {
    const target = event.target.closest('button');

    if (!target) {
      return;
    }

    if (target.dataset.action === 'new-project') {
      openEditor('project');
    }

    if (target.dataset.action === 'new-member') {
      openEditor('member');
    }

    if (target.dataset.editProject) {
      openEditor('project', state.projects.find((item) => item._id === target.dataset.editProject));
    }

    if (target.dataset.editMember) {
      openEditor('member', state.team.find((item) => item._id === target.dataset.editMember));
    }

    if (target.dataset.deleteProject) {
      removeResource(`/api/projects/${target.dataset.deleteProject}`, 'Delete this project?');
    }

    if (target.dataset.deleteMember) {
      removeResource(`/api/team/${target.dataset.deleteMember}`, 'Delete this team member?');
    }

    if (target.dataset.deleteReview) {
      removeResource(`/api/reviews/${target.dataset.deleteReview}`, 'Delete this review?');
    }

    if (target.dataset.verifyReview) {
      try {
        await api(`/api/reviews/${target.dataset.verifyReview}/verify`, {
          method: 'PUT',
          body: JSON.stringify({ verified: target.dataset.verified === 'true' })
        });
        showToast('Review status updated.');
        await loadDashboard();
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  });

  document.getElementById('closeDialog').addEventListener('click', () => {
    document.getElementById('editorDialog').close();
  });
  document.getElementById('saveDialog').addEventListener('click', saveEditor);
  document.getElementById('logoutButton').addEventListener('click', () => logout(true));
}

function wireAuth() {
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formObject(form))
      });
      state.token = data.token;
      localStorage.setItem(tokenKey, data.token);
      toggleView(true);
      form.reset();
      showToast('Welcome back.');
      await loadDashboard();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function wireNewsletter() {
  document.getElementById('emailForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      const result = await api('/api/newsletter/send-email', {
        method: 'POST',
        body: JSON.stringify(formObject(form))
      });
      form.reset();
      showToast(result.message);
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

wireAuth();
wireNavigation();
wireActions();
wireNewsletter();

if (state.token) {
  toggleView(true);
  loadDashboard();
} else {
  toggleView(false);
}
