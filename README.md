# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Docker Command

To run a local PostgreSQL database for BusMate using Docker, use the following command:

```sh
docker run -d \
    --name busmate-db \
    -e POSTGRES_USER=root \
    -e POSTGRES_PASSWORD=root \
    -e POSTGRES_DB=BusMate \
    -p 5432:5432 \
    -v busmate_data:/var/lib/postgresql/data \
    postgres:latest
```

**Explanation of options:**

- `-d`: Run container in detached mode
- `--name busmate-db`: Name the container `busmate-db`
- `-e POSTGRES_USER=root`: Set the database user to `root`
- `-e POSTGRES_PASSWORD=root`: Set the database password to `root`
- `-e POSTGRES_DB=BusMate`: Create a database named `BusMate`
- `-p 5432:5432`: Map port 5432 of the container to your local machine
- `-v busmate_data:/var/lib/postgresql/data`: Persist database data in a Docker volume

> **Tip:**  
> You can stop the container with `docker stop busmate-db` and remove it with `docker rm busmate-db`.

> **To remove persisted data:**  
> Run `docker volume rm busmate_data` after stopping and removing the container. This will delete all data stored in the volume.