CREATE TABLE "contact_us" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	CONSTRAINT "contact_us_id_unique" UNIQUE("id")
);
