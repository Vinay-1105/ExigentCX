# ExigentCX App Development Prompt: Expert & Company Portals (Flutter Clone)

This document serves as a highly detailed, comprehensive prompt for an Agentic AI to build a pixel-perfect, feature-complete Flutter app clone of the **ExigentCX** platform. The app must implement the identical visual aesthetics, user flows, state changes, buttons, and responsive layout structures found on the ExigentCX website.

---

## 1. Visual Identity & Design System

The app must adopt a premium, clean, executive-level aesthetic using a custom design system with rich gradients, micro-animations, and smooth transitions.

### 1.1 Color Palette
*   **Primary Brand Color (Forest Green):** `Color(0xFF134E40)`
*   **Accent Brand Color (Teal/Mint):** `Color(0xFF0EB59A)`
*   **Main Background Color:** `Color(0xFFF4F7F5)`
*   **Card Background Color:** `Color(0xFFFFFFFF)` or `Color(0xFFFAFBF9)`
*   **Soft Mint Highlights:** `Color(0xFFF0FDF4)`
*   **Alert/Warning Soft Yellow:** `Color(0xFFFEF3C7)` (Text: `Color(0xFFD97706)`)
*   **Danger/Urgent Soft Red:** `Color(0xFFFFF1F2)` (Text: `Color(0xFFF43F5E)`)
*   **Neutral Dark Gray (Text):** `Color(0xFF1E293B)` (Slate 800) or `Color(0xFF0F172A)` (Slate 900)
*   **Neutral Light Gray (Borders):** `Color(0xFFE2E8F0)`

### 1.2 Typography & Shadows
*   **Hero Headers / Serif Text:** Use a premium Serif font (e.g., `Georgia` or Google Fonts `Lora` / `Merriweather`) for main welcome greetings and headline titles.
*   **Body & UI Text:** Clean Sans-Serif font (e.g., Google Fonts `Inter`, `Outfit`, or `Roboto`).
*   **Shadows:** Card shadows must be extremely soft: `box-shadow: 0 4px 20px rgba(0,0,0,0.04)` for idle cards, and `0 20px 48px rgba(19,78,64,0.12)` for hovered/active elements.
*   **Formal Card Border:** Custom widgets representing containers must display a subtle gradient border matching the primary to accent transition (`0xFF134E40` to `0xFF0EB59A`) on hover/interaction.

### 1.3 Adaptive Layout Support
*   **Sidebar Navigation:** Used for Large Screen Widths (Tablets/Web/Desktops). A collapsible sidebar that animates from `260dp` (expanded) to `68dp` (collapsed).
*   **Drawer Navigation:** Used for Mobile Screen Widths. Slide-out drawer containing identical menu items.
*   **Collapsible Transitions:** Nav items must transition from Icon + Text (expanded) to Icon only (collapsed) using smooth fade-in/out animations.

---

## 2. Authentication & Entrance Guard

*   **Role-Based Entrance:** The login flow separates **Expert Sign-In** and **Company Sign-In**. 
*   **State parameters:** The sign-in page must accept a role parameter (e.g., `role=expert` or `role=company`) and dynamically swap theme accents and copy text based on the active role.
*   **OTP / Magic Link Support:** Standard sign-in accepts Email with options for OTP (One-Time Password) or Magic Link authentication.
*   **Local Storage Session Guard:** If a session is present (stored via Flutter Secure Storage or Shared Preferences), route the user directly to their respective portal (`/expert-dashboard` or `/company-dashboard`).

### 2.1 Post-Login Routing & Portal Segregation (Anti-Hallucination Guard)
To prevent navigation leaks and interface hallucinations, the app must strictly divide the post-authentication view hierarchies:

1.  **Immediate Routing Decision:** Upon successful login or session recovery:
    *   Query the user profile from Supabase/database to confirm their role.
    *   **If Role = `expert`:** Route directly to the **Expert Shell Layout** (`/expert-dashboard`).
    *   **If Role = `company`:** Route directly to the **Company Shell Layout** (`/company-dashboard`).
