# Sophia's World — Design Document (MVP)

**Data:** 2026-05-10
**Autor:** Anderson Argentoni (vibe-coder, perfil de dados, AI-assisted)
**Público-alvo:** Sofia, 8 anos, leitora fluente, joga sozinha
**Modo do projeto:** Hobby-first com porta aberta para publicação futura (não comercial no MVP)
**Estado:** Aprovado para implementação

---

## 1. Visão geral

Sophia's World é uma versão original do gênero "digital dollhouse / sandbox de faz-de-conta" inspirada em Avatar World (Pazu Games) e Toca Boca World. O jogo é construído para uma criança específica (Sofia, 8 anos) que ama:

- Inventar histórias com personagens
- Customizar roupas e acessórios
- Decorar ambientes
- Frequentar lojinhas dentro do jogo e comprar itens
- Cuidar e brincar com pets

A primeira versão roda como Progressive Web App (PWA) acessível por URL no Safari (iPad) ou Chrome (Android), instalável como ícone na tela inicial e funcional offline.

## 2. Goals e non-goals

### Goals (MVP)
- Cobrir as quatro paixões da Sofia: customizar, decorar, comprar, cuidar de pet
- Funcionar em iPad e Android phone em **orientação landscape** (canônica do MVP)
- Funcionar 100% offline após o primeiro carregamento
- Salvamento local sem login, sem conta, sem nuvem
- Estilo visual original (sem cópia de IP)
- Caber em ~120h de desenvolvimento ao longo de ~2.5–3 meses (10h/semana)

### Non-goals (MVP — adiados ou descartados)
- Múltiplos personagens salvos (apenas 1 personagem no MVP)
- Múltiplos pets ou outras espécies (apenas cachorro)
- Loop de "vida" com decay temporal (fome/sono diminuindo com o tempo real)
- Mini-jogos próprios dentro das cenas (cozinhar, banhar, etc., com mecânica dedicada)
- Missões com roteiro e NPCs falantes
- Música ambiente
- Inglês ou outros idiomas além de português do Brasil
- Conta, login, sync entre devices, social, multiplayer, chat
- Compras com dinheiro real e qualquer monetização
- Publicação nas lojas (Google Play / App Store)
- **Orientação portrait**: quando detectada, mostrar tela "vire o aparelho" amigável. Suporte real a portrait fica para v1.1.

## 3. Perfil da jogadora

| Atributo | Valor |
|---|---|
| Idade | 8 anos |
| Leitura | Fluente — UI pode ter textos, nomes e descrições curtas |
| Dispositivos | iPad e celular Android |
| Sessão típica | Longa, exploratória, sozinha |
| Estilo | Inventiva, narrativa, gosta de detalhes e customização |
| Comportamentos observados | Frequenta lojinhas, decora casas/ambientes, inventa roupas/acessórios, brinca com pets |
| Idioma | Português brasileiro |

Sofia é a usuária real e juíza final do MVP. Cada fase termina com sessão de teste com ela, e o feedback orienta a próxima fase.

## 4. Stack técnica

| Camada | Escolha | Razão |
|---|---|---|
| Linguagem | TypeScript (strict) | Corpus enorme para AI coding, type safety reduz bugs |
| Bundler | Vite | HMR rápido, configuração mínima |
| Game engine | **Phaser 3 (latest stable 3.x na Fase 0, pinado em `package.json`). NÃO Phaser 4.** | 2D maduro, mobile touch resolvido, scenes/sprites/depth nativos. Phaser 4 mudou API e tem corpus de IA muito menor; agentes vão misturar APIs se a versão ficar solta. |
| Estado fora do Phaser | Zustand | Leve, pouca cerimônia, agentes entendem bem |
| Persistência | IndexedDB via `idb-keyval` | Suporta payloads maiores que localStorage, simples |
| Service worker | Workbox (via `vite-plugin-pwa`) | Padrão de PWA, cache de assets |
| Validação de schemas | Zod | Valida `SaveState` em runtime; valida JSONs de conteúdo no build (testes garantem assets existem, IDs únicos, ações conhecidas) |
| Testes unitários | Vitest | Lógica pura (preço, save schema, moeda) e validação de JSONs de conteúdo |
| Testes smoke | Playwright (3 testes) | "Abre", "arrasta personagem", "build offline funciona" — rodam local; alta razão custo/benefício para vibe coding |
| Empacotamento futuro | Capacitor (apenas se virar produto) | Reaproveita 100% do código web como app nativo |

