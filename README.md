# Gharpayy Lead Management CRM - MVP

## Overview
This repository contains the Minimum Viable Product (MVP) for the Gharpayy Lead Management System. It is designed to capture leads, automatically assign ownership to agents using an intelligent round-robin algorithm, manage a sales pipeline, enforce a 5-minute response SLA, and schedule real-world property visits.

This project was built to strictly adhere to the **10 Non-Negotiable operational laws** outlined in the assignment brief.

## Features & Assignment Requirements Met
- **Zero Lead Loss Capture:** Webhook-ready `/api/leads` endpoint that captures leads from any source and instantly assigns an agent.
- **Automated Round-Robin Assignment:** Distributes incoming leads fairly among available agents to balance workload.
- **5-Minute SLA Tracking:** Visually tracks and pulses red for leads that have not received an initial response message within 5 minutes.
- **Complete Conversation Ledger:** Immutable logging of all agent text replies and system events (status changes, visit schedules).
- **Pipeline Kanban Board:** Visual interface for moving leads intuitively through stages (`NEW` -> `CONTACTED` -> `REQUIREMENT_COLLECTED` -> ... -> `BOOKED`).
- **Visit Scheduling & Outcomes:** End-to-end flow to schedule property visits and log the results (`PENDING`, `BOOKED`, `CONSIDERING`, `NOT_INTERESTED`).
- **Analytical Dashboard:** Real-time visibility into total business volume, stage breakdowns, scheduled visits, and SLA infractions.
- **Automated Follow-ups:** Backend endpoint to simulate cron-jobs that flag cold leads after 1, 3, and 7 days of inactivity.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Premium Glassmorphism UI)
- **Database**: SQLite (Local, zero-configuration)
- **ORM**: Prisma

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the Database:**
   The project uses a local SQLite database, requiring zero external setup or credentials.
   ```bash
   npx prisma db push
   ```

3. **Seed the Database with Initial Agents:**
   To safely test the Round-Robin assignment logic, you must populate the database with default agents.
   ```bash
   node prisma/seed.js
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Test the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   
   *Tip: To simulate an external incoming lead (e.g. from WhatsApp or a Website), navigate to the **Mock Form** via the sidebar and submit the form. The lead will instantly appear in the Dashboard and Pipeline assigned to a seeded agent!*

## Architecture Documentation
For a detailed breakdown of the system architecture, scaling decisions, and database schema, please refer to the attached `architecture.md` document provided separately alongside this repository.
