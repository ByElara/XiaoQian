# XiaoQian | Travel Planning Experience

### An Embedded Travel Planning Experience for Douyin

**Discover places. Plan journeys. Record experiences. Share meaningful trips.**

发现旅行灵感，规划完整行程，记录真实体验，分享旅行攻略。

> XiaoQian is an independent product design concept exploring how travel discovery, itinerary planning, travel records, and content sharing can be connected within a social content platform.

小牵是一个独立产品设计项目，探索如何将旅行内容发现、行程规划、旅行记录和攻略分享融合到社交内容平台中。

---

## 01. Project Overview | 项目概述

**Product Name:** XiaoQian (小牵)

**Product Type:** Travel Planning & Social Content Experience

**Platform Concept:** Douyin (TikTok China)

**Project Version:** V1.1

**Project Role:** Independent Product Design Project

**Project Scope:** Product Strategy · Product Architecture · UX Design · Interaction Design · Business Logic

### Product Vision

Transform travel inspiration into actionable itineraries, and turn personal travel experiences into reusable and shareable travel guides.

将碎片化的旅行灵感转化为可执行的行程规划，再将真实旅行体验沉淀为可复用、可分享的旅行攻略。

---

## 02. Product Goals | 产品目标

XiaoQian aims to connect four important stages of the travel experience:

1. **Discover** — Explore travel destinations and itinerary inspiration through content discovery.
2. **Plan** — Create structured itineraries with destinations, maps, schedules, and transportation.
3. **Record** — Capture travel experiences, photos, notes, and related commercial links.
4. **Share** — Transform completed trips into structured travel guides or individual destination reviews.

小牵希望打通旅行发现、行程规划、旅行记录和内容分享四个阶段，形成完整的旅行体验闭环。

---

## 03. Product Architecture | 产品功能架构

### 3.1 Travel Discovery | 旅行发现

- An itinerary channel integrated into the Douyin-style recommendation experience.
- A unified entry through the travel channel and life services.
- Travel content cards combining attractive imagery, route information, and itinerary highlights.
- Access to personal itinerary management.

通过内容推荐与行程频道，让用户从旅行灵感自然进入行程规划。

### 3.2 Itinerary Creation & Editing | 行程创建与编辑

- Itinerary title, destination, departure date, and trip duration.
- Interactive route map and multi-day itinerary planning.
- Timeline-based destination management.
- Estimated arrival times, duration, and expenses.
- Transportation options between destinations.
- Long-press drag-and-drop destination reordering.
- Automatic route recalculation after itinerary changes.

采用地图与时间轴结合的编辑方式，让用户直观地规划每日路线和地点顺序。

### 3.3 Personal Itinerary Management | 我的行程

A unified management interface for:

- All itineraries
- Upcoming trips
- Ongoing trips
- Completed trips
- Planning drafts

Users can edit, continue recording, review, publish, or manage their itineraries according to their current status.

### 3.4 Travel Records | 旅行记录

Travel records support two forms:

- **Trip-level records:** Overall experiences, photos, and memories of an entire journey.
- **Location-based records:** Experiences, notes, and photos associated with individual destinations.

Key capabilities:

- Add records before or during a trip.
- Manage record visibility: Public, Friends Only, or Private.
- Save unfinished records as drafts.
- Attach multiple group-buying, ticket, or other commercial links to a travel record.

旅行记录既可以属于整段旅程，也可以关联具体地点，并由用户控制每条内容的可见范围。

### 3.5 Content Publishing | 内容发布

Two independent publishing formats:

**A. Complete Travel Guide**

- Route maps and daily itineraries.
- Destination information and transportation.
- Selected travel records and photos.
- Related commercial links.

**B. Individual Destination Review**

- A focused review of one destination.
- Personal experience, photos, and related commercial links.
- No requirement to publish the entire itinerary.

The system collects eligible travel records automatically for review. Users can select, remove, and reorder content before publishing.

完整行程攻略与单地点测评是两种独立的发布形式。私人记录不会被自动全部公开，用户始终拥有内容选择权。

---

## 04. Key UX & Interaction Design | 核心交互设计

### 4.1 Timeline-based Itinerary Editing

A map-oriented planning interface combined with a chronological destination timeline.

- Drag-and-drop destination reordering.
- Automatic recalculation of affected routes.
- Independent transportation selection for each route segment.
- Preservation of destination records and settings when itinerary order changes.

### 4.2 Privacy-aware Travel Records

Privacy settings apply to individual notes and records rather than automatically exposing the entire itinerary.

### 4.3 Flexible Trip Status Management

Users can add travel records before starting a trip and directly mark a trip as completed when documenting a journey retrospectively.

Publishing requires a completed itinerary.

### 4.4 Draft & Version Management

Different draft types are managed independently:

- Private itinerary planning drafts.
- Itinerary editing drafts.
- Travel record drafts.
- Douyin native content publishing drafts.

Published works remain independent snapshots and do not automatically synchronize with later changes to the private itinerary.

### 4.5 Native Service Integration

Destination details, group-buying, ticket purchases, payment, refunds, and order verification are designed around existing Douyin native service capabilities.

XiaoQian focuses on itinerary experiences and does not duplicate native transaction management.

---

## 05. Product Innovation | 产品创新

**1. Connected Travel Experience**

Connect travel discovery, planning, recording, and publishing within one continuous experience.

**2. Structured Travel Content**

Turn fragmented travel notes and destination experiences into reusable itinerary content.

**3. Flexible Content Publishing**

Support both complete travel guides and individual destination reviews without forcing users to disclose their entire trip.

**4. Privacy by Design**

Give users granular control over which records and experiences become public.

**5. Native Ecosystem Reuse**

Reuse existing platform capabilities instead of rebuilding destination information, commercial transactions, and order management.

---

## 06. Business Value | 商业价值

The product concept explores opportunities to connect travel content with local services.

Potential value areas include:

- Improved discovery of travel-related local services.
- Contextual group-buying and ticket entry points.
- More useful destination and itinerary content.
- Stronger connections between content discovery and service conversion.
- Reusable travel experiences that enrich the content ecosystem.

---

## 07. Design Principles | 产品设计原则

- Native Experience First — Respect the host platform's interaction patterns.
- User Control First — Preserve user ownership and privacy.
- Consistent Information Architecture — Keep itinerary, records, and publishing logically connected.
- Reliable Interaction — Handle editing, deletion, drafts, and publishing failures carefully.
- Minimal Duplication — Reuse existing native services wherever possible.

---

## 08. Project Status | 项目状态

**Current Version:** V1.1

**Stage:** Product Planning & Interaction Design

Project work includes:

- Product requirements and functional architecture.
- Detailed interaction and business rules.
- High-fidelity interface design concepts.
- Multi-state itinerary management.
- Travel record and publishing workflows.
- Exception handling and interaction specifications.

This repository documents an independent product design concept. It is not an official Douyin product and is not affiliated with ByteDance.

---

## 09. About This Project | 项目说明

XiaoQian explores how a social content platform can evolve into a more complete travel planning and experience-sharing environment.

The central idea is simple:

**Don't just discover a trip. Plan it, experience it, remember it, and share it.**

不止于发现旅行，更要规划旅行、体验旅行、记录旅行和分享旅行。

---

*Designed and documented by Elara.*

*Building meaningful products, one idea at a time.*
