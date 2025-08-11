export type EnrichmentLink = {
  to: string;
  label: string;
  description?: string;
};

export const ENRICHMENT_LINKS: EnrichmentLink[] = [
  {
    to: '/minecraft-logic',
    label: 'מיינקראפט וחשיבה לוגית',
    description: 'מאמר והסבר על פיתוח חשיבה לוגית דרך מיינקראפט',
  },
  {
    to: '/minecraft-confidence',
    label: 'מיינקראפט וביטחון עצמי',
    description: 'איך המשחק מחזק מסוגלות, התמדה ומיומנויות חברתיות',
  },
  {
    to: '/minecraft-attention',
    label: 'שיטת מיינקראפט: טווח קשב',
    description: 'מודל עבודה להארכת טווח הקשב – ספרינטים, מדדים ותכנית 4 שבועות',
  },
];


