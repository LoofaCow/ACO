// src/rendererConstants.js

export const DEFAULT_CONTEXT_TEMPLATE_PRESET = `{{#if system}}{{system}}
{{/if}}{{#if wiBefore}}{{wiBefore}}
{{/if}}{{#if description}}{{description}}
{{/if}}{{#if personality}}{{personality}}
{{/if}}{{#if scenario}}{{scenario}}
{{/if}}{{#if wiAfter}}{{wiAfter}}
{{/if}}{{#if persona}}{{persona}}
{{/if}}`;

export const DEFAULT_SYSTEM_PROMPT_PRESET = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.`;
