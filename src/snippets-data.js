// Snippet data for Zara & Finn couple
// This file contains all dialogue snippets organized by topics specific to their relationship

const ZARA_FINN_SNIPPETS = {
    // Transformation safety and boundaries
    "transformation_safety": {
        zara: [
            {
                id: 'zara_transform_001',
                text: 'When I transform, I feel like I lose myself completely.',
                tier: 1,
                trustRequired: 10,
                categories: [
                    { category: 'Differentiation', polarity: 'negative', score: 3 },
                    { category: 'Anxiety Management', polarity: 'negative', score: 2 }
                ]
            },
            {
                id: 'zara_transform_002',
                text: 'I need him to understand that transformation is deeply personal for me.',
                tier: 1,
                trustRequired: 20,
                categories: [
                    { category: 'Boundary Clarity', polarity: 'positive', score: 2 },
                    { category: 'Differentiation', polarity: 'positive', score: 1 }
                ]
            }
        ],
        finn: [
            {
                id: 'finn_transform_001',
                text: 'I just want to make sure she\'s safe when she transforms.',
                tier: 1,
                trustRequired: 10,
                categories: [
                    { category: 'Anxiety Management', polarity: 'negative', score: 2 },
                    { category: 'Boundary Clarity', polarity: 'negative', score: 1 }
                ]
            },
            {
                id: 'finn_transform_002',
                text: 'Dragons are powerful creatures - what if something goes wrong?',
                tier: 1,
                trustRequired: 15,
                categories: [
                    { category: 'Anxiety Management', polarity: 'negative', score: 3 },
                    { category: 'Projection', polarity: 'negative', score: 1 }
                ]
            }
        ],
        noMore: {
            zara: 'I think we\'ve covered my transformation concerns for now.',
            finn: 'I don\'t have more to say about transformation safety right now.'
        }
    },

    // Communication during conflicts
    "conflict_communication": {
        zara: [
            {
                id: 'zara_conflict_001',
                text: 'Sometimes I wish he would just listen instead of trying to fix everything.',
                tier: 1,
                trustRequired: 20,
                categories: [
                    { category: 'Validation Seeking', polarity: 'positive', score: 2 },
                    { category: 'Boundary Clarity', polarity: 'positive', score: 1 }
                ]
            },
            {
                id: 'zara_conflict_002',
                text: 'When we argue, he gets this look like I\'m being unreasonable.',
                tier: 1,
                trustRequired: 25,
                categories: [
                    { category: 'Validation Seeking', polarity: 'negative', score: 2 },
                    { category: 'Projection', polarity: 'positive', score: 1 }
                ]
            }
        ],
        finn: [
            {
                id: 'finn_conflict_001',
                text: 'I try to support her, but I never know if I\'m saying the right thing.',
                tier: 1,
                trustRequired: 15,
                categories: [
                    { category: 'Validation Seeking', polarity: 'negative', score: 2 },
                    { category: 'Anxiety Management', polarity: 'negative', score: 1 }
                ]
            },
            {
                id: 'finn_conflict_002',
                text: 'When she gets upset, I feel like I need to do something to help.',
                tier: 1,
                trustRequired: 20,
                categories: [
                    { category: 'Enmeshment', polarity: 'negative', score: 2 },
                    { category: 'Boundary Clarity', polarity: 'negative', score: 2 }
                ]
            }
        ],
        noMore: {
            zara: 'We\'ve talked enough about our communication patterns for now.',
            finn: 'I think that covers how we handle conflicts.'
        }
    },

    // Family dinner incident
    "family_dinner_incident": {
        zara: [
            {
                id: 'zara_dinner_001',
                text: 'At the family dinner, I felt like he was making excuses for my behavior.',
                tier: 1,
                trustRequired: 30,
                categories: [
                    { category: 'Validation Seeking', polarity: 'negative', score: 3 },
                    { category: 'Triangulation', polarity: 'negative', score: 2 }
                ]
            },
            {
                id: 'zara_dinner_002',
                text: 'I can handle my own family - I don\'t need him to protect me from them.',
                tier: 1,
                trustRequired: 25,
                categories: [
                    { category: 'Differentiation', polarity: 'positive', score: 2 },
                    { category: 'Boundary Clarity', polarity: 'positive', score: 1 }
                ]
            }
        ],
        finn: [
            {
                id: 'finn_dinner_001',
                text: 'Her family was being really harsh about the dragon thing.',
                tier: 1,
                trustRequired: 25,
                categories: [
                    { category: 'Triangulation', polarity: 'negative', score: 2 },
                    { category: 'Projection', polarity: 'negative', score: 1 }
                ]
            },
            {
                id: 'finn_dinner_002',
                text: 'I thought I was helping by explaining things to her parents.',
                tier: 1,
                trustRequired: 30,
                categories: [
                    { category: 'Boundary Clarity', polarity: 'negative', score: 2 },
                    { category: 'Triangulation', polarity: 'negative', score: 2 }
                ]
            }
        ],
        noMore: {
            zara: 'I think we\'ve said enough about the family dinner situation.',
            finn: 'That covers the family dinner incident for me.'
        }
    },

    // Personal space and boundaries
    "personal_space": {
        zara: [
            {
                id: 'zara_space_001',
                text: 'Finn always tries to help, but sometimes I need space to figure things out.',
                tier: 1,
                trustRequired: 15,
                categories: [
                    { category: 'Boundary Clarity', polarity: 'positive', score: 2 },
                    { category: 'Validation Seeking', polarity: 'negative', score: 1 }
                ]
            },
            {
                id: 'zara_space_002',
                text: 'I love that he cares, but I need him to trust that I can handle some things alone.',
                tier: 1,
                trustRequired: 25,
                categories: [
                    { category: 'Differentiation', polarity: 'positive', score: 3 },
                    { category: 'Boundary Clarity', polarity: 'positive', score: 2 }
                ]
            }
        ],
        finn: [
            {
                id: 'finn_space_001',
                text: 'Maybe I do hover too much, but dragons are powerful creatures.',
                tier: 1,
                trustRequired: 20,
                categories: [
                    { category: 'Differentiation', polarity: 'negative', score: 1 },
                    { category: 'Projection', polarity: 'positive', score: 2 }
                ]
            },
            {
                id: 'finn_space_002',
                text: 'It\'s hard to know when to step back and when to be supportive.',
                tier: 1,
                trustRequired: 25,
                categories: [
                    { category: 'Boundary Clarity', polarity: 'negative', score: 2 },
                    { category: 'Anxiety Management', polarity: 'negative', score: 1 }
                ]
            }
        ],
        noMore: {
            zara: 'I think we\'ve covered the personal space topic thoroughly.',
            finn: 'That\'s all I have to say about personal space for now.'
        }
    }
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ZARA_FINN_SNIPPETS };
} else {
    window.ZARA_FINN_SNIPPETS = ZARA_FINN_SNIPPETS;
}