import "dotenv/config";
import ImageKit from "imagekit"
import dummyBooks from "../dummybooks.json"
import config from "@/lib/config"
import { books } from "./schema"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const sql = neon(config.env.databaseUrl)
export const db = drizzle({ client: sql })

const imageKit = new ImageKit({
    publicKey: config.env.imageKit.publicKey,
    privateKey: config.env.imageKit.privateKey,
    urlEndpoint: config.env.imageKit.urlEndpoint,
})

const uploadToImageKit = async (url: string, fileName: string, folder: string) => {
    try {
        const response = await imageKit.upload({
            file: url,
            fileName,
            folder,
        })
        return response.filePath;
    } catch (error) {
        console.error("❌ Error uploading to ImageKit:", error);
        return null;
    }
}


const seedBooks = async () => {
    console.log("📚 Seeding data...")

    try {
        for (const book of dummyBooks) {
            console.log(`🔄 Uploading cover for: ${book.title}`);
            const coverUrl = (await uploadToImageKit(
                book.coverUrl,
                `${book.title}.jpg`,
                "/books/covers",
            )) as string;
            if (!coverUrl) continue;

            console.log(`🎥 Uploading video for: ${book.title}`);
            const videoUrl = (await uploadToImageKit(
                book.videoUrl,
                `${book.title}.mp4`,
                "/books/videos",
            )) as string;
            if (!videoUrl) continue;

            console.log(`💾 Inserting into DB: ${book.title}`);
            await db.insert(books).values({
                ...book,
                coverUrl,
                videoUrl,
            })

            console.log(`Seeded: ${book.title}`);
        }

        console.log("✅ Books seeding completed.");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

// -------- CLI Logic --------
const main = async () => {
    const args = process.argv.slice(2);

    if (args.includes("--books")) {
        await seedBooks();
    } else {
        console.log("❗ Please provide a valid flag.\n");
        console.log("Usage:");
        console.log("  --books       Seed book data and upload to ImageKit");
        console.log("\nExample:");
        console.log("  npm run seed -- --books");
    }
};

main();