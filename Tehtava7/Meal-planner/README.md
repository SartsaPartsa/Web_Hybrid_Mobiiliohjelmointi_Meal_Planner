# 🍽️ Meal Planner - Resepti-sovellus

Mobiilisovellus, joka hakee reseptejä TheMealDB API:sta käyttäjän jääkaapissa olevien ainesten perusteella ja luo automaattisesti ostoslistan puuttuvista aineksista.

## 📱 Ominaisuudet

- ✅ **Ainesten hallinta**: Lisää ja poista jääkaapissasi olevia aineksia
- 🔍 **Älykäs reseptihaku**: Hakee reseptejä, jotka sopivat parhaiten olemassa oleviin aineksiin
- 📊 **Match-prosentti**: Näyttää kuinka monta prosenttia reseptin aineksista sinulla on
- 🛒 **Automaattinen ostoslista**: Generoi listan puuttuvista aineksista
- ⭐ **Suosikit**: Tallenna lempireseptisi myöhempää käyttöä varten
- 💾 **Tietojen tallennus**: AsyncStorage tallentaa ainekset ja suosikit

## 🚀 Asennus ja käyttö

### Vaatimukset
- Node.js
- Expo CLI
- Expo Go -sovellus (iOS/Android)

### Käynnistys

1. Navigoi projektikansioon:
```bash
cd Tehtava7/Meal-planner
```

2. Asenna riippuvuudet (jos ei vielä asennettu):
```bash
npm install
```

3. Käynnistä sovellus:
```bash
npx expo start
```

4. Skannaa QR-koodi Expo Go -sovelluksella

## 📖 Käyttöohje

1. **Lisää aineksia**:
   - Kirjoita ainesosa tekstikenttään (esim. "kana", "rice", "kerma")
   - Paina "+" -nappia tai Enter
   - Ainekset näkyvät sinisellä chipeillä

2. **Hae reseptejä**:
   - Paina "🔍 Hae reseptejä" -nappia
   - Sovellus etsii reseptejä, jotka sisältävät lisäämiäsi aineksia
   - Reseptit järjestetään match-prosentin mukaan (paras ensin)

3. **Tarkastele reseptejä**:
   - Napauta reseptikorttia nähdäksesi ainekset ja ohjeet
   - Vihreät ✅ = löytyy sinulta, Punaiset ❌ = puuttuu

4. **Luo ostoslista**:
   - Paina "🛒 Ostoslista" -nappia reseptin alla
   - Näet kaikki puuttuvat ainekset listattuna

5. **Tallenna suosikiksi**:
   - Paina "⭐ Suosikki" -nappia
   - Näe kaikki suosikit "⭐ Suosikit" -napista

## 🏗️ Projektin rakenne

```
Meal-planner/
├── App.tsx                          # Pääsovellus
├── types.ts                         # TypeScript tyypit
├── services/
│   └── mealApi.ts                   # TheMealDB API -integraatio
├── components/
│   ├── IngredientInput.tsx          # Ainesten syöttö
│   ├── RecipeCard.tsx               # Reseptikortti
│   └── ShoppingList.tsx             # Ostoslista modal
└── package.json                     # Riippuvuudet
```

## 🔧 Tekniset yksityiskohdat

### Käytetyt teknologiat
- **React Native** + **Expo**: Mobiilisovelluskehys
- **TypeScript**: Tyypitetty JavaScript
- **TheMealDB API**: Ilmainen resepti-API
- **AsyncStorage**: Paikallinen tietojen tallennus

### API
- **TheMealDB**: https://www.themealdb.com/api.php
- Ei vaadi API-avainta tai rekisteröitymistä
- Ilmainen käyttö

### Toimintalogiikka

1. **Reseptihaku**:
   - Käyttäjän ensimmäisellä ainesosalla haetaan reseptejä
   - Jokaiselle reseptille haetaan yksityiskohtaiset tiedot
   - Lasketaan match-prosentti käyttäjän ainesten perusteella

2. **Match-prosentti**:
   ```
   Match % = (Löytyvät ainekset / Kaikki ainekset) × 100
   ```

3. **Ostoslista**:
   - Filtteröi reseptin ainekset
   - Näytä vain ne, joita käyttäjällä ei ole

## 📝 Funktionaaliset ominaisuudet

### Tehtävänannon vaatimukset ✅

1. ✅ **Datan haku avoimesta API:sta**: TheMealDB
2. ✅ **Ainesten syöttö**: Käyttäjä voi lisätä aineksia
3. ✅ **Reseptien haku**: Hakee reseptejä API:sta
4. ✅ **Match-laskenta**: Laskee kuinka monta ainesta löytyy
5. ✅ **Järjestys**: Reseptit järjestetään match-prosentin mukaan
6. ✅ **Ostoslista**: Generoi listan puuttuvista aineksista
7. ✅ **Suosikit**: Tallenna ja hallitse lempireseptejä
8. ✅ **Paikallinen tallennus**: AsyncStorage säilyttää tiedot

### Lisäominaisuudet 🌟

- Reseptien kategoria ja alkuperämaa
- Visuaalinen match-prosentti värillä (vihreä/keltainen/punainen)
- Modal-pohjainen ostoslista
- Yksityiskohtaiset reseptiohjeet
- Reseptikuvat

## 🎓 Kurssin kannalta

Tämä sovellus täyttää "Web- ja hybriditeknologiat mobiiliohjelmoinnissa" -kurssin tehtävän vaatimukset:

- ✅ Hakee dataa avoimesta rajapinnasta (TheMealDB)
- ✅ Sisältää funktionaalisen kulman (match-laskenta, ostoslista)
- ✅ Ei pelkkä datan näyttö vaan laskee ja prosessoi tietoa
- ✅ TypeScript-toteutus
- ✅ React Native/Expo
- ✅ Käyttää API:n JSONia

