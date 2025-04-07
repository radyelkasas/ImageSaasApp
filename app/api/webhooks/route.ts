import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const SIGNING_SECRET =
    process.env.WEBHOOK_SECRET || process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add WEBHOOK_SECRET/SIGNING_SECRET from Clerk Dashboard to .env file"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing Svix headers");
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

  // CREATE
  if (eventType === "user.created") {
    console.log("Processing user creation event");
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    try {
      const newUser = await createUser(user);
      console.log(`User created successfully with ID: ${newUser._id}`);

      // Set public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
        console.log(`Updated Clerk metadata for user: ${id}`);
      }

      return NextResponse.json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    console.log("Processing user update event");
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    try {
      const updatedUser = await updateUser(id, user);
      console.log(`User updated successfully: ${id}`);
      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }

  // DELETE
  if (eventType === "user.deleted") {
    console.log("Processing user deletion event");
    const { id } = evt.data;

    try {
      const deletedUser = await deleteUser(id!);
      console.log(`User deleted successfully: ${id}`);
      return NextResponse.json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  // For any other event types
  console.log("Webhook payload:", body);
  return new Response("Webhook received", { status: 200 });
}
