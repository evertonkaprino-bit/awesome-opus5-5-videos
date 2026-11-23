# Alinhavo — curta de terror em estilo stop-motion (9:16, 60 s)

Vídeo vertical para TikTok / YouTube Shorts com um personagem original — **Alinhavo**, um boneco costureiro
de porcelana e feltro que "conserta tudo que quebra" — na linguagem visual do stop-motion de terror
doméstico (luz de vela vs. frio, paleta dessaturada com um único acento carmim, movimento a 12 fps com tremido).

- `alinhavo_final_9x16.mp4` — vídeo final (1080×1920, 24 fps com animação em "dois", H.264 + AAC, −14 LUFS)
- `alinhavo_quadros.png` — folha de contato (1 quadro a cada 2 s)
- `alinhavo_capa.png` — capa 1080×1920 (`npx remotion still src/index.ts Capa out/capa.png`)
- `POSTAGEM.md` — legendas, títulos e hashtags para TikTok e Shorts + checklist de publicação
- `producao.md` — guia de produção, custos e status das etapas
- `video/` — projeto Remotion que gera o vídeo inteiro por código

## Como funciona

| Arquivo | O que faz |
|---|---|
| `video/src/lib.tsx` | Boneco em SVG (textura de feltro/porcelana que "ferve" a cada quadro), vela, granulação, vinheta, legendas, tremido |
| `video/src/scenes.tsx` | As 10 cenas do roteiro (hook, sótão, conserto, rachadura, corredor, janela verde, escuro, retorno, agulha, loop) |
| `video/src/Root.tsx` | Linha do tempo (duração de cada corte) |
| `video/audio/make_audio.py` | Trilha 100% sintetizada e original (chuva, relógio, caixinha de música, cliques, estalo, passos, fósforo, sussurro via espeak-ng) |

## Renderizar de novo

```bash
cd video
npm install
python3 audio/make_audio.py            # requer numpy, scipy e espeak-ng
npx remotion render src/index.ts AlinhavoMudo out/alinhavo_mudo.mp4 --concurrency=4
ffmpeg -i out/alinhavo_mudo.mp4 -i public/audio.wav \
  -filter_complex "[1:a]loudnorm=I=-14:TP=-1.0:LRA=11[a]" -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest out/alinhavo_final.mp4
```

Prévia interativa: `npx remotion studio src/index.ts`.
