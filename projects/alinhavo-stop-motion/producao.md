# Alinhavo — produção (stop-motion de terror, 9:16, ~60s)

## Status
- [x] Folha de personagem (2 variações) — ElevenLabs flow 8PF1Xf6XhdSmwWJlUVem (gemini-3-pro-image)
  - A: generation v3JRuE5djyCUX7AiZEsi
  - B: generation mUhBikk8NNauEY9nhY4m
- [x] Variação escolhida: A (nó de referência 2zRj8Bx9Wg0D9kIXeY1s)
- [x] Quadros-chave 9:16 2K (gemini-3-pro-image, ref. folha A):
  | Cena | Nó | Generation |
  |---|---|---|
  | 01 Hook | oKRCR9qGJ4sgPKzR1tas | x11lrF53a3tR6L54ZXbr |
  | 02 Sótão | wmTb62StHXmrssR5qIEK | g3HhvCkRAuhgDuBPJPm8 |
  | 03 Conserto | 4jPu5nnHMbJHwDYhxsme | XMMk5p0z2ReYu4Vi8gVo |
  | 04 Virada | nm1BaRgyAQSued527fEj | A0e4L7wBiYWXQslaQMYG |
  | 05 Corredor | nCiFxxYY5KEFCStG6eaR | iWL3PqJDTefOEm9a27qh |
  | 06 Clímax | jtHVFMvfT6CxTy7FPDp7 | EOuReUKpPCjKnpuVaFtS |
  | 08 Retorno | YgAaPA6nc7GysafZPKKj | GuPAtm2ZoR9BwDG0pvQ5 |
  | 09 Gancho | DBFxOBqWqsQUroJXkORT | JNYw97Yflc2iDUuEQ75v |
- Gasto até aqui: ~US$ 5,58 (ElevenLabs)
- [ ] Animar cenas 1–6, 8, 9 (Kling 3 Pro, 1080p, 9:16, sem áudio nativo) — cenas 7 e 10 feitas na montagem
  | Cena | Nó de vídeo | Status | Generation |
  |---|---|---|---|
  | 01 (3s) | RVj0GL4CNoSiP4Y7S8Et | ✅ pronto | PuIND3G3g5gfVJSbM0Gk |
  | 02 (7s) | ckGYPFM0AthW5KnhnbP7 | ✅ pronto | jFS7GX0SjVuNJ3wJUSiK |
  | 03 (6s) | L8niEPYrGRTDCTvTlfrm | ✅ pronto | LA3bymD8xHhk0RKNnSMm |
  | 04 (7s) | uDQ78H0db5OudgBQ5xGk | ⏸ pendente (créditos) | — |
  | 05 (8s) | Eq36DvLW4RVnGZBUZ4hs | ⏸ pendente (créditos) | — |
  | 06 (8s) | BWfQMoSfzLD2rRbMQvzx | ⏸ pendente (créditos) | — |
  | 08 (8s) | 94IfbfuzDfsK4A4jshT1 | ⏸ pendente (créditos) | — |
  | 09 (6s) | xM6qto7CoU06Otl2QkoO | ⏸ pendente (pagamento) | — |
  - Falta ~25.100 créditos ElevenLabs (~US$ 5) para os 5 restantes. Prompts já estão nos nós; basta rodar.
- [ ] Sons (ElevenLabs SFX + sussurro "Sua vez.")
- [ ] Montagem Remotion: hold 2 frames @24fps (12fps), jitter ±1px, grão, vinheta, legendas, 1080x1920

## Bloco de estilo (anexar a todo prompt)
handcrafted stop-motion puppet film, miniature set, macro lens shallow depth of field, felt and micro-knit
textures with visible fibers and fingerprints, porcelain with hairline seams, practical candle key light,
cold teal moonlight fill, long hard shadows, desaturated palette with single crimson accent, gothic domestic
horror, symmetrical framing, 35mm film grain, vertical 9:16

## Custos estimados (23/11/2026)
| Item | Higgsfield | ElevenLabs |
|---|---|---|
| Imagem | 2 cr (Nano Banana Pro) | ~US$0,24 (Gemini 3 Pro Image) |
| Vídeo ~5–6s | 8,75 cr (Kling 3.0) / 22,5 cr (Seedance 2.0) | ~US$1,02 (Kling 3 Pro) / ~US$2,80 (Seedance 2.5) |

## Versão final gratuita (código) — 23/11/2026
Sem créditos no Higgsfield/ElevenLabs e sem acesso de rede aos arquivos de lá, o vídeo foi refeito 100% em código:
- `video/` — projeto Remotion (src/lib.tsx = boneco SVG + vela + granulação; src/scenes.tsx = 10 cenas; src/Root.tsx = linha do tempo)
- `video/audio/make_audio.py` — trilha sintetizada (chuva, relógio, caixinha de música original, cliques, sussurro espeak-ng)
- Render: `npx remotion render src/index.ts AlinhavoMudo out/alinhavo_mudo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell --concurrency=4`
- Mix: ffmpeg loudnorm I=-14 TP=-1 → `alinhavo_final_9x16.mp4` (1080x1920, 24 fps, 60 s, H.264 + AAC)
