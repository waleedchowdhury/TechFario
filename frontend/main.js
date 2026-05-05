const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5000' : window.location.origin;

const services = [
  {
    title: 'Software Development',
    icon: 'code',
    description: 'Frontend, backend, database, and deployment work for fast, maintainable digital products.'
  },
  {
    title: 'Digital Marketing',
    icon: 'trend',
    description: 'Campaign strategy, content systems, analytics tracking, and conversion-focused growth loops.'
  },
  {
    title: 'Virtual Assistance',
    icon: 'tasks',
    description: 'Remote operational support for inboxes, research, scheduling, documentation, and customer workflows.'
  },
  {
    title: 'Data & Analytics',
    icon: 'chart',
    description: 'Dashboards, reporting models, data cleanup, KPI tracking, and decision-ready business insights.'
  },
  {
    title: 'Automation & Integration',
    icon: 'bolt',
    description: 'Connect tools, automate repetitive work, and keep your business systems synchronized.'
  },
  {
    title: 'Animation',
    icon: 'spark',
    description: 'Motion graphics, explainer visuals, interface animation, and branded launch assets.'
  },
  {
    title: 'Design & Branding',
    icon: 'brand',
    description: 'Visual identity, product UI, social kits, pitch assets, and modern brand systems.'
  }
];

const fallbackProjects = [
  {
    title: 'Revenue Intelligence Dashboard',
    description: 'A KPI command center with automated data pulls, segmentation, and executive reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    techStack: ['Node.js', 'MongoDB', 'Charts', 'Automation'],
    liveLink: 'https://example.com'
  },
  {
    title: 'SaaS Launch Website',
    description: 'A responsive marketing site and lead capture system built for a B2B product launch.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'SEO'],
    liveLink: 'https://example.com'
  },
  {
    title: 'Operations Automation Hub',
    description: 'Integrated CRM, task routing, email sequences, and internal status dashboards.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    techStack: ['Express', 'APIs', 'Nodemailer', 'Workflows'],
    liveLink: 'https://example.com'
  }
];

const fallbackTeam = [
  {
    name: 'Ari Morgan',
    role: 'Product Engineer',
    skills: ['Frontend', 'Backend', 'Database'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    socialLinks: { linkedin: 'https://example.com', github: 'https://example.com' }
  },
  {
    name: 'Nora Ellis',
    role: 'Growth Strategist',
    skills: ['SEO', 'Paid Media', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    socialLinks: { linkedin: 'https://example.com', website: 'https://example.com' }
  },
  {
    name: 'Sam Rivera',
    role: 'Automation Lead',
    skills: ['APIs', 'CRM', 'Operations'],
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=700&q=80',
    socialLinks: { linkedin: 'https://example.com', github: 'https://example.com' }
  }
];

const fallbackReviews = [
  {
    name: 'Maya Chen',
    position: 'Founder, BrightOps',
    review: 'The team shipped our portal, dashboard, and launch assets with excellent polish. The automation work saved us hours every week.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
    proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    verified: true
  },
  {
    name: 'Daniel Brooks',
    position: 'COO, Northline Studio',
    review: 'We finally have clean project tracking, campaign reporting, and admin workflows in one place. Communication was sharp from day one.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    proofImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    verified: true
  }
];

const icons = {
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18 3 12l6-6 1.4 1.4L5.8 12l4.6 4.6L9 18Zm6 0-1.4-1.4 4.6-4.6-4.6-4.6L15 6l6 6-6 6Z" fill="currentColor"/></svg>',
  trend: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 17 6-6 4 4 5.5-7H16V6h7v7h-2V9.7L14.2 18 10 13.8 5.4 18.4 4 17Z" fill="currentColor"/></svg>',
  tasks: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v2H5V5Zm0 6h14v2H5v-2Zm0 6h10v2H5v-2Z" fill="currentColor"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9h3v10H5Zm5 0V5h3v14h-3Zm5 0v-7h3v7h-3Z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" fill="currentColor"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z" fill="currentColor"/></svg>',
  brand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a4 4 0 0 1 0-8h2V3h-2Zm5 2v5h2V5h-2Z" fill="currentColor"/></svg>'
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
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function renderServices() {
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card reveal">
          <div class="service-icon">${icons[service.icon]}</div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        </article>
      `
    )
    .join('');
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <div class="card-body">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="chip-row">${(project.techStack || []).map((tech) => `<span class="chip">${tech}</span>`).join('')}</div>
            <p><a class="card-link" href="${project.liveLink}" target="_blank" rel="noreferrer">Live link</a></p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTeam(team) {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = team
    .map((member) => {
      const links = Object.entries(member.socialLinks || {})
        .filter(([, value]) => value)
        .map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`)
        .join('');

      return `
        <article class="team-card reveal">
          <img src="${member.image}" alt="${member.name}" loading="lazy" />
          <div class="card-body">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
            <div class="chip-row">${(member.skills || []).map((skill) => `<span class="chip">${skill}</span>`).join('')}</div>
            <div class="social-row">${links}</div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderReviews(reviews) {
  const track = document.getElementById('reviewsTrack');
  track.innerHTML = reviews
    .map(
      (item) => `
        <article class="review-card reveal">
          <div class="review-top">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            <div>
              <h3>${item.name}</h3>
              <p>${item.position}</p>
              ${item.verified ? '<span class="verified">Verified</span>' : ''}
            </div>
          </div>
          <div class="stars" aria-label="${item.rating} out of 5 stars">${'&#9733;'.repeat(item.rating)}</div>
          <p>${item.review}</p>
          <a class="proof-link" href="${item.proofImage}" target="_blank" rel="noreferrer">View proof</a>
        </article>
      `
    )
    .join('');
}

async function loadDynamicContent() {
  try {
    const projects = await api('/api/projects');
    renderProjects(projects.length ? projects : fallbackProjects);
  } catch (error) {
    renderProjects(fallbackProjects);
  }

  try {
    const team = await api('/api/team');
    renderTeam(team.length ? team : fallbackTeam);
  } catch (error) {
    renderTeam(fallbackTeam);
  }

  try {
    const reviews = await api('/api/reviews');
    renderReviews(reviews.length ? reviews : fallbackReviews);
  } catch (error) {
    renderReviews(fallbackReviews);
  }

  initReveal();
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function requireFields(form) {
  const valid = form.checkValidity();

  if (!valid) {
    form.reportValidity();
    throw new Error('Please complete the required fields');
  }
}

function wireForms() {
  document.getElementById('newsletterForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      requireFields(form);
      await api('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify(formData(form))
      });
      form.reset();
      showToast('Subscription saved. Welcome aboard.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      requireFields(form);
      await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData(form))
      });
      form.reset();
      showToast('Message sent. We will get back to you soon.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  document.getElementById('reviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = formData(form);
    payload.rating = Number(payload.rating);

    try {
      requireFields(form);
      await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      form.reset();
      showToast('Review submitted for verification.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      links.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initReviewsNav() {
  const track = document.getElementById('reviewsTrack');
  document.getElementById('prevReview').addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  });
  document.getElementById('nextReview').addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;
        const goal = Number(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(goal / 44));
        const timer = window.setInterval(() => {
          current = Math.min(goal, current + step);
          el.textContent = goal === 97 ? `${current}%` : `${current}+`;
          if (current >= goal) {
            window.clearInterval(timer);
          }
        }, 28);
        observer.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initReveal() {
  const revealItems = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

renderServices();
initNavbar();
initCounters();
initReviewsNav();
wireForms();
loadDynamicContent();
initReveal();