### Stack descartada e por quê

- **React + DOM/CSS puro**: viável e ainda mais "agent-friendly", mas reinventa Z-order, sprite atlases, gestão de cenas. Mantido como plano C.
- **Godot 4**: ferramenta certa "no papel" para o gênero, mas GDScript tem corpus AI menor e ciclo de build (Android Studio, Xcode) atrasa a iteração com a Sofia. Reservado para eventual v2.0 caso o jogo seja portado para performance nativa.

## 5. Arquitetura

### 5.1 Cenas Phaser

```
BootScene ──► PreloadScene ──► MapScene
                                  ├──► HouseScene (3 cômodos: quarto, sala, cozinha)
                                  ├──► ParkScene
                                  └──► ShoppingScene
                                          ├──► ShopRoupasScene
                                          └──► ShopDecoracaoScene

Cenas sobrepostas (UI sempre disponível):
  HUDScene       — moeda, botão de inventário, botão de voltar
  WardrobeScene  — modal de customização de personagem
  ShopScene      — modal de compra
  InventoryScene — modal de itens possuídos
```

`HUDScene` é lançada uma única vez no início e fica como overlay permanente sobre todas as cenas de gameplay.

### 5.2 Estrutura de pastas

```
sophias-world/
├── public/
│   ├── manifest.json           — manifest PWA
│   ├── icons/                  — ícones gerados por script
│   └── assets/
│       ├── sprites/            — PNGs finais cortados
│       └── audio/              — SFX
├── src/
│   ├── main.ts                 — entrypoint
│   ├── scenes/                 — BootScene, MapScene, HouseScene, ...
│   ├── systems/
│   │   ├── characterComposer.ts — sistema de camadas
│   │   ├── interactionSystem.ts — drag-drop e triggers
│   │   ├── inventorySystem.ts
│   │   ├── currencySystem.ts
│   │   ├── saveSystem.ts        — idb-keyval, debounce, migração
│   │   └── audioSystem.ts
│   ├── data/                   — JSONs de conteúdo
│   │   ├── characters.json
│   │   ├── clothes.json
│   │   ├── furniture.json
│   │   ├── objects.json
│   │   ├── pets.json
│   │   └── scenes.json
│   ├── schemas/                — Zod schemas (SaveState + content JSONs)
│   ├── ui/                     — HUD em Phaser-native (sprites + bitmap text);
│   │                             DOM somente para tela de loading e "atualizando" do PWA
│   └── store/                  — Zustand stores
├── art-source/                 — originais da IA antes do cutout
├── tests/                      — Vitest (lógica + validação de conteúdo)
├── e2e/                        — Playwright (3 smoke tests)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-10-sophias-world-design.md
├── vite.config.ts
└── package.json
```

### 5.3 Princípio data-driven

Todo conteúdo do jogo (roupas, móveis, pets, objetos interativos, composição de cenas) é definido em JSON. **Conteúdo novo dentro dos tipos de ação existentes** (as ~8 ações listadas em §6.2) não exige código novo — apenas uma entrada no JSON correspondente e uma sprite. Tipos de ação inéditos (ex: minigame de cozinhar) sempre exigem código.

Os JSONs são validados por **schemas Zod** no build e em CI local: todo asset referenciado precisa existir em disco, todos os IDs precisam ser únicos por arquivo, toda `interaction.actions[].type` precisa estar na lista conhecida.

Isso permite que o agente de IA expanda o conteúdo em paralelo enquanto a lógica do jogo permanece estável.

### 5.4 Z-order

Phaser oferece `sprite.depth` nativamente. Convenção: `depth = sprite.y` (quanto mais embaixo na tela, mais na frente). Para móveis que precisam cortar o personagem (parte de trás + parte da frente), usamos duas sprites empilhadas com `depth` calculado por marca de referência.

### 5.5 Fronteira Phaser ↔ Zustand ↔ save

Para evitar listener leaks e bugs de lifecycle (Scene assina store, Scene morre, listener fica vazando):

