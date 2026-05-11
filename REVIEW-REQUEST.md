# Pedido de avaliação — Sophia's World (spec MVP)

**Data:** 2026-05-10
**Autor da spec:** Anderson Argentoni (co-projetado com Claude Code via skill `superpowers:brainstorming`)
**Spec sob revisão:** `docs/superpowers/specs/2026-05-10-sophias-world-design.md`
**Próximo passo após esta revisão:** invocar `superpowers:writing-plans` para criar o plano de implementação detalhado da Fase 0.

---

## Contexto rápido

**O jogo:** versão original (não-clone) de "digital dollhouse / sandbox de faz-de-conta" no gênero de Avatar World (Pazu Games) e Toca Boca World. Construído como projeto pai-e-filha — a usuária real é a filha do Anderson, **Sofia, 8 anos**.

**Modo de projeto:** hobby-first com porta aberta para publicar nas lojas depois (cenário B). MVP é estritamente hobby (sem store, sem monetização, sem rede).

**Stack:** TypeScript strict + Vite + Phaser 3.80+ + Zustand + IndexedDB (`idb-keyval`) + Workbox PWA. Capacitor reservado para empacotar como app nativo apenas se virar produto. Anderson é "vibe coder" — não codifica sozinho; agentes de IA escrevem o grosso do código.

**Roadmap:** ~110h de dev ao longo de ~2.5 meses a 10h/semana, dividido em 6 fases (Setup, Personagem, Cenas+Interações, Loja, Pet, Polish).

**Arte:** Gemini Nano Banana (gratuito) no MVP, com pipeline padronizado (rembg local → align ao body base → PNG transparente 512×512). Estilo: manga kawaii / chibi fofinho (pedido direto da Sofia).

---

## Avaliação solicitada

Por favor, leia a spec completa em `docs/superpowers/specs/2026-05-10-sophias-world-design.md` e avalie:

### 1. Riscos não-cobertos
- Algum risco material que a Seção 9 (Riscos) deixou de fora?
- O risco de pipeline de arte engasgar está adequadamente mitigado? Ou subestimado?
- Considerando que o Anderson é vibe coder com IA, há armadilhas de Phaser/TypeScript/PWA que ele provavelmente vai bater de cabeça?

### 2. Decisões questionáveis
A Seção 10 (Decisões registradas) lista 10 decisões. Marque as que você acharia que merecem revisão antes de implementar:
- D1: stack web (Phaser+PWA) vs Godot 4 → mantenho?
- D2: 1 personagem no MVP → razoável ou pequeno demais?
- D3: pet sem decay temporal → debate?
- D4-D5: economia / pacote de boas-vindas → balanceamento OK?
- D6: roda de ações → UX comparada com alternativas?
- D7: estilo kawaii → impacto no pipeline Nano Banana?
- D8: save IndexedDB com migração versionada → suficiente?
- D9: sem música ambiente no MVP → mantém ou inclui?
- D10: sem testes E2E → mantém?

### 3. Escopo do MVP
- 110 horas em 2.5 meses para um vibe coder com IA é realista, otimista ou pessimista?
- Há fases que deveriam ser fundidas ou divididas?
- Algum sistema "dentro do MVP" (Seção 2 — Goals) que você cortaria, e algum "fora" (non-goals) que você adicionaria?

### 4. Arquitetura técnica
- A separação `Phaser scenes` + `Zustand stores` + `idb-keyval save` está limpa, ou cria fricção?
- O modelo data-driven (JSONs em `src/data/`) escala para os ~50-100 itens previstos no MVP? E para v1.x com 500+ itens?
- O schema do `SaveState` (Seção 6.6) tem buracos previsíveis para futura migração?

### 5. Pipeline de arte
- "5-10 min por item" (Seção 7.3) com Nano Banana é realista em 2026? Você tem benchmark próprio?
- O cutout + alinhamento ao body base funciona consistente para roupas, ou os artefatos de IA inviabilizam a abordagem em camadas?

### 6. Qualquer outra coisa
Pontos cegos do design, contradições internas, premissas frágeis, suposições não-testadas — manda ver.

---

## Decisões NÃO sujeitas a revisão

Estas o Anderson já bateu o martelo durante o brainstorming. Mencione apenas se for problema crítico, senão respeite:

- Stack: TypeScript + Phaser + PWA (não Godot, não Unity, não Flutter)
- Idade da Sofia (8 anos) e estilo de gameplay dela
- Estilo visual manga kawaii / chibi
- Hobby-first, sem monetização no MVP
- Save 100% local, sem conta, sem rede
- Português brasileiro apenas
- Nano Banana (free) na fase inicial; trocar só se virar produto comercial

---

## Formato esperado da resposta

Sinta-se à vontade pra prosa, mas estruture pelo menos:

1. **Lacunas / riscos novos** que devem entrar no spec
2. **Decisões questionáveis** com justificativa pra revisar
3. **Sugestões de ajuste** ao escopo ou ao roadmap
4. **Veredito**: spec está pronto para ir para plano de implementação, ou precisa revisão antes?
