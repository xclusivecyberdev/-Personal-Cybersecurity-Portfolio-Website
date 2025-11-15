# Cybersecurity Portfolio Website

A professional portfolio website showcasing cybersecurity expertise, projects, and technical writeups. Built with Jekyll and deployed on GitHub Pages.

![Portfolio Preview](https://img.shields.io/badge/status-live-success)
![Jekyll](https://img.shields.io/badge/Jekyll-4.3.2-red)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### 🎨 Design
- **Cybersecurity-themed UI** with Matrix rain background effect
- **Fully responsive** design for all devices
- **Dark mode** optimized for developer/security professional aesthetic
- **Modern animations** and smooth transitions

### 🔒 Security Features
- **Security headers** implemented (CSP, HSTS, X-Frame-Options, etc.)
- **Input validation** and sanitization on contact form
- **Honeypot field** for bot detection
- **Rate limiting** on form submissions
- **XSS protection** with input escaping
- **CSRF protection** measures
- **Security.txt** for responsible disclosure (RFC 9116 compliant)

### 📄 Pages
- **Home** - Introduction and overview
- **About** - Professional background and certifications
- **Projects** - Showcase of security tools and research
- **Blog** - Technical writeups and CTF solutions
- **Contact** - Secure contact form with validation

### ⚡ Performance
- **Optimized assets** for fast loading
- **Lazy loading** for images and animations
- **Minified CSS/JS** in production
- **CDN integration** for external resources

## Quick Start

### Prerequisites
- Ruby 3.0+
- Jekyll 4.3+
- Bundler

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/your-portfolio-repo.git
cd your-portfolio-repo

# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# Open browser to http://localhost:4000
```

### Configuration

Edit `_config.yml` to customize:

```yaml
title: Your Name
description: Your portfolio description
author: Your Name
email: your.email@example.com

# Social links
github_username: your-github-username
linkedin_username: your-linkedin-username
twitter_username: your-twitter-username
```

## Project Structure

```
.
├── _config.yml              # Jekyll configuration
├── _data/
│   └── certifications.yml   # Certification data
├── _layouts/
│   ├── default.html         # Base layout
│   ├── post.html           # Blog post layout
│   └── project.html        # Project layout
├── _posts/                  # Blog posts
│   └── YYYY-MM-DD-title.md
├── _projects/              # Project pages
│   └── project-name.md
├── assets/
│   ├── css/
│   │   └── main.css        # Main stylesheet
│   └── js/
│       └── main.js         # JavaScript functions
├── .well-known/
│   └── security.txt        # Security disclosure policy
├── index.html              # Homepage
├── about.html              # About page
├── projects.html           # Projects listing
├── blog.html               # Blog listing
├── contact.html            # Contact page
└── README.md              # This file
```

## Adding Content

### Adding a Blog Post

Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "Your Post Title"
date: 2024-01-15 10:00:00 -0000
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
author: Your Name
---

Your content here...
```

### Adding a Project

Create a new file in `_projects/` with the format `project-name.md`:

```markdown
---
layout: project
title: Project Title
description: Short description
technologies:
  - Python
  - Docker
  - etc
icon: icon-name
github_url: https://github.com/username/repo
demo_url: https://demo.example.com
---

Detailed project description...
```

### Adding Certifications

Edit `_data/certifications.yml`:

```yaml
- name: OSCP
  full_name: Offensive Security Certified Professional
  issuer: Offensive Security
  icon: fas fa-shield-halved
  year: 2023
```

## Deployment

### GitHub Pages (Automatic)

1. Push to the `main` branch (or configured branch)
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://username.github.io/repo-name/`

### Manual Deployment

```bash
# Build the site
JEKYLL_ENV=production bundle exec jekyll build

# Deploy the _site folder to your hosting provider
```

## Security

### Reporting Vulnerabilities

Please report security vulnerabilities via:
- Email: your.email@example.com
- See `.well-known/security.txt` for full policy

### Security Features Implemented

- ✅ Content Security Policy (CSP)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer Policy
- ✅ Permissions Policy
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Secure form handling

## Customization

### Changing Colors

Edit `assets/css/main.css` and modify CSS variables:

```css
:root {
    --primary-color: #00ff41;
    --secondary-color: #0f0;
    --accent-color: #00d4ff;
    /* ... */
}
```

### Modifying Matrix Effect

Edit `assets/js/main.js` and adjust `MatrixRain` class parameters.

### Adding New Pages

1. Create new HTML file in root directory
2. Add front matter with `layout: default`
3. Add to navigation in `_layouts/default.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jekyll](https://jekyllrb.com/) - Static site generator
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography
- Matrix rain effect inspired by classic hacker aesthetics

## Contact

- Website: [your-portfolio-site.github.io](https://your-portfolio-site.github.io)
- Email: your.email@example.com
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin-username)

---

Built with ❤️ and ☕ by XclusiveCyberDev

**Note**: Remember to customize all placeholder content (your-username, your-email, etc.) with your actual information!