- **Phaser scenes leem snapshots** do Zustand quando precisam, e **emitem eventos** quando o jogador faz algo significativo. Scenes não se "inscrevem" continuamente no store.
- **Zustand mantém apenas estado serializável** — o que vai no save. Referências a `Phaser.GameObjects` ficam em maps locais da scene, fora do store.
- **`saveSystem` é o único observador permanente do store**: ele assina mutações, debounce 1s, escreve no IndexedDB.
- **Eventos cross-scene** (ex: HUD precisa saber que o jogador ganhou moeda) usam `Phaser.Events.EventEmitter` global, não subscriptions do store.

### 5.6 Estratégia de update do PWA

Service workers offline podem prender o usuário em uma versão antiga do jogo. Política explícita:

- **Constante `APP_VERSION`** em `src/version.ts`, lida em build e injetada no service worker e no save.
- **`vite-plugin-pwa` em modo `autoUpdate`** com cache bust por hash de conteúdo.
- Quando o SW detecta nova versão, mostra **tela mínima "Atualizando…"** (DOM simples, não Phaser) por ~1–2s e recarrega.
- **Migração de save**: cada bump de `SaveState.version` registra uma função de migração idempotente em `src/systems/saveMigrations.ts`. Toda migração tem teste Vitest correspondente.
- **Teste manual obrigatório a cada release**: deploy → fechar PWA → reabrir offline → confirmar que o save antigo carrega e o jogo funciona.

## 6. Sistemas centrais

### 6.1 Sistema de personagem (`CharacterComposer`)

O personagem é um `Phaser.GameObjects.Container` composto por camadas de sprite intercambiáveis com o mesmo ponto de ancoragem.

**Ordem de renderização (de baixo para cima):**

1. Sombra no chão
2. Corpo base (tom de pele aplicado via `tint`)
3. Cabelo de trás (rabo, tranças)
4. Top / parte de cima
5. Bottom / parte de baixo (vestido sobrepõe top + bottom)
6. Sapatos
7. Olhos + boca (atlas de expressões: feliz, surpresa, dormindo, comendo)
8. Cabelo da frente (franja)
9. Acessórios (óculos, chapéu, colar, bolsa — array, múltiplos simultâneos)

**Modelo de dados:**

```typescript
type Character = {
  body: {
    skinTone: "1" | "2" | "3" | "4" | "5",
    bodyType: "kid"
  },
  hair: { styleId: string, color: string },
  face: { eyes: string, mouth: string },
  outfit: {
    top?: string,
    bottom?: string,
    dress?: string,     // sobrepõe top + bottom quando setado
    shoes?: string,
    accessories: string[]
  }
}
```

`CharacterComposer` observa o estado Zustand do personagem e redesenha apenas a camada que mudou.

### 6.2 Sistema de interação (`interactionSystem`)

Todo objeto arrastável (personagem, pet, itens de inventário) recebe comportamento `Draggable`. No evento `dragend`, o sistema:

1. Detecta `InteractiveObject`s em overlap
2. Procura `interactions` cujo `trigger` corresponde (`drop-character`, `drop-pet`, `drop-item:food`, `tap`, etc.)
3. Se há **uma** interação possível, executa imediatamente
4. Se há **múltiplas**, abre a **roda de ações** (popup radial com ícones — ela escolhe)
5. Cada `action` é executada em sequência

**Definição de objeto interativo (`objects.json`):**

```json
{
  "id": "bed-pink",
  "sprite": "bed-pink.png",
  "interactions": [
    {
      "trigger": "drop-character",
      "label": "Dormir",
      "icon": "icon-sleep.png",
      "actions": [
        { "type": "play-animation", "target": "character", "anim": "sleep" },
        { "type": "set-expression", "target": "character", "expression": "sleeping" },
        { "type": "play-sound", "sound": "yawn" },
        { "type": "give-currency", "amount": 2, "firstTimeOnly": true }
      ]
    },
    {
      "trigger": "drop-pet",
      "label": "Pet dorme",
      "icon": "icon-pet-sleep.png",
      "actions": [
        { "type": "play-animation", "target": "pet", "anim": "sleep" }
      ]
    }
  ]
}
```

**Tipos de ação suportados** (engine genérica, ~8 tipos cobrem 95% dos casos):

- `play-animation` — toca animação em personagem/pet/objeto
- `play-sound` — toca SFX
- `set-expression` — muda atlas de olhos/boca
- `swap-sprite` — troca sprite do objeto (ex: copo cheio → copo vazio)
- `give-item` — adiciona item ao inventário
- `give-currency` — adiciona estrelinhas (com flag `firstTimeOnly`)
- `spawn-particle` — efeito visual (coração, estrela)
- `wait` — pausa entre ações

