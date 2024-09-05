-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "post_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" TIMESTAMP NOT NULL,
    "authorUsername" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToPostCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToPostCategories_AB_unique" ON "_PostToPostCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToPostCategories_B_index" ON "_PostToPostCategories"("B");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostCategories" ADD CONSTRAINT "_PostToPostCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostCategories" ADD CONSTRAINT "_PostToPostCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "post_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
