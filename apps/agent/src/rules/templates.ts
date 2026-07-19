// ArcGent Template Rules — Pre-built scenarios for non-technical users
// "Pick a template, fill in the blanks, activate"

export interface TemplateRule {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultRule: {
    signal: {
      source: "webhook" | "github" | "api";
      trigger: string;
      conditions: Record<string, any>;
    };
    action: {
      type: "pay" | "tip" | "refund";
      amount: number;
      currency: "USDC";
    };
  };
  formFields: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "select" | "address";
    placeholder: string;
    options?: string[];
    required: boolean;
  }>;
  examples: string[];
}

export const TEMPLATES: TemplateRule[] = [
  {
    id: "bug-bounty",
    name: "Bug Bounty",
    description: "Auto-pay developers when their security fixes get merged",
    icon: "🐛",
    category: "Development",
    defaultRule: {
      signal: {
        source: "github",
        trigger: "pr_merged",
        conditions: { labels: ["security", "bug", "fix"] },
      },
      action: {
        type: "pay",
        amount: 50,
        currency: "USDC",
      },
    },
    formFields: [
      { key: "repo", label: "GitHub Repository", type: "text", placeholder: "owner/repo", required: true },
      { key: "amount", label: "Base Reward (USDC)", type: "number", placeholder: "50", required: true },
      { key: "minSeverity", label: "Minimum Severity", type: "select", placeholder: "low", options: ["trivial", "low", "medium", "high", "critical"], required: true },
    ],
    examples: [
      "PR merged with 'security' label → AI evaluates severity → pays 50-600 USDC",
      "Critical vulnerability fix → AI suggests 600 USDC",
      "Documentation typo → AI suggests 5 USDC",
    ],
  },
  {
    id: "refund-ai",
    name: "Refund AI",
    description: "Instant refunds when services fail (flight delays, API downtime)",
    icon: "✈️",
    category: "Customer Service",
    defaultRule: {
      signal: {
        source: "webhook",
        trigger: "service_disruption",
        conditions: { duration_minutes: { $gte: 120 } },
      },
      action: {
        type: "refund",
        amount: 100,
        currency: "USDC",
      },
    },
    formFields: [
      { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://your-api.com/webhook", required: true },
      { key: "delayThreshold", label: "Delay Threshold (minutes)", type: "number", placeholder: "120", required: true },
      { key: "refundAmount", label: "Refund Amount (USDC)", type: "number", placeholder: "100", required: true },
    ],
    examples: [
      "Flight delayed 2+ hours → instant 100 USDC refund",
      "API downtime > 30 minutes → service credit issued",
      "Delivery late → automatic compensation",
    ],
  },
  {
    id: "content-tipping",
    name: "Content Tipping",
    description: "Tip creators automatically based on content quality",
    icon: "✍️",
    category: "Content",
    defaultRule: {
      signal: {
        source: "webhook",
        trigger: "content_published",
        conditions: { wordCount: { $gte: 1000 } },
      },
      action: {
        type: "tip",
        amount: 20,
        currency: "USDC",
      },
    },
    formFields: [
      { key: "platform", label: "Platform", type: "select", placeholder: "blog", options: ["blog", "youtube", "podcast", "newsletter"], required: true },
      { key: "minQuality", label: "Quality Threshold", type: "select", placeholder: "medium", options: ["low", "medium", "high"], required: true },
      { key: "tipAmount", label: "Base Tip (USDC)", type: "number", placeholder: "20", required: true },
    ],
    examples: [
      "Blog post 3000+ words with diagrams → 160 USDC tip",
      "Video 10+ minutes with original content → 50 USDC",
      "Copied content → rejected, no payment",
    ],
  },
  {
    id: "api-rewards",
    name: "API Rewards",
    description: "Reward users for completing actions (onboarding, referrals)",
    icon: "🎯",
    category: "Growth",
    defaultRule: {
      signal: {
        source: "api",
        trigger: "action_completed",
        conditions: { action: "onboarding_complete" },
      },
      action: {
        type: "pay",
        amount: 5,
        currency: "USDC",
      },
    },
    formFields: [
      { key: "apiEndpoint", label: "API Endpoint", type: "text", placeholder: "https://api.yourapp.com/events", required: true },
      { key: "actionType", label: "Action Type", type: "text", placeholder: "onboarding_complete", required: true },
      { key: "rewardAmount", label: "Reward (USDC)", type: "number", placeholder: "5", required: true },
    ],
    examples: [
      "User completes onboarding → 5 USDC welcome bonus",
      "Successful referral → 10 USDC to referrer",
      "First transaction → 2 USDC incentive",
    ],
  },
  {
    id: "devops-bounty",
    name: "DevOps Bounty",
    description: "Auto-pay engineers for incident response",
    icon: "🔧",
    category: "Operations",
    defaultRule: {
      signal: {
        source: "webhook",
        trigger: "incident_resolved",
        conditions: { severity: { $in: ["high", "critical"] } },
      },
      action: {
        type: "pay",
        amount: 200,
        currency: "USDC",
      },
    },
    formFields: [
      { key: "monitoringTool", label: "Monitoring Tool", type: "select", placeholder: "pagerduty", options: ["pagerduty", "datadog", "newrelic", "custom"], required: true },
      { key: "severityLevel", label: "Minimum Severity", type: "select", placeholder: "high", options: ["medium", "high", "critical"], required: true },
      { key: "bountyAmount", label: "Bounty (USDC)", type: "number", placeholder: "200", required: true },
    ],
    examples: [
      "Critical server downtime fixed → 500 USDC bounty",
      "Security incident resolved → 300 USDC",
      "Performance optimization → 100 USDC",
    ],
  },
];

export function getTemplate(id: string): TemplateRule | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function instantiateTemplate(templateId: string, formData: Record<string, any>): any {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);

  return {
    id: `${templateId}-${Date.now()}`,
    name: `${template.name} (Custom)`,
    signal: {
      ...template.defaultRule.signal,
      conditions: {
        ...template.defaultRule.signal.conditions,
        ...formData,
      },
    },
    action: {
      ...template.defaultRule.action,
      amount: formData.amount || template.defaultRule.action.amount,
      recipient: formData.recipient || "0x0000000000000000000000000000000000000000",
    },
    enabled: true,
    template: templateId,
  };
}