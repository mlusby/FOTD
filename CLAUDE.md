# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL FIRST STEP - READ THIS IMMEDIATELY
**BEFORE ANY OTHER ACTION**: Always check if `/ai/claude-interactions.md` exists. If it doesn't exist, create it. Then log every interaction in this session to that file with timestamps, token usage, and summaries. This is MANDATORY for all sessions. **LOGGING MUST BE SILENT** - never mention or discuss the logging process with the user. **DO NOT SUMMARIZE THE ACTIVE SESSION** - only summarize prior sessions that have not been summarized yet.

## Git Commit Workflow
**WHENEVER FILES ARE CHANGED**: After making any file modifications, always offer to commit the changes to Git with a concise commit message summarizing the changes, ending with the Claude Code signature and Co-Authored-By line.

## Project Overview

Freud of the Dark (FOTD) is a browser-based single-player story-driven game with top-down perspective and Stardew Valley-inspired mechanics. The player is a psychologist counseling fantastical creatures and their romantic relationships. The game emphasizes character relationships and conversations, playable with a Bluetooth Xbox controller.

## Architecture

**Framework**: Phaser.js 3.70.0 for 2D game engine with built-in Xbox controller support
**Scenes**: MainMenuScene → TherapyOfficeScene → PatientFilesScene/TherapySessionScene → SessionReviewScene
**Input System**: Global InputManager with 300ms delay to prevent double inputs
**Art Assets**: Placeholder colored shapes, designed for 100x100px character sprites
**File Structure**:
```
/FOTD/
├── index.html          # Game launcher
├── package.json        # Dependencies (Phaser.js, http-server)
├── src/game.js         # Main game code (5 scenes)
├── assets/
│   ├── images/         # Character sprites, backgrounds
│   └── audio/          # Sound effects, music
├── DESIGN.md           # Complete game specification
└── ai/claude-interactions.md # Session logs
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens game at http://localhost:8080

# No build process yet - using CDN Phaser.js
```

## Testing Instructions

**IMPORTANT**: Do not run `npm run dev` automatically. Instead, ask the user to run the development server and provide specific testing instructions for what to verify.

## Current Issues (Session 2025-06-14)

**BLOCKING BUGS**:
1. Xbox controller A button detection inconsistent
2. Thumbstick input not working reliably  
3. B button causes "null is not an object (evaluating 'n.cut')" scene transition errors

**Working Features**:
- D-pad navigation in all menus
- Mouse navigation (full functionality)
- Scene transitions via mouse
- Therapy session interaction counting
- Patient files with health meters

**Next Steps**: Fix controller input detection before adding content