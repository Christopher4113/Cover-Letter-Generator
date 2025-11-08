
# AI Cover Letter Generator

A Cover Letter Generator where it lets you input resumes and job description.Using AI, it creates a custom cover letter for you




## Features

- Utilizes Next.js, TypeScript, Python, FastAPI, MongoDB, EdgeStore, Lllama3-8b-8192
- JWT authentication with email verification
- Users can store their resume into MongoDB and EdgeStore
- Uses generative ai such as Lllama3 to generate cover letters
- Users can also edit their cover letters and download it as a pdf


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## Demo

https://cover-letter-generator-pi.vercel.app/


## API Reference

#### POST all items

```http
  POST /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `NEXT_PUBLIC_FASTAPI_URL` | `string` | **Required**. Your API key |

#### POST item

```http
  POST /api/items/${resume,jobDescription,today,company,location}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. {resume,jobDescription,today,company,location} |

#### generate_cover_letters(resume,jobDescription,today,company,location)

Takes resume, jobDescription, today, company, location and with templates it feeds it into llama3 to generate mutiple cover letters


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL`

`TOKEN_SECRET`

`DOMAIN`

`user`

`pass`

`EDGE_STORE_ACCESS_KEY`

`EDGE_STORE_SECRET_KEY`

`NEXT_PUBLIC_FASTAPI_URL`




## Authors

- [@Christopher4113](https://github.com/Christopher4113)


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the client

```bash
  npm run dev
```

Start the server

```bash
  python main.py
```
## Deployment

To deploy this project run

```bash
  npm run build
```
But also deploy it on your own services such as vercel


## FAQ

#### Will it work on any device

It works on any device but I would recommend using at least a laptop

#### Can I have symbols in the cover letter

Unfortunatley symbols won't be able to be render properly when you download it to a pdf


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Feedback

If you have any feedback, please reach out to us at ch.lam1328@gmail.com

