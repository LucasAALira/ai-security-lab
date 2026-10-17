import type { FrameworkRef } from './types'

/* Registro de frameworks e normas citados pelo conteúdo. Cada entrada tem a edição, o endereço oficial e a data da
   última revisão. Os itens listados foram conferidos na fonte indicada em `verification`; um item que não foi
   conferido não entra aqui, e qualquer referência de desafio, missão ou aula precisa resolver para um item daqui
   (há um teste para isso). Isso evita citar de memória um identificador que nunca existiu naquela edição.

   Os títulos ficam no idioma original da fonte. */

export interface FrameworkItem {
  id: string
  title: string
}

export interface Framework {
  id: string
  name: string
  /** Rótulo curto para filtros e etiquetas. */
  short: string
  publisher: string
  edition: string
  url: string
  /** `true` quando `items` traz a lista completa da edição; `false` quando traz só os itens citados pelo conteúdo. */
  complete: boolean
  /** Data (AAAA-MM-DD) em que a edição e os títulos foram conferidos. */
  reviewed: string
  /** Como foi conferido, em uma frase. */
  verification: string
  /** Endereço de um item, quando a fonte tem uma página estável por item. */
  itemUrl?: (id: string) => string
  items: FrameworkItem[]
}

const REVIEWED = '2026-10-17'

