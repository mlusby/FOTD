# Freud of the Dark - Game Design Document

## Core Concept
Story-driven browser-based therapy RPG where player is a psychologist with memory loss who counsels fantastical creatures in relationships. Focus on exploration for understanding and high-stakes counseling sessions.

## Technical Stack
- **Engine**: Phaser.js (chosen for controller support, scene management, sprite handling)
- **Platform**: Browser-based with Xbox controller support
- **Art Style**: Top-down 2D, Stardew Valley level of detail

## Core Gameplay Loop

### 1. World Exploration (No Time Pressure)
- **Purpose**: Build understanding of races, cultures, magical dynamics
- **Mechanics**: 
  - Talk to townsfolk to learn about different creature types
  - Observe behaviors and cultural norms
  - Discover information that aids therapy sessions
- **Knowledge System**: Information stored in searchable journal, affects therapy effectiveness but doesn't lock dialogue options

### 2. Memory Recovery System
- **Trigger**: Specific situations/clients trigger college flashbacks
- **Content**: Interactive library scenes, classroom discussions, mentor guidance
- **Effect**: Unlocks summary information in journal, improves player understanding
- **Philosophy**: Player skill progression, not character stat progression

### 3. Therapy Sessions (5-10 minutes real time)
- **Pressure Mechanics**: 
  - Limited interactions per session (not timed, but interaction-counted)
  - Progress in uncovering issues slows relationship/health degradation
  - Poor sessions accelerate client decline and reduce return likelihood
- **Health Tracking**:
  - Individual health meters (depression, anxiety, self-esteem)
  - Relationship health meters (trust, communication, intimacy)
  - Session attendance/frequency tracking

### 4. Post-Session Review
- **Automatic Observations**: Game generates notes on body language, therapeutic approaches used, cultural factors
- **Patient Folders**: Comprehensive system tracking all sessions, insights, health trends
- **Organization**: Chronological records, searchable insights, cross-client references

## Narrative Framework
- **Opening**: Childhood backstory animation (giving advice to imaginary friends)
- **Setup**: Memory loss accident affecting recall of training
- **Progression**: Rediscovering therapy skills while helping fantastical relationship problems
- **Theme**: Building understanding through exploration and applying knowledge under pressure

## Proof of Concept Priorities
1. **Basic Phaser.js setup** with controller support
2. **Simple dialogue system** with interaction counting
3. **Minimal patient folder UI** with health meters
4. **One test therapy scenario** to validate core mechanics

## Next Session Planning
- Technical implementation details
- Asset requirements and pipeline
- Specific dialogue tree structures
- UI/UX wireframes for patient folders