### 6.3 Sistema de moeda e loja

**Moeda única:** ⭐ "estrelinhas". Sem moeda premium. Sem dinheiro real. Sem RNG.

**Ganho de estrelinhas:**

| Evento | Recompensa |
|---|---|
| Descobrir interação pela primeira vez | +1 a +3 ⭐ (definido por objeto) |
| Abrir o jogo no dia (1ª vez) | +5 ⭐ |
| Marco de decoração ("mobiliou o quarto") | +10 ⭐ |
| Pacote de boas-vindas (1ª sessão) | +100 ⭐ |

**Gasto:**

- Lojas vendem itens a preços fixos
- Botão "Comprar" só habilita com estrelinhas suficientes
- Sem urgência, sem expiração, sem desconto, sem vitrine rotativa no MVP
- Itens iniciais grátis: ~5 roupas básicas + ~3 móveis básicos (para ela não travar antes de ganhar a primeira estrelinha)

**UI da loja:**

- Grid de itens por categoria (tab de roupas, tab de móveis, tab de comida)
- Tap em item: preview no personagem (se for roupa) ou no cômodo (se for móvel)
- Tap em "Comprar": desconta estrelinhas, item entra no inventário, fica equipado/colocado se ela confirmar

### 6.4 Sistema de pet

Pet é um `Draggable` com AI simples de wandering quando não está sendo arrastado: anda em pontos aleatórios da cena atual, ocasionalmente para perto do personagem.

**Estados do pet (sem decay temporal):**

```typescript
type Pet = {
  breed: "dog",
  color: string,
  accessories: string[],
  state: {
    hunger: 0..100,
    energy: 0..100,
    happiness: 0..100
  }
}
```

Os meters **não diminuem com o tempo real** e **não diminuem entre sessões**. Sobem quando a Sofia cuida; ficam estáveis quando ela está fazendo outra coisa. Decisão deliberada para evitar ansiedade em criança que joga sem supervisão. Em v1.1 pode-se experimentar "humor recente" (variação intra-sessão sem punição), mas o MVP é zero-decay puro.

**Ações de cuidado:**

| Ação | Como ela executa |
|---|---|
| Alimentar | Arrasta comida do inventário sobre o pet |
| Dar água | Arrasta tigela de água sobre o pet (futuro — não MVP) |
| Brincar | Tap no pet sem item, ou arrasta brinquedo sobre o pet |
| Dormir | Arrasta o pet na cama do pet |
| Banho | Arrasta o pet no banho (cena casa, banheiro — entra na Fase 5b junto com o ambiente decorável) |

**Customização do pet:** 3 cores de pelo + 5 acessórios (coleira, laço, óculos, capa, fantasia).

No MVP, o pet vem **grátis** com a Sofia desde a primeira sessão. Não é compra.

### 6.5 Sistema de decoração

Cada cômodo da casa define em `scenes.json` uma **área de decoração** (retângulo do chão onde móveis podem ser colocados) e um **passo de grid** (ex: 32px) para posicionamento. A Sofia pode:

- Arrastar móvel do inventário para o cômodo — solta livremente, o móvel snap-a para a célula de grid mais próxima
- Reposicionar móveis já colocados (mesmo snap)
- Remover móvel (long-press 1s + ícone de remover aparece)

Decoração é isolada por cena: cada cômodo guarda sua própria composição no save (`scenes[sceneId].furniturePlacement`). Não há quantidade fixa de "slots" — qualquer célula livre do grid aceita qualquer móvel cujas dimensões caibam.

### 6.6 Sistema de save

**Schema unificado, IndexedDB via `idb-keyval`, validado em runtime por Zod:**

