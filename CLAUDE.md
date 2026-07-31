# Portfolio — Román Paparella

Sitio estático de portfolio de diseño de producto. Sin build step, sin dependencias: HTML plano + una hoja de estilos compartida. Se edita y se sirve tal cual.

---

## Reglas — leer antes de tocar nada

Estas tres mandan por encima de cualquier otra cosa en este archivo.

### 1. Los componentes compartidos se cambian en todas las páginas, a la vez

Navbar, project cards y footer son **un solo componente replicado en 21 archivos**. Si el pedido es **estructural, de tamaño o de color**, se aplica en **todas** las páginas —las 21, español e inglés— y además se refleja en `estilos.html` en el mismo cambio.

Aplica a: agregar o sacar items, reordenar, cambiar clases o markup, gaps, paddings, tamaños, tipografía, colores, estados de hover.

**No aplica al contenido.** Cambiar el texto de un case study, un título o una imagen es de una página sola.

Antes de dar por terminado un cambio de estos, verificar que no quedó ninguna atrás:

```bash
grep -rc "PATRON" --include="*.html" . | grep ":0$"
```

Si algo tiene que quedar distinto en una página, decirlo explícitamente en vez de dejarlo desparejo en silencio.

### 2. No inventar estilos de texto

Los estilos tipográficos son **exclusivamente** los que documenta `estilos.html`: Headline 1–4, Stats, Description, Body Text, Texto secundario y Field Label. La escala es **72 / 48 / 38 / 32 / 18 / 16 / 13 / 11.5 px** (más los `clamp()` de h1 y h2). No crear tamaños, pesos, interlineados ni tracking nuevos, ni siquiera "por esta vez" o para un caso puntual.

Si un pedido parece necesitar un estilo que no existe, o si al trabajar aparece en el código un estilo que no está en la guía (un `font-size` suelto, un peso distinto, un interlineado propio): **no resolverlo por cuenta propia**. Avisar cuál es la inconsistencia, dónde está, y preguntar cómo resolverla — si se adopta uno existente, si se agrega uno nuevo a la guía, o si se corrige el código.

### 3. Lo mismo con los colores

Los colores son **exclusivamente** los tokens de `:root` documentados en `estilos.html`. Ningún hex, `rgb()` ni `rgba()` suelto en CSS ni en los `<style>` embebidos.

Si hace falta un color que no existe, o aparece uno hardcodeado o un token sin documentar: **avisar y preguntar**, no elegir el más parecido ni agregar un token por decisión propia.

### Estado

Los archivos del sitio (`style.css`, `index.html`, `en/index.html`) **cumplen las tres reglas**: cero `font-size` fuera de la escala, cero colores sueltos. Verificable con:

```bash
# colores fuera de :root
awk 'NR>60 && /rgba?\(|#[0-9a-fA-F]{6}/' assets/style.css
grep -n 'rgba\?(\|#[0-9a-fA-F]\{6\}' index.html en/index.html
```

`estilos.html` tiene tamaños propios en su chrome (sidebar, tablas) y en las muestras de la escala; eso es la UI de la guía, no del sitio, y queda fuera de la regla.

**Pendiente de decisión:** 6 tokens declarados sin uso — `--green`, `--green-secondary`, `--success-bg`, `--subtle-bg`, `--dark-hover`, `--gray-300`. Y `--text-tertiary` con un solo uso.

---

## Estructura

- `assets/style.css` — **única** hoja de estilos del sitio. Todo lo compartido vive acá.
- `index.html` / `en/index.html` — home en español e inglés.
- `proyectos/index.html` + `proyectos/en/index.html` — listado de proyectos.
- `proyectos/<slug>/index.html` + `proyectos/<slug>/en/index.html` — un case study por proyecto (8 proyectos × 2 idiomas).
- `estilos.html` — guía de estilos viva. Documenta tokens, escala tipográfica y componentes.

Son **21 archivos HTML** en total. El español es el default; el inglés vive bajo `/en/`.

Las dos homes (`index.html`, `en/index.html`) tienen bloques `<style>` embebidos con estilos propios (hero, skills, testimonios). El resto de las páginas usa solo `style.css`.

## Correr el sitio

```bash
python3 -m http.server 5500
```

O con la config ya definida en `.claude/launch.json` (`preview_start` con `name: "portfolio-static"`). Nunca levantar el server con Bash si está disponible la herramienta de preview.

## Cache busting — importante

El server no manda headers de no-cache, así que **el navegador se queda con la versión vieja del CSS**. Cada vez que se toca `assets/style.css` hay que bumpear el query param en los 21 HTML:

```bash
find . -name "*.html" -not -path "./node_modules/*" -print0 | xargs -0 perl -i -pe 's{(href="[^"]*style\.css)\?v=\d+"}{$1?v=NUEVO"}g'
```

Todos los archivos tienen que quedar en la **misma** versión. Verificar con:

```bash
grep -rho "style\.css[^\"']*" --include="*.html" . | sort | uniq -c
```

Si el HTML mismo cambió, el navegador también lo cachea: para verificar hay que navegar con un query param cualquiera (`?r=1`), porque recargar la misma URL no alcanza.

## Sistema de color

Todos los colores salen de variables en `:root` de `style.css`. Ver **regla 3**: nada de hex sueltos, y ante un color faltante o no documentado se pregunta antes de decidir.

La paleta está alineada a la familia **neutral** de Tailwind (`#a3a3a3` = neutral-400 y `#404040` = neutral-700 son exactos).

