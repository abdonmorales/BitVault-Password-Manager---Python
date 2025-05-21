export interface PasswordEntry {
	id: string;           // Unique identifier for the entry
	title: string;        // Title or name for the password entry
	password: string;     // The actual encrypted password
	url?: string;         // Optional URL associated with the password
	username: string;     // Username associated with the password
	notes?: string;       // Optional additional notes
	category?: string;    // Optional category for organizing passwords
	createdAt: Date;      // Date when the entry was created
	updatedAt: Date;      // Date when the entry was last updated
}