```typescript
type SaveState = {
  version: 1,                              // bump a cada mudança incompatível
  appVersion: string,                      // APP_VERSION na hora do save (debug)
  character: Character,
  pet: Pet,
  currency: number,
  currentScene: string,                    // última cena ativa
  characterPositionByScene: Record<string, { x: number; y: number }>,
  petPositionByScene: Record<string, { x: number; y: number }>,
  inventory: {
    clothes: string[],                     // IDs únicos em clothes.json (set semântico)
    furniture: string[],                   // IDs únicos em furniture.json
    food: Array<{ itemId: string; count: number }>  // consumível, precisa contar
  },
  scenes: {
    [sceneId: string]: {
      furniturePlacement: Array<{
        placementId: string,               // UUID — duas cadeiras iguais têm placementIds distintos
        itemId: string,
        x: number,
        y: number,
        rotation: 0 | 90 | 180 | 270,      // graus, snap a cardeal
        variant?: string,                  // cor/textura opcional (futuro)
        scale: number,                     // 1.0 default; permite "miniaturas" futuras
        locked: boolean                    // não-removível, fixos da cena
      }>
    }
  },
  discoveredInteractions: string[],        // formato: `${objectId}:${trigger}` — granular por interação, não só objeto
  settings: {
    sfxVolume: 0..1,
    parentalLockEnabled: boolean
  },
  flags: {
    welcomeBonusGiven: boolean,
    dailyBonusLastDate: string             // ISO date "YYYY-MM-DD" no fuso local
  },
  lastPlayed: number                       // unix timestamp ms
}
```

**Política de save:**

- Auto-save debounced (1s) a cada mutação relevante
- Sem botão "salvar" visível para a Sofia
- **Validação Zod em load**: se o save não bater no schema (corrupção, downgrade), entra modo de recuperação — não sobrescreve, oferece export do save quebrado para o pai e oferece "começar do zero" como ação explícita
- **Migração**: ao carregar save, se `version < CURRENT_VERSION`, aplica migrações em sequência (`saveMigrations.ts`). Cada migração tem teste unitário com fixture do schema antigo

**Resiliência iOS / WebKit (importante):**

- **`navigator.storage.persist()`** chamado no primeiro save bem-sucedido (depois do welcome bonus). WebKit pode descartar IndexedDB de PWAs não-persistidos depois de inatividade prolongada.
- **`QuotaExceededError`** tratado em `saveSystem`: log, toast amigável ("o jogo guardou bastante coisa! avise um adulto"), mantém o save anterior intacto.
- **Sem reset silencioso**: nenhum caminho de código limpa o save sem ação humana explícita.
- **Backup parental — export/import JSON**:
  - **Export**: no menu de Configurações (atrás de um parental gate simples — segurar 3 dedos por 2s ou resolver uma soma), botão "Salvar backup" baixa um JSON com o `SaveState` completo.
  - **Import**: outro botão pede um arquivo JSON, valida com Zod, e (após confirmação) sobrescreve o save atual.
  - Os dois operam só com arquivo local — nada vai pra rede.

**Teste de longevidade (deliverable da Fase 0):** simular "7+ dias sem abrir o jogo" mudando relógio do dispositivo + ciclar app → confirmar que o save sobrevive em iPad real.

### 6.7 Áudio

- `audioSystem` gerencia pool de SFX
- Volume ajustável (1 controle global no menu de pausa — fora do alcance direto da Sofia)
- Sem música ambiente no MVP
- ~15-20 SFX no MVP, todos curtos (<1s na maioria)

## 7. Pipeline de arte

### 7.1 Style sheet

Documento curto que entra como referência em toda geração:

- **Estilo**: manga kawaii / chibi fofinho, traço suave, cores chapadas com sombras suaves
- **Referências de linguagem**: anime infantil (não copiar nenhum personagem específico)
- **Paleta**: ~12 cores pastel saturadas — a paleta concreta (códigos hex) é deliverable da Fase 0 e fica registrada em `art-source/STYLE.md` antes da primeira geração da Fase 1
- **Proporção**: criança ~3-4 cabeças de altura, olhos grandes
- **Iluminação**: luz do topo, sombras cinza translúcidas
- **Fundo**: transparente (PNG com alfa)
- **Prompt negativo padrão (anti-IP)**: incluir em TODA geração — "no Avatar World style, no Toca Boca style, no specific anime character, no copyrighted character, no trademark, original design only". O nome desses jogos/marcas como negative prompt reduz a chance da IA replicar paletas/poses que ela viu durante treinamento.

O style sheet é um arquivo `art-source/STYLE.md` versionado.

### 7.2 Personagem base

Antes de qualquer roupa, gerar **um único** personagem base em pose neutra. Toda roupa/acessório/cabelo é cortado e alinhado a essa base.

### 7.3 Fluxo de produção por item

```
1. Definir item                ("vestido azul com estrelas, manga curta")
2. Prompt template + style ref → Nano Banana gera 4 variações
3. Escolha manual da melhor
4. Background removal automático (rembg local)
5. Alinhar ao body base        (script Python ou Photopea)
6. Exportar PNG transparente   (512×512 padrão, ajustável por slot)
7. Adicionar entrada no JSON
```

