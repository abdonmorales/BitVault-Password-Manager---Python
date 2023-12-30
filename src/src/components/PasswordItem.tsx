import React from 'react';
import { PasswordEntry } from '../models/passwordEntry';

interface PasswordItemProps {
	entry: PasswordEntry;
}

const PasswordItem: React.FC<PasswordItemProps> = ({ entry }) => {
	return (
		<div>
			<h3>{entry.title}</h3>
			<p>{entry.password}</p>
			{/* You can add more details here like URL, username, etc. */}
		</div>
	);
};

export default PasswordItem;
