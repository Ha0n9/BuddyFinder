import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import fs from "fs";
import path from "path";

const reportPath = path.resolve("report.docx");

const doc = new Document({ sections: [] });

const addHeading = (text, level = 1) =>
  new Paragraph({
    text,
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { after: 200 },
  });

const addParagraph = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: 24 })],
    spacing: { after: 120 },
  });

const addBullet = (text) =>
  new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

const addCodeBlock = (code) =>
  new Paragraph({
    children: [new TextRun({ text: code, font: "Consolas", size: 20 })],
    spacing: { after: 120 },
  });

const children = [];
children.push(addHeading("BuddyFinder Technical Report", 1));
children.push(addParagraph("Date: " + new Date().toLocaleDateString()));
children.push(addParagraph("This document summarizes the current BuddyFinder platform that pairs users with workout buddies, outlines the database and architecture design, and lists validation and testing considerations."));

children.push(addHeading("1. Database Overview", 2));
children.push(addParagraph("BuddyFinder relies on a relational database (MySQL/PostgreSQL compatible) managed by Spring Data JPA. The dominant entities are:"));
[
  "users – core profile, auth, subscription tier, verification and incognito state, and the new isAdmin/isSuperAdmin flags",
  "profiles – extended media (photo gallery) and fitness metadata for a user",
  "likes & matches – records swipe events and mutual matches, feeding the chat subsystem",
  "activities & activity_participants – community events and group chat rooms",
  "messages – direct chat history for a given match",
  "ratings, reports, refunds, verification_requests, support_requests – trust & safety workflows",
  "notifications – push delivered via REST + WebSocket to surface bans, approvals, matches, etc."
].forEach((line) => children.push(addBullet(line)));

children.push(addHeading("2. Normalization Notes", 2));
children.push(addParagraph("Tables are designed to satisfy 3NF: each table owns a single concept, foreign keys reference parent entities, and repeating groups are moved to their own tables. Examples:"));
children.push(addBullet("User vs Profile: demographic and auth columns live in users while large text/media fields live in profiles, reducing null-heavy columns and improving cache coherence."));
children.push(addBullet("Likes -> Match: a like row captures directionality; when mutual likes exist a match row is created. This keeps match metadata (status, compatibilityScore) separate."));
children.push(addBullet("Refund/Verification workflows: each request references both the user and the moderator that processed it, enabling auditing without duplicating moderator names."));
children.push(addParagraph("Future enhancements could move frequently filtered enums into lookup tables and add covering indexes for chat history pagination."));

children.push(addHeading("3. System Architecture", 2));
children.push(addParagraph("BuddyFinder follows a client/server model:"));
children.push(addBullet("Frontend: React 19 + Vite + Tailwind, Zustand for auth state, axios services for REST, SockJS/STOMP for live chat and notifications."));
children.push(addBullet("Backend: Spring Boot REST controllers, services (SearchService, MatchService, AdminService, etc.), JWT auth via JwtUtil, and STOMP endpoints for chat."));
children.push(addBullet("Storage: profile media stored as URLs; relational DB holds metadata, ensuring transactional consistency."));
children.push(addParagraph("The SPA authenticates via /api/auth/login, stores the JWT, and attaches it to REST/WebSocket calls. SUPER_ADMIN accounts can manage admin roles through /api/admin/accounts."));

children.push(addHeading("4. Application Flow", 2));
children.push(addParagraph("Typical user journey:"));
children.push(addBullet("Registration collects demographic data and optional geolocation; AuthService persists normalized fields and coordinates."));
children.push(addBullet("SearchService filters active, non-incognito, non-admin users while applying Haversine distance filtering when coordinates are supplied."));
children.push(addBullet("MatchService records likes and upgrades mutual likes into matches, triggering notifications and unlocking chat subscriptions."));
children.push(addBullet("Admin workflows (ban/unban, refund decisions, verification reviews, support response) live under /api/admin and require elevated roles."));

children.push(addHeading("5. Sequence Diagrams (Mermaid)", 2));
children.push(addParagraph("Copy the following snippets into mermaid.live or documentation to render sequence diagrams:"));
const registrationDiagram = "```mermaid\nsequenceDiagram\n    participant U as User\n    participant FE as React App\n    participant BE as Spring API\n    participant DB as Database\n    U->>FE: Fill registration form\n    FE->>BE: POST /api/auth/register (payload + coords)\n    BE->>DB: Insert user + profile\n    DB-->>BE: OK\n    BE-->>FE: JWT + profile data\n    FE->>FE: Store token & preload dashboard\n```";
children.push(addCodeBlock(registrationDiagram));
const chatDiagram = "```mermaid\nsequenceDiagram\n    participant FE as React ChatWindow\n    participant WS as STOMP WebSocket\n    participant API as MatchService\n    participant DB as Messages\n    FE->>WS: CONNECT + subscribe /topic/match/{id}\n    FE->>API: GET /api/chat/messages/{matchId}\n    API->>DB: Query history\n    DB-->>API: Rows\n    API-->>FE: Message list\n    FE->>WS: SEND /app/chat/{matchId} (encrypted)\n    WS-->>FE: Broadcast to both users\n    FE->>WS: SEND /app/chat/{matchId}/typing\n    WS-->>FE: Typing indicator events\n```";
children.push(addCodeBlock(chatDiagram));

children.push(addHeading("6. Testing & Quality", 2));
children.push(addParagraph("Current practices:"));
children.push(addBullet("Backend: targeted JUnit tests for services; recommendation to extend coverage to SUPER_ADMIN APIs and chat typing helpers."));
children.push(addBullet("Frontend: manual regression testing around authentication, search, and chat. Cypress/Playwright scripts are on the roadmap."));
children.push(addBullet("Build validation: `npm run build` is run locally; backend Maven build requires a configured JAVA_HOME."));

children.push(addHeading("7. Deployment & Observability", 2));
children.push(addParagraph("Recommended setup:"));
children.push(addBullet("Spring Boot packaged as a Docker image behind TLS with environment-provided DB + JWT secrets."));
children.push(addBullet("Vite build deployed to CDN or nginx container; /ws WebSocket endpoint must share origin with REST."));
children.push(addBullet("Monitoring dashboards should track REST latency, WebSocket connect/disconnect events, and admin actions for auditing."));

children.push(addParagraph("Prepared by Codex (GPT-5)."));

doc.addSection({ children });

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(reportPath, buffer);
console.log("Report generated at", reportPath);
