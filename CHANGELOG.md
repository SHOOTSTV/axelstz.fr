# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-13

### Added

- Live-ping indicator on live projects: a green pulsing dot before the status
  line in Recent Activity for any project with a live URL. Disabled under
  `motion-off` / `prefers-reduced-motion`.
- Recruiter-mode toggle in the top navbar as a subtle bordered chip, replacing
  the floating button row above the profile header.

### Changed

- Restyled the top nav to match the Steam navbar: lighter-weight uppercase
  links, brighter blue active colour, and a blue underline bar under the active
  tab.
- Reworked the mobile top bar so it wraps cleanly — the recruiter chip sits on
  its own top-right line above a full-width scrollable nav, with the horizontal
  scrollbar hidden.

### Removed

- The "Completed 100%" filter tab from the projects library.
- The redundant "Live" pill from the project page run block.

### Fixed

- Guestbook admin page no longer crashes (React error #31) when pending notes
  exist: timestamp values from the database are coerced to strings before
  rendering.

## [0.2.0] - 2026-06-20

### Added

- Steam-style achievement badges in the profile sidebar: four hand-authored,
  feature-truthful badges (Shipper, Full-Stack, Open Source, Guestbook Host)
  with a light hover/focus tooltip showing name, description and unlock year.
- Live "Committed" badge derived from the real total commit count across project
  repos (`fetchTotalCommits`), tiered at 100/500/1000 and shown only when the
  count is greater than zero.

### Changed

- Badge tiles redesigned with a glossy, hue-consistent gradient; tooltip sits
  above the tile with a downward notch and is keyboard-accessible via
  `:focus-visible` (a mouse click no longer pins it). Respects reduced motion.
- Tidied `AGENTS.md` heading spacing.

### Removed

- Secondary "Get in touch" link from the About section (the primary contact CTA
  remains in the profile header).
- The always-empty "Reviews" count row from the sidebar.

### Fixed

- OG image route: escaped literal quotes in the code snippet to resolve a
  `react/no-unescaped-entities` lint error.