**Tempo realista (calibrado pelo review do Codex):**

- **Primeiros 10 itens**: 30–60 min por item. O pipeline está sendo montado, ajustando prompt template, descobrindo edge cases de cutout, alinhando offsets ao body base.
- **Itens subsequentes (pipeline maduro)**: ~10 min para roupa simples; 15–25 min para roupa com camadas complexas (vestido com babado, mochila com tiras).
- **Props simples** (xícara, livro, suco): ~5–10 min mesmo no início.

A meta dos 5-10 min é alcançável apenas para props simples e roupas básicas depois que o pipeline maturar; para roupas em camadas alinhadas ao corpo, esperar 20–60 min até estabilizar.

### 7.4 Ferramentas

| Necessidade | Ferramenta principal | Backup |
|---|---|---|
| Geração de imagem | Gemini Nano Banana (gratuito, edit multimodal) | Midjourney pago (se MVP virar produto) |
| Background removal | `rembg` (Python local) | remove.bg web |
| Edição final | Photopea (web gratuito) | Affinity Photo |
| Organização | `art-source/` versionado + `public/assets/sprites/` | — |
| Texture atlas | TexturePacker (gratuito básico) | Phaser pode usar PNGs individuais antes do polish |

### 7.5 Quality bar

- Consistência > beleza
- Sofia é a juíza final por fase
- Refazer artes vira tarefa de v2

### 7.6 Licenciamento

Para uso pessoal no MVP, Nano Banana é suficiente. Caso o cenário B (publicação) se concretize, revisar termos atuais e considerar regenerar artes-chave em ferramenta com licença comercial clara (Midjourney pago, Adobe Firefly, ou Flux dev/SDXL local).

### 7.7 Áudio

- SFX de: freesound.org (CC0/CC-BY), Zapsplat (cadastro gratuito), Pixabay sound effects
- SFX sintéticos cute (clique, pop, ding): Bfxr / jsfxr (web, gratuitos)
- Licenças anotadas em `public/assets/audio/CREDITS.md`

## 8. Roadmap MVP

Total estimado: **~120 horas ≈ 12 semanas a 10h/semana ≈ 2.5–3 meses**. Cada fase entrega algo jogável.

### Fase 0 — Gate de risco técnico (15–20h, 1–2 semanas)

Fase 0 **não é "setup". É gate de risco**: existe para provar que as escolhas técnicas funcionam ANTES de investir em conteúdo. Sai da fase só quando todos os critérios de saída forem atendidos.

**Atividades:**

- Repositório Git, Vite, TypeScript, Phaser 3 pinado, Zustand, idb-keyval, Zod, Vitest, Playwright, ESLint
- `vite-plugin-pwa` com `APP_VERSION`, cache bust, "atualizando" screen mínima
- `BootScene` + `PreloadScene` Phaser funcionando
- 1 personagem base hardcoded + drag-drop funcionando em iPad real
- Pipeline de arte ponta-a-ponta: gerar 1 roupa real no Nano Banana, cortar com rembg, alinhar ao body base, exportar PNG, carregar no Phaser
- `SaveState` mínimo (apenas `character` + `currency: 0`) com `navigator.storage.persist()`
- Smoke tests Playwright (3): abre o jogo, arrasta personagem, build offline carrega

**Critérios de saída (TODOS obrigatórios):**

1. ✅ Sofia abre o link no iPad real, instala como ícone na home
2. ✅ Modo avião: jogo carrega e roda sem rede
3. ✅ Arrasta o personagem com o dedo, drop estável (sem stuttering)
4. ✅ Fechar app, virar relógio do iPad +7 dias, reabrir: save sobrevive
5. ✅ Pipeline de arte gerou 1 roupa real consistente com o style sheet
6. ✅ 3 smoke tests Playwright passando localmente
7. ✅ Style sheet (`art-source/STYLE.md`) escrito com paleta hex finalizada

🎯 **Marco**: Sofia abre o ícone do iPad dela e arrasta um boneco com uma roupa real. Você consegue dormir tranquilo sabendo que a stack inteira funciona.

### Fase 1 — Personagem & guarda-roupa (~25h, 2–3 semanas)