2.  **Separate Shell Layout Views:**
    *   **Expert Shell Layout:** A wrapper widget that renders the **Expert Collapsible Navigation Menu** (Sidebar for tablet/desktop, Drawer for mobile) and the **Expert Global Header**. The main viewport child of this layout is the `ExpertDashboard` page. This entire layout is ONLY visible when logged in as an expert.
    *   **Company Shell Layout:** A wrapper widget that renders the **Company Collapsible Navigation Menu** (Sidebar for tablet/desktop, Drawer for mobile) and the **Company Global Header**. The main viewport child of this layout is the `CompanyDashboard` page. This entire layout is ONLY visible when logged in as a company.
3.  **Strict Isolation Guard:**
    *   No shared sidebar widget can cross roles. The widgets for `Expert Collapsible Sidebar` and `Company Collapsible Sidebar` are completely separate components.
    *   Routes for company features (e.g., creating requirements, filtering experts, payment releases) must be protected by a route guard that blocks access if the authenticated role is `expert`.
    *   Routes for expert features (e.g., browsing opportunities, submitting deliverables, withdrawing earnings) must block access if the authenticated role is `company`.

---

## 3. PORTAL A: EXPERT INTERFACE (Logged-in Expert)

The Expert Portal is structured around the `ExpertDashboard` and its connected sub-views. Every button, menu, card, and interaction described below must be fully implemented.

### 3.1 Expert Collapsible Sidebar / Drawer Navigation Menu
The navigation side menu includes the following options. Selecting an option updates the main viewport and highlights the active item:
1.  **Dashboard:** The main landing workspace (`/expert-dashboard`). Shows active KPI stats, opportunities, connection requests, and today's schedule.
2.  **Opportunities:** (`/expert-opportunities`). Browsing matched requirements posted by companies. Shows a badge indicating the number of new opportunities (e.g., `3`).
3.  **My Engagements:** (`/expert-engagements`). Project list showing contract status, milestones, deliverable submissions, and message workspaces.
4.  **Contracts:** (`/expert-contracts`). Digital sign-off panel for legal NDAs and project agreements. Shows a badge for pending actions (e.g., `1 pending`).
5.  **Earnings:** (`/expert-earnings`). Withdrawals, milestone payments pending clearance, and transaction history.
6.  **Profile Builder:** (`/expert-profile`). Profile detail builder (Basic info, Experience, Key Skills, Rate Card, Resume Upload).
7.  **Messages:** (`/messages`). Inbox for direct client chat.
8.  **Meetings:** (`/meetings`). Calendar integration showing scheduled video call slots.
9.  **Settings:** (`/expert-settings`). Pinned to the bottom, managing notification channels and security settings.
10. **Sign Out:** Triggering session destruction and redirecting to the sign-in screen.

### 3.2 Expert Global Header
Fixed at the top of the portal. Contains:
*   **Mobile Menu Toggle:** Visible only on mobile screens to toggle the navigation drawer.
*   **Search Bar:** Text field with left search icon. Focus changes borders to Teal (`0xFF0EB59A`) with a subtle glowing ring. Placeholder: *"Search opportunities, companies, skills..."*
*   **Browse Roles Button:** Pill button with `Briefcase` icon. Hover triggers a gradient slide overlay. Redirects to `/expert-opportunities`.
*   **Quick-Nav Grid (9-Dot Button):** Toggles a dropdown menu showing a compact matrix of navigations with activity badges (e.g., *Opportunities - 3 new*, *Earnings - ₹3.5L pending*). Clicking outside closes the dropdown.
*   **Notification Bell:** Animating shake vector. Shows red badge with count of unread items. Toggles a right-side drawer slide-out listing notifications (e.g., *"New Role Match"*, *"Milestone Approved"*). Clicking "Mark all read" updates all unread states to read.
*   **Avatar with Online Status:** Circular profile image (or initials if missing) with a pulsing green indicator dot in the bottom-right corner.

