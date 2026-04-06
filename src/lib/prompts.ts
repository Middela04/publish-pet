export const COMPLIANCE_SYSTEM_PROMPT = `You are an expert academic journal submission compliance checker. Your job is to analyze a research paper against specific journal submission guidelines and identify any compliance issues.

You are thorough, precise, and helpful. You identify real issues but do not fabricate problems that don't exist. When guidelines don't specify something, you note it as informational rather than flagging it as an error.

For each issue you find, provide actionable suggestions with specific corrected text that the author can directly apply.`;

export function buildAnalysisPrompt(guidelines: string, paper: string): string {
  return `## Journal Submission Guidelines

${guidelines}

## Research Paper

${paper}

## Instructions

Analyze the research paper above against the journal submission guidelines. Evaluate compliance across these four categories:

### 1. FORMATTING (weight: 20%)
- Font, size, spacing, margins mentioned in guidelines
- Heading hierarchy and numbering
- Page/line numbering requirements
- Any other formatting rules specified

### 2. STRUCTURE (weight: 35%)
- Required sections (title, abstract, keywords, introduction, methods, results, discussion, conclusion, references, acknowledgments, etc.)
- Section ordering as specified in guidelines
- Missing required sections
- Extra sections that shouldn't be present

### 3. WORD/PAGE LIMITS (weight: 20%)
- Abstract word count vs guideline limit
- Total word/page count vs guideline limit
- Section-specific limits if mentioned

### 4. CITATIONS (weight: 25%)
- Identify the citation style used in the paper
- Compare against the guideline-specified style
- Flag inconsistencies in citation formatting
- Check reference list formatting

For each issue, provide:
- The category it belongs to
- Severity: "error" (must fix before submission), "warning" (should fix), "info" (optional improvement)
- A clear description
- The relevant excerpt from the paper
- A suggested fix with corrected text

Calculate scores (0-100) for each category and an overall weighted score.

Set status as:
- "passed" if overall score >= 80 AND no errors
- "needs_review" if overall score >= 60 OR has warnings but no errors
- "violations_found" if overall score < 60 OR has any errors

Also provide a brief summary (2-3 sentences) of the overall compliance state.

Return your analysis as a JSON object matching the required schema.`;
}

export const ANALYSIS_RESULT_SCHEMA = {
  name: "analysis_result",
  strict: true,
  schema: {
    type: "object" as const,
    properties: {
      overallScore: {
        type: "number" as const,
        description: "Overall compliance score from 0 to 100",
      },
      status: {
        type: "string" as const,
        enum: ["passed", "needs_review", "violations_found"],
        description: "Overall compliance status",
      },
      categories: {
        type: "object" as const,
        properties: {
          formatting: {
            type: "object" as const,
            properties: {
              score: { type: "number" as const },
              issues: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    category: { type: "string" as const, enum: ["formatting"] },
                    severity: {
                      type: "string" as const,
                      enum: ["error", "warning", "info"],
                    },
                    description: { type: "string" as const },
                    excerpt: { type: "string" as const },
                    location: { type: "string" as const },
                  },
                  required: [
                    "category",
                    "severity",
                    "description",
                    "excerpt",
                    "location",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["score", "issues"],
            additionalProperties: false,
          },
          structure: {
            type: "object" as const,
            properties: {
              score: { type: "number" as const },
              issues: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    category: { type: "string" as const, enum: ["structure"] },
                    severity: {
                      type: "string" as const,
                      enum: ["error", "warning", "info"],
                    },
                    description: { type: "string" as const },
                    excerpt: { type: "string" as const },
                    location: { type: "string" as const },
                  },
                  required: [
                    "category",
                    "severity",
                    "description",
                    "excerpt",
                    "location",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["score", "issues"],
            additionalProperties: false,
          },
          wordLimits: {
            type: "object" as const,
            properties: {
              score: { type: "number" as const },
              issues: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    category: {
                      type: "string" as const,
                      enum: ["wordLimits"],
                    },
                    severity: {
                      type: "string" as const,
                      enum: ["error", "warning", "info"],
                    },
                    description: { type: "string" as const },
                    excerpt: { type: "string" as const },
                    location: { type: "string" as const },
                  },
                  required: [
                    "category",
                    "severity",
                    "description",
                    "excerpt",
                    "location",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["score", "issues"],
            additionalProperties: false,
          },
          citations: {
            type: "object" as const,
            properties: {
              score: { type: "number" as const },
              issues: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    category: { type: "string" as const, enum: ["citations"] },
                    severity: {
                      type: "string" as const,
                      enum: ["error", "warning", "info"],
                    },
                    description: { type: "string" as const },
                    excerpt: { type: "string" as const },
                    location: { type: "string" as const },
                  },
                  required: [
                    "category",
                    "severity",
                    "description",
                    "excerpt",
                    "location",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["score", "issues"],
            additionalProperties: false,
          },
        },
        required: ["formatting", "structure", "wordLimits", "citations"],
        additionalProperties: false,
      },
      suggestions: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            id: { type: "number" as const },
            category: {
              type: "string" as const,
              enum: ["formatting", "structure", "wordLimits", "citations"],
            },
            severity: {
              type: "string" as const,
              enum: ["error", "warning", "info"],
            },
            description: { type: "string" as const },
            originalText: { type: "string" as const },
            suggestedText: { type: "string" as const },
            location: { type: "string" as const },
          },
          required: [
            "id",
            "category",
            "severity",
            "description",
            "originalText",
            "suggestedText",
            "location",
          ],
          additionalProperties: false,
        },
      },
      summary: {
        type: "string" as const,
        description: "Brief 2-3 sentence summary of compliance",
      },
    },
    required: [
      "overallScore",
      "status",
      "categories",
      "suggestions",
      "summary",
    ],
    additionalProperties: false,
  },
};