- `CharacterComposer` (sistema de camadas, atlas de expressões)
- `WardrobeScene` (UI de customização — tabs por categoria)
- Conteúdo de partida (reduzido — qualidade > quantidade): 5 cabelos × 4 cores, 5 olhos, 5 bocas, 5 tons de pele, **6–8 roupas + 3 acessórios**
- Save estendido para customização completa
- **Sinal a observar com a Sofia**: ela pede "amiga/mãe/irmã"? Se sim, considerar "duplicar personagem atual" como fast follow pós-MVP (v1.1)
- 🎯 **Marco**: Sofia passa 30 minutos só vestindo o boneco.

### Fase 2 — Cenas & interações (~25h, 2–3 semanas)

- `MapScene` (mapa-mãe com 3 ícones)
- `HouseScene` (1 cômodo inicial — quarto)
- `ParkScene`
- Engine de interações data-driven (`objects.json`)
- Roda de ações (com QA depois: testar bolha-acima-do-objeto em celular pequeno; trocar se ler melhor)
- Z-order automático
- 10 objetos interativos (cama, suco, livro, mesa, cadeira, brinquedo, espelho, balanço, escorregador, fonte do parque)
- 15 SFX integrados
- 🎯 **Marco**: Sofia explora 2 cenas e descobre ações sozinha.

### Fase 3 — Loja, moeda, inventário (~20h, 2 semanas)

- HUD persistente em Phaser-native (sprites + bitmap text)
- `ShopScene` (UI de compra com preview)
- `InventoryScene`
- Sistema de ganho de estrelinhas (descobertas, daily, marcos)
- **Pacote de boas-vindas: 100 ⭐** — economia calibrada como "brincadeira de lojinha, não escassez": com 100 ⭐ ela deve comprar 4–8 itens iniciais sem suar (preços-alvo: top 10⭐, vestido 25⭐, móvel 30–50⭐, acessório 5–15⭐)
- 1ª lojinha funcional (roupas) com 20 itens — preenche com o conteúdo da Fase 1 + 12 novos
- Save expandido (inventário, currency, settings, flags)
- 🎯 **Marco**: Sofia ganha estrelinha, compra item novo, equipa.

### Fase 4 — Pet (~15h, 1.5 semanas)

- Pet sprite + AI básica (wandering, ocasionalmente seguir personagem)
- **3 ações de cuidado no MVP: alimentar, brincar, dormir.** Banho fica explicitamente para a Fase 5a (depende do banheiro decorável).
- Customização do pet (3 cores + 5 acessórios)
- Comida do pet adicionada na loja
- 🎯 **Marco**: Sofia cuida do pet por uma sessão inteira.

### Fase 5a — Decoração core (~10h, 1 semana)

Decoração não é polish — é um dos quatro pilares do jogo. Ganhou fase própria.

- Sistema de mover móveis com snap a grid (drag, snap, rotate 90°, remover)
- **1 cômodo decorável de verdade: o quarto** (em vez de 3 cômodos meia-boca)
- 2ª loja no shopping (decoração) com 15–20 móveis
- Inventário expandido para móveis
- 🎯 **Marco**: Sofia mobilia o quarto dela do jeito que quer.

### Fase 5b — Expansão & polish (~10h, 1 semana)

- Casa expandida para 3 cômodos (sala + cozinha entram, decoráveis também)
- Banheiro como ambiente extra ou parte de um cômodo: habilita ação de banho do pet (fechando o gap da Fase 4)
- Parque com mais objetos
- SFX faltantes e refino de animações
- "Add to Home Screen" prompt no momento certo (sessão 2 ou 3)
- QA observacional com Sofia (sessão livre, sem direção)
- Ajustes finais de balanceamento de preço/recompensa
- 🎯 **Marco MVP**: Sofia escolhe Sophia's World em vez de Avatar World numa sessão livre.

