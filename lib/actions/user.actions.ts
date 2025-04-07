"use server";

import { connectToDatabase } from "../database/mongoose";
import User from "../database/models/user.model";

// Create a new user
export async function createUser(userData: {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
}) {
  try {
    console.log("connecting From createUser...");

    await connectToDatabase();

    // Check if user already exists
    const userExists = await User.findOne({ clerkId: userData.clerkId });

    if (userExists) {
      return userExists;
    }

    // Create a new user
    const newUser = await User.create({
      clerkId: userData.clerkId,
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photo: userData.photo,
      planId: "1", // Default plan ID
      creditBalance: 10, // Default credit balance
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user data
export async function updateUser(
  clerkId: string,
  userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
  }
) {
  try {
    console.log("connecting From updateUser...");

    await connectToDatabase();

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: userData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(clerkId: string) {
  try {
    console.log("connecting From deleteUser...");
    await connectToDatabase();

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Find a user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    console.log("connecting From getUserByClerkId...");
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
}
