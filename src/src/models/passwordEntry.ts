export interface PasswordEntry {
	id: number;           // Unique identifier for the entry
	title: string;        // Title or name for the password entry
	password: string;     // The actual password (consider encryption for real use)
	url?: string;         // Optional URL associated with the password
	username?: string;    // Optional username associated with the password
	notes?: string;       // Optional additional notes
	// You can add more fields as required, like creation date, modification date, etc.
}