CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."seatStatus" AS ENUM('available', 'booked', 'reserved');--> statement-breakpoint
CREATE TABLE "BusMate_acceptedRolls" (
	"rollNo" varchar(10) NOT NULL,
	"boardingPointId" varchar(255) NOT NULL,
	CONSTRAINT "BusMate_acceptedRolls_rollNo_unique" UNIQUE("rollNo")
);
--> statement-breakpoint
CREATE TABLE "BusMate_account" (
	"userId" varchar(255) PRIMARY KEY NOT NULL,
	"password" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BusMate_boardingPoint" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"latitude" double precision,
	"longitude" double precision
);
--> statement-breakpoint
CREATE TABLE "BusMate_busBoardingPoint" (
	"id" serial PRIMARY KEY NOT NULL,
	"busId" varchar(255) NOT NULL,
	"boardingPointId" varchar(255) NOT NULL,
	"arrivalTime" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "BusMate_bus" (
	"id" uuid PRIMARY KEY NOT NULL,
	"model" varchar(255) NOT NULL,
	"busNumber" varchar(10) NOT NULL,
	"routeName" varchar(255) NOT NULL,
	"driverName" varchar(255) NOT NULL,
	"driverPhone" varchar(15) NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "BusMate_bus_busNumber_unique" UNIQUE("busNumber")
);
--> statement-breakpoint
CREATE TABLE "BusMate_seat" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"busId" varchar(255) NOT NULL,
	"status" "seatStatus" DEFAULT 'available',
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BusMate_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"rollNo" varchar(10) NOT NULL,
	"name" varchar(255) NOT NULL,
	"gender" "gender" NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"address" varchar(255) NOT NULL,
	"dateOfBirth" timestamp with time zone NOT NULL,
	"busId" varchar(255) NOT NULL,
	"boardingPointId" varchar(255) NOT NULL,
	"receiptId" varchar(255) NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "BusMate_user_rollNo_unique" UNIQUE("rollNo"),
	CONSTRAINT "BusMate_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "BusMate_acceptedRolls" ADD CONSTRAINT "BusMate_acceptedRolls_boardingPointId_BusMate_boardingPoint_id_fk" FOREIGN KEY ("boardingPointId") REFERENCES "public"."BusMate_boardingPoint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_account" ADD CONSTRAINT "BusMate_account_userId_BusMate_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."BusMate_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_busBoardingPoint" ADD CONSTRAINT "BusMate_busBoardingPoint_busId_BusMate_bus_id_fk" FOREIGN KEY ("busId") REFERENCES "public"."BusMate_bus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_busBoardingPoint" ADD CONSTRAINT "BusMate_busBoardingPoint_boardingPointId_BusMate_boardingPoint_id_fk" FOREIGN KEY ("boardingPointId") REFERENCES "public"."BusMate_boardingPoint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_seat" ADD CONSTRAINT "BusMate_seat_userId_BusMate_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."BusMate_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_seat" ADD CONSTRAINT "BusMate_seat_busId_BusMate_bus_id_fk" FOREIGN KEY ("busId") REFERENCES "public"."BusMate_bus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_user" ADD CONSTRAINT "BusMate_user_busId_BusMate_bus_id_fk" FOREIGN KEY ("busId") REFERENCES "public"."BusMate_bus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BusMate_user" ADD CONSTRAINT "BusMate_user_boardingPointId_BusMate_boardingPoint_id_fk" FOREIGN KEY ("boardingPointId") REFERENCES "public"."BusMate_boardingPoint"("id") ON DELETE no action ON UPDATE no action;