### 3.3 Expert Hero Welcome Banner
*   **Design:** Gradient background starting from Soft Mint (`0xFFF0FDF4`) blending into Light Grey.
*   **Verified Star Badge:** Group of 5 amber stars followed by a badge: *"Verified Expert · Top 5%"*.
*   **Dynamic Greeting:** *"Welcome, [Expert Name]."* in Georgia serif.
*   **Summary Subtitle:** Text detailing pending items: *"You have 3 pending actions and 3 new role matches waiting. Your profile was viewed 12 times today."*
*   **Quick Context Badges:** Scrollable list of horizontal capsules indicating events:
    *   `Clock` icon: *"3 meetings today"* (Teal accent background)
    *   `MessageSquare` icon: *"3 unread messages"* (Blue accent background)
    *   `Target` icon: *"1 deadline this week"* (Amber accent background)
    *   `Eye` icon: *"12 profile views today"* (Emerald accent background)
*   **Availability Toggle Switch:** Custom toggle button. Displays `🟢 Available for New Projects` (Green border/Soft Green bg) or `⏸ Not Available` (Gray border/Gray bg). Tapping updates the database profile state and displays a confirmation toast.

### 3.4 Expert KPI Dashboard Cards
A grid of 4 interactive cards with animated numeric counters:
1.  **Active Engagements:** Displays count (e.g., `2`). Trend indicator: `+1 this month` (Green background pill).
2.  **Proposals Sent:** Displays count (e.g., `8`). Trend indicator: `3 pending review` (Forest Green background pill).
3.  **Total Earned:** Displays amount (e.g., `₹12.4L`). Trend: `+₹3.5L this month` (Amber background pill).
4.  **Profile Views:** Displays count (e.g., `234`). Trend: `+48 this week` (Purple background pill).

### 3.5 Today's Schedule Timeline
*   **Design:** List of horizontal cards displaying calendar items:
    *   Event 1: *11:00 AM - Weekly Sync & Alignment - Acme Corp (30 mins)* - Color Accent: Green.
    *   Event 2: *02:30 PM - Financial Model Review - TechScale Ventures (45 mins)* - Color Accent: Forest Green.
    *   Event 3: *04:00 PM - Q2 Strategy Briefing - HealthTech Startup (60 mins)* - Color Accent: Amber.
*   **Action:** Hovering/tapping an event shows a "Join Call" trigger redirecting to the chat/meeting room. Includes a "+ Schedule Meeting" dashed boundary card at the end of the list.

### 3.6 Matched Opportunities Carousel
*   **Interface:** Slide-out list of potential jobs. Displays a maximum of 2 cards per view (on tablets/desktop) or 1 card (on mobile) with left/right navigation chevrons.
*   **Carousel Indicators:** Dot indicators at the bottom indicating scroll index.
*   **Autoplay Mode:** Automatically rotates cards every `3.5s` with a visible linear progress bar at the bottom showing time elapsed until the next slide. Hovering/touching the carousel pauses progress and shows a small *"Paused"* label.
*   **Opportunity Card Structure:**
    *   **Header:** Match Percentage Badge (e.g., `96% Match` on Teal gradient background), Urgency Flag (e.g., `High` or `Immediate` in soft red/amber), and `NEW` label if posted recently.
    *   **Brand Icon:** Center-aligned company initial logo inside a modern gradient box.
    *   **Role Info:** Bold role title (e.g., *"Fractional CFO"*), company name, size/stage (e.g., *"Series A · 50-200 employees"*), and duration (e.g., *"6 months"*).
    *   **Financial & Commitment Table:** A centered, bordered table block showing:
        *   *Budget:* `₹2L - ₹3L/mo`
        *   *Commitment:* `20 hrs/wk`
        *   *Location:* `Remote`
    *   **Skills Tags:** Tiny horizontal tags representing required skills (e.g., *Financial Modeling*, *Fundraising*).
    *   **Footer Statistics:** Active applicant counter + date posted (e.g., *"4 applied · Posted 2d ago"*).
    *   **CTAs:** Two full-width row buttons: `Apply Now` (Forest Green, triggers proposal modal) and `Details` (Bordered text, opens opportunity spec page).

### 3.7 Expert Pending Actions Sidebar
*   **Design:** List of priority actions featuring urgency badges and customized CTAs:
    *   *Action 1 (Urgent):* "Submit Milestone Deliverable" for *Series B Funding Strategy*. Type: `SUBMIT` (Amber banner). CTA: `Submit Deliverable`.
    *   *Action 2 (Critical):* "Review & Sign Contract" for *Financial Due Diligence*. Type: `SIGN` (Red banner). CTA: `Sign Contract`.
    *   *Action 3 (Info):* "New Message from Acme Corp" for *Series B Funding Strategy*. Type: `MESSAGE` (Blue banner). CTA: `Open Message`.

### 3.8 Connection Requests Container
*   **Design:** Action box triggered when a company requests a connection.
*   **Details:** Displays Company Name, logo initial, and text *"Wants to connect with you"*.
*   **Actions:** Side-by-side buttons: `Accept` (Forest Green with check icon, adds company to network list, triggers success banner) and `Decline` (Light grey, removes request).

### 3.9 My Engagements Workspace (Active Workspace)
*   **View:** Displays list of active projects. Selecting a project opens a tabbed workspace:
    *   **Milestones Tab:** Shows milestone blocks with progress percentages (e.g., `Investor Deck - 65%`). Includes an `Upload Deliverable` button (triggers file selector) and `Submit for Approval` trigger.
    *   **Messages Tab:** Real-time text interface with the company admin. Shows message status (Sent, Read) and attachments.
    *   **Contracts Tab:** Displays active NDA documents, project schedules, and an option to view/download signed PDF copies.

### 3.10 Earnings Dashboard Screen
*   **KPI Blocks:**
    *   *Total Earned:* Cumulative earnings.
    *   *Pending Clearance:* Funds locked in escrow for milestones submitted but not yet released.
    *   *Available for Withdrawal:* Released funds.
*   **Withdrawal Action:** `Withdraw Funds` button. Opens a bottom sheet inputting withdrawal amount, bank selection, and showing a success animation on complete.
*   **Transactions Table:** List of payments showing date, client, milestone title, amount, and status (`Success`, `Pending`, `Escrowed`).

### 3.11 Profile Builder Wizard
*   A multi-step setup flow for experts to configure their profile:
    *   *Step 1: General Info.* Name, Title, Headline, Years of Experience, Profile Photo.
    *   *Step 2: Domain & Services.* Primary Domain dropdown, list of specific services offered (e.g., *Fractional CFO*, *Fundraising Advisory*).
    *   *Step 3: Skills.* Multi-select chips for technical skills.
    *   *Step 4: Rate Card.* Target hourly rate and minimum monthly retainer fee.
    *   *Step 5: Attachments.* Resume upload and LinkedIn profile link.

---

## 4. PORTAL B: COMPANY INTERFACE (Logged-in Company)

The Company Portal handles posting business challenges, discovering top experts, and managing milestones, escrow payments, and contracts.

### 4.1 Company Collapsible Sidebar / Drawer Navigation Menu
1.  **Dashboard:** Main portal homepage (`/company-dashboard`). Displays KPIs, recommended experts, active engagements, and pending tasks.
2.  **My Requirements:** (`/requirements`). Listing created requirements with candidate matches and options to edit/create drafts.
3.  **Experts:** (`/experts`). Talent discovery workspace with search filters.
4.  **Payments:** (`/payments`). Escrow management, deposit options, and billing invoices.
5.  **Analytics:** (`/analytics`). Budget spending, SLA adherence, and milestone schedules.
6.  **Messages:** (`/messages`). Direct message threads with active and prospective experts.
7.  **Scheduled Meetings:** (`/meetings`). Booked consultant sync sessions.
8.  **Settings:** Company details, team access settings, and payment details.
9.  **Sign Out:** Clears company session and returns to login.

