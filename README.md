FloorballKenya
A digital platform for Kenyan floorball — competition management, teams and players, match officials, equipment marketplace, sponsorship, and advertising.
Project status: Under development. This README describes the planned architecture and development direction; not every listed feature is necessarily implemented yet.

Table of Contents
- Overview
- Objectives
- Key Features
- Technology Stack
- Architecture
- Project Structure
- User Roles
- Database Overview
- API Architecture
- Getting Started
- Environment Variables
- Security
- Testing
- Deployment
- Development Roadmap
- Contributing
- License
- Contact
Overview
FloorballKenya is a web platform intended to support the growth and organization of floorball in Kenya. It brings competition administration, team and player information, match-official coordination, equipment commerce, sponsorship, and advertising into one system.
The planned frontend uses vanilla HTML5, CSS3, and JavaScript. The backend uses Python and FastAPI, with Supabase for authentication, PostgreSQL database services, and file storage.
Objectives
- Make Kenyan floorball competitions and results easier to manage and follow.
- Maintain records for teams, players, officials, fixtures, and statistics.
- Support tournament registration, draws, fixture generation, and standings.
- Provide a marketplace for floorball equipment and vendor-managed products.
- Help sponsors and advertisers reach the floorball community through managed campaigns.
- Give authorized users role-appropriate dashboards and tools.
Key Features
Public Website
- Home, about, contact, news, gallery, sponsor directory, and advertising information.
- Public views of competitions, teams, players, fixtures, match reports, standings, and statistics.
- Responsive layouts for desktop and mobile.
Competition Management
- Leagues, seasons, tournaments, and competition registrations.
- Tournament pots, groups, draws, and progression rules.
- Fixture generation and match scheduling.
- Match details, result submissions, approvals, and reports.
- Standings, team statistics, player statistics, and historical snapshots.
Teams, Players, and Officials
- Team profiles, player profiles, and membership records.
- Team-manager tools for rosters and competition registrations.
- Official profiles, qualifications, availability, assignments, and match reporting.
- Assignment checks for qualifications, availability, overlapping matches, and workload.
Marketplace
- Products such as sticks, blades, balls, shoes, jerseys, helmets, goalie equipment, kits, goalposts, and nets.
- Vendor dashboards for products, stock, orders, and payouts.
- Cart, checkout, order history, payment verification, commissions, and refunds.
Advertising and Sponsorship
- Advertiser accounts and campaign management.
- Creative uploads, placement selection, approval, scheduling, and expiry.
- Analytics for impressions, clicks, and click-through rate (CTR).
- Sponsor directory, sponsorship packages, and agreements.
- Clear labelling of paid or sponsored content.
Administration
- User and role management.
- Competition, marketplace, advertising, sponsor, news, and gallery moderation.
- Result approvals, audit logs, system settings, integration status, and system-health views.
Technology Stack
Area	Planned technology
Frontend	HTML5, CSS3, vanilla JavaScript
Backend	Python, FastAPI, Pydantic
Authentication	Supabase Auth
Database	PostgreSQL through Supabase
File storage	Supabase Storage
API style	REST API under /api/v1
Testing	pytest, HTTPX
Version control	Git and GitHub
Deployment automation	GitHub Actions and hosting-provider integration
Payments	M-Pesa integration planned


Architecture
The initial backend is planned as a modular monolith: one deployable backend organized into domain modules. This keeps the project maintainable without adding the complexity of microservices too early.
Typical request flow:
1. A user interacts with the frontend.
2. JavaScript sends HTTP requests to the FastAPI REST API.
3. FastAPI validates input, authenticates the user, checks permissions, and invokes the relevant service.
4. Services access PostgreSQL/Supabase.
5. Supabase Auth handles authentication, while backend authorization and PostgreSQL Row Level Security (RLS) protect data.
6. Supabase Storage holds approved media and uploaded files.
Tournament draws, fixture generation, payment verification, standings updates, and advertisement eligibility should be controlled by backend services, not trusted to frontend code.
Project Structure
This is the intended structure. Files and modules may be added as implementation progresses.
FloorballKenya/
├── frontend/
│   ├── index.html
│   ├── 404.html
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── pages/
│   │   ├── public/
│   │   ├── sports/
│   │   ├── marketplace/
│   │   ├── auth/
│   │   ├── player/
│   │   ├── team-manager/
│   │   ├── officials/
│   │   ├── vendor/
│   │   ├── advertiser/
│   │   └── admin/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── navigation.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   ├── sports.css
│   │   ├── marketplace.css
│   │   ├── advertising.css
│   │   ├── dashboard.css
│   │   ├── admin.css
│   │   ├── animations.css
│   │   └── responsive.css
│   └── js/
│       ├── config.js
│       ├── api/
│       ├── components/
│       ├── utils/
│       └── pages/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── database/
│   │   ├── dependencies/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── integrations/
│   │   ├── jobs/
│   │   └── utils/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── api/
│   │   └── security/
│   ├── migrations/
│   ├── scripts/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── policies/
│   ├── functions/
│   └── migrations/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── advertising/
│   ├── security/
│   ├── deployment/
│   └── user-guides/
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
Backend module pattern
Where appropriate, each backend domain module can contain:
- router.py — API endpoints.
- schemas.py — Pydantic request and response schemas.
- service.py — business rules and workflows.
- repository.py — data-access operations.
- models.py — database-related models, where needed.
- permissions.py — authorization rules.
User Roles
Planned roles include:
- super_admin — platform-wide administration and sensitive configuration.
- admin — day-to-day platform moderation and administration.
- competition_manager — leagues, tournaments, draws, fixtures, and competition operations.
- match_official — assigned matches, result submissions, and reports.
- team_manager — team rosters and registrations.
- player — player profile and relevant statistics.
- vendor — product catalogue, inventory, orders, and payouts.
- customer — shopping and order management.
- advertiser — campaigns, creatives, placements, and analytics.
Roles must be checked server-side. Hiding a frontend link is not sufficient authorization.
Database Overview
The planned database domains and example tables include:
Domain	Example tables
Identity and permissions	profiles, user_roles, permissions, role_permissions
Audit and settings	audit_logs, system_settings
Teams and players	teams, team_memberships, player_profiles, team_managers, venues
Leagues and seasons	leagues, seasons, league_season_entries, competition_rules
Tournaments and draws	tournaments, tournament_registrations, tournament_pots, tournament_groups, tournament_draws
Matches and officials	matches, match_official_assignments, official_profiles, official_availability, match_events, match_result_submissions, match_reports
Standings and statistics	standings, team_statistics, player_statistics, statistics_snapshots
Marketplace	vendors, products, product_images, carts, cart_items, orders, order_items
Payments	payments, commissions, vendor_payouts, refunds, payment_webhook_events
Advertising	advertisers, advertising_campaigns, advertisement_creatives, advertisement_placements, campaign_events
Sponsorship	sponsors, sponsorship_packages, sponsorship_agreements
News and gallery	news_articles, news_media, gallery_albums, gallery_media, media_approvals
Operations	deployment_records, integration_status, background_jobs, backup_records


