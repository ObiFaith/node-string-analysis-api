# 🧩 String Analysis REST API

A RESTful API service that analyzes strings and stores their computed properties such as `length`, `palindrome status`, `unique character count`, `word count`, `SHA-256 hash`, and `character frequency`.

This project demonstrates API design, data validation, and string analysis using modern backend development practices.

## 📽️ Explainer Overview

This API receives strings, computes analytical properties, and persists them for future retrieval or filtering.
It supports querying by computed metrics, natural language filters, and secure hash-based identification.

## ⚙️ Core Features

For each analyzed string, the API computes and stores the following:

| Property                | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| length                  | Number of characters in the string                                      |
| is_palindrome           | Boolean — true if the string reads the same backward (case-insensitive) |
| unique_characters       | Total number of distinct characters                                     |
| word_count              | Number of words separated by whitespace                                 |
| sha256_hash             | Unique SHA-256 hash of the string                                       |
| character_frequency_map | Object showing how often each character appears                         |

## 🧠 API Endpoints

### 1️⃣ Create / Analyze String

**POST `/strings`**

Analyzes and stores a new string.

#### Request

```json
{
  "value": "string to analyze"
}
```

#### Success Response — 201 Created

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

#### Error Responses

| Status | Description                           |
| ------ | ------------------------------------- |
| 400    | Invalid body or missing "value" field |
| 409    | String already exists                 |
| 422    | "value" must be of type string        |

### 2️⃣ Get Specific String

**GET `/strings/{string_value}`**

Retrieve the analysis of a particular string.

#### Success Response — 200 OK

```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": {
    /* ... */
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

#### Error Response

**404 `String not found`**

### 3️⃣ Get All Strings with Filtering

**GET `/strings`**

Supports advanced filtering by computed properties.

#### Example Request

```bash
GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a
```

#### Success Response — 200 OK

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": {
        /* ... */
      },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

#### Supported Query Parameters

| Parameter            | Type    | Description                |
| -------------------- | ------- | -------------------------- |
| `is_palindrome`      | boolean | Filter by palindrome       |
| `min_length`         | integer | Minimum string length      |
| `max_length`         | integer | Maximum string length      |
| `word_count`         | integer | Exact word count           |
| `contains_character` | string  | Character that must appear |

#### Error Response

**400 `Invalid query parameter types or values`**

### 4️⃣ Natural Language Filtering

Use human-like text queries to fetch matching strings.

```bash
GET /strings/filter-by-natural-language?query={text}
```

#### Example Queries

| Query                                              | Parsed Filters                                   |
| -------------------------------------------------- | ------------------------------------------------ |
| "all single word palindromic strings"              | { word_count: 1, is_palindrome: true }           |
| "strings longer than 10 characters"                | { min_length: 11 }                               |
| "strings containing the letter z"                  | { contains_character: "z" }                      |
| "palindromic strings that contain the first vowel" | { is_palindrome: true, contains_character: "a" } |

#### Example Success Response — 200 OK

```json
{
  "data": [
    /* matching strings */
  ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

#### Error Responses

| Status | Description                        |
| ------ | ---------------------------------- |
| 400    | Query cannot be parsed             |
| 422    | Parsed but filters are conflicting |

### 5️⃣ Delete String

**DELETE `/strings/{string_value}`**

Removes a stored string and its analysis.

#### Success Response — 204 `No Content`

#### Error Response — 404 `String not found`

## 🧱 Suggested Tech Stack

| Layer     | Technology                       |
| --------- | -------------------------------- |
| Runtime   | Node.js (v18+)                   |
| Framework | Express.js                       |
| Database  | MongoDB / Mongoose               |
| Security  | Helmet, CORS, Express Rate Limit |
| Hashing   | Node crypto module               |

## 🚀 Getting Started

**1. Clone Repository**

```sh
git clone https://github.com/yourusername/string-analysis-api.git
cd string-analysis-api
```

**2. Install Dependencies**

```sh
npm install
```

**3. Set Up Environment (.env)**

```sh
PORT=5000
MONGO_URI=mongodb://localhost:27017/string_analysis_db
```

**4. Run Server**

```sh
npm run dev
```

**5. Test the Endpoints**

> Use Postman, Insomnia, or cURL to interact with the API.

## 🧩 Example Workflow

1. **POST** `/strings` → Analyze “racecar”

2. **GET** `/strings/racecar` → Retrieve its analysis

3. **GET** `/strings?is_palindrome=true` → Get all palindromic strings

4. **GET** `/strings/filter-by-natural-language?query=strings longer than 10 characters`

5. **DELETE** `/strings/racecar` → Remove it

## 📘 Notes

- The SHA-256 hash acts as both a `unique ID` and `primary key`.

- Palindrome check ignores `case` and `whitespace`.

- Character frequency map includes `spaces and punctuation` for completeness.

- Filtering supports `combined conditions`.

- Natural language parsing may use basic keyword heuristics or a lightweight NLP library.

## 📄 License

MIT License © 2025 — String Analysis API
