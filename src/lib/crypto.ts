/**
 * Replicates the IPU portal's password hashing mechanism
 * Uses SHA-256 + Base64 encoding with captcha as salt
 */
export async function hashPassword(password: string, captcha: string): Promise<string> {
    const combined = password + captcha;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    // Convert to Base64 using a safer method
    let binary = '';
    for (let i = 0; i < hashArray.length; i++) {
        binary += String.fromCharCode(hashArray[i]);
    }
    return btoa(binary);
}
