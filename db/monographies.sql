BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "achievements_tbl" (
	"id_achievement"	int NOT NULL,
	"picture_achievement"	TEXT NOT NULL,
	"name_achievement"	TEXT NOT NULL,
	"description_achievement"	TEXT DEFAULT NULL,
	"date_achievement"	TEXT DEFAULT NULL,
	PRIMARY KEY("id_achievement")
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	int NOT NULL,
	"name"	TEXT DEFAULT NULL,
	"password"	TEXT DEFAULT NULL,
	"image"	TEXT DEFAULT NULL,
	"email"	TEXT DEFAULT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "users_tbl" (
	"id_user"	int NOT NULL,
	"name_user"	TEXT NOT NULL,
	"password_user"	TEXT DEFAULT NULL,
	"image_user"	TEXT DEFAULT NULL,
	"email_user"	TEXT NOT NULL,
	"privilege_seeallsources_user"	tinyint DEFAULT NULL,
	PRIMARY KEY("id_user")
);
CREATE UNIQUE INDEX IF NOT EXISTS "achievements_tbl_id_achievement_UNIQUE" ON "achievements_tbl" (
	"id_achievement"
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_users_email_unique" ON "users" (
	"email"
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_tbl_id_user_UNIQUE" ON "users_tbl" (
	"id_user"
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_tbl_email_user_UNIQUE" ON "users_tbl" (
	"email_user"
);
COMMIT;
