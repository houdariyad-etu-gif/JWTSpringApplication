# Backend – Authentification JWT avec Spring Boot

Ce module constitue le backend de l'application **JWTSpringApplication**. Il expose une API REST permettant de créer un compte, d'authentifier un utilisateur et de protéger certaines ressources à l'aide de JSON Web Tokens (JWT).

Le backend repose sur Spring Boot, Spring Security, Spring Data JPA et une base de données H2 en mémoire. L'authentification est sans état (*stateless*) : après la connexion, le client transmet le JWT dans l'en-tête `Authorization` de chaque requête protégée.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du backend](#architecture-du-backend)
- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Installation et lancement](#installation-et-lancement)
- [API REST](#api-rest)
- [Fonctionnement de l'authentification JWT](#fonctionnement-de-lauthentification-jwt)
- [Sécurité](#sécurité)
- [Tests](#tests)
- [Intégration avec le frontend React](#intégration-avec-le-frontend-react)
- [Limites actuelles et améliorations](#limites-actuelles-et-améliorations)

## Fonctionnalités

- Inscription d'un nouvel utilisateur avec une adresse e-mail et un mot de passe.
- Vérification de l'unicité de l'adresse e-mail.
- Hachage des mots de passe avec BCrypt avant leur stockage.
- Authentification des utilisateurs avec Spring Security.
- Génération d'un JWT signé après une connexion réussie.
- Vérification du JWT à chaque requête protégée grâce à un filtre personnalisé.
- Accès aux informations de l'utilisateur authentifié.
- Configuration d'une session sans état (`SessionCreationPolicy.STATELESS`).
- Persistance des utilisateurs avec Spring Data JPA et H2.

## Technologies utilisées

| Technologie | Utilisation |
|---|---|
| Java 21 | Langage de développement |
| Spring Boot 4.1.1 | Socle de l'application backend |
| Spring Web MVC | Création des contrôleurs REST |
| Spring Security | Authentification et sécurisation des endpoints |
| Spring Data JPA | Accès aux données et persistance |
| Hibernate | Implémentation ORM utilisée par JPA |
| H2 Database | Base de données relationnelle en mémoire |
| JJWT 0.13.0 | Création, signature et lecture des JWT |
| Lombok | Réduction du code répétitif dans l'entité |
| Maven | Gestion des dépendances et construction du projet |

## Architecture du backend

Les classes Java sont organisées par responsabilité dans le package :

`net.riyad.tpjwtspringapplication`

```text
src/
└── main/
    ├── java/net/riyad/tpjwtspringapplication/
    │   ├── TpJwtSpringApplication.java
    │   ├── config/
    │   │   └── SecurityConfig.java
    │   ├── controllers/
    │   │   ├── AuthController.java
    │   │   └── UserController.java
    │   ├── dto/
    │   │   ├── AuthResponse.java
    │   │   ├── LoginRequest.java
    │   │   └── RegisterRequest.java
    │   ├── entity/
    │   │   └── AppUser.java
    │   ├── repository/
    │   │   └── UserRepository.java
    │   ├── security/
    │   │   └── JwtFilter.java
    │   └── service/
    │       ├── CustomerUserDetailsService.java
    │       └── JwtService.java
    └── resources/
        └── application.properties
```

### Rôle des principaux composants

| Composant | Responsabilité |
|---|---|
| `TpJwtSpringApplication` | Point d'entrée : démarre l'application Spring Boot. |
| `SecurityConfig` | Configure Spring Security, les règles d'accès, le gestionnaire d'authentification, BCrypt et la chaîne de filtres. |
| `AuthController` | Expose les endpoints d'inscription (`/auth/register`) et de connexion (`/auth/login`). |
| `UserController` | Expose les endpoints protégés de test et de consultation du profil. |
| `AppUser` | Entité JPA représentant un utilisateur avec son identifiant, son e-mail, son mot de passe haché et son rôle. |
| `UserRepository` | Fournit les opérations d'accès aux utilisateurs, notamment la recherche par e-mail et la vérification de son existence. |
| `RegisterRequest` | DTO contenant l'e-mail et le mot de passe nécessaires à l'inscription. |
| `LoginRequest` | DTO contenant les identifiants nécessaires à la connexion. |
| `AuthResponse` | DTO contenant le JWT renvoyé après une authentification réussie. |
| `CustomerUserDetailsService` | Charge un utilisateur depuis la base de données à partir de son adresse e-mail et construit son `UserDetails`. |
| `JwtService` | Génère le JWT, extrait les informations du jeton et vérifie son identité et sa validité cryptographique. |
| `JwtFilter` | Intercepte les requêtes, lit le JWT transmis dans l'en-tête HTTP et établit l'authentification dans le `SecurityContext`. |

## Prérequis

Avant de lancer le backend, installez :

- **JDK 21** ou une version compatible avec la configuration du projet.
- **Git**, pour cloner le dépôt.
- Un terminal (PowerShell, CMD ou terminal IntelliJ).

Le dépôt contient le Maven Wrapper (`mvnw` et `mvnw.cmd`) : une installation globale de Maven n'est donc pas nécessaire.

## Configuration

La configuration actuelle se trouve dans :

`src/main/resources/application.properties`

| Paramètre | Valeur actuelle | Description |
|---|---|---|
| `server.port` | `8081` | Port HTTP du backend. |
| `spring.datasource.url` | `jdbc:h2:mem:securitydb` | Base H2 en mémoire nommée `securitydb`. |
| `spring.datasource.username` | `sa` | Utilisateur de la base H2. |
| `spring.datasource.password` | vide | Mot de passe H2 actuel. |
| `spring.jpa.hibernate.ddl-auto` | `update` | Mise à jour du schéma selon les entités JPA. |
| `spring.h2.console.enabled` | `true` | Active la console web H2. |
| `spring.h2.console.path` | `/h2-console` | Chemin d'accès à la console H2. |
| `jwt.expiration` | `3600000` | Durée de validité du JWT en millisecondes, soit une heure. |
| `jwt.secret` | configuré dans le fichier | Clé secrète encodée en Base64 utilisée pour signer les JWT. |

**Important :** la clé JWT présente dans la configuration actuelle est une valeur de démonstration. Ne l'utilisez pas en production et ne publiez jamais une véritable clé secrète dans Git. Pour un déploiement réel, injectez une clé forte et privée via une variable d'environnement ou un gestionnaire de secrets.

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/houdariyad-etu-gif/JWTSpringApplication.git
cd JWTSpringApplication
```

### 2. Démarrer le backend

Sous Windows PowerShell :

```powershell
.\mvnw.cmd spring-boot:run
```

Sous Linux ou macOS :

```bash
./mvnw spring-boot:run
```

L'API est alors disponible à l'adresse :

`http://localhost:8081`

### 3. Construire le projet

Sous Windows :

```powershell
.\mvnw.cmd clean package
```

Sous Linux ou macOS :

```bash
./mvnw clean package
```

Le fichier JAR généré se trouve dans le dossier `target/`.

Pour lancer le JAR :

```bash
java -jar target/TpJWTSpringApplication-0.0.1-SNAPSHOT.jar
```

## API REST

Les endpoints exposés par le backend sont les suivants :

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Crée un compte utilisateur. |
| `POST` | `/auth/login` | Public | Authentifie un utilisateur et renvoie un JWT. |
| `GET` | `/api/hello` | JWT requis | Renvoie un message de bienvenue depuis une route protégée. |
| `GET` | `/api/profile` | JWT requis | Renvoie l'adresse e-mail de l'utilisateur authentifié. |

### 1. Inscription – `POST /auth/register`

Corps de la requête :

```json
{
  "email": "utilisateur@example.com",
  "password": "mot-de-passe"
}
```

Traitement effectué :
1. Le backend vérifie si l'adresse e-mail existe déjà.
2. Si elle est déjà utilisée, une réponse HTTP `400 Bad Request` est renvoyée.
3. Sinon, le mot de passe est haché avec `BCryptPasswordEncoder`.
4. Le nouvel utilisateur est enregistré avec le rôle `USER`.

Réponse en cas de succès :

```text
User registered successfully
```

### 2. Connexion – `POST /auth/login`

Corps de la requête :

```json
{
  "email": "utilisateur@example.com",
  "password": "mot-de-passe"
}
```

Le `AuthenticationManager` délègue la vérification des identifiants à Spring Security. Si l'authentification réussit, `JwtService` génère un jeton signé.

Exemple de réponse :

```json
{
  "token": "<JWT>"
}
```

Le jeton est valable pendant une heure selon la configuration actuelle.

### 3. Tester une route protégée – `GET /api/hello`

Sans JWT valide, l'accès à cette ressource est refusé.

Avec un JWT valide, envoyer l'en-tête :

```http
Authorization: Bearer <JWT>
```

Réponse :

```text
Bienvenue dans l'API securisee!
```

### 4. Consulter le profil – `GET /api/profile`

Cette route utilise l'objet `Authentication` fourni par Spring Security pour identifier l'utilisateur authentifié.

En-tête requis :

```http
Authorization: Bearer <JWT>
```

Exemple de réponse :

```text
Utilisateur connecte : utilisateur@example.com
```

## Fonctionnement de l'authentification JWT

Le mécanisme d'authentification suit les étapes ci-dessous :

```text
             INSCRIPTION
                  |
                  v
       POST /auth/register
                  |
                  v
       Vérification de l'e-mail
                  |
                  v
       Hachage du mot de passe
             avec BCrypt
                  |
                  v
        Enregistrement en H2


              CONNEXION
                  |
                  v
        POST /auth/login
                  |
                  v
       AuthenticationManager
                  |
                  v
       Vérification des identifiants
                  |
                  v
           JwtService
                  |
                  v
          Génération du JWT
                  |
                  v
       Retour du jeton au client
                  |
                  v
         REQUÊTE PROTÉGÉE
                  |
                  v
      Authorization: Bearer <JWT>
                  |
                  v
              JwtFilter
                  |
                  v
       Vérification du jeton
                  |
                  v
       Chargement de l'utilisateur
                  |
                  v
       Mise à jour du SecurityContext
                  |
                  v
       Accès à la ressource protégée
```

### Pourquoi utiliser JWT ?

Après la connexion, le serveur renvoie un jeton signé. Le client le transmet lors des appels aux ressources protégées. Le backend peut alors identifier l'utilisateur et contrôler l'accès sans conserver une session HTTP côté serveur.

Dans cette application, `JwtFilter` étend `OncePerRequestFilter` afin d'exécuter le traitement du jeton une fois par requête. Lorsque le jeton est valide, une instance `UsernamePasswordAuthenticationToken` est placée dans le `SecurityContextHolder`.

## Sécurité

La configuration actuelle applique plusieurs mécanismes :

- **BCrypt** : les mots de passe sont hachés avant leur enregistrement.
- **JWT signé** : le jeton est signé avec une clé HMAC construite à partir de la clé secrète Base64.
- **Filtre JWT personnalisé** : le filtre récupère le jeton depuis l'en-tête `Authorization`.
- **Authentification sans état** : les sessions HTTP sont désactivées avec `SessionCreationPolicy.STATELESS`.
- **Routes publiques** : `/auth/**` et `/h2-console/**` sont accessibles sans authentification.
- **Routes protégées** : `/api/**` nécessitent une authentification.
- **Console H2** : l'option `frameOptions().sameOrigin()` permet son affichage dans le même domaine.

La désactivation de CSRF est configurée dans `SecurityConfig`. Cette configuration correspond au fonctionnement actuel basé sur un jeton Bearer transmis explicitement dans l'en-tête HTTP ; elle doit être réévaluée si le mécanisme d'authentification évolue vers des cookies.

## Tests

Le projet contient actuellement un test de démarrage Spring Boot :

`src/test/java/net/riyad/tpjwtspringapplication/TpJwtSpringApplicationTests.java`

Il vérifie que le contexte de l'application peut être chargé.

Pour exécuter les tests :

Sous Windows :

```powershell
.\mvnw.cmd test
```

Sous Linux ou macOS :

```bash
./mvnw test
```

Ce test ne couvre pas encore les scénarios fonctionnels d'inscription, de connexion, de validation du JWT ou d'accès aux routes protégées.

## Intégration avec le frontend React

Le frontend React se trouve dans le dossier `frontend/` du dépôt.

Il utilise Axios et envoie les identifiants vers :

`POST http://localhost:8081/auth/login`

Le frontend attend une réponse contenant `token`, ce qui correspond au DTO `AuthResponse` renvoyé par le backend.

Après la connexion, le frontend ajoute le jeton aux requêtes Axios avec l'en-tête :

```http
Authorization: Bearer <JWT>
```

**Point d'intégration à corriger :** le frontend appelle actuellement `GET /profile`, alors que le backend expose `GET /api/profile`. Pour que la consultation du profil fonctionne, il faut modifier l'appel frontend en `api.get("/api/profile")` ou adapter le mapping du contrôleur backend.

**Autre point à vérifier :** le backend ne déclare pas actuellement de configuration CORS explicite. Comme Vite et Spring Boot utilisent des ports différents en développement (`5173` et `8081`), le navigateur peut bloquer les appels cross-origin. Une configuration CORS adaptée devra être ajoutée côté backend avant de tester le frontend depuis le navigateur.

## Limites actuelles et améliorations

Cette version constitue une base pédagogique pour comprendre l'authentification JWT avec Spring Security. Plusieurs améliorations sont envisageables :

- Externaliser la clé secrète JWT et utiliser une clé suffisamment robuste.
- Remplacer la base H2 en mémoire par une base persistante pour conserver les comptes après le redémarrage.
- Ajouter une validation des données d'entrée (`@Valid`, `@Email`, `@NotBlank`, etc.).
- Gérer explicitement les erreurs d'authentification et les réponses HTTP (`400`, `401`, `403`).
- Ajouter une configuration CORS adaptée au frontend.
- Compléter les tests unitaires et les tests d'intégration des endpoints.
- Vérifier systématiquement l'expiration et la validité des jetons dans tous les scénarios.
- Ajouter une gestion des rôles et des autorisations plus détaillée.
- Retirer ou sécuriser la console H2 dans un environnement de production.