### 4.2 Company Global Header
*   Identical in structure to the Expert header but customized for Company views:
    *   **Primary CTA:** `Post Requirement` button with a `Plus` icon in Forest Green. Redirects to `/requirements/create`.
    *   **Quick-Nav Grid (9-Dot):** Compact matrix featuring options: *Requirements (2 active)*, *Find Experts (5 matched)*, *Contracts (1 pending)*, *Payments (₹4.2L spent)*.
    *   **Notification Bell & Account Menu:** Toggles notification pane and company profile/billing preferences.

### 4.3 Company Welcome Banner
*   **Design:** Light gradient mint layout matching Portal A.
*   **Greeting:** *"Welcome, [Company Name]"* in Georgia Serif.
*   **Quick Summary Text:** *"You have 3 pending actions and 3 expert matches today."*
*   **Header Buttons:** `Post a Role` (Forest green with plus icon) and `Download Report` (White border button with trending-up arrow icon).

### 4.4 Company KPI Dashboard Cards
A grid of 4 dashboard analytics cards:
1.  **Active Engagements:** Count of active consultants. Trend: `+1 this month` (Teal accent).
2.  **Experts Shortlisted:** Count of saved/shortlisted expert profiles. Trend: `4 new this week` (Purple accent).
3.  **Total Spend:** Sum of released and escrowed funds (e.g., `₹4.2L`). Trend: `On budget` (Blue accent).
4.  **Milestones Due:** Count of upcoming deliveries. Trend: `Next in 3 days` (Amber accent).

### 4.5 Recommended Experts Carousel
*   **Design:** Slide carousel with linear autoplay progress indicator, pause-on-hover, and manual nav arrows.
*   **Expert Card Details:**
    *   **Header:** Matching Compatibility Percentage (e.g., `98% MATCH` on brand gradient background), rating stars (e.g., `5.0` or `4.9` with gold stars).
    *   **Avatar:** Round-cornered avatar image with a green active indicator.
    *   **Expert Info:** Name, Headline (e.g., *"Ex-CMO at TechCorp"*), Rate card retainer details (e.g., *"₹1.5L - ₹2.5L/mo"*), Availability (e.g., *"20 hrs/week"*), and Location.
    *   **Actions Strip:** Horizontal row containing three buttons:
        *   `View Profile` (Forest Green, routes to `/experts/:expertId`).
        *   `Invite` (Bordered text, opens requirement invite dialog).
        *   `Favorite Heart Icon` (Toggles state between filled rose red and outlined grey, animating scale bounce on toggle).

### 4.6 Active Engagements Grid/Table
*   **View:** Displays list of active projects in a clean tabular view:
    *   **Project Name & Expert:** Project title + expert name and avatar.
    *   **Current Milestone Status:** Active milestone badge (e.g., *"Financial Model Draft"* with status color coding).
    *   **Progress Bar:** Linear progress bar with a moving gradient highlight animation displaying current completion percentage.
    *   **Deadline:** Date accompanied by a clock icon.
    *   **Risk Level:** Color-coded status badge: `Low` (Green), `Medium` (Amber), `High` (Red).
    *   **Actions Row:** Quick-action buttons:
        *   `View Workspace` (Eye icon, opens project workspace).
        *   `Message` (Chat icon, opens direct thread).
        *   `Approve Milestone` (CheckCircle icon, releases escrow).
        *   `Invoices` (FileText icon, opens payment history).