export const frameworks: Framework[] = [
  {
    id: 'owasp-top10',
    name: 'OWASP Top 10',
    short: 'OWASP Top 10:2025',
    publisher: 'OWASP',
    edition: '2025',
    url: 'https://owasp.org/Top10/2025/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Lista conferida na página oficial da edição 2025.',
    items: [
      { id: 'A01', title: 'Broken Access Control' },
      { id: 'A02', title: 'Security Misconfiguration' },
      { id: 'A03', title: 'Software Supply Chain Failures' },
      { id: 'A04', title: 'Cryptographic Failures' },
      { id: 'A05', title: 'Injection' },
      { id: 'A06', title: 'Insecure Design' },
      { id: 'A07', title: 'Authentication Failures' },
      { id: 'A08', title: 'Software or Data Integrity Failures' },
      { id: 'A09', title: 'Security Logging and Alerting Failures' },
      { id: 'A10', title: 'Mishandling of Exceptional Conditions' },
    ],
  },
  {
    id: 'owasp-api-top10',
    name: 'OWASP API Security Top 10',
    short: 'OWASP API Top 10:2023',
    publisher: 'OWASP',
    edition: '2023',
    url: 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Lista conferida em um resumo publicado por terceiros; a página oficial redirecionou para outro domínio que não pôde ser aberto nesta revisão.',
    items: [
      { id: 'API1', title: 'Broken Object Level Authorization' },
      { id: 'API2', title: 'Broken Authentication' },
      { id: 'API3', title: 'Broken Object Property Level Authorization' },
      { id: 'API4', title: 'Unrestricted Resource Consumption' },
      { id: 'API5', title: 'Broken Function Level Authorization' },
      { id: 'API6', title: 'Unrestricted Access to Sensitive Business Flows' },
      { id: 'API7', title: 'Server Side Request Forgery' },
      { id: 'API8', title: 'Security Misconfiguration' },
      { id: 'API9', title: 'Improper Inventory Management' },
      { id: 'API10', title: 'Unsafe Consumption of APIs' },
    ],
  },
  {
    id: 'owasp-mobile-top10',
    name: 'OWASP Mobile Top 10',
    short: 'OWASP Mobile Top 10:2024',
    publisher: 'OWASP',
    edition: '2024 (versão final)',
    url: 'https://owasp.org/www-project-mobile-top-10/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Lista conferida na página oficial do projeto ("Top 10 Mobile Risks - Final release 2024").',
    items: [
      { id: 'M1', title: 'Improper Credential Usage' },
      { id: 'M2', title: 'Inadequate Supply Chain Security' },
      { id: 'M3', title: 'Insecure Authentication/Authorization' },
      { id: 'M4', title: 'Insufficient Input/Output Validation' },
      { id: 'M5', title: 'Insecure Communication' },
      { id: 'M6', title: 'Inadequate Privacy Controls' },
      { id: 'M7', title: 'Insufficient Binary Protections' },
      { id: 'M8', title: 'Security Misconfiguration' },
      { id: 'M9', title: 'Insecure Data Storage' },
      { id: 'M10', title: 'Insufficient Cryptography' },
    ],
  },
  {
    id: 'masvs',
    name: 'OWASP MASVS (Mobile Application Security Verification Standard)',
    short: 'OWASP MASVS',
    publisher: 'OWASP',
    edition: '2.x (grupos de controles)',
    url: 'https://mas.owasp.org/MASVS/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Grupos de controles conferidos na página oficial; a página não informa o número exato da versão, então a edição não é afirmada além da série 2.x.',
    items: [
      { id: 'MASVS-STORAGE', title: 'Storage' },
      { id: 'MASVS-CRYPTO', title: 'Cryptography' },
      { id: 'MASVS-AUTH', title: 'Authentication and Authorization' },
      { id: 'MASVS-NETWORK', title: 'Network Communication' },
      { id: 'MASVS-PLATFORM', title: 'Platform Interaction' },
      { id: 'MASVS-CODE', title: 'Code Quality' },
      { id: 'MASVS-RESILIENCE', title: 'Resilience Against Reverse Engineering and Tampering' },
      { id: 'MASVS-PRIVACY', title: 'Privacy' },
    ],
  },
  {
    id: 'mastg',
    name: 'OWASP MASTG (Mobile Application Security Testing Guide)',
    short: 'OWASP MASTG',
    publisher: 'OWASP',
    edition: 'guia em atualização contínua (a página não indica número de versão)',
    url: 'https://mas.owasp.org/MASTG/',
    complete: false,
    reviewed: REVIEWED,
    verification: 'Existência e finalidade conferidas na página oficial; nenhum item individual é citado.',
    items: [],
  },
  {
    id: 'asvs',
    name: 'OWASP ASVS (Application Security Verification Standard)',
    short: 'OWASP ASVS 5.0.0',
    publisher: 'OWASP',
    edition: '5.0.0',
    url: 'https://owasp.org/www-project-application-security-verification-standard/',
    complete: false,
    reviewed: REVIEWED,
    verification: 'Versão estável conferida na página oficial do projeto; nenhum requisito individual é citado.',
    items: [],
  },
  {
    id: 'wstg',
    name: 'OWASP WSTG (Web Security Testing Guide)',
    short: 'OWASP WSTG 4.2',
    publisher: 'OWASP',
    edition: '4.2',
    url: 'https://owasp.org/www-project-web-security-testing-guide/',
    complete: false,
    reviewed: REVIEWED,
    verification: 'Versão estável (4.2) conferida na página oficial do projeto; nenhum teste individual é citado.',
    items: [],
  },
  {
    id: 'owasp-llm-top10',
    name: 'OWASP Top 10 for LLM Applications',
    short: 'OWASP LLM Top 10:2025',
    publisher: 'OWASP Gen AI Security Project',
    edition: '2025',
    url: 'https://genai.owasp.org/llm-top-10/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Lista conferida em um resumo publicado por terceiros e o título de LLM03 confirmado na página oficial do risco; a página oficial da lista não pôde ser aberta nesta revisão.',
    items: [
      { id: 'LLM01', title: 'Prompt Injection' },
      { id: 'LLM02', title: 'Sensitive Information Disclosure' },
      { id: 'LLM03', title: 'Supply Chain' },
      { id: 'LLM04', title: 'Data and Model Poisoning' },
      { id: 'LLM05', title: 'Improper Output Handling' },
      { id: 'LLM06', title: 'Excessive Agency' },
      { id: 'LLM07', title: 'System Prompt Leakage' },
      { id: 'LLM08', title: 'Vector and Embedding Weaknesses' },
      { id: 'LLM09', title: 'Misinformation' },
      { id: 'LLM10', title: 'Unbounded Consumption' },
    ],
  },
  {
    id: 'cwe',
    name: 'CWE (Common Weakness Enumeration)',
    short: 'CWE',
    publisher: 'MITRE',
    edition: 'catálogo vigente na data da revisão',
    url: 'https://cwe.mitre.org/',
    complete: false,
    reviewed: REVIEWED,
    verification: 'Cada identificador e título foi conferido na página da própria fraqueza em cwe.mitre.org. Só os itens citados pelo conteúdo constam aqui.',
    itemUrl: (id) => `https://cwe.mitre.org/data/definitions/${id.replace(/^CWE-/, '')}.html`,
    items: [
      { id: 'CWE-22', title: "Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')" },
      { id: 'CWE-79', title: "Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')" },
      { id: 'CWE-89', title: "Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')" },
      { id: 'CWE-250', title: 'Execution with Unnecessary Privileges' },
      { id: 'CWE-295', title: 'Improper Certificate Validation' },
      { id: 'CWE-312', title: 'Cleartext Storage of Sensitive Information' },
      { id: 'CWE-319', title: 'Cleartext Transmission of Sensitive Information' },
      { id: 'CWE-327', title: 'Use of a Broken or Risky Cryptographic Algorithm' },
      { id: 'CWE-330', title: 'Use of Insufficiently Random Values' },
      { id: 'CWE-347', title: 'Improper Verification of Cryptographic Signature' },
      { id: 'CWE-352', title: 'Cross-Site Request Forgery (CSRF)' },
      { id: 'CWE-362', title: "Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')" },
      { id: 'CWE-434', title: 'Unrestricted Upload of File with Dangerous Type' },
      { id: 'CWE-489', title: 'Active Debug Code' },
      { id: 'CWE-502', title: 'Deserialization of Untrusted Data' },
      { id: 'CWE-532', title: 'Insertion of Sensitive Information into Log File' },
      { id: 'CWE-601', title: "URL Redirection to Untrusted Site ('Open Redirect')" },
      { id: 'CWE-602', title: 'Client-Side Enforcement of Server-Side Security' },
      { id: 'CWE-639', title: 'Authorization Bypass Through User-Controlled Key' },
      { id: 'CWE-749', title: 'Exposed Dangerous Method or Function' },
      { id: 'CWE-770', title: 'Allocation of Resources Without Limits or Throttling' },
      { id: 'CWE-798', title: 'Use of Hard-coded Credentials' },
      { id: 'CWE-829', title: 'Inclusion of Functionality from Untrusted Control Sphere' },
      { id: 'CWE-862', title: 'Missing Authorization' },
      { id: 'CWE-915', title: 'Improperly Controlled Modification of Dynamically-Determined Object Attributes' },
      { id: 'CWE-918', title: 'Server-Side Request Forgery (SSRF)' },
      { id: 'CWE-926', title: 'Improper Export of Android Application Components' },
      { id: 'CWE-939', title: 'Improper Authorization in Handler for Custom URL Scheme' },
      { id: 'CWE-942', title: 'Permissive Cross-domain Security Policy with Untrusted Domains' },
    ],
  },
  {
    id: 'nist-ssdf',
    name: 'NIST SP 800-218, Secure Software Development Framework (SSDF)',
    short: 'NIST SSDF v1.1',
    publisher: 'NIST',
    edition: 'Versão 1.1 (fevereiro de 2022)',
    url: 'https://csrc.nist.gov/projects/ssdf',
    complete: false,
    reviewed: REVIEWED,
    verification: 'Edição conferida na página oficial da publicação; títulos das práticas conferidos em material do NIST (NCCoE). Só as práticas citadas constam aqui.',
    items: [
      { id: 'PO.5', title: 'Implement and Maintain Secure Environments for Software Development' },
      { id: 'PS.1', title: 'Protect All Forms of Code from Unauthorized Access and Tampering' },
      { id: 'PS.2', title: 'Provide a Mechanism for Verifying Software Release Integrity' },
      { id: 'PS.3', title: 'Archive and Protect Each Software Release' },
      { id: 'PW.4', title: 'Reuse Existing, Well-Secured Software When Feasible Instead of Duplicating Functionality' },
      { id: 'RV.1', title: 'Identify and Confirm Vulnerabilities on an Ongoing Basis' },
    ],
  },
  {
    id: 'slsa',
    name: 'SLSA (Supply-chain Levels for Software Artifacts)',
    short: 'SLSA v1.2',
    publisher: 'OpenSSF',
    edition: 'Versão 1.2',
    url: 'https://slsa.dev/spec/v1.2/',
    complete: true,
    reviewed: REVIEWED,
    verification: 'Versão e trilhas (Build e Source) conferidas na página oficial da especificação.',
    itemUrl: (id) => (id === 'build' ? 'https://slsa.dev/spec/v1.2/build-track-basics' : 'https://slsa.dev/spec/v1.2/'),
    items: [
      { id: 'build', title: 'Build Track' },
      { id: 'source', title: 'Source Track' },
    ],
  },
]

export const frameworkById = (id: string): Framework | undefined => frameworks.find((f) => f.id === id)

export interface ResolvedRef {
  framework: Framework
  item: FrameworkItem
  /** Endereço do item, quando a fonte tem página por item; senão o da edição. */
  url: string
}

/** Resolve uma referência para o item verificado do registro; `undefined` quando a edição ou o item não existem. */
export function resolveRef(ref: FrameworkRef): ResolvedRef | undefined {
  const framework = frameworkById(ref.framework)
  const item = framework?.items.find((i) => i.id === ref.id)
  if (!framework || !item) return undefined
  return { framework, item, url: framework.itemUrl ? framework.itemUrl(item.id) : framework.url }
}

/** Texto curto para mostrar a referência: "OWASP Top 10:2025 · A01 Broken Access Control". */
export function refLabel(ref: FrameworkRef): string {
  const r = resolveRef(ref)
  return r ? `${r.framework.short} · ${r.item.id} ${r.item.title}` : `${ref.framework} ${ref.id}`
}
