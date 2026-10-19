#!/bin/sh
# Gera o APK do AI Security Lab sem Gradle, direto com as ferramentas do Android SDK.
# Útil quando o Gradle não tem acesso ao repositório do Google; com Android Studio, use o
# projeto em android/ normalmente (./gradlew assembleDebug).
#
# Requer: JDK 17+, python3 e as ferramentas abaixo (caminhos por variável de ambiente):
#   ANDROID_JAR    android.jar da plataforma (API 34)
#   AAPT2          executável aapt2
#   ZIPALIGN       executável zipalign (padrão: ao lado de AAPT2)
#   D8_JAR         d8.jar (R8)
#   APKSIGNER_JAR  apksigner.jar
#   KEYSTORE       keystore para assinar (criado como chave de depuração se não existir)
#   KS_PASS        senha do keystore (padrão: android, a convenção das chaves de depuração)
#
# Uso: npm run build && sh scripts/build-apk.sh [saída.apk]
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
app=$root/android/app/src/main
pkg=io.github.lucasaalira.aisecuritylab
version=$(node -p "require('$root/package.json').version")
code=${VERSION_CODE:-$(sed -n 's/^[[:space:]]*versionCode[[:space:]]*\([0-9]*\).*/\1/p' "$root/android/app/build.gradle")}
out=${1:-$root/android/build/ai-security-lab-$version.apk}
work=$root/android/build/apk
KS_PASS=${KS_PASS:-android}

for v in ANDROID_JAR AAPT2 D8_JAR APKSIGNER_JAR KEYSTORE; do
  eval "val=\${$v:-}"
  [ -n "$val" ] || { echo "Defina $v (veja o cabeçalho deste script)." >&2; exit 1; }
done
ZIPALIGN=${ZIPALIGN:-$(dirname "$AAPT2")/zipalign}
[ -x "$ZIPALIGN" ] || { echo "Defina ZIPALIGN para o executável do SDK." >&2; exit 1; }
[ -f "$root/dist/index.html" ] || { echo "Gere o site antes: npm run build" >&2; exit 1; }

rm -rf "$work"
mkdir -p "$work/assets/public" "$work/gen" "$work/classes" "$work/dex" "$(dirname "$out")"

echo "1/6 Site: copiando dist/ para dentro do app"
cp -R "$root/dist/." "$work/assets/public/"

echo "2/6 Recursos: compilando ícones, cores e textos"
"$AAPT2" compile --dir "$app/res" -o "$work/res.zip"

echo "3/6 Manifesto e pacote base"
sed "s#<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">#<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\" package=\"$pkg\">#" \
  "$app/AndroidManifest.xml" > "$work/AndroidManifest.xml"
"$AAPT2" link -I "$ANDROID_JAR" --manifest "$work/AndroidManifest.xml" \
  --min-sdk-version 24 --target-sdk-version 34 --version-code "$code" --version-name "$version" \
  --java "$work/gen" -A "$work/assets" -o "$work/base.apk" "$work/res.zip"

echo "4/6 Código: compilando o Java"
find "$app/java" "$work/gen" -name '*.java' > "$work/sources.txt"
javac -nowarn -source 8 -target 8 -bootclasspath "$ANDROID_JAR" -encoding UTF-8 \
  -d "$work/classes" @"$work/sources.txt" 2>&1 | grep -v "^warning: \[options\]" || true
[ -f "$work/classes/io/github/lucasaalira/aisecuritylab/MainActivity.class" ] || { echo "Falha ao compilar o Java." >&2; exit 1; }

echo "5/6 Dex"
find "$work/classes" -name '*.class' > "$work/classes.txt"
java -cp "$D8_JAR" com.android.tools.r8.D8 --release --min-api 24 --lib "$ANDROID_JAR" \
  --output "$work/dex" @"$work/classes.txt"
python3 - "$work/base.apk" "$work/dex/classes.dex" <<'PY'
import sys, zipfile
with zipfile.ZipFile(sys.argv[1], 'a', zipfile.ZIP_DEFLATED) as z:
    z.write(sys.argv[2], 'classes.dex')
PY

echo "6/6 Alinhamento e assinatura"
"$ZIPALIGN" -f 4 "$work/base.apk" "$work/aligned.apk"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -keystore "$KEYSTORE" -storepass "$KS_PASS" -keypass "$KS_PASS" -alias androiddebugkey \
    -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000 >/dev/null 2>&1
fi
java -jar "$APKSIGNER_JAR" sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --ks-key-alias androiddebugkey \
  --min-sdk-version 24 --out "$out" "$work/aligned.apk"
java -jar "$APKSIGNER_JAR" verify --min-sdk-version 24 "$out"
"$ZIPALIGN" -c 4 "$out"

echo "APK pronto: $out ($(du -h "$out" | cut -f1))"