### 4.7 Company Pending Actions Panel
*   **Design:** Urgent tasks requiring action from company admins:
    *   *Action 1:* "Approve Milestone: Phase 1" for *Marketing Strategy*. Type: `APPROVAL`. Action: Release escrow.
    *   *Action 2:* "Review New Candidates" for *Interim CFO*. Type: `REVIEW`. Action: Open Discovery dashboard.
    *   *Action 3:* "Sign Contract" for *Tech Advisory*. Type: `ACTION`. Action: Launch signature panel.
    *   *Action 4:* "Escrow Pending" for *Project Scoping*. Type: `ESCROW`. Action: Add funds.

### 4.8 "Create Requirement" Wizard (Step-by-Step)
A multi-step wizard to create and post a project requirement. Each step must validate mandatory fields before enabling navigation to the next:

*   **Step 1: Engagement Type**
    *   Select one model card:
        *   *Fractional* (Part-time senior leadership, e.g., CFO 15hrs/wk)
        *   *Interim* (Full-time replacement for a fixed period)
        *   *Advisory* (Strategic board-level guidance)
        *   *Project* (Defined scope with clear deliverables)
    *   *Selection State:* Highlights border and adds a Teal checkmark in the corner.

*   **Step 2: Business Challenge**
    *   Multi-select grid of problem tags: *Fundraising*, *Go-to-Market*, *Scaling Operations*, *Technology*, *People & Culture*, *Governance*, *Revenue Growth*, *Product Strategy*.
    *   Selecting a tag adds a checkmark.
    *   Includes a text area box: *"Describe your challenge in your own words (optional)"*.

*   **Step 3: Skills & Experience**
    *   *Text Field:* Role Title (Mandatory, e.g., *"Interim CFO"*).
    *   *Skills Selection:* Wrap list of tag chips. Tap to select (highlighted in solid green with a check icon).
    *   *Experience Retainer:* Horizontal selector for experience bracket (`10-13 yrs`, `14-17 yrs`, `18-20 yrs`, `20+ yrs`).
    *   *Industries Preferred:* Clickable tag chips for target industries (e.g., *Fintech*, *SaaS*, *Healthcare*).

*   **Step 4: Budget & Logistics**
    *   *Monthly Budget Range:* Input fields for Minimum (₹) and Maximum (₹) budget per month.
    *   *Duration Selector:* Option pills (e.g., *1 month*, *3 months*, *6 months*, *Ongoing*).
    *   *Weekly Commitment:* Option pills (e.g., *8 hrs/wk*, *15 hrs/wk*, *40 hrs/wk*).
    *   *Urgency Selector:* Button options (`Immediate (ASAP)` or `Planned (30-60 days)`).
    *   *Location Preference:* Pills (`Remote`, `Hybrid`, `In Office - Bangalore`, etc.).

*   **Step 5: Review & Submit**
    *   Displays a structured card summary of all selected values across steps 1 to 4.
    *   *Action Buttons:* `Save Draft` (grey border) and `Post Requirement` (Forest Green, launches creation animation, sets state to active, redirects to requirements index).

---

## 5. Technical Requirements & Architecture

1.  **State Management:** Implement using a standard Flutter state management library (e.g., `Provider`, `Riverpod`, or `Bloc`).
2.  **Offline & Mock Mode Fallback:** If the network or Supabase environment is unavailable, the app must gracefully fall back to local JSON/Mock data stores (`demo_company = true` or `demo_expert = true` stored in shared preferences) to allow complete interface interaction without crashes.
3.  **Animations:** Implement the following animations:
    *   *Animated Counter:* Numbers in KPI cards animate on mount (incrementing from 0 to the target value).
    *   *Carousel Transitions:* Slide transitions with direction coordinates when switching items.
    *   *Hero Pulsing Stars:* Stars in the header welcome banner scale in sequence with a spring animation.
    *   *Collapsible Sidebar:* Width changes animate smoothly using `AnimatedContainer` or custom controller transition durations.
4.  **Supabase Client Integration:** Setup authentication listeners and PostgreSQL tables matching `company_requirements`, `expert_profiles`, `engagements`, and `notifications`.