This is a planned inventory, not a claim that every table already exists. Document actual schemas, constraints, indexes, migrations, and RLS policies as they are implemented.
API Architecture
The planned API base path is:
/api/v1
Potential endpoint groups include /auth, /users, /teams, /players, /officials, /leagues, /seasons, /tournaments, /draws, /fixtures, /matches, /standings, /statistics, /products, /orders, /payments, /vendors, /advertising, /sponsors, /gallery, /news, /notifications, and /admin.
Use consistent validation and error responses, pagination for list endpoints, and permission checks for protected operations. Exact endpoints should match the routers actually implemented.

Security
- Validate Supabase Auth tokens on protected backend routes.
- Enforce authorization in FastAPI and use PostgreSQL RLS as an additional layer.
- Validate incoming data and apply sensible request-size and rate limits.
- Keep secrets in environment variables or a managed secret store.
- Verify payment callbacks and payment status on the backend; a browser redirect alone is not proof of payment.
- Use audit logs for sensitive administrative and financial actions.
- Restrict uploads by file type, size, and authorization.
- Public advertising queries must only return approved campaigns within their scheduled active period, even if a background expiry job has not run.
- Label sponsored content clearly and distinguish it from editorial content.
- Use controlled, audited deployment integrations rather than arbitrary shell access for super-admin operations.
Testing
The planned testing stack is pytest and HTTPX. Tests should cover:
- Unit tests: business rules, calculations, validation, and service functions.
- Integration tests: database interactions and external-service adapters.
- API tests: endpoint behavior, schemas, pagination, and errors.
- Security tests: authentication, role permissions, RLS assumptions, and unauthorized access.
- Workflow tests: tournament draws, fixture generation, result approval, standings updates, orders, payment verification, and advertising schedules.
Run tests from the backend directory once the test configuration and dependencies are in place:
pytest
Deployment
The planned deployment uses a hosting provider for the frontend and backend, Supabase for managed backend services, and GitHub Actions for controlled automation.
Before production deployment:
1. Set production environment variables through the hosting provider's secret manager.
2. Configure the production frontend origin in CORS.
3. Apply and verify database migrations and RLS policies.
4. Configure HTTPS, logging, backups, and monitoring.
5. Test authentication, permissions, payment callbacks, uploads, and recovery procedures.
6. Use restricted tokens for deployment automation and keep deployment events auditable.
Document the exact hosting provider and deployment commands once they are selected and configured.
Development Roadmap
1. Foundation: configuration, database connection, health checks, and error handling.
2. Authentication and roles: Supabase Auth, profiles, permissions, and protected dashboards.
3. Core floorball records: teams, players, officials, leagues, seasons, and venues.
4. Competitions: registrations, draws, fixtures, match records, and official assignments.
5. Results and statistics: result submission and approval, standings, statistics, and reports.
6. Publishing and sponsorship: news, gallery moderation, sponsors, and advertising workflow.
7. Marketplace: vendors, products, carts, orders, payment verification, commissions, and payouts.
8. Production readiness: automated tests, security review, monitoring, backups, and deployment automation.
Contributing
Contributions and suggestions are welcome.
1. Review the current implementation before adding a new module.
2. Keep frontend code in vanilla HTML, CSS, and JavaScript unless the architecture is deliberately revised.
3. Keep critical business rules in backend services rather than duplicating them in the browser.
4. Add or update tests when behavior changes.
5. Update documentation and .env.example when configuration changes.

A license has not yet been specified. Add a LICENSE file before distributing or accepting contributions under an open-source license. Until then, do not assume the project is open source.
Contact
Project: FloorballKenya
GitHub repository: https://github.com/MASHER001/FLOO