## 9. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Pipeline de arte engasga e desanima | Alta | Alto | Montar pipeline na Fase 0 como gate; estimativa realista 30–60 min/item nos primeiros 10; regra "ship imperfeito" |
| Sofia perde interesse no meio | Média | Médio | Cada fase entrega jogável; sessão de teste com ela ao fim de cada fase |
| Bugs de touch no Safari iOS | Média | Médio | Testar em iPad real desde a Fase 0, não simulador |
| Bundle muito grande para mobile | Baixa | Médio | Texture atlases na Fase 5b; lazy load por cena |
| Sobrecarga do desenvolvedor | Média | Médio | Pausas longas são OK; nenhuma fase tem deadline externa |
| Licença Nano Banana incompatível com produto | Média | Alto se virar produto | Regenerar artes-chave com Midjourney/Firefly antes de publicar |
| **WebKit/iOS descarta IndexedDB de PWA inativa** | **Média** | **Alto (perda do save)** | `navigator.storage.persist()` no 1º save; export/import JSON pelo menu parental; teste de longevidade "7+ dias sem abrir" como critério de saída da Fase 0 |
| **Service worker prende usuário em versão antiga** | **Média** | **Médio** | `vite-plugin-pwa` autoUpdate + cache bust por hash; tela "atualizando" mínima; teste manual offline-após-deploy a cada release; migrações idempotentes com fixture |
| **Agente de IA mistura APIs de Phaser 3 e Phaser 4** | **Média** | **Médio** | Phaser pinado em `package.json` na versão 3.x; instruir agente explicitamente "NÃO Phaser 4" no AGENTS.md |
| **Roupas em camadas geradas pela IA não alinham consistente ao body base** | **Média** | **Alto** | Body base hardcoded como referência fixa; primeiros 10 itens manuais para calibrar offsets; aceitar 30–60 min/item até estabilizar |

## 10. Decisões registradas

| # | Decisão | Razão |
|---|---|---|
| D1 | Stack web (TS + **Phaser 3 pinado, NÃO Phaser 4** + PWA), não Godot | Vibe coding + agente de IA + iteração rápida com Sofia. Phaser 4 ainda tem corpus de IA pequeno e agentes misturam APIs |
| D2 | 1 personagem no MVP, não múltiplos | Reduz UX de seleção e save de 30% sem perder o core loop. Observar sinal da Sofia: se ela pedir "amiga/mãe" cedo, multi-character vira fast follow em v1.1 |
| D3 | Pet sem decay temporal e sem decay entre sessões | Evitar ansiedade em criança que joga sem supervisão constante. "Humor recente" intra-sessão fica como possível experimento em v1.1, NÃO no MVP |
| D4 | Moeda única, sem premium | Sem ganchos psicológicos de jogo predatório |
| D5 | Pacote de boas-vindas 100 ⭐, calibrado como "brincadeira de lojinha, não escassez" | Ensina o loop de comprar desde o início, com folga: 100 ⭐ = 4–8 itens iniciais |
| D6 | Roda de ações para múltiplas opções (default); revisar contra "bolha-acima-do-objeto" em QA de celular pequeno | UX mais intuitiva que menu lateral para criança; QA decide se a bolha lê melhor em telas pequenas |
| D7 | Estilo manga kawaii / chibi fofinho **com prompts negativos anti-IP** | Pedido direto da Sofia; Nano Banana gera bem; negative prompts ("no Avatar World style, no Toca Boca, no copyrighted character") reduzem risco de plágio acidental |
| D8 | Save em IndexedDB com schema versionado por Zod, `navigator.storage.persist()`, export/import JSON pelo parental gate | Suporta payloads maiores; resiste a descarte WebKit/iOS; permite backup explícito do pai sem cloud |
| D9 | Sem áudio musical no MVP, **SFX desde a Fase 2** | SFX entregam 80% da experiência sonora com custo baixo |
| D10 | Vitest em lógica pura **+ 3 smoke tests Playwright** (abre, arrasta, build offline) | E2E grande tem custo-benefício ruim; 3 smoke tests cobrem regressões catastróficas no vibe coding |
| D11 | **MVP travado em orientação landscape**, portrait fica para v1.1 com tela "vire o aparelho" amigável | Suportar ambas duplica trabalho de UI; landscape é a forma canônica do gênero e do iPad |

## 11. Próximos passos imediatos

1. Inicializar repositório Git no diretório do projeto
2. Criar `.gitignore` com `.superpowers/`, `node_modules/`, `dist/`. Manter `art-source/` versionado por enquanto (originais + `STYLE.md`); migrar para Git LFS se o diretório passar de ~100 MB
3. Criar `AGENTS.md` com regra explícita "Phaser 3, NÃO Phaser 4" (anti-confusão de agente)
4. Criar plano de implementação detalhado a partir deste design (skill `superpowers:writing-plans`)
5. Começar Fase 0 com foco nos critérios de saída como gate de risco
