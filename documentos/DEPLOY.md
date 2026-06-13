# App Revista — Guia de Deploy e Arquitetura

Documento de referência para deploys futuros. Última atualização: 2026-05-30.

---

## 1. Visão geral da arquitetura

O projeto tem três partes:

| Parte | Pasta | Tecnologia | Onde roda |
|-------|-------|------------|-----------|
| App Android | `capacitor/` | Capacitor (wrapper nativo) | Celular do usuário |
| Backend / API | `api/` | NestJS + Postgres | Servidor |
| Site (conteúdo) | `src/` (Next.js) | Next.js / React | `https://apprevista.com.br` |

**Ponto-chave:** o app Android **NÃO contém o site embutido**. Ele é apenas um invólucro (WebView) que carrega o site remoto.

```ts
// capacitor/capacitor.config.ts
appId: 'br.com.apprevista.app'
server.url: 'https://apprevista.com.br'
webDir: 'www'
```

---

## 2. Regra de ouro: quando precisa de novo AAB?

Como o app carrega o site remoto via `server.url`, a maioria das mudanças **NÃO** exige novo AAB.

### Deploy só pelo SERVIDOR (sem AAB):
- Qualquer mudança no site / conteúdo / front-end (`src/`)
- Qualquer mudança na API (`api/`)
- Textos, telas, layout, lógica de negócio

### Precisa GERAR e SUBIR novo AAB (mudança nativa):
- Ícone do app / splash screen
- `versionCode` / `versionName`
- Permissões Android (AndroidManifest)
- Plugins Capacitor novos
- Mudança em `capacitor.config.ts` (ex.: trocar a `server.url`)

---

## 3. Como gerar o AAB assinado (passo a passo)

### 3.1 Pré-requisitos / variáveis de ambiente
O build local exige caminhos específicos (o `JAVA_HOME` do sistema aponta para um JDK inválido, por isso sobrescrevemos a cada sessão):

```powershell
$env:JAVA_HOME        = "C:\Users\HP\.bubblewrap\jdk\jdk-17.0.11+9"
$env:ANDROID_HOME     = "C:\Users\HP\.bubblewrap\android_sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\HP\.bubblewrap\android_sdk"
```

> O `sdk.dir` também está fixado em `capacitor/android/local.properties`:
> `sdk.dir=C\:/Users/HP/.bubblewrap/android_sdk`

### 3.2 Bump de versão (OBRIGATÓRIO antes de cada upload)
Editar `capacitor/android/app/build.gradle` → bloco `defaultConfig`:

```gradle
versionCode 4         // SEMPRE incrementar (+1). O Play REJEITA versionCode repetido.
versionName "1.0.3"   // string visível ao usuário
```

### 3.3 Comando de build
```powershell
Set-Location "...\App Revista\capacitor\android"
cmd /c ".\gradlew.bat bundleRelease --no-daemon -Dorg.gradle.jvmargs=-Xmx1024m" > "$env:TEMP\aab_build.log"
"EXIT=$LASTEXITCODE"   # esperado: EXIT=0
```

> **Heap limitado a 1024m de propósito.** Em `capacitor/android/gradle.properties` a
> última linha é `org.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=384m`. Valores
> maiores causavam o erro "Could not reserve enough space for object heap" nesta máquina.

### 3.4 Saída e cópia para upload
```
Gerado em: capacitor/android/app/build/outputs/bundle/release/app-release.aab
Copiar para a Área de Trabalho renomeando com a versão, ex.:
  app-revista-v1.0.3-vc4.aab
```

---

## 4. Assinatura (keystore)

Configurada em `capacitor/android/app/build.gradle` → `signingConfigs.release`:

- **Keystore:** `~/OneDrive/Área de Trabalho/apprevista-release.jks`
- **Alias:** `apprevista`
- **Senha (store e key):** está em texto puro no próprio `build.gradle`.

⚠️ **NUNCA perder este `.jks`.** Sem ele é impossível publicar atualizações do app no Play
(a Google exige sempre a mesma chave de assinatura).

---

## 5. Ícone do app

- **Logo fonte:** `~/OneDrive/Área de Trabalho/Logos/Logo App Revista.png` — logo "pura"
  (aspecto 3D é **intencional**; foram removidos apenas sombras e brilho). Arquivo é enorme
  (~30000×30000 px); para reamostrar use decodificação reduzida (ex.: WPF `BitmapImage`
  com `DecodePixelWidth=1024`) — `System.Drawing` estoura `OverflowException` no tamanho cheio.
- Ícones gerados **full-bleed** ("preenchendo tudo") em todas as densidades:
  `capacitor/android/app/src/main/res/mipmap-*/` →
  `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`.
- **Fundo do ícone transparente:** `res/values/ic_launcher_background.xml` →
  `<color name="ic_launcher_background">#00000000</color>`.
- Trocar o ícone = mudança nativa → exige novo AAB (ver seção 2).

---

## 6. Backend / API (`api/`)

- NestJS + Postgres (lib `postgres`). Ao gravar JSON em colunas, usar
  `this.sql.json(valor as postgres.JSONValue)` (senão o `tsc` quebra).
- Validações de boot aplicadas: `JWT_SECRET` obrigatório no boot; CORS configurado.
- Lint: eslint flat config; `react-hooks/set-state-in-effect` rebaixado para `warn`.
- Deploy da API é **pelo servidor** — não envolve AAB.

---

## 7. Histórico de versões publicadas

| versionCode | versionName | Data | Notas |
|-------------|-------------|------|-------|
| 3 | 1.0.2 | — | Última publicada antes desta sessão |
| 4 | 1.0.3 | 2026-05-30 | Novo ícone (logo pura, full-bleed, fundo transparente) |

> Próximo upload: usar versionCode **5** ou superior.

---

## 8. Checklist rápido de deploy do app (AAB)

1. [ ] A mudança é nativa? (senão, deploy pelo servidor e pare aqui)
2. [ ] Incrementar `versionCode` (+1) e atualizar `versionName` em `app/build.gradle`
3. [ ] Setar `JAVA_HOME` / `ANDROID_HOME` / `ANDROID_SDK_ROOT` (seção 3.1)
4. [ ] `gradlew.bat bundleRelease` → conferir `EXIT=0`
5. [ ] Copiar `app-release.aab` p/ Área de Trabalho renomeado com a versão
6. [ ] Subir no Google Play Console
7. [ ] Atualizar a tabela da seção 7 deste documento
