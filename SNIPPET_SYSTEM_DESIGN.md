# Advanced Conversation System Design

## Overview
This document outlines the design for an advanced snippet-based conversation system that replaces the current simple dialogue mechanics in therapy sessions.

## Core System

### Snippet-Based Dialogue
- Characters speak in short, categorizable therapeutic statements (typically 1 sentence)
- Snippets can be combined for variety and more natural flow
- Each snippet represents a meaningful therapeutic moment that can be analyzed

### Flexible Categorization
- Players can categorize snippets during active therapy sessions
- Players can also categorize snippets later when reviewing patient files
- Categorization is not required for storage - all snippets are automatically saved
- Multiple categories can be applied to a single snippet over time

### Insight Proposals
- Players use categorized snippets to make therapeutic interventions
- Proposals require selecting a snippet + category + polarity (positive/negative)
- Only newly successful categories provide attribute benefits (prevents re-use exploitation)
- Failed proposals result in lost opportunity, not negative consequences

### Progressive Unlocking
- Each character has individual tier progression (1-3) based on unique attribute combinations
- Higher tiers unlock deeper, more revealing snippets
- Progression is hidden from player but influences available content

## Data Structures

### Snippet Structure
```javascript
{
  id: "snippet_001",
  characterId: "zara",
  text: "When I transform, I feel like I lose myself completely",
  characterTierRequirement: 1,
  relationshipRequirements: {
    trust: 15,
    alliance: 10
  },
  categories: [
    { 
      category: "Differentiation", 
      polarity: "negative",
      score: 3
    },
    { 
      category: "Anxiety Management", 
      polarity: "negative", 
      score: 2
    }
  ]
}
```

### Character Structure
```javascript
{
  id: "zara",
  name: "Zara",
  currentTier: 1,
  individualAttributes: {
    differentiation: 25,
    enmeshment: 40,
    anxietyManagement: 30,
    projection: 35,
    validationSeeking: 45,
    triangulation: 20,
    boundaryClarity: 15
  },
  tierThresholds: {
    tier2: { differentiation: 40, boundaryClarity: 30 },
    tier3: { differentiation: 60, anxietyManagement: 50, boundaryClarity: 45 }
  },
  doctorPatientRelationship: {
    trust: 50
  }
}
```

### Relationship Structure
```javascript
{
  partners: ["zara", "finn"],
  attributes: {
    trust: 35,
    alliance: 25,
    insightAgreement: 20
  }
}
```

### Player Categorization Structure
```javascript
{
  snippetId: "snippet_001",
  categories: [
    { 
      category: "Differentiation", 
      polarity: "negative",
      proposed: true,
      successful: true
    },
    { 
      category: "Anxiety Management", 
      polarity: "negative",
      proposed: false,
      successful: null
    }
  ]
}
```

### Session Notes Structure
```javascript
{
  sessionId: "session_001",
  snippets: [
    {
      id: "snippet_001",
      characterId: "zara", 
      text: "When I transform, I feel like I lose myself completely",
      timestamp: "2025-06-15T10:30:00",
      playerCategorization: null // Links to categorization when created
    }
  ]
}
```

## Therapeutic Categories

### Individual Character Categories
- **Differentiation**: Ability to maintain sense of self in relationships
- **Enmeshment**: Unhealthy fusion/boundary issues with others
- **Anxiety Management**: Coping with stress and emotional regulation
- **Projection**: Attributing own feelings/traits to others
- **Validation Seeking**: Need for external approval/confirmation
- **Triangulation**: Involving third parties in relationship conflicts
- **Boundary Clarity**: Understanding and maintaining personal limits

### Relationship Categories
- **Trust**: Fundamental faith in partner's reliability and intentions
- **Alliance**: Working together as a team toward shared goals
- **Insight Agreement**: Mutual understanding of relationship dynamics

### Doctor-Patient Categories
- **Trust**: Patient's confidence in therapist's competence and care

## Game Mechanics

### Session Flow
1. Player enters therapy session
2. Characters deliver snippets in cohesive exchanges
3. Player can access notes anytime to categorize snippets
4. Each interaction offers:
   - **Gather Information**: Request more snippets from characters
   - **Propose Insight**: Use categorized snippets for therapeutic intervention
5. Successful insights improve hidden attributes
6. Session continues until target interaction count reached

### Progression System
- Character tiers unlock based on reaching specific attribute combinations
- Relationship attributes affect snippet availability across both characters
- Player insightfulness score (hidden) affects quality of non-verbal observations
- Overall relationship status communicated at session end, individual attributes remain hidden

### Success Indicators
- Characters become more open and revealing
- Access to deeper, more vulnerable snippets
- Improved relationship status reports
- Enhanced non-verbal observations (based on player skill)

## Implementation Phases

### Phase 1: Core Data Structures
- Define snippet, character, relationship, and categorization objects
- Create basic data management system
- Implement attribute tracking and tier calculation

### Phase 2: Basic Session System
- Replace current dialogue with snippet delivery
- Implement real-time note-taking during sessions
- Create basic categorization interface

### Phase 3: Insight Mechanics
- Add insight proposal system
- Implement success/failure tracking
- Connect proposals to attribute changes

### Phase 4: Advanced Features
- Patient file review system
- Historical snippet organization
- Enhanced categorization tools
- Non-verbal observation system

## Success Metrics
- Players engage deeply with categorization system
- Therapeutic concepts are learned through gameplay
- Multiple valid interpretations encourage replayability
- System supports meaningful character progression