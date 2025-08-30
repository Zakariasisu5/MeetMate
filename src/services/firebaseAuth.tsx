import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// User interface
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'ATTENDEE' | 'ORGANIZER' | 'SPONSOR';
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  interests?: string[];
  skills?: string[];
  avatar?: string;
}

// Authentication service
export class FirebaseAuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, name: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name,
        role: 'ATTENDEE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.displayName || 'Google User',
          role: 'ATTENDEE',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      }

      return userCredential;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}

export default FirebaseAuthService;
