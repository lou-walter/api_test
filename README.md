# Api
API REST qui justifie un texte passé en paramètre

## Routes

### Token

Génère un token à partir d'une adresse email

#### Requête

```http
POST /api/token
```
#### Body

format application/json

Exemple:
```javascript
{"email": string}
```

#### Réponse

| Status Code | Description |
| :--- | :--- |
| 200 | "token" |
| 400 | 'Le body doit être au format application/json' |
| 422 | 'Champ email manquant' |

### Justifier

Justifie un texte passé dans le body et revoie le texte justifié, authentification par Token Bearer avec une limite de 80000 mots par jour par token

#### Requête

```http
POST /api/justifier
```
#### Body

Format text/plain

#### Réponse

| Status Code | Description |
| :--- | :--- |
| 200 | texte justifié |
| 400 | 'Le body doit être au format text/plain' |
| 401 | 'Token manquant' |
| 402 | 'Payment required |
| 403 | 'Mauvais token' |
