
import { jwtVerify } from '@tsndr/cloudflare-worker-jwt';

export interface User {
  id: string;
  email: string;
  orgId: string;
  role: 'admin' | 'user';
}

export async function validateAuth(request: Request, secret: string): Promise<User | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.substring(7);
  try {
    const isValid = await jwtVerify(token, secret);
    if (!isValid) return null;
    
    // In a real app, you would decode the payload properly
    // For now we mock the return assuming valid signature implies valid user
    // const { payload } = decode(token);
    
    return {
      id: 'user_123',
      email: 'demo@voiceorchestrator.com',
      orgId: 'org_default',
      role: 'admin'
    };
  } catch (e) {
    return null;
  }
}

export function requireAuth(user: User | null) {
  if (!user) {
    throw new Error('Unauthorized');
  }
}
