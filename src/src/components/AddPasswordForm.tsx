import React from 'react';
import PasswordItem from './PasswordItem';
import { PasswordEntry } from '../models/passwordEntry';

interface PasswordListProps {
	entries: PasswordEntry[];
}

const PasswordList: React.FC<PasswordListProps> = ({ entries }) => {
	return (
		<div>
			{entries.map(entry => (
				<PasswordItem key={entry.id} entry={entry} />
			))}
		</div>
	);
};

export default PasswordList;