### Texto — 3 niveles + muted

| Token | Valor | Uso |
|---|---|---|
| `--black` | `#050505` | headlines — hay regla global `h1–h6` |
| `--text-body` | `#525252` | párrafos, `.description`, bullets, subtítulos de card |
| `--text-tertiary` | `#404040` | texto de apoyo — hoy solo `.tcard-role` |
| `--gray-mid` | `#a3a3a3` | meta y labels |

### Resto

**En uso:**

- **Fondos**: `--white`, `--dark` `#141414`, `--gray-bg` `#f7f7f7`
- **Bordes**: `--gray-border` `#f2f2f2`, `--gray-100` `#f0f0f0`
- **Acentos**: `--purple-500` `#6A71DF` — eyebrows de case study
- **Layout**: `--max-w` `1040px`, `--case-text-w` `880px`

**Declarados pero sin uso real** (aparecen en `:root` y en los swatches de `estilos.html`, pero ningún elemento los referencia): `--green`, `--green-secondary`, `--success-bg`, `--subtle-bg`, `--dark-hover`, `--gray-300`, `--text-tertiary` (este último con un solo uso, `.tcard-role`).

Antes de agregar un token nuevo conviene revisar si alguno de esos ya cubre el caso. Verificar uso real con:

```bash
grep -rho "var(--TOKEN)" --include="*.html" --include="*.css" . | wc -l
```

No existe acento azul: se eliminó y todo pasó a `--purple-500`.

## Tipografía

Inter en 400/500/600/700, vía Google Fonts + rsms.me.

**`line-height` y `letter-spacing` van siempre en `em`.** No usar px ni valores sin unidad. `font-size` sí va en px (o `clamp()`).

| Estilo | font-size | line-height | weight | tracking |
|---|---|---|---|---|
| h1 | `clamp(38px, 6vw, 72px)` | `1.25em` | 700 | `-0.025em` |
| h2 | `clamp(26px, 4vw, 38px)` | `1.2em` | 700 | `-0.02em` |
| h3 | 32px | `1.2em` | 500 | `-0.04em` |
| h4 / card title | 18px | heredado | 600 | — |
| `.description` | 18px | `1.4em` | 400 | — |
| `.case-section p` | 16px | `1.7em` | 400 | — |
| `.case-list li` | 16px | `1.6em` | 400 | — |

Computados de los `clamp()`: h1 → 72px desktop / 46.08px a 768 / 38px mobile. h2 → 38 / 30.72 / 26.

### Trampa conocida: herencia de `line-height` en em

`body` tiene `line-height: 1.4em`, que resuelve **una sola vez** a 22.4px (1.4 × 16px) y se hereda como **ese px fijo**, no como proporción. Todo elemento que no declare su propio `line-height` recibe 22.4px literales sin importar su `font-size` — por eso un h4 de 18px y un label de 11.5px tienen el mismo interlineado.

Si un elemento nuevo necesita interlineado proporcional, hay que **declararle el suyo**. Cambiar `body` a `1.4` sin unidad lo arreglaría de raíz, pero afecta a todo lo que hoy hereda 22.4px.

## Nav

El nav es idéntico en las 21 páginas y tiene 4 items con `gap: 24px`:

`Proyectos` · `Estilos` · `<idioma>` · `Descargar CV`

Los tres primeros son `.btn .btn-text .btn-sm`; el último es `.btn .btn-primary .btn-sm`. Todos usan la estructura de doble capa para la animación de hover:

```html
<span class="btn-inner">
  <span class="btn-top">Texto</span>
  <span class="btn-bot" aria-hidden="true">Texto</span>
</span>
```

**El botón de idioma muestra el idioma del contenido actual**, no el destino: `ES` en páginas españolas, `EN` en las inglesas. El link apunta a la contraparte.

El nav es el caso más típico de la **regla 1**: cualquier cambio que no sea de contenido va en los 21 archivos y en `estilos.html`.

`.btn-inner` es un clip de `overflow:hidden` con `height: 1.2em` exacta, y el hover mueve `translateY(-1.2em)`. Cuidado al tocar `line-height` ahí: la animación depende de que esos tres valores coincidan.

## Guía de estilos

`estilos.html` no es decorativa: **es la fuente de verdad** de los estilos de texto y de color, y las reglas 1–3 se apoyan en ella. Si queda desactualizada, deja de servir para decidir — ya pasó con varios valores que quedaron mintiendo. Cualquier cambio de token, escala o componente se refleja acá en el mismo cambio.

Ojo con los specimens: `.t-h1`, `.t-h2`, etc. son `<span>`, no headings reales, así que **no les aplica la regla global `h1–h6`** y hay que darles color y line-height a mano.

La sección "Escala por breakpoint" y la sección "Responsive" documentan lo mismo en dos lugares. Es una duplicación conocida y una fuente de desincronización.

## Verificación

Este sitio no tiene tests. La forma de verificar un cambio es **medir estilos computados en el navegador**, no leer el CSS:

```js
getComputedStyle(document.querySelector('.selector')).color
```

Para cambios de riesgo (unidades, herencia, refactors de color), capturar un baseline de valores computados **antes** de tocar nada y comparar después. Reportar diferencias reales, no asumir que salió bien porque el CSS parece correcto.

## Idioma

El código, los comentarios del CSS y este archivo van en español, igual que el contenido del sitio.
