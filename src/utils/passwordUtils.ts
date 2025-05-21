// Function to generate a random password
export const generatePassword = (
  length: number = 12,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSpecialChars: boolean = true
): string => {
  let chars = '';
  let password = '';

  // Add characters based on options
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) chars += '0123456789';
  if (includeSpecialChars) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  // Make sure there are characters available
  if (chars.length === 0) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  // Generate the password
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
};

// Function to evaluate password strength
export const evaluatePasswordStrength = (password: string, t?: any): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback: string[] = [];

  // Check length
  if (password.length < 8) {
    feedback.push(t ? t('passwords.strength.feedback.too_short') : 'Password is too short.');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Check complexity
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push(t ? t('passwords.strength.feedback.add_uppercase') : 'Add uppercase letters.');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push(t ? t('passwords.strength.feedback.add_lowercase') : 'Add lowercase letters.');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push(t ? t('passwords.strength.feedback.add_numbers') : 'Add numbers.');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push(t ? t('passwords.strength.feedback.add_special') : 'Add special characters.');

  // Calculate final score (maximum 5)
  const finalScore = Math.min(5, score);

  // Determine message based on score
  let finalFeedback = '';
  if (finalScore <= 1) finalFeedback = t ? t('passwords.strength.very_weak') : 'Very weak';
  else if (finalScore === 2) finalFeedback = t ? t('passwords.strength.weak') : 'Weak';
  else if (finalScore === 3) finalFeedback = t ? t('passwords.strength.fair') : 'Fair';
  else if (finalScore === 4) finalFeedback = t ? t('passwords.strength.strong') : 'Strong';
  else finalFeedback = t ? t('passwords.strength.very_strong') : 'Very strong';

  if (feedback.length > 0) {
    finalFeedback += ': ' + feedback.join(' ');
  }

  return {
    score: finalScore,
    feedback: finalFeedback
  